// backend/src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma.services';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  async revokeTokenById(id: any) {
    await this.prisma.refreshToken.update({
      where: { id },
      data: { revoked: true },
    });
  }

  async getUserById(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, createdAt: true },
    });
  }
  constructor(private prisma: PrismaService) {}

  async signAccessToken(userId: number) {
    const payload = { sub: userId };
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      throw new Error('ACCESS_TOKEN_SECRET environment variable is not set');
    }
    const token = jwt.sign(payload, secret, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
    });
    return token;
  }

  async createRefreshToken(userId: number) {
    const id = uuidv4(); // DB id for quick lookup
    const raw = crypto.randomBytes(64).toString('hex'); // secret part
    const tokenHash = await bcrypt.hash(raw, 10);
    const expiresAt = new Date(
      Date.now() +
        parseInt(process.env.REFRESH_TOKEN_EXPIRES_SEC || `${7 * 24 * 3600}`) *
          1000,
    ); // or parse REFRESH_TOKEN_EXPIRES_IN
    await this.prisma.refreshToken.create({
      data: { id, tokenHash, expiresAt, userId },
    });
    return `${id}.${raw}`; // send this to client (store only hash)
  }

  async login(email: string, password: string) {
    console.log('Login attempt for email:', email);
    const user = await this.prisma.user.findUnique({ where: { email } });
    console.log('User found:', !!user);
    if (!user) {
      console.log('User not found');
      throw new UnauthorizedException();
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    console.log('Password match:', ok);
    if (!ok) {
      console.log('Password mismatch');
      throw new UnauthorizedException();
    }
    const accessToken = await this.signAccessToken(user.id);
    const refreshToken = await this.createRefreshToken(user.id);
    return { accessToken, refreshToken, user };
  }

  async signup(email: string, password: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error('Email already in use');
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { email, passwordHash },
    });
    const accessToken = await this.signAccessToken(user.id);
    const refreshToken = await this.createRefreshToken(user.id);
    return { accessToken, refreshToken, user };
  }
  
  // refresh flow (called by /auth/refresh)
  async rotateRefreshToken(incoming: string) {
    // incoming = `${id}.${raw}`
    const [id, raw] = incoming.split('.');
    if (!id || !raw) throw new UnauthorizedException();

    const tokenRow = await this.prisma.refreshToken.findUnique({
      where: { id },
    });
    if (!tokenRow || tokenRow.revoked) {
      // possible reuse or invalid token -> revoke all tokens for user if we can
      if (tokenRow && tokenRow.userId) {
        await this.prisma.refreshToken.updateMany({
          where: { userId: tokenRow.userId },
          data: { revoked: true },
        });
      }
      throw new UnauthorizedException('Refresh token invalid');
    }

    const match = await bcrypt.compare(raw, tokenRow.tokenHash);
    if (!match) {
      // token reuse attempt: revoke all
      await this.prisma.refreshToken.updateMany({
        where: { userId: tokenRow.userId },
        data: { revoked: true },
      });
      throw new UnauthorizedException('Refresh token reuse detected');
    }

    // ok -> rotate
    const newRefresh = await this.createRefreshToken(tokenRow.userId);
    // revoke old token and link replacement
    await this.prisma.refreshToken.update({
      where: { id },
      data: { revoked: true, replacedById: newRefresh.split('.')[0] },
    });

    const accessToken = await this.signAccessToken(tokenRow.userId);
    return { accessToken, refreshToken: newRefresh };
  }
}
