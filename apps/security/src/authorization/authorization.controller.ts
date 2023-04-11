import { Controller } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { MessagePattern } from "@nestjs/microservices";
import { authorizationPatterns as patterns } from "@ns/endpoints";
import { ComposeAbilitiesQuery } from "./compose-abilities";
@Controller()
export class AuthorizationNatsController {
    constructor(private queryBus: QueryBus) {}

    @MessagePattern(patterns.getAbilities)
    async getAbilities(uid: string) {
        return await this.queryBus.execute(new ComposeAbilitiesQuery(uid));
    }
}
