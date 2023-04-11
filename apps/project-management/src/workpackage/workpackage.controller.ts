import { Controller } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { MessagePattern, Payload } from "@nestjs/microservices";
import {
    CreateWorkpackageDto, UpdateBookingStageDto,
    UpdateStageDto, UpdateWorkpackageDto
} from "@ns/dto";
import { workpackagePatterns as patterns } from "@ns/endpoints";
import {
    CreateWorkpackageCommand, DeleteWorkpackageCommand,
    UpdateBookingStageCommand,
    UpdateStageCommand, UpdateWorkpackageCommand
} from "./commands";
import {
    ProjectManagerWorkpackagesQuery,
    StagesQuery,
    WorkpackageCreateFormQuery,
    WorkpackageFormOptionsQuery,
    WorkpackageProfileQuery,
    WorkpackageViewQuery
} from "./queries";

@Controller()
export class WorkpackageNatsController {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus
    ) {}

    @MessagePattern(patterns.createWorkpackage)
    async createWorkpackage(
        @Payload("dto") dto: CreateWorkpackageDto,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(
            new CreateWorkpackageCommand(dto, uid)
        );
    }

    @MessagePattern(patterns.updateWorkpackage)
    async updateWorkpackage(
        @Payload("dto") dto: UpdateWorkpackageDto,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(
            new UpdateWorkpackageCommand(dto, uid)
        );
    }

    @MessagePattern(patterns.deleteWorkpackage)
    async deleteWorkpackage(
        @Payload("workpackageId") workpackageId: string,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(
            new DeleteWorkpackageCommand(workpackageId, uid)
        );
    }

    @MessagePattern(patterns.updateBookingStage)
    async updateBookingStage(
        @Payload("dto") dto: UpdateBookingStageDto,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(
            new UpdateBookingStageCommand(dto, uid)
        );
    }

    @MessagePattern(patterns.updateStage)
    async updateStage(
        @Payload("dto") dto: UpdateStageDto,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(new UpdateStageCommand(dto, uid));
    }

    @MessagePattern(patterns.getWorkpackageStages)
    async getStages() {
        return await this.queryBus.execute(new StagesQuery());
    }

    @MessagePattern(patterns.getWorkpackageProfile)
    async getProfile(id: string) {
        return await this.queryBus.execute(new WorkpackageProfileQuery(id));
    }

    @MessagePattern(patterns.getWorkpackagesView)
    async getView() {
        return await this.queryBus.execute(new WorkpackageViewQuery());
    }

    @MessagePattern(patterns.getWorkpackageCreateForm)
    async getCreateForm() {
        return await this.queryBus.execute(new WorkpackageCreateFormQuery());
    }

    async getFormOptions() {
        return await this.queryBus.execute(new WorkpackageFormOptionsQuery());
    }

    @MessagePattern(patterns.getProjectManagerWorkpackages)
    async getProjectManagerWorkpackages(id: string) {
        return await this.queryBus.execute(new ProjectManagerWorkpackagesQuery(id));
    }

}
