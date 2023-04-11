import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { MaiLCredentialsDto } from "@ns/dto";
import { mailerPatterns as patterns } from "@ns/endpoints";
import { SendgridService } from "./sendgrid.service";
import { getCredentialsHTML } from "./templates";
import { MailDataRequired } from "@sendgrid/mail";

@Controller()
export class MailerNatsController {
    constructor(private mailer: SendgridService) {}

    @MessagePattern(patterns.mailCredentials)
    async mailCredentials(dto: MaiLCredentialsDto) {
        const html = getCredentialsHTML(dto.name, dto.username, dto.password);

        const mail: MailDataRequired = {
            to: "mathias.oehrgaard@mohconsulting.dk",
            from: "ext.mathias.oehrgaard@eltelnetworks.com",
            subject: "Adgangsoplysninger til Project Tool",
            html,
        };

        await this.mailer.send(mail);
        return { result: true };
    }
}
