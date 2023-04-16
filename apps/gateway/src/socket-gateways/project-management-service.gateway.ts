import { UseGuards } from "@nestjs/common";
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import {
    CreateActivityDto,
    CreateAllocationDto,
    CreateAssignmentDto,
    DeleteAssignmentDto,
    UpdateActivityColorDto,
    UpdateActivityNameDto,
    UpdateAllocationDto,
    UpdatePeriodDto,
    UpdateWorkpackageDto,
    AddTeamMemberDto,
    RemoveTeamMemberDto,
    AssignProjectManagerDto,
    SwapTeamMemberDto,
    UpdateBookingStageDto,
    UpdateStageDto,
} from "@ns/dto";
import { NatsClient } from "@ns/nats";
import { WsGuard } from "@ns/session";
import { UserId } from "@ns/decorators";
import {
    planningPatterns,
    projectManagerPatterns,
    resourcePortfolioPatterns,
    teamPatterns,
    workpackagePatterns,
} from "@ns/endpoints";

@WebSocketGateway({
    namespace: "project-management",
    cors: {
        origin: "*",
    }
})
export class ProjectManagementGateway {
    constructor(private client: NatsClient) {}

    @WebSocketServer()
    server: Server;

    @UseGuards(WsGuard)
    @SubscribeMessage("join")
    join(
        @MessageBody() workpackageId: string,
        @ConnectedSocket() client: Socket
    ) {
        console.log(client.handshake.headers);
        client.join(workpackageId);
    }

    @UseGuards(WsGuard)
    @SubscribeMessage("update:booking-stage")
    async updateBookingStage(
        @MessageBody() dto: UpdateBookingStageDto,
        @UserId() uid: string
    ) {
        return await this.client.request(
            workpackagePatterns.updateBookingStage,
            {
                dto,
                uid,
            }
        );
    }

    @UseGuards(WsGuard)
    @SubscribeMessage("update:stage")
    async updateStage(
        @MessageBody() dto: UpdateStageDto,
        @UserId() uid: string
    ) {
        return await this.client.request(workpackagePatterns.updateStage, {
            dto,
            uid,
        });
    }

    @UseGuards(WsGuard)
    @SubscribeMessage("update:workpackage")
    async updateWorkpacakge(
        @MessageBody() dto: UpdateWorkpackageDto,
        @UserId() uid: string
    ) {
        return await this.client.request(
            workpackagePatterns.updateWorkpackage,
            { dto, uid }
        );
    }

    @UseGuards(WsGuard)
    @SubscribeMessage("update:project-manager")
    async updateProjectManager(
        @MessageBody() dto: AssignProjectManagerDto,
        @UserId() uid: string
    ) {
        return await this.client.request(
            projectManagerPatterns.assignProjectManager,
            { dto, uid }
        );
    }

    @UseGuards(WsGuard)
    @SubscribeMessage("get:project-manager-options")
    async getProjectManagerOptions() {
        return await this.client.request(
            projectManagerPatterns.getProjectManagerOptions
        );
    }

    @UseGuards(WsGuard)
    @SubscribeMessage("get:team-options")
    async getTeamOptions(@MessageBody() workpackageId: string) {
        console.log(workpackageId)
        return await this.client.request(
            resourcePortfolioPatterns.getTeamOptions,
            workpackageId
        );
    }

    @UseGuards(WsGuard)
    @SubscribeMessage("add:teammember")
    async addTeamMember(
        @MessageBody() dto: AddTeamMemberDto,
        @UserId() uid: string
    ) {
        return await this.client.request(teamPatterns.addTeamMember, {
            dto,
            uid,
        });
    }

    @UseGuards(WsGuard)
    @SubscribeMessage("remove:teammember")
    async removeTeamMember(
        @MessageBody() dto: RemoveTeamMemberDto,
        @UserId() uid: string
    ) {
        return await this.client.request(teamPatterns.removeTeamMember, {
            dto,
            uid,
        });
    }

    @UseGuards(WsGuard)
    @SubscribeMessage("swap:teammember")
    async swapTeamMember(
        @MessageBody()
        dto: SwapTeamMemberDto,
        @UserId() uid: string
    ) {
        return await this.client.request(teamPatterns.swapTeamMember, {
            dto,
            uid,
        });
    }

    @UseGuards(WsGuard)
    @SubscribeMessage("create:activity")
    async createActivity(
        @MessageBody() dto: CreateActivityDto,
        @UserId() uid: string
    ) {
        console.log(dto, uid);
        return await this.client.request(planningPatterns.createActivity, {
            dto,
            uid,
        });
    }

    @UseGuards(WsGuard)
    @SubscribeMessage("delete:activity")
    async deleteActivity(
        @MessageBody() activityId: string,
        @UserId() uid: string
    ) {
        return await this.client.request(planningPatterns.deleteActivity, {
            activityId,
            uid,
        });
    }

    @UseGuards(WsGuard)
    @SubscribeMessage("create:assignment")
    async createAssignment(
        @MessageBody() dto: CreateAssignmentDto,
        @UserId() uid: string
    ) {
        return await this.client.request(planningPatterns.createAssignment, {
            dto,
            uid,
        });
    }

    @UseGuards(WsGuard)
    @SubscribeMessage("delete:assignment")
    async deleteAssignment(
        @MessageBody() dto: DeleteAssignmentDto,
        @UserId() uid: string
    ) {
        return await this.client.request(planningPatterns.deleteAssignment, {
            dto,
            uid,
        });
    }

    @UseGuards(WsGuard)
    @SubscribeMessage("create:allocation")
    async createAllocation(
        @MessageBody() dto: CreateAllocationDto,
        @UserId() uid: string
    ) {
        return await this.client.request(planningPatterns.createAllocation, {
            dto,
            uid,
        });
    }

    @UseGuards(WsGuard)
    @SubscribeMessage("update:allocation")
    async updateAllocation(
        @MessageBody() dto: UpdateAllocationDto,
        @UserId() uid: string
    ) {
        return await this.client.request(planningPatterns.updateAllocation, {
            dto,
            uid,
        });
    }

    @UseGuards(WsGuard)
    @SubscribeMessage("update:period")
    async updatePeriod(
        @MessageBody() dto: UpdatePeriodDto,
        @UserId() uid: string
    ) {
        return await this.client.request(planningPatterns.updatePeriod, {
            dto,
            uid,
        });
    }

    @UseGuards(WsGuard)
    @SubscribeMessage("update:activity-name")
    async updateActivityName(
        @MessageBody() dto: UpdateActivityNameDto,
        @UserId() uid: string
    ) {
        return await this.client.request(planningPatterns.updateActivityName, {
            dto,
            uid,
        });
    }

    @UseGuards(WsGuard)
    @SubscribeMessage("update:activity-color")
    async updateActivityColor(
        @MessageBody() dto: UpdateActivityColorDto,
        @UserId() uid: string
    ) {
        return await this.client.request(planningPatterns.updateActivityColor, {
            dto,
            uid,
        });
    }
}
