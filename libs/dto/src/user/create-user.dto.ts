import { CreateResourceDto } from "../resource";

export class CreateUserDto {
    public readonly uid: string
    public readonly name: string;
    public readonly email: string;
    public readonly color: string;
    public readonly accessGroups: string[];
    public readonly isProjectManager: boolean;
    public readonly isResource: boolean;
    public readonly connect: string;
    public readonly resourceDto?: Omit<CreateResourceDto, "id" | "name" | "color">;
    public readonly sendWelcomeEmail: boolean;
}
