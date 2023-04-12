import { FeedbackType } from "@ns/definitions";
import { SubmissionBase } from "./submit-feedback-base.dto";

export class SubmitFeatureDto extends SubmissionBase {
    public readonly type: FeedbackType.Feature;
    public readonly submission: Submission;
}

class Submission {
    page: string;
    problem: string;
    impact: string;
    reach: number;
    urgency: number;
    goals: string;
    solution: string;
    remarks: string;
}
