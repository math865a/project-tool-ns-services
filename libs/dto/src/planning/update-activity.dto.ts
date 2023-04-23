import { OmitType } from "@nestjs/mapped-types";

export class UpdateActivityDto {
    public readonly id: string;
    public readonly name: string;
    public readonly color?: string;
    public readonly description?: string;
}

export class PipedUpdateActivityDto extends OmitType(UpdateActivityDto, [
    "color",
    "description",
]) {
    public readonly color: string | null;
    public readonly description: string | null;
}
