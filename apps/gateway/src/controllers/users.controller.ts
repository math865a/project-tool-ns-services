import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { HttpUser } from "@ns/decorators";
import { CreateUserDto, LinkUserDto, UpdateUserDto } from "@ns/dto";
import {
    accessGroupPatterns,
    authenticationPatterns,
    calendarPatterns,
    mailerPatterns,
    resourceTypePatterns,
    userPatterns,
} from "@ns/endpoints";
import { NatsClient } from "@ns/nats";

@Controller("users")
export class UsersController {
    constructor(private client: NatsClient) {}

    @Get()
    async getView(@HttpUser() uid: string) {
        return await Promise.all([
            this.client.request(userPatterns.getUsersView, uid),
            this.client.request(accessGroupPatterns.getAccessGroupOptions),
        ]).then((res) => ({
            rows: res[0],
            accessGroupOptions: res[1],
        }));
    }

    @Get("merge-options")
    async getConnectOptions() {
        return await this.client.request(userPatterns.getUserConnectOptions);
    }

    @Post("reset-password/:uid")
    async resetPassword(@Param("uid") uid: string) {
        return await this.client.request(
            authenticationPatterns.resetPassword,
            uid
        );
    }

    @Post("welcome/:uid")
    async sendWelcomeEmail(@Param("uid") uid: string) {
        const user: any = await this.client.request(userPatterns.getUser, uid);
        return await this.client.request(mailerPatterns.mailWelcome, {
            email: user.email,
            name: user.name
        });
    }

    @Post("mail-credentials/:uid")
    async sendCredentialsEmail(@Param("uid") uid: string) {
        return await this.client.request(mailerPatterns.mailCredentials, uid);
    }

    @Post("merge")
    async linkUser(@Body() dto: LinkUserDto, @HttpUser() uid: string) {
        return await this.client.request(userPatterns.linkUser, {
            dto,
            uid,
        });
    }

    @Post("split")
    async splitUser(@Body("id") id: string, @HttpUser() uid: string) {
        return await this.client.request(userPatterns.splitUser, {
            id,
            uid,
        });
    }

    @Post()
    async createUser(@Body() dto: CreateUserDto, @HttpUser() uid: string) {
        console.log(dto);
        return await this.client.request(userPatterns.createUser, {
            dto,
            uid,
        });
    }

    @Post(":uid")
    async updateUser(@Body() dto: UpdateUserDto, @HttpUser() uid: string) {
        return await this.client.request(userPatterns.updateUser, {
            dto,
            uid,
        });
    }

    @Delete(":uid")
    async deleteUser(@Param("uid") uid: string, @HttpUser() httpUser: string) {
        return await this.client.request(userPatterns.deleteUser, {
            id: uid,
            uid: httpUser,
        });
    }

    @Get("create-user-options")
    async getUserForm() {
        return await Promise.all([
            this.client.request(resourceTypePatterns.getResourceTypeOptions),
            this.client.request(accessGroupPatterns.getAccessGroupOptions),
            this.client.request(calendarPatterns.getCalendarOptions),
            this.client.request(userPatterns.getUserConnectOptions),
        ]).then((res) => ({
            resourceTypes: res[0],
            accessGroups: res[1],
            calendars: res[2],
            connectOptions: res[3],
        }));
    }

    @Get("resource-form/:uid")
    async getResourceForm(@Param("uid") uid: string) {
        return await Promise.all([
            this.client.request(resourceTypePatterns.getResourceTypeOptions),
            this.client.request(calendarPatterns.getCalendarOptions),
            this.client.request<{ uid: string; name: string; color: string }>(
                userPatterns.getUser,
                uid
            ),
        ]).then((res) => ({
            options: {
                resourceTypes: res[0],
                calendars: res[1],
            },
            base: res[2]
                ? {
                      id: res[2].uid,
                      name: res[2].name,
                      color: res[2].color,
                  }
                : undefined,
        }));
    }

    @Get("options")
    async getUserOptions() {
        return await this.client.request(userPatterns.getUserOptions);
    }
}
