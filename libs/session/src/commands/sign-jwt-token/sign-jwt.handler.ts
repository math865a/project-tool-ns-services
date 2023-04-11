import { SignedJwtToken } from '@ns/definitions';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { DomainEvents } from '@ns/cqrs';
import { JwtTokenSignedEvent } from '@ns/events';
import { SignJwtCommand } from './sign-jwt.command';

@CommandHandler(SignJwtCommand)
export class SignJwtHandler
    implements ICommandHandler<SignJwtCommand, SignedJwtToken>
{
    constructor(
        private readonly jwtService: JwtService,
        private readonly publisher: DomainEvents,
    ) {}

    async execute({ uid }: SignJwtCommand): Promise<SignedJwtToken> {
        const token = this.jwtService.sign({uid: uid});
        this.publisher.publish(new JwtTokenSignedEvent())
        return new SignedJwtToken(token);
    }
}
