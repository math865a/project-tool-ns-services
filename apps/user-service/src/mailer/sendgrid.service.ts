import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DomainEvents } from "@ns/cqrs";
import { authenticationPatterns, userPatterns } from "@ns/endpoints";
import { NatsClient } from "@ns/nats";

import * as SendGrid from "@sendgrid/mail";
import { getCredentialsHTML, getWelcomeHTML } from "./templates";
import { FormErrorResponse, FormSuccessResponse } from "@ns/definitions";
import { CredentialsForwardedEvent, WelcomeMailSentEvent } from "@ns/events";
@Injectable()
export class SendgridService {
    constructor(
        private readonly config: ConfigService,
        private client: NatsClient,
        public publisher: DomainEvents
    ) {
        SendGrid.setApiKey(this.config.get("SENDGRID_API_KEY"));
    }

    private async getCredentials(uid: string) {
        return await Promise.all([
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
            return new FormErrorResponse({
                message:
                    "Der skete en fejl under afsendelsen af mail. Prøv igen.",
            });
        });
    }

    private async send(
        to: string,
        subject: string,
        html: string
    ): Promise<SendGrid.MailDataRequired> {
        const mail: SendGrid.MailDataRequired = {
            to:  process.env.NODE_ENV === "development" ? "mathias.oehrgaard@mohconsulting.dk" : to, 
            from: "ext.mathias.oehrgaard@eltelnetworks.com",
            subject: subject,
            html: html,
        };
        const transport = await SendGrid.send(mail);
        console.log(transport);
        console.log(`E-Mail sent to ${mail.to}`);
        return mail;
    }

    async mailCredentials(to: string, uid: string) {
        const data = await this.getCredentials(to);
        if (data instanceof FormErrorResponse) return data;

        const result = await this.send(
            data.email,
            "Adgangsoplysninger til Project Tool",
            getCredentialsHTML(data.name, data.username, data.password)
        );

        this.publisher.publish(
            new CredentialsForwardedEvent(
                {
                    uid: to,
                    mail: result,
                },
                uid
            )
        );
        return new FormSuccessResponse({
            message: "Adgangsoplysningerne blev sendt.",
        });
    }

    async mailWelcome(to: string, uid: string) {
        const data = await this.getCredentials(to);
        if (data instanceof FormErrorResponse) return data;

        const result = await this.send(
            data.email,
            "Velkommen til Project Tool",
            getWelcomeHTML(data.name, data.username, data.password)
        );

        this.publisher.publish(
            new WelcomeMailSentEvent(
                {
                    uid: to,
                    mail: result,
                },
                uid
            )
        );
        return new FormSuccessResponse({
            message: "Velkomstmailen blev sendt.",
        });
    }
}
