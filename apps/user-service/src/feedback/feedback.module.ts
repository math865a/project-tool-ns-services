import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
    Bug,
    Feedback,
    FeedbackSchema,
    Opinion,
    OpinionSchema,
    BugSchema,
    Feature,
    FeatureSchema,
} from "./models";
import { SubmitFeedbackHandler } from "./submit-feedback";
import { FeedbackNatsController } from "./feedback.controller";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Feedback.name,
                schema: FeedbackSchema,
                discriminators: [
                    {
                        name: Bug.name,
                        schema: BugSchema,
                    },
                    {
                        name: Opinion.name,
                        schema: OpinionSchema,
                    },
                    {
                        name: Feature.name,
                        schema: FeatureSchema
                    }
                ],
            },
        ]),
    ],
    providers: [SubmitFeedbackHandler],
    controllers: [FeedbackNatsController],
})
export class FeedbackModule {}
