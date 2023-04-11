export class UpdateUsernameCommand {
    constructor(public readonly email: string, public readonly uid: string) {}
}
