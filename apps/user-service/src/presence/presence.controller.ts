import { Controller } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { presencePatterns as patterns } from "@ns/endpoints";
import { TogglePresenceCommand } from "./commands/toggle-presence/toggle-presence.command";
import { LoadPresenceQuery } from "./queries/load-presence.query";
import { UserJoinedEvent, UserLeftEvent } from "@ns/events";
import { IsUserOnlineQuery } from "./queries";
@Controller()
export class PresenceNatsController {
    constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

    @EventPattern(UserJoinedEvent.name)
    async registerPresence(event: UserJoinedEvent) {
        console.log("Register presence", event);
        await this.commandBus.execute(
            new TogglePresenceCommand(true, event.timestamp, event.uid)
        );
    }

    @EventPattern(UserLeftEvent.name)
    async registerAbsence(event: UserLeftEvent) {
        console.log("Register absence", event);
        await this.commandBus.execute(
            new TogglePresenceCommand(false, event.timestamp, event.uid)
        );
    }

    @MessagePattern(patterns.getPresence)
    async getOnlineUsers(uid: string) {
        return await this.queryBus.execute(new LoadPresenceQuery(uid, true));
    }

    @MessagePattern(patterns.getUserPresence)
    async getUser(uid: string) {
        return await this.queryBus.execute(new LoadPresenceQuery(uid));
    }

    @MessagePattern(patterns.getIsUserOnline)
    async isUserOnline(uid: string) {
        return await this.queryBus.execute(new IsUserOnlineQuery(uid));
    }
}
