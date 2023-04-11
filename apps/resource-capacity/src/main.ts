import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { ResourceCapacityModule } from "./resource-capacity.module";

async function bootstrap() {
    const app = await NestFactory.createMicroservice(ResourceCapacityModule, {
        transport: Transport.NATS,
        options: {
            servers: [process.env.NATS_CONN],
        },
    });
    await app.listen();
}
bootstrap();
