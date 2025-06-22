import { NestFactory } from "@nestjs/core";
import { GatewayModule } from "./gateway.module";
import { Transport } from "@nestjs/microservices";
import * as compression from "compression";

async function bootstrap() {
    const app = await NestFactory.create(GatewayModule);
    const natsMicroservice = app.connectMicroservice({
        transport: Transport.NATS,
        options: {
            servers: [process.env.NATS_CONN],
        },
    });

    app.enableCors({ origin: "*:*" });
    app.use(compression());
    await app.startAllMicroservices();
    await app.listen(process.env.PORT || 5001);
    console.log("listening on port " + process.env.PORT || 5001);
}
bootstrap();
