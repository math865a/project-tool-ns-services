import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { ProjectManagementModule } from "./project-management.module";


async function bootstrap() {
    const app = await NestFactory.createMicroservice(ProjectManagementModule, {
        transport: Transport.NATS,
        options: {
            servers: [process.env.NATS_CONN],
        },
    });
    await app.listen();
}
bootstrap();
