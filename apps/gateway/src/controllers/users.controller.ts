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

    @Post("activate/:uid")
    async activateUser(@Param("uid") id: string, @HttpUser() uid: string) {
        return await this.client.request(userPatterns.activateUser, {
            id,
            uid,
        });
    }

    @Post("deactivate/:uid")
    async deactivateUser(@Param("uid") id: string, @HttpUser() uid: string) {
        return await this.client.request(userPatterns.deactivateUser, {
            id,
            uid,
        });
    }

    @Post("reset-password")
    async resetPassword(@Body("email") email: string, @HttpUser() uid: string) {
        return await this.client.request(authenticationPatterns.resetPassword, {
            email,
            uid,
        });
    }

    @Post("mail-welcome/:uid")
    async sendWelcomeEmail(@Param("uid") to: string, @HttpUser() uid: string) {
        return await this.client.request(mailerPatterns.mailWelcome, {
            to,
            uid,
        });
    }

    @Post("mail-credentials/:uid")
    async sendCredentialsEmail(
        @Param("uid") to: string,
        @HttpUser() uid: string
    ) {
        return await this.client.request(mailerPatterns.mailCredentials, {
            to,
            uid,
        });
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
