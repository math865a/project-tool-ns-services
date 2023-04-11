import { Module } from "@nestjs/common";
import { AuthorizationNatsController } from "./authorization.controller";
import { ComposeAbilitiesQueryHandler } from "./compose-abilities";

@Module({
    imports: [],
    providers: [ComposeAbilitiesQueryHandler],
    controllers: [AuthorizationNatsController]
})
export class AuthorizationModule {}
