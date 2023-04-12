import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import * as SendGrid from "@sendgrid/mail";
@Injectable()
export class SendgridService {
    constructor(private readonly config: ConfigService) {
        SendGrid.setApiKey("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");
    }

    async send(mail: SendGrid.MailDataRequired) {
        const transport = await SendGrid.send(mail);
        console.log(transport)
        console.log(`E-Mail sent to ${mail.to}`);
        return transport;
    }
}
