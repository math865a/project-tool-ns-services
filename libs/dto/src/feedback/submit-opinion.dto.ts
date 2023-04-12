import { FeedbackType } from "@ns/definitions";
import { SubmissionBase } from "./submit-feedback-base.dto";

export class SubmitOpinionDto extends SubmissionBase {
    public readonly type: FeedbackType.Opinion;
    public readonly submission: Submission;
}

class Submission {
    public readonly topic: string;
    public readonly text: string;
}
