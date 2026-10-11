import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/providers/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FindTasksDto } from './dto/find-tasks.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, userId: number) {
    const { dueDate, ...rest } = createTaskDto;

    return this.prisma.task.create({
      data: {
        ...rest,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        userId,
      },
    });
  }

  async findAll(query: FindTasksDto, userId: number) {
    const { page, limit, showAll, search } = query;

    const whereClause: Prisma.TaskWhereInput = {
      userId,
      deleted: false,
    };

    if (query.status) {
      whereClause.status = query.status;
    }
    if (search) {
      whereClause.title = {
        contains: search,
        mode: Prisma.QueryMode.insensitive,
      };
    }

    const queryClause: Prisma.TaskFindManyArgs = {
      where: whereClause,
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
      },
    };
    if (!showAll) {
      queryClause.skip = (page - 1) * limit;
      queryClause.take = limit;
    }

    const data = await this.prisma.task.findMany(queryClause);
    const totalRecords = await this.prisma.task.count({ where: whereClause });

    return { data, totalRecords };
  }

  async findOne(id: number, userId: number) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId, deleted: false },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number) {
    await this.findOne(id, userId);

    const { dueDate, ...rest } = updateTaskDto;

    return this.prisma.task.update({
      where: { id },
      data: {
        ...rest,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
    });
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);

    return this.prisma.task.update({
      where: { id },
      data: { deleted: true },
    });
  }
}
