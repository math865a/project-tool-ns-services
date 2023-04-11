import { Module } from "@nestjs/common";
import { AccessGroupModule } from "./access-group/access-group.module";
import { AuthenticationModule } from "./authentication/authentication.module";
import { AuthorizationModule } from "./authorization/authorization.module";
import { ServiceModule } from "@ns/service-deps";
import { UserModule } from "./user/user.module";

@Module({
    imports: [
        ServiceModule,
        AccessGroupModule,
        AuthenticationModule,
        AuthorizationModule,
        UserModule
    ],
})
export class SecurityModule {}
