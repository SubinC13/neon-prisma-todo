// backend/src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import express from 'express';
import * as crypto from 'crypto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { accessToken, refreshToken, user } = await this.authService.login(
      body.email,
      body.password,
    );

    // HttpOnly secure cookies
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15min
      path: '/',
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 3600 * 1000, // 7 days
      path: '/auth/refresh', // restrict cookie to refresh path if desired
    });

    // double-submit CSRF token (accessible to JS)
    const csrf = crypto.randomBytes(24).toString('hex');
    res.cookie('csrf_token', csrf, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return { ok: true, csrf }; // front-end can store/read csrf if desired
  }

  @Post('signup')
  async signup(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { accessToken, refreshToken, user } = await this.authService.signup(
      body.email,
      body.password,
    );

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 3600 * 1000,
      path: '/auth/refresh',
    });

    const csrf = crypto.randomBytes(24).toString('hex');
    res.cookie('csrf_token', csrf, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return { ok: true, csrf };
  }

  @Post('refresh')
  async refresh(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const incoming = req.cookies?.refresh_token;
    if (!incoming) throw new UnauthorizedException();

    const { accessToken, refreshToken } =
      await this.authService.rotateRefreshToken(incoming);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 3600 * 1000,
      path: '/auth/refresh',
    });

    const csrf = crypto.randomBytes(24).toString('hex');
    res.cookie('csrf_token', csrf, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return { ok: true, csrf };
  }

  @Post('logout')
  async logout(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const incoming = req.cookies?.refresh_token;
    if (incoming) {
      const [id] = incoming.split('.');
      await this.authService.revokeTokenById(id); // implement revoke method in service
    }
    // clear cookies
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/auth/refresh' });
    res.clearCookie('csrf_token', { path: '/' });
    return { ok: true };
  }
}
