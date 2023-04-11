import { UseGuards } from "@nestjs/common";
import {
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { UserId } from "@ns/decorators";
import {
    authenticationPatterns,
    favoritePatterns,
    presencePatterns,
    userPatterns,
} from "@ns/endpoints";
import {
    UserJoinedEvent,
    UserLeftEvent
} from "@ns/events";
import { NatsClient } from "@ns/nats";
import { WsGuard } from "@ns/session";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
    namespace: "user-service",
    cors: {
        origin: "*",
    },
})
export class UserServiceGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    constructor(private client: NatsClient) {}

    @WebSocketServer()
    server: Server;

    async handleConnection(client: Socket) {
        const uid = client.handshake.auth["uid"] as string;
        const roomSockets = await this.server.in(uid as string).fetchSockets();
        if (roomSockets.length === 0) {
            await client.join(uid);
            this.client.publish(new UserJoinedEvent(uid));
            this.emitJoinEvent(uid);
        }
    }

    async handleDisconnect(client: Socket) {
        const uid = client.handshake.auth["uid"] as string;
        console.log(uid)
        const roomSockets = await this.server.in(uid as string).fetchSockets();
        if (roomSockets.length === 0) {
            this.client.publish(new UserLeftEvent(uid));
            this.emitLeaveEvent(uid);
        }
    }

    async emitJoinEvent(uid: string) {
        const user = await this.client.request(userPatterns.getUser, uid);
        this.server.except(uid).emit("presence:join", user);
    }

    async emitLeaveEvent(uid: string) {
        this.server.except(uid).emit("presence:leave", uid);
    }

    async emitInitialLoad(uid: string) {
        const onlineUsers = await this.client.request(
            presencePatterns.getPresence,
            uid
        );
        this.server.to(uid).emit("presence:initial", onlineUsers);
    }

    @UseGuards(WsGuard)
    @SubscribeMessage("update:password")
    async updatePassword(
        @MessageBody() password: string,
        @UserId() uid: string
    ) {
        return await this.client.request(
            authenticationPatterns.updatePassword,
            {
                password,
                uid,
            }
        );
    }

    @UseGuards(WsGuard)
    @SubscribeMessage("add:favorite")
    async addFavorite(@MessageBody() recordId: string, @UserId() uid: string) {
        return await this.client.request(favoritePatterns.addFavorite, {
            recordId,
            uid,
        });
    }

    @UseGuards(WsGuard)
    @SubscribeMessage("remove:favorite")
    async removeFavorite(
        @MessageBody() recordId: string,
        @UserId() uid: string
    ) {
        return await this.client.request(favoritePatterns.removeFavorite, {
            recordId,
            uid,
        });
    }
}
