import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { HttpUser } from "@ns/decorators";
import { CreateProjectManagerDto, UpdateProjectManagerDto } from "@ns/dto";
import { projectManagerPatterns, workpackagePatterns } from "@ns/endpoints";
import { NatsClient } from "@ns/nats";

@Controller("project-manager")
export class ProjectManagerController {
    constructor(private client: NatsClient) {}

    @Get()
    async getProjectManagers() {
        return await this.client.request(
            projectManagerPatterns.getProjectManagers
        );
    }

    @Get(":id")
    async getProjectManager(@Param("id") id: string) {
        return await Promise.all([
            this.client.request(
                projectManagerPatterns.getProjectManagerProfile,
                id
            ),
            this.client.request(
                workpackagePatterns.getProjectManagerWorkpackages,
                id
            ),
        ]).then((res) => ({
            node: res[0],
            workpackages: res[1],
        }));
    }

    @Post()
    async createProjectManager(
        @Body() dto: CreateProjectManagerDto,
        @HttpUser() uid: string
    ) {
        console.log(dto);
        return await this.client.request(
            projectManagerPatterns.createProjectManager,
            {
                dto,
                uid,
            }
        );
    }

    @Post(":id")
    async updateProjectManager(
        @Body() dto: Omit<UpdateProjectManagerDto, "id">,
        @Param("id") id: string,
        @HttpUser() uid: string,

    ) {
        return await this.client.request(
            projectManagerPatterns.updateProjectManager,
            {
                dto: {
                    ...dto,
                    id: id,
                },
                uid,
            }
        );
    }

    @Delete(":id")
    async deleteProjectManager(
        @Param("id") id: string,
        @HttpUser() httpUser: string
    ) {
        return await this.client.request(
            projectManagerPatterns.removeProjectManager,
            {
                id,
                uid: httpUser,
            }
        );
    }
}
