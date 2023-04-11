export class CreateResourceTypeDto {
    public readonly name: string;
    public readonly abbrevation: string;
    public readonly salesDefault: number;
    public readonly salesOvertime: number;
    public readonly typeNo: number;
    public readonly contract: string;
    public readonly resources: string[]
}
