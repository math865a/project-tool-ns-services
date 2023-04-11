export class DeleteContractCommand {
    constructor(
        public readonly id: string,
        public readonly uid: string
    ) {}
}