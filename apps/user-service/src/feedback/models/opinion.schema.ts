import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Document } from "mongoose";
import { FeedbackMeta } from "./feedback.model";

@Schema({ _id: false })
export class OpinionSubmission extends Document {
    @Prop()
    topic: string;

    @Prop()
    text: string;
}

@Schema()
export class Opinion extends Document {
    meta: FeedbackMeta;
    type: string;

    @Prop()
    submission: OpinionSubmission;
}

export const OpinionSchema = SchemaFactory.createForClass(Opinion);