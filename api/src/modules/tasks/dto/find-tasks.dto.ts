import { TaskStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '@/contracts/dto/pagination-query.dto';

export class FindTasksDto extends PaginationQueryDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}
