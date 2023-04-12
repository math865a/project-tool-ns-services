import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Document } from "mongoose";
import { FeedbackMeta } from "./feedback.model";

@Schema({ _id: false })
export class FeatureSubmission extends Document {
    @Prop()
    page: string;
    
    @Prop()
    problem: string;

    @Prop()
    impact: string;

    @Prop()
    cost: string;

    @Prop()
    reach: number;

    @Prop()
    urgency: number

    @Prop()
    goals: string;

    @Prop()
    solution: string

    @Prop()
    remarks: string

}

@Schema()
export class Feature extends Document {
    meta: FeedbackMeta;
    type: string;

    @Prop()
    submission: FeatureSubmission;
}

export const FeatureSchema = SchemaFactory.createForClass(Feature);