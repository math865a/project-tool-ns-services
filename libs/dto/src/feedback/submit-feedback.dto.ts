import { SubmitBugDto } from "./submit-bug.dto";
import { SubmitFeatureDto } from "./submit-feature.dto";
import { SubmitOpinionDto } from "./submit-opinion.dto";

export type SubmitFeedbackDto =
    | SubmitFeatureDto
    | SubmitBugDto
    | SubmitOpinionDto;
