import { Controller } from "@nestjs/common";
import { UserServiceGateway } from "./user-service.gateway";
import { EventPattern } from "@nestjs/microservices";
import { UserDeactivatedEvent } from "@ns/events";
import { NatsClient } from "@ns/nats";
import { presencePatterns } from "@ns/endpoints";

@Controller()
export class UserServiceNats {
    constructor(
        private gateway: UserServiceGateway,
        private client: NatsClient
    ) {}

    @EventPattern(UserDeactivatedEvent.name)
    async handleUserDeactivatedEvent(event: UserDeactivatedEvent) {
        const isUserOnline = await this.client.request<boolean>(
            presencePatterns.getIsUserOnline,
            event.uid
        );
        if (isUserOnline) {
            this.gateway.server.to(event.uid).emit("user-deactivated");
        }
    }
}
