import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { MonitoringModule } from "./monitoring.module";

async function bootstrap() {
    const app = await NestFactory.createMicroservice(MonitoringModule, {
        transport: Transport.NATS,
        options: {
            servers: [process.env.NATS_CONN],
        },
    });
    await app.listen();
}
bootstrap();
