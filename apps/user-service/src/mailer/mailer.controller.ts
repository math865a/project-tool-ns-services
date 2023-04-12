import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { MaiLCredentialsDto } from "@ns/dto";
import {
    authenticationPatterns,
    mailerPatterns as patterns,
    userPatterns,
} from "@ns/endpoints";
import { SendgridService } from "./sendgrid.service";
import { getCredentialsHTML } from "./templates";
import { MailDataRequired } from "@sendgrid/mail";
import { NatsClient } from "@ns/nats";

@Controller()
export class MailerNatsController {
    constructor(private mailer: SendgridService, private client: NatsClient) {}

    @MessagePattern(patterns.mailCredentials)
    async mailCredentials(uid: string) {
        const data = await Promise.all([
            this.client.request<any>(userPatterns.getUser, uid),
            this.client.request<any>(
                authenticationPatterns.getCredentials,
                uid
            ),
        ]).then((res) => {
            if (res[0] && res[1]) {
                return {
                    email: res[0].email,
                    name: res[0].name,
                    username: res[1].username,
                    password: res[1].password,
                };
            }
            return null;
        });
        if (data) {
            const html = getCredentialsHTML(
                data.name,
                data.username,
                data.password
            );

            const mail: MailDataRequired = {
                to: "mathias.oehrgaard@mohconsulting.dk",
                from: "ext.mathias.oehrgaard@eltelnetworks.com",
                subject: "Adgangsoplysninger til Project Tool",
                html: html
            };

            await this.mailer.send(mail);
            return { result: true };
        }
        return {result: false}
    }
}
