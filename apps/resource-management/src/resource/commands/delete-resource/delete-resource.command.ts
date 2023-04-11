export class DeleteResourceCommand {
    constructor(
        public readonly id: string,
        public readonly uid: string
    ) {}
}
