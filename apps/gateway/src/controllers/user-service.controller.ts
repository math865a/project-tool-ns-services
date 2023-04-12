import { Body, Controller, Get, Post } from "@nestjs/common";
import { HttpUser } from "@ns/decorators";
import { UpdateUserDetailsDto } from "@ns/dto";
import {
    authenticationPatterns,
    authorizationPatterns,
    favoritePatterns,
    presencePatterns,
    userPatterns,
} from "@ns/endpoints";
import { NatsClient } from "@ns/nats";


@Controller("user-service")
export class UserServiceController {
    constructor(private client: NatsClient) {}

    @Get("session")
    async getSession(@HttpUser() uid: string) {
        if (!uid) return null;
        return await Promise.all([
            this.client.request(userPatterns.getUser, uid),
            this.client.request(authorizationPatterns.getAbilities, uid),
            this.client.request(favoritePatterns.getFavorites, uid),
            this.client.request(presencePatterns.getPresence, uid),
        ]).then((res) => ({
            user: res[0],
            rawAbilities: res[1],
            favorites: res[2],
            onlineUsers: res[3],
        }));
    }

    @Post("password")
    async updatePassword(
        @HttpUser() uid: string,
        @Body("password") password: string
    ) {
        return await this.client.request(
            authenticationPatterns.updatePassword,
            { password, uid }
        );
    }

    @Post()
    async updateDetails(
        @Body() dto: UpdateUserDetailsDto,
        @HttpUser() uid: string
    ) {
        return await this.client.request(userPatterns.updateUserDetails, {
            dto,
            uid,
        });
    }

    
}
