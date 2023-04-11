import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { ResourceManagementModule } from "./resource-management.module";

async function bootstrap() {
    const app = await NestFactory.createMicroservice(ResourceManagementModule, {
        transport: Transport.NATS,
        options: {
            servers: [process.env.NATS_CONN],
        },
    });
    await app.listen();
}
bootstrap();
