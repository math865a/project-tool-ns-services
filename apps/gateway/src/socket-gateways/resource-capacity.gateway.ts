import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { ResourceCapacityInstructionsDto } from "@ns/dto";
import { schedulePatterns } from "@ns/endpoints";
import { NatsClient } from "@ns/nats";
import { Server } from "socket.io";

@WebSocketGateway({
    namespace: "resource-capacity",
    cors: {
        origin: "*",
    },
})
export class ResourceCapacityGateway {
    constructor(private client: NatsClient) {}

    @WebSocketServer()
    server: Server;

    @SubscribeMessage("get:workpackage-tasks")
    async getWorkpackageTasks(
        @MessageBody("instruction")
        instruction: ResourceCapacityInstructionsDto,
        @MessageBody("workpackageId") workpackageId: string
    ) {
        return await this.client.request(schedulePatterns.getWorkpackageTasks, {
            instruction,
            workpackageId,
        });
    }

    @SubscribeMessage("get:capacity-difference-timeseries")
    async getCapacityDifferenceTimeseries(
        @MessageBody() instruction: ResourceCapacityInstructionsDto
    ) {
        return await this.client.request(
            schedulePatterns.getCapacityDifferenceTimeseries,
            instruction
        );
    }

    @SubscribeMessage("get:booking-stage-timeseries")
    async getBookingStageTimeseries(
        @MessageBody() instruction: ResourceCapacityInstructionsDto
    ) {
        return await this.client.request(
            schedulePatterns.getBookingStageTimeseries,
            instruction
        );
    }

    @SubscribeMessage("get:workpackage-data")
    async getWorkpackageTimeseries(
        @MessageBody() instruction: ResourceCapacityInstructionsDto
    ) {
        return await Promise.all([
            this.client.request(
                schedulePatterns.getWorkpackageTimeseries,
                instruction
            ),
            this.client.request(
                schedulePatterns.getWorkpackageTotals,
                instruction
            ),
        ]).then((res) => ({
            timeseries: res[0],
            totals: res[1],
        }));
    }
}
