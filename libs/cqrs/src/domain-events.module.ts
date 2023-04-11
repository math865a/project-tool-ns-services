import { Module } from "@nestjs/common";
import { CqrsModule as cqrs } from "@nestjs/cqrs";
import { NatsModule, NatsPublisher } from "@ns/nats";
import { DomainEvents } from "./domain-events";
import { NestJSCqrsDomainEvents } from "./nestjs-cqrs-domain-events";
@Module({
    imports: [cqrs, NatsModule],
    providers: [
        NestJSCqrsDomainEvents,
        { provide: DomainEvents, useClass: NatsPublisher },
    ],
    exports: [DomainEvents, cqrs],
})
export class CQRSModule {}
