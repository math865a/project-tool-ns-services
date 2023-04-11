import { Module } from '@nestjs/common';
import { commandHandlers } from './commands';
import { FinancialSourcesNatsController } from './financialsource.controller';
import { queryHandlers } from './queries';

@Module({
  controllers: [FinancialSourcesNatsController],
  providers: [...commandHandlers, ...queryHandlers],
})
export class FinancialsourceModule {}
