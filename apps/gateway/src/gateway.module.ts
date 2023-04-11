import { Module } from "@nestjs/common";
import { NatsModule } from "@ns/nats";
import { SessionModule } from "@ns/session";
import {
    AccessGroupsController,
    AuthenticationController,
    ContractsController,
    FinancialSourcesController,
    ProjectManagerController,
    ResourcesController,
    ResourceTypesController,
    UsersController,
    WorkpackagesController,
    SchduleController,
    ResourcePortfolioController,
} from "./controllers";
import {
    CapacityBoardGateway,
    ProjectManagementGateway,
    ResourceCapacityGateway,
} from "./socket-gateways";
import { UserServiceController } from "./controllers/user-service.controller";
import { CQRSModule } from "@ns/cqrs";
import { CapacityBoardController } from "./controllers/capacity-board.controller";
import { UserServiceNats, UserServiceGateway } from "./user-service";

@Module({
    imports: [NatsModule, SessionModule, CQRSModule],
    controllers: [
        ContractsController,
        FinancialSourcesController,
        ResourcesController,
        ResourceTypesController,
        UsersController,
        WorkpackagesController,
        UserServiceController,
        AuthenticationController,
        CapacityBoardController,
        AccessGroupsController,
        ProjectManagerController,
        SchduleController,
        ResourcePortfolioController,
        UserServiceNats,
    ],
    providers: [
        CapacityBoardGateway,
        ProjectManagementGateway,
        ResourceCapacityGateway,
        UserServiceGateway,
    ],
})
export class GatewayModule {}
