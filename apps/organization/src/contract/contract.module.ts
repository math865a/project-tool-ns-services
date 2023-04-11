import { Module } from '@nestjs/common';
import { commandHandlers } from "./commands";
import { ContractsNastController } from './contract.controller';
import { queryHandlers } from "./queries";


@Module({
  controllers: [ContractsNastController],
  providers: [...commandHandlers, ...queryHandlers],
})
export class ContractModule {}
