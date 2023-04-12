import { EventBase } from "@ns/nats";
import { MailDataRequired } from "@sendgrid/mail";

export class WelcomeMailSentEvent extends EventBase {
    constructor(
        public body: {
            uid: string;
            mail: MailDataRequired;
        },
        public readonly uid: string
    ) {
        super();
    }
}
