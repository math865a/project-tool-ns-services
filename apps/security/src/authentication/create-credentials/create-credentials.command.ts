export class CreateCredentialsCommand {
    constructor(
        public readonly uid: string,
        public readonly email: string,
        public readonly sendWelcomeEmail: boolean
    ) {}
}
