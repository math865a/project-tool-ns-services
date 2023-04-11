import { Controller } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { EventPattern } from "@nestjs/microservices";
import {
    AllocationCreatedEvent,
    AllocationUpdatedEvent,
    PeriodUpdatedEvent
} from "@ns/events"
import { SyncBookingsCommand } from "./sync-bookings/sync-bookings.command";

@Controller()
export class SchedulerController {
    constructor(private commandBus: CommandBus) {}

    @EventPattern(AllocationCreatedEvent.name)
    async onAllocationCreated(event: AllocationCreatedEvent) {
        await this.commandBus.execute(
            new SyncBookingsCommand(event.body.id, event.uid)
        );
    }

    @EventPattern(PeriodUpdatedEvent.name)
    async onPeriodUpdated(event: PeriodUpdatedEvent) {
        if (event.body.kind === "Allocation") {
            await this.commandBus.execute(
                new SyncBookingsCommand(event.body.activityId, event.uid)
            );
        }
    }

    @EventPattern(AllocationUpdatedEvent.name)
    async onAllocationUpdated(event: AllocationUpdatedEvent) {
        await this.commandBus.execute(
            new SyncBookingsCommand(event.body.allocationId, event.uid)
        );
    }
}
