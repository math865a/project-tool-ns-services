import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { HttpUser } from "@ns/decorators";
import { UpsertAccessGroupDto } from "@ns/dto";
import { accessGroupPatterns, userPatterns } from "@ns/endpoints";
import { NatsClient } from "@ns/nats";

@Controller("access-groups")
export class AccessGroupsController {
    constructor(private client: NatsClient) {}

    @Get()
    async getView() {
        return await Promise.all([
            this.client.request(accessGroupPatterns.getAccessGroupsView),
            this.client.request(userPatterns.getUserOptions),
        ]).then((res) => ({
            ...(res[0] as Object),
            userOptions: res[1],
        }));
    }

    @Get("options")
    async getOptions() {
        return await this.client.request(
            accessGroupPatterns.getAccessGroupOptions
        );
    }

    @Post()
    async createAccessGroup(
        @Body() dto: UpsertAccessGroupDto,
        @HttpUser() uid: string
    ) {
        return await this.client.request(
            accessGroupPatterns.createAccessGroup,
            { dto, uid }
        );
    }

    @Post(":id")
    async updateAccessGroup(
        @Body() dto: UpsertAccessGroupDto,
        @HttpUser() uid: string
    ) {
        return await this.client.request(
            accessGroupPatterns.updateAccessGroup,
            { dto, uid }
        );
    }

    @Delete(":id")
    async deleteAccessGroup(@Param("id") id: string, @HttpUser() uid: string) {
        return await this.client.request(
            accessGroupPatterns.deleteAccessGroup,
            { id, uid }
        );
    }
}
