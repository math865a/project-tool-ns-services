import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATS } from './_constants';
import { EventBase } from './event-base';

export class NatsClient {
    constructor(@Inject(NATS) private client: ClientProxy) {}

    publish(event: EventBase) {
        const name = event.constructor.name;
        console.log(event.constructor.name)
        this.client.emit(name, event);
    }

    async request<T>(pattern: string, record: any = {}) {
        return await this.client.send<T>(pattern, record).toPromise().catch(e => console.log(e))

    }
}
/*        const result = this.client.send(pattern, record).subscribe((response: T) => {
            return response;
        })*/