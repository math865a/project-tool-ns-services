import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { OrganizationModule } from "./organization.module";

async function bootstrap() {
    const app = await NestFactory.createMicroservice(OrganizationModule, {
        transport: Transport.NATS,
        options: {
            servers: [process.env.NATS_CONN],
        },
    });
    await app.listen();
}
bootstrap();
