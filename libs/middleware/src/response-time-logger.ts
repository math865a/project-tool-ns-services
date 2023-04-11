import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class ResponseTimeLogger implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const startHrTime = process.hrtime();

        res.on("finish", () => {
            const elapsedHrTime = process.hrtime(startHrTime);
            const elapsedTimeInMs =
                elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
            console.log("%s : %fms", req.path, elapsedTimeInMs);
        });

        next();
    }
}
