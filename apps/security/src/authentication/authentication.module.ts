import { Module } from "@nestjs/common";
import { AuthenticationController } from "./authentication.controller";
import { CreateCredentialsHandler } from "./create-credentials";
import { ResetPasswordHandler } from "./reset-password";
import { UpdatePasswordHandler } from "./update-password";
import { UpdateUsernameHandler } from "./update-username";
import { GetCredentialsQueryHandler } from "./get-credentials";

@Module({
    providers: [
        CreateCredentialsHandler,
        ResetPasswordHandler,
        UpdatePasswordHandler,
        UpdateUsernameHandler,
        GetCredentialsQueryHandler
    ],
    controllers: [AuthenticationController],
})
export class AuthenticationModule {}
