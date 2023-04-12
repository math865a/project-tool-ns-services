import { Controller } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { SubmitFeatureDto } from "@ns/dto";
import { feedbackPatterns } from "@ns/endpoints";
import { SubmitFeedbackCommand } from "./submit-feedback";

@Controller()
export class FeedbackNatsController {
    constructor(private commandBus: CommandBus) {}

    @MessagePattern(feedbackPatterns.submitFeedback)
    async submitFeedback(
        @Payload("dto") dto: SubmitFeatureDto,
        @Payload("uid") uid: string
    ) {
        console.log(dto)
        return await this.commandBus.execute(
            new SubmitFeedbackCommand(dto, uid)
        );
    }
}
