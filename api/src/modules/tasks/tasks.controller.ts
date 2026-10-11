import { ApiBearerAuth } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { FindTasksDto } from './dto/find-tasks.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/modules/auth/decorators/current-user.decorator';
import { PaginationInterceptor } from '@/interceptors/pagination/pagination.interceptor';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.tasksService.create(createTaskDto, user.id);
  }

  @Get()
  @UseInterceptors(PaginationInterceptor)
  findAll(
    @Query() query: FindTasksDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.tasksService.findAll(query, user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @CurrentUser() user: AuthenticatedUser) {
    return this.tasksService.findOne(id, user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.tasksService.update(id, updateTaskDto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number, @CurrentUser() user: AuthenticatedUser) {
    return this.tasksService.remove(id, user.id);
  }
}
