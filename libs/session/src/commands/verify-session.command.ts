import { JwtTokenPayload } from "@ns/definitions";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JwtService } from "@nestjs/jwt";
import { DomainEvents } from "@ns/cqrs";
import { InvalidJwtTokenEvent, JwtTokenVerifiedEvent } from "@ns/events";

export class VerifySession {
    constructor(public readonly token: string | undefined) {}
}

export class JwtVerifiedEvent {
    constructor(public readonly payload: JwtTokenPayload, timestamp: number) {}
}

@CommandHandler(VerifySession)
export class VerifySessionHandler
    implements ICommandHandler<VerifySession, JwtTokenPayload | false>
{
    constructor(
        private readonly jwtService: JwtService,
        private readonly publisher: DomainEvents
    ) {}

    async execute({ token }: VerifySession): Promise<JwtTokenPayload | false> {
        if (!token) return false;
        try {
            const payload = await this.jwtService.verifyAsync<JwtTokenPayload>(
                token
            );
            return payload;
        } catch (e) {
            this.publisher.publish(new InvalidJwtTokenEvent());
            return false;
        }
    }
}
