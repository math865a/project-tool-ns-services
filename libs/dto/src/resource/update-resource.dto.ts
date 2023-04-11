export class UpdateResourceDto {
    readonly resourceId: string;
    readonly name: string;
    readonly initials: string;
    readonly costDefault: number;
    readonly costOvertime: number;
}