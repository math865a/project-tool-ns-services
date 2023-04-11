

export class UpdateUserDetailsDto {
    constructor(
        public readonly name: string,
        public readonly email: string,
        public readonly color: string
    ){}
}