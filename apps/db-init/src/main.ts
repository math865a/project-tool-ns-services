import { NestFactory } from "@nestjs/core";
import { DBInitModule } from "./dbinit.module";
import { DBInitService } from "./service";
import { setTimeout } from "timers";

async function bootstrap() {
    const app = await NestFactory.create(DBInitModule);

    await app.listen(6000)
}
bootstrap();
