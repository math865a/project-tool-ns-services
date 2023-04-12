import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { FeedbackMeta } from "./feedback.model";

@Schema({ _id: false })
export class BugSubmission extends Document {
    @Prop()
    summary: string;

    @Prop({ required: true })
    priority: number;

    @Prop()
    page: string;

    @Prop()
    stepsToReproduce: string;

    @Prop()
    expectedResult: string;

    @Prop()
    actualResult: string;

    @Prop()
    remarks: string;
}

@Schema()
export class Bug extends Document {
    meta: FeedbackMeta;
    type: string;

    @Prop({ type: BugSubmission })
    submission: BugSubmission;
}

export const BugSchema = SchemaFactory.createForClass(Bug);
