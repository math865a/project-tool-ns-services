

export class UpdatePasswordDto {
    public readonly oldPassword: string;
    public readonly password: string;
    public readonly confirmPassword: string;
}