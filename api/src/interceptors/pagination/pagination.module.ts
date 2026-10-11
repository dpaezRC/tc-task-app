import { Module } from '@nestjs/common';
import { PaginationInterceptor } from './pagination.interceptor';

@Module({
  providers: [PaginationInterceptor],
  exports: [PaginationInterceptor],
})
export class PaginationModule {}
