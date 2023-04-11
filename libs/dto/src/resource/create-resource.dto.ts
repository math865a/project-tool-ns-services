export class CreateResourceDto {
    public readonly id: string;
    public readonly name: string;
    public readonly initials: string;
    public readonly costDefault: number;
    public readonly costOvertime: number;
    public readonly resourceTypes: string[];
    public readonly calendar: string;
    public readonly color: string;
}