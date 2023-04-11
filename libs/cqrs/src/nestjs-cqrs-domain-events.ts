import { DomainEvents } from './domain-events';
import { DomainEvent } from './domain.event';
import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

@Injectable()
export class NestJSCqrsDomainEvents implements DomainEvents {
  constructor(private readonly eventBus: EventBus) {}

  publish(event: DomainEvent): void {
    this.eventBus.publish(event);
  }
}