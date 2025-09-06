import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.services';

export interface CreateTodoDto {
  title: string;
  description?: string;
  color?: string;
  category?: string;
}

export interface UpdateTodoDto {
  title?: string;
  description?: string;
  completed?: boolean;
  color?: string;
  category?: string;
}

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createTodoDto: CreateTodoDto) {
    return this.prisma.todo.create({
      data: {
        ...createTodoDto,
        userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.todo.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId: number) {
    const todo = await this.prisma.todo.findUnique({
      where: { id },
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    if (todo.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return todo;
  }

  async update(id: number, userId: number, updateTodoDto: UpdateTodoDto) {
    await this.findOne(id, userId); // Check ownership

    return this.prisma.todo.update({
      where: { id },
      data: updateTodoDto,
    });
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId); // Check ownership

    return this.prisma.todo.delete({
      where: { id },
    });
  }

  async getStats(userId: number) {
    const [total, completed, upcoming, today] = await Promise.all([
      this.prisma.todo.count({ where: { userId } }),
      this.prisma.todo.count({ where: { userId, completed: true } }),
      this.prisma.todo.count({ 
        where: { 
          userId, 
          completed: false,
          createdAt: {
            gte: new Date()
          }
        } 
      }),
      this.prisma.todo.count({ 
        where: { 
          userId, 
          completed: false,
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999))
          }
        } 
      }),
    ]);

    return { total, completed, upcoming, today };
  }
}
