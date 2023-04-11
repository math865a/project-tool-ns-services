import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { HttpUser } from "@ns/decorators";
import { CreateContractDto, UpdateContractDto } from "@ns/dto";
import { contractPatterns } from "@ns/endpoints";
import { NatsClient } from "@ns/nats";

@Controller("contracts")
export class ContractsController {
    constructor(private client: NatsClient) {}

    @Get("options")
    async getOptions() {
        console.log("options")
        return await this.client.request(contractPatterns.getContractOptions);
    }

    @Get()
    async getView() {
        return await this.client.request(contractPatterns.getContractsView);
    }

    @Get(":contractId")
    async getProfile(@Param("contractId") contractId: string) {
        return await this.client.request(contractPatterns.getContractProfile, {
            id: contractId,
        });
    }

    @Post()
    async create(@Body() dto: CreateContractDto, @HttpUser() uid: string) {
        return await this.client.request(contractPatterns.createContract, {
            dto,
            uid,
        });
    }

    @Post(":id")
    async update(
        @Param("id") id: string,
        @Body() dto: Omit<UpdateContractDto, "contractId">,
        @HttpUser() uid: string
    ) {
        return await this.client.request(contractPatterns.updateContract, {
            dto: {
                contractId: id,
                ...dto,
            },
            uid: uid,
        });
    }
}
