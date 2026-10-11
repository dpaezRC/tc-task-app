import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PAGINATION_QUERY_DEFAULTS } from '@/constants';

export class PaginationQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = PAGINATION_QUERY_DEFAULTS.PAGE;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = PAGINATION_QUERY_DEFAULTS.LIMIT;

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  showAll: boolean = false;

  @IsString()
  @IsOptional()
  search?: string;
}
