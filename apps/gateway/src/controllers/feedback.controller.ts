import { Body, Controller, Post } from "@nestjs/common";
import { HttpUser } from "@ns/decorators";
import { SubmitFeedbackDto } from "@ns/dto";
import { feedbackPatterns } from "@ns/endpoints";
import { NatsClient } from "@ns/nats";

@Controller("feedback")
export class FeedbackController {
    constructor(private client: NatsClient) {}

    @Post()
    async submitFeedback(
        @Body() dto: SubmitFeedbackDto,
        @HttpUser() uid: string
    ) {
        console.log(dto)
        return await this.client.request(feedbackPatterns.submitFeedback, {
            dto,
            uid,
        });
    }
}
