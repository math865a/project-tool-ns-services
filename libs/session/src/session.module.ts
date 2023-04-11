import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { CQRSModule } from "@ns/cqrs";
import { NatsModule } from "@ns/nats";
import { Neo4jModule } from "@ns/neo4j";
import { Duration as dur } from "luxon";
import {
    SignJwtHandler,
    VerifySessionHandler
} from "./commands";
import { JwtAuthGuard } from "./guards";
import { ValidateCredentialsHandler } from "./queries";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET as string,
            signOptions: { expiresIn: dur.fromObject({ days: 7 }).toMillis() },
        }),
        CQRSModule,
        Neo4jModule,
        NatsModule,
    ],
    providers: [
        JwtStrategy,
        LocalStrategy,
        ValidateCredentialsHandler,
        SignJwtHandler,
        VerifySessionHandler,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
    exports: [
        JwtModule,
        JwtStrategy,
        LocalStrategy,
        ValidateCredentialsHandler,
        SignJwtHandler,
        VerifySessionHandler,
    ],
})
export class SessionModule {}
