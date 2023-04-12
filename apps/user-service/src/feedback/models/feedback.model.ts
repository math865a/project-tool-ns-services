import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, now, Types } from "mongoose";
import { Bug, BugSubmission } from "./bug.model";
import { Opinion, OpinionSubmission } from "./opinion.schema";
import { Feature } from "./feature.model";

@Schema({ _id: false, timestamps: true })
export class FeedbackMeta extends Document {
    @Prop({ required: true })
    uid: string;
    @Prop({ required: true })
    pageUrl: string;

    @Prop({ default: now() })
    createdAt: Date;

    @Prop({ default: now() })
    updatedAt: Date;
}

@Schema({ discriminatorKey: "type" })
export class Feedback extends Document {
    @Prop({ required: true, type: FeedbackMeta })
    meta: FeedbackMeta;

    @Prop({
        required: true,
        enum: [Opinion.name, Bug.name, Feature.name],
        type: String,
    })
    type: string;

    submission: any;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
