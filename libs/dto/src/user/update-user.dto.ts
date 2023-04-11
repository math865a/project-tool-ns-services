export class UpdateUserDto {
    public readonly uid: string;
    public readonly email: string;
    public readonly accessGroups: string[];
    public readonly name: string;
    public readonly color: string;
    public readonly isDeactivated: boolean;

}
