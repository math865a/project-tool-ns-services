import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NatsClient } from './nats.client';
import { NatsPublisher } from './nats.publisher';
import { NATS } from './_constants';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: NATS,
                transport: Transport.NATS,
                options: {
                    servers: [
                        process.env.NATS_CONN
                    ],
                },
            },
        ]),
    ],
    providers: [NatsClient, NatsPublisher],
    exports: [NatsClient, NatsPublisher, ClientsModule],
})
export class NatsModule {}
