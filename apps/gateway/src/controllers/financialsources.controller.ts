import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { HttpUser } from "@ns/decorators";
import { CreateFinancialSourceDto, UpdateFinancialSourceDto } from "@ns/dto";
import { financialsourcePatterns as patterns } from "@ns/endpoints";
import { NatsClient } from "@ns/nats";
@Controller("financialsources")
export class FinancialSourcesController {
    constructor(private client: NatsClient) {}

    @Get()
    async getView() {
        return await this.client.request(patterns.getFinancialSourcesView);
    }

    @Post()
    async create(
        @Body() dto: CreateFinancialSourceDto,
        @HttpUser() uid: string
    ) {
        return await this.client.request(patterns.createFinancialSource, {
            dto,
            uid,
        });
    }

    @Get(":financialSourceId")
    async getProfile(@Param("financialSourceId") financialSourceId: string) {
        return await this.client.request(
            patterns.getFinancialSourceProfile,
            financialSourceId
        );
    }

    @Delete(":financialSourceId")
    async deleteFinancialSource(
        @Param("financialSourceId") financialSourceId: string,
        @HttpUser() uid: string
    ) {
        return await this.client.request(patterns.deleteFinancialSource, {
            financialSourceId,
            uid,
        });
    }

    @Post(":financialSourceId")
    async updateFinancialSource(
        @Param("financialSourceId") financialSourceId: string,
        @Body() dto: Omit<UpdateFinancialSourceDto, "financialsourceId">,
        @HttpUser() uid: string
    ) {
        return await this.client.request(patterns.updateFinancialSource, {
            dto: {
                ...dto,
                financialSourceId,
            },
            uid,
        });
    }
}
