

export class DeleteCapacityViewCommand {
    constructor(
        public readonly viewId: string,
        public readonly uid: string
    ) {}
}
