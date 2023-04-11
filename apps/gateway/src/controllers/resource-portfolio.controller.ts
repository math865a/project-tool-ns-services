import { FormResponse } from "@ns/definitions";
import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { HttpUser } from "@ns/decorators";
import { CreateAgentDto } from "@ns/dto";
import { resourcePortfolioPatterns } from "@ns/endpoints";
import { NatsClient } from "@ns/nats";

@Controller("resource-portfolio")
export class ResourcePortfolioController {
    constructor(private client: NatsClient) {}

    @Get("delete-consequences/:agentId")
    async getDeleteConsequences(@Param("agentId") agentId: string) {
        console.log(agentId);
        return await this.client.request(
            resourcePortfolioPatterns.getDeleteAgentConsequences,
            agentId
        );
    }

    @Delete(":agentId")
    async deleteAgent(
        @Param("agentId") agentId: string,
        @HttpUser() uid: string
    ) {
        return await this.client.request(
            resourcePortfolioPatterns.deleteAgent,
            {
                agentId,
                uid,
            }
        );
    }

    @Post()
    async createAgents(@Body() dto: CreateAgentDto[], @HttpUser() uid: string) {
        let results: FormResponse[] = [];
        for (let i = 0; i < dto.length; i++) {
            const response = await this.client.request<FormResponse>(
                resourcePortfolioPatterns.createAgent,
                {
                    dto: dto[i],
                    uid,
                }
            );
            if (response) {
                results.push(response);
            }
        }
        return results[0];
    }
}
