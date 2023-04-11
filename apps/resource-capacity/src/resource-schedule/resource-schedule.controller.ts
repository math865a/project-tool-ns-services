import { Controller, UsePipes } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { MessagePattern, Payload } from "@nestjs/microservices";
import {
    ResourceCapacityWeeksInstruction,
    ScheduleInstruction,
} from "@ns/definitions";
import { schedulePatterns as patterns } from "@ns/endpoints";
import { IntervalWeeksPipe, SummaryViewPipe } from "./pipes";
import {
    BookingStageTimeseriesQuery,
    CapacityDifferenceTimeseriesQuery,
    ScheduleQuery,
    TasksQuery,
    WorkpackageTasksQuery,
    WorkpackageTimeseriesQuery,
    WorkpackageTotalsQuery,
} from "./queries";
import { ResourceCapacityInstructionsDto } from "@ns/dto";

@Controller()
export class ScheduleNatsController {
    constructor(private queryBus: QueryBus) {}

    @MessagePattern(patterns.getSchedule)
    async getSchedule(@Payload() instruction: ScheduleInstruction) {
        return await this.queryBus.execute(new ScheduleQuery(instruction));
    }

    @MessagePattern(patterns.getTasks)
    async getTasks(@Payload() instruction: ScheduleInstruction) {
        return await this.queryBus.execute(new TasksQuery(instruction));
    }

    @UsePipes(SummaryViewPipe)
    @MessagePattern(patterns.getSummaryTasks)
    async getSummaryTasks(@Payload() instruction: ScheduleInstruction) {
        return await this.queryBus.execute(new TasksQuery(instruction));
    }

    @UsePipes(new IntervalWeeksPipe())
    @MessagePattern(patterns.getBookingStageTimeseries)
    async getBookingStageTimeseries(
        @Payload() instruction: ResourceCapacityWeeksInstruction
    ) {
        return await this.queryBus.execute(
            new BookingStageTimeseriesQuery(instruction)
        );
    }

    @UsePipes(new IntervalWeeksPipe())
    @MessagePattern(patterns.getCapacityDifferenceTimeseries)
    async getCapacityDifferenceTimeseries(
        @Payload() instruction: ResourceCapacityWeeksInstruction
    ) {
        return await this.queryBus.execute(
            new CapacityDifferenceTimeseriesQuery(instruction)
        );
    }

    @UsePipes(new IntervalWeeksPipe())
    @MessagePattern(patterns.getWorkpackageTimeseries)
    async getWorkpackageTimeseries(
        @Payload() instruction: ResourceCapacityWeeksInstruction
    ) {
        return await this.queryBus.execute(
            new WorkpackageTimeseriesQuery(instruction)
        );
    }

    @MessagePattern(patterns.getWorkpackageTotals)
    async getWorkpackageTotals(
        @Payload() instruction: ResourceCapacityInstructionsDto
    ) {
        return await this.queryBus.execute(
            new WorkpackageTotalsQuery(instruction)
        );
    }

    @MessagePattern(patterns.getWorkpackageTasks)
    async getWorkpackageTasks(
        @Payload("instruction") instruction: ResourceCapacityInstructionsDto,
        @Payload("workpackageId") workpackageId: string
    ) {
        return await this.queryBus.execute(
            new WorkpackageTasksQuery(instruction, workpackageId)
        );
    }
}
