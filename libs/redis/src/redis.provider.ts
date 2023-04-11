import { Provider } from "@nestjs/common";
import { REDIS_TOKEN } from "./redis-constants";
import { Redis } from "ioredis";

export const RedisProvider: Provider = {
    provide: REDIS_TOKEN,
    useFactory: () => {
        return new Redis(
            process.env.REDIS_PORT as unknown as number,
            process.env.REDIS_HOST as string
        );
    },
};
