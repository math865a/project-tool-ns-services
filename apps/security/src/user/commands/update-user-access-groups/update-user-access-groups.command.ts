export class UpdateUserAccessGroupsCommand {
    constructor(

        public readonly accessGroups: string[],
        public readonly uid: string
    ) {}
}
