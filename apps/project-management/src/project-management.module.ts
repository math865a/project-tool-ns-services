import { Module } from "@nestjs/common";
import { ServiceModule } from "@ns/service-deps";
import { TeamModule } from "./team/team.module";
import { WorkpackageModule } from "./workpackage/workpackage.module";
import { ProjectManagerModule } from "./project-manager/project-manager.module";
import { PlanningModule } from "./planning/planning.module";

@Module({
    imports: [
        ServiceModule,
        TeamModule,
        WorkpackageModule,
        ProjectManagerModule,
        PlanningModule,
    ],
})
export class ProjectManagementModule {}
