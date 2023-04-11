import { CanActivate, Injectable } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { Observable } from "rxjs";
import { Socket } from "socket.io";
import { VerifySession, VerifySessionHandler } from "../commands";

@Injectable()
export class WsGuard implements CanActivate {
    constructor(private verify: VerifySessionHandler) {}

    canActivate(
        context: any
    ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
        const client = context.args[0] as Socket;
        const token = client.handshake.auth["access_token"] as string;
        const result = this.verify.execute(new VerifySession(token));
        if (!result) {
            client.disconnect(true);
            return false;
        }
        return true;
    }
}
