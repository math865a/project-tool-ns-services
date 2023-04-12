import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { DomainEvents } from "@ns/cqrs";
import { FormResponse, FormSuccessResponse } from "@ns/definitions";
import { Model } from "mongoose";
import { Feedback } from "../models";
import { SubmitFeedbackCommand } from "./submit-feedback.command";
import { FeedbackSubmittedEvent } from "@ns/events";

@CommandHandler(SubmitFeedbackCommand)
export class SubmitFeedbackHandler
    implements ICommandHandler<SubmitFeedbackCommand, FormResponse>
{
    constructor(
        @InjectModel(Feedback.name) private Feedback: Model<Feedback>,
        private publisher: DomainEvents
    ) {}

    async execute(command: SubmitFeedbackCommand) {
        const submission = await new this.Feedback({
            type: command.dto.type,
            submission: command.dto.submission,
            meta: {
                uid: command.uid,
                pageUrl: command.dto.pageUrl,
            },
        }).save();
        console.log(submission);

        this.publisher.publish(
            new FeedbackSubmittedEvent(submission.toObject(), command.uid)
        );

        return new FormSuccessResponse({ message: "Din feedback er sendt" });
    }
}
