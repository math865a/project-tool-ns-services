export class ValidateSystematicNameQuery {
    constructor(
        public readonly contractId: string,
        public readonly financialSourceId: string,
        public readonly serialNo: string,
        public readonly id?: string
    ) {}
}
