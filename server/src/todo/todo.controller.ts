import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import type { CreateTodoDto, UpdateTodoDto } from './todo.service';
import * as jwt from 'jsonwebtoken';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  private extractUserIdFromRequest(req: any): number {
    const token = req.cookies?.access_token;
    if (!token) {
      throw new UnauthorizedException('No access token found');
    }
  
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      throw new UnauthorizedException('Access token secret not configured');
    }
  
    try {
      const payload = jwt.verify(token, secret) as jwt.JwtPayload;
      if (!payload.sub) {
        throw new UnauthorizedException('Invalid token payload');
      }
      // Convert to number since sub is stored as number in auth service
      const userId = typeof payload.sub === 'string' ? parseInt(payload.sub, 10) : payload.sub;
      if (isNaN(userId)) {
        throw new UnauthorizedException('Invalid user ID in token');
      }
      return userId;
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  @Post()
  create(@Req() req: any, @Body() createTodoDto: CreateTodoDto) {
    const userId = this.extractUserIdFromRequest(req);
    return this.todoService.create(userId, createTodoDto);
  }

  @Get()
  findAll(@Req() req: any) {
    const userId = this.extractUserIdFromRequest(req);
    return this.todoService.findAll(userId);
  }

  @Get('stats')
  getStats(@Req() req: any) {
    const userId = this.extractUserIdFromRequest(req);
    return this.todoService.getStats(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    const userId = this.extractUserIdFromRequest(req);
    return this.todoService.findOne(+id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    const userId = this.extractUserIdFromRequest(req);
    return this.todoService.update(+id, userId, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    const userId = this.extractUserIdFromRequest(req);
    return this.todoService.remove(+id, userId);
  }
}
