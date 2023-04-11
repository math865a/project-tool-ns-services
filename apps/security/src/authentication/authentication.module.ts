import { Module } from "@nestjs/common";
import { AuthenticationController } from "./authentication.controller";
import { CreateCredentialsHandler } from "./create-credentials";
import { ResetPasswordHandler } from "./reset-password";
import { UpdatePasswordHandler } from "./update-password";
import { UpdateUsernameHandler } from "./update-username";

@Module({
    providers: [
        CreateCredentialsHandler,
        ResetPasswordHandler,
        UpdatePasswordHandler,
        UpdateUsernameHandler,
    ],
    controllers: [AuthenticationController],
})
export class AuthenticationModule {}
