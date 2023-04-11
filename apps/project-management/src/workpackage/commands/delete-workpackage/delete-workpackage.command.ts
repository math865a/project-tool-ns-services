
export class DeleteWorkpackageCommand {
    constructor(
        public readonly workpackageId: string,
        public readonly uid: string
    ) {}
}
