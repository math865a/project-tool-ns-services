

export class DeleteResourceTypeCommand {
    constructor(
        public readonly resourceTypeId: string,
        public readonly uid: string
    ) {}
}