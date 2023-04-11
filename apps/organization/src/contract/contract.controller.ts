import { Controller } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { MessagePattern, Payload } from "@nestjs/microservices";
import {
    CreateContractCommand,
    DeleteContractCommand,
    UpdateContractCommand,
} from "./commands";
import { CreateContractDto, UpdateContractDto } from "@ns/dto";
import { ContractProfileQuery, ContractViewQuery } from "./queries";
import { ContractOptionsQuery } from "./queries/contract-options";
import { contractPatterns as patterns } from "@ns/endpoints";

@Controller()
export class ContractsNastController {
    constructor(private queryBus: QueryBus) {}

    @MessagePattern(patterns.getContractOptions)
    async getContractOptions() {
        return await this.queryBus.execute(new ContractOptionsQuery());
    }

    @MessagePattern(patterns.getContractProfile)
    async getContractProfile(@Payload("id") id: string) {
        return await this.queryBus.execute(new ContractProfileQuery(id));
    }

    @MessagePattern(patterns.getContractsView)
    async getContractsView() {
        return await this.queryBus.execute(new ContractViewQuery());
    }

    @MessagePattern(patterns.createContract)
    async createContract(
        @Payload("dto") dto: CreateContractDto,
        @Payload("uid") uid: string
    ) {
        return await this.queryBus.execute(new CreateContractCommand(dto, uid));
    }

    @MessagePattern(patterns.updateContract)
    async updateContract(
        @Payload("dto") dto: UpdateContractDto,
        @Payload("uid") uid: string
    ) {
        return await this.queryBus.execute(new UpdateContractCommand(dto, uid));
    }

    @MessagePattern(patterns.deleteContract)
    async deleteContract(
        @Payload("id") id: string,
        @Payload("uid") uid: string
    ) {
        return await this.queryBus.execute(new DeleteContractCommand(id, uid));
    }
}
