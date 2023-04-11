import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MailerNatsController } from "./mailer.controller";
import { SendgridService } from "./sendgrid.service";

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [MailerNatsController],
    providers: [SendgridService],
})
export class MailerModule {}
