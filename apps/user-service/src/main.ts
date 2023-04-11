import { NestFactory } from "@nestjs/core";
import { NatsOptions, Transport } from "@nestjs/microservices";
import { UserServiceModule } from "./user-service.module";

async function bootstrap() {
    const app = await NestFactory.createMicroservice<NatsOptions>(
        UserServiceModule,
        {
            transport: Transport.NATS,
            options: {
                servers: [process.env.NATS_CONN],
            },
        }
    );
    await app.listen();
}
bootstrap();
