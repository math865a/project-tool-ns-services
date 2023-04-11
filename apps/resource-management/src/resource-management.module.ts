import { Module } from "@nestjs/common";
import { ServiceModule } from "@ns/service-deps";
import { ResourceModule } from "./resource/resource.module";
import { ResourcePortfolioModule } from "./resource-portfolio/resource-portfolio.module";
import { ResourceTypeModule } from "./resourcetype/resourcetype.module";

@Module({
    imports: [
        ServiceModule,
        ResourceModule,
        ResourcePortfolioModule,
        ResourceTypeModule,
    ],
})
export class ResourceManagementModule {}
