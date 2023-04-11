import { Module } from '@nestjs/common';
import { commandHandlers } from './commands';
import { CapacityViewNatsController } from './capacity-view.controller';
import { queryHandlers } from './queries';


@Module({
  controllers: [CapacityViewNatsController],
  providers: [...queryHandlers, ...commandHandlers],
})
export class CapacityViewModule {}
