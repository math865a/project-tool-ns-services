import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { HttpUser } from "@ns/decorators";
import { CreateResourceDto, UpdateResourceDto } from "@ns/dto";
import {
    calendarPatterns,
    resourcePatterns as patterns,
    resourcePortfolioPatterns,
    resourceTypePatterns,
} from "@ns/endpoints";
import { NatsClient } from "@ns/nats";
@Controller("resources")
export class ResourcesController {
    constructor(private client: NatsClient) {}

    @Get()
    async getView() {
        return await this.client.request(patterns.getResourcesView);
    }

    @Post()
    async create(@Body() dto: CreateResourceDto, @HttpUser() uid: string) {
        return await this.client.request(patterns.createResource, {
            dto,
            uid,
        });
    }

    @Get("create-form-options")
    async getCreateForm() {
        return await Promise.all([
            this.client.request(resourceTypePatterns.getResourceTypeOptions),
            this.client.request(calendarPatterns.getCalendarOptions),
        ]).then((res) => ({
            resourceTypes: res[0],
            calendars: res[1],
        }));
    }

    @Get(":resourceId")
    async getProfile(@Param("resourceId") resourceId: string) {
        return await Promise.all([
            this.client.request(patterns.getResourceProfile, resourceId),
            this.client.request(
                resourcePortfolioPatterns.getResourceAgents,
                resourceId
            ),
        ]).then((res) => ({
            node: res[0],
            resourcetypes: res[1],
        }));
    }

    @Delete(":id")
    async delete(
        @Param("id") id: string,
        @HttpUser() uid: string
    ) {
        return await this.client.request(patterns.deleteResource, {
            id,
            uid,
        });
    }

    @Post(":resourceId")
    async update(
        @Param("resourceId") resourceId: string,
        @Body() dto: Omit<UpdateResourceDto, "resourceId">,
        @HttpUser() uid: string
    ) {
        return await this.client.request(patterns.updateResource, {
            dto: {
                ...dto,
                resourceId,
            },
            uid,
        });
    }
}
