import { Body, Controller, Get, Post } from "@nestjs/common";
import { HttpUser } from "@ns/decorators";
import { UpdatePasswordDto, UpdateUserDetailsDto } from "@ns/dto";
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

    @Post("password")
    async pass(@Body() dto: UpdatePasswordDto, @HttpUser() uid: string) {
        console.log(dto);
        return await this.client.request(
            authenticationPatterns.updatePassword,
            { dto: dto, uid: uid }
        );
    }

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

    @Get("test")
    test(@HttpUser() uid: string) {
        console.log(uid);
        return { uid: uid };
    }

    @Post()
    async updateDetails(
        @Body() dto: Omit<UpdateUserDetailsDto, "uid">,
        @HttpUser() uid: string
    ) {
        return await this.client.request(userPatterns.updateUserDetails, {
            dto: {
                ...dto,
                uid,
            },
            uid,
        });
    }
}
