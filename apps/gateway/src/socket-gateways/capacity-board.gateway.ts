import { UseGuards } from "@nestjs/common";
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { UserId } from "@ns/decorators";
import {
    CapacityFilterDto,
    CreateCapacityViewDto,
    UpdateCapacityViewDto,
    UpdateCapacityViewNameDto,
    UpdateDefaultCapacityViewDto,
} from "@ns/dto";
import { capacityBoardPatterns, capacityViewPatterns } from "@ns/endpoints";
import { NatsClient } from "@ns/nats";
import { WsGuard } from "@ns/session";
import { Server } from "socket.io";

@WebSocketGateway({
    namespace: "capacity-board",
    cors: {
        origin: "*",
    },
})
export class CapacityBoardGateway {
    constructor(private client: NatsClient) {}
    @WebSocketServer()
    server: Server;

    @UseGuards(WsGuard)
    @SubscribeMessage("get:batch")
    async loadCapacityBatch(@MessageBody() filter: CapacityFilterDto) {
        return await this.client.request(
            capacityBoardPatterns.getBatch,
            filter
        );
    }

    @UseGuards(WsGuard)
    @SubscribeMessage("create:view")
    async createCapacityView(
        @MessageBody() dto: CreateCapacityViewDto,
        @UserId() uid: string
    ) {
        return await this.client.request(
            capacityViewPatterns.createCapacityView,
            { dto, uid }
        );
    }

    @UseGuards(WsGuard)
    @SubscribeMessage("update:view")
    async updateCapacityView(
        @MessageBody() dto: UpdateCapacityViewDto,
        @UserId() uid: string
    ) {
        return await this.client.request(
            capacityViewPatterns.updateCapacityView,
            {
                dto,
                uid,
            }
        );
    }

    @UseGuards(WsGuard)
    @SubscribeMessage("update:view-name")
    async updateCapacityViewName(
        @MessageBody() dto: UpdateCapacityViewNameDto,
        @UserId() uid: string
    ) {
        return await this.client.request(
            capacityViewPatterns.updateCapacityViewName,
            {
                dto,
                uid,
            }
        );
    }

    @UseGuards(WsGuard)
    @SubscribeMessage("update:default-view")
    async updateDefaultCapacityView(
        @MessageBody() dto: UpdateDefaultCapacityViewDto,
        @UserId() uid: string
    ) {
        return await this.client.request(
            capacityViewPatterns.updateDefaultCapacityView,
            {
                dto,
                uid,
            }
        );
    }

    @UseGuards(WsGuard)
    @SubscribeMessage("delete:view")
    async deleteCapacityView(
        @MessageBody() viewId: string,
        @UserId() uid: string
    ) {
        return await this.client.request(
            capacityViewPatterns.deleteCapacityView,
            {
                viewId,
                uid,
            }
        );
    }
}
