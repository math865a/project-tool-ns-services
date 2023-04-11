import { SecurityModule } from "./security.module";
import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";

async function bootstrap() {
    const app = await NestFactory.createMicroservice(SecurityModule, {
        transport: Transport.NATS,
        options: {
            servers: [process.env.NATS_CONN],
        },
    });
    await app.listen();
}
bootstrap();
