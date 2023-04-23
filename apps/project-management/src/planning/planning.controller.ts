import { Controller, UsePipes } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { MessagePattern, Payload } from "@nestjs/microservices";
import {
    CreateActivityDto,
    CreateAllocationDto,
    CreateAssignmentDto,
    DeleteAssignmentDto,
    PipedUpdateActivityDto,
    UpdateAllocationDto,
    UpdatePeriodDto,
} from "@ns/dto";
import { planningPatterns as patterns } from "@ns/endpoints";
import {
    CreateActivityCommand,
    CreateAllocationCommand,
    CreateAssignmentCommand,
    DeleteActivityCommand,
    DeleteAssignmentCommand,
    UpdateActivityCommand,
    UpdateAllocationCommand,
    UpdatePeriodCommand,
} from "./commands";
import { AllocationQuery, PlanQuery } from "./queries";
import { UpdateActivityPipe } from "./pipes";

@Controller()
export class PlanningNatsController {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus
    ) {}

    @MessagePattern(patterns.getPlan)
    async getPlan(workpackageId: string) {
        return await this.queryBus.execute(new PlanQuery(workpackageId));
    }

    @MessagePattern(patterns.getAllocation)
    async getAllocation(allocationId: string) {
        return await this.queryBus.execute(new AllocationQuery(allocationId));
    }

    @MessagePattern(patterns.createActivity)
    async createActivity(
        @Payload("dto") dto: CreateActivityDto,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(
            new CreateActivityCommand(dto, uid)
        );
    }

    @MessagePattern(patterns.deleteActivity)
    async deleteActivity(
        @Payload("activityId") activityId: string,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(
            new DeleteActivityCommand(activityId, uid)
        );
    }

    @MessagePattern(patterns.createAllocation)
    async createAllocation(
        @Payload("dto") dto: CreateAllocationDto,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(
            new CreateAllocationCommand(dto, uid)
        );
    }

    @MessagePattern(patterns.updateAllocation)
    async updateAllocation(
        @Payload("dto") dto: UpdateAllocationDto,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(
            new UpdateAllocationCommand(dto, uid)
        );
    }

    @MessagePattern(patterns.createAssignment)
    async createAssignment(
        @Payload("dto") dto: CreateAssignmentDto,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(
            new CreateAssignmentCommand(dto, uid)
        );
    }

    @MessagePattern(patterns.deleteAssignment)
    async deleteAssignment(
        @Payload("dto") dto: DeleteAssignmentDto,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(
            new DeleteAssignmentCommand(dto, uid)
        );
    }

    @MessagePattern(patterns.updatePeriod)
    async updatePeriod(
        @Payload("dto") dto: UpdatePeriodDto,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(new UpdatePeriodCommand(dto, uid));
    }

    @UsePipes(UpdateActivityPipe)
    @MessagePattern(patterns.updateActivity)
    async updateActivity(
        @Payload("dto") dto: PipedUpdateActivityDto,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(
            new UpdateActivityCommand(dto, uid)
        );
    }
}
