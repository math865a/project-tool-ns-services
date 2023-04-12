import { FeedbackType } from "@ns/definitions";
import { SubmissionBase } from "./submit-feedback-base.dto";

export class SubmitBugDto extends SubmissionBase {
    public readonly type: FeedbackType.Bug;
    public readonly submission: Submission;
}

class Submission {
    public readonly summary: string;
    public readonly priority: number;
    public readonly page: string;
    public readonly stepsToReproduce: string;
    public readonly expectedResult: string;
    public readonly actualResult: string;
    public readonly remarks: string;
}
