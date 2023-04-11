import { Module } from "@nestjs/common";
import { commandHandlers } from "./commands";
import { queryHandlers } from "./queries";
import { ResourcePortfolioNastController } from "./resource-portfolio.controller";

@Module({
    providers: [...commandHandlers, ...queryHandlers],
    controllers: [ResourcePortfolioNastController],
})
export class ResourcePortfolioModule {}
