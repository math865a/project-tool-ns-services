import { Controller } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import {
    AssignProjectManagerDto,
    CreateProjectManagerDto,
    UpdateProjectManagerDto,
} from "@ns/dto";
import { projectManagerPatterns as patterns } from "@ns/endpoints";
import { UserCreatedEvent } from "@ns/events";
import {
    AssignProjectManagerCommand,
    UpdateProjectManagerCommand,
} from "./commands";
import { CreateProjectManagerCommand } from "./commands/create-project-manager";
import { RemoveProjectManagerCommand } from "./commands/remove-project-manager";
import {
    IsProjectManagerQuery,
    ProjectManagerOptionsQuery,
    ProjectManagerQuery,
    ProjectManagersQuery,
} from "./queries";
@Controller()
export class ProjectManagerNatsController {
    constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}

    @MessagePattern(patterns.assignProjectManager)
    async assignProjectManager(
        @Payload("dto") dto: AssignProjectManagerDto,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(
            new AssignProjectManagerCommand(dto, uid)
        );
    }

    @MessagePattern(patterns.getProjectManagerOptions)
    async getProjectManagerOptions() {
        return await this.queryBus.execute(new ProjectManagerOptionsQuery());
    }

    @MessagePattern(patterns.createProjectManager)
    async createProjectManager(
        @Payload("dto") dto: CreateProjectManagerDto,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(
            new CreateProjectManagerCommand(dto, uid)
        );
    }

    @MessagePattern(patterns.removeProjectManager)
    async removeProjectManager(
        @Payload("id") id: string,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(
            new RemoveProjectManagerCommand(id, uid)
        );
    }

    @MessagePattern(patterns.getProjectManagers)
    async getProjectManagers() {
        return await this.queryBus.execute(new ProjectManagersQuery());
    }

    @MessagePattern(patterns.getProjectManagerProfile)
    async getProjectManagerProfile(id: string) {
        return await this.queryBus.execute(new ProjectManagerQuery(id));
    }

    @MessagePattern(patterns.updateProjectManager)
    async updateProjectManager(
        @Payload("dto") dto: UpdateProjectManagerDto,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(
            new UpdateProjectManagerCommand(dto, uid)
        );
    }

    @EventPattern(UserCreatedEvent.name)
    async onUserCreated(event: UserCreatedEvent) {
        if (event.body.isProjectManager && event.body.connect === "Ingen") {
            await this.commandBus.execute(
                new CreateProjectManagerCommand(
                    {
                        id: event.body.uid,
                        name: event.body.name,
                        color: event.body.color,
                    },
                    event.body.uid
                )
            );
        } else if (event.body.connect !== "Ingen") {
            const isProjectManager = await this.queryBus.execute(
                new IsProjectManagerQuery(event.body.uid)
            );
            if (isProjectManager && !event.body.isProjectManager) {
                await this.commandBus.execute(
                    new RemoveProjectManagerCommand(event.body.uid, event.uid)
                );
            } else if (!isProjectManager && event.body.isProjectManager) {
                await this.commandBus.execute(
                    new CreateProjectManagerCommand(
                        {
                            id: event.body.uid,
                            name: event.body.name,
                            color: event.body.color,
                        },
                        event.uid
                    )
                );
            }
        }
    }
}
