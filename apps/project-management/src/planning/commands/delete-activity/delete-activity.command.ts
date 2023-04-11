export class DeleteActivityCommand {
    constructor(
        public readonly activityId: string,
        public readonly uid: string
    ) {}
}
