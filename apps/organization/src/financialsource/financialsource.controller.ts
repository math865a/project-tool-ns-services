import { Controller } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
    CreateFinancialSourceCommand,
    DeleteFinancialSourceCommand,
    UpdateFinancialSourceCommand,
} from './commands';
import { CreateFinancialSourceDto, UpdateFinancialSourceDto } from '@ns/dto';
import {
    FinancialSourceOptionsQuery,
    FinancialSourceProfileQuery,
    FinancialSourceViewQuery,
} from './queries';
import { financialsourcePatterns as patterns } from '@ns/endpoints';

@Controller()
export class FinancialSourcesNatsController {
    constructor(private queryBus: QueryBus) {}

    @MessagePattern(patterns.getFinancialSourceOptions)
    async getFinancialSourceOptions() {
        return await this.queryBus.execute(new FinancialSourceOptionsQuery());
    }

    @MessagePattern(patterns.getFinancialSourceProfile)
    async getFinancialSourceProfile(id: string) {
        return await this.queryBus.execute(new FinancialSourceProfileQuery(id));
    }

    @MessagePattern(patterns.getFinancialSourcesView)
    async getFinancialSourcesView() {
        return await this.queryBus.execute(new FinancialSourceViewQuery());
    }

    @MessagePattern(patterns.createFinancialSource)
    async createFinancialSource(
        @Payload('dto') dto: CreateFinancialSourceDto,
        @Payload('uid') uid: string,
    ) {
        return await this.queryBus.execute(
            new CreateFinancialSourceCommand(dto, uid),
        );
    }

    @MessagePattern(patterns.updateFinancialSource)
    async updateFinancialSource(
        @Payload('dto') dto: UpdateFinancialSourceDto,
        @Payload('uid') uid: string,
    ) {
        return await this.queryBus.execute(
            new UpdateFinancialSourceCommand(dto, uid),
        );
    }

    @MessagePattern(patterns.deleteFinancialSource)
    async deleteFinancialSource(
        @Payload('id') id: string,
        @Payload('uid') uid: string,
    ) {
        return await this.queryBus.execute(
            new DeleteFinancialSourceCommand(id, uid),
        );
    }
}
