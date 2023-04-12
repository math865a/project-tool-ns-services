import { SubmitFeatureDto } from "@ns/dto";


export class SubmitFeedbackCommand {
    constructor(
        public readonly dto: SubmitFeatureDto,
        public readonly uid: string
    ) {}
}
