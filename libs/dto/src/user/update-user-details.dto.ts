

export class UpdateUserDetailsDto {
    constructor(
        public readonly uid: string,
        public readonly name: string,
        public readonly email: string,
        public readonly color: string
    ){}
}