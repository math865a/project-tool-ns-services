import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { NatsClient } from "@ns/nats";
import {
    planningPatterns,
    workpackagePatterns,
    contractPatterns,
    financialsourcePatterns,
    projectManagerPatterns,
} from "@ns/endpoints";
import { CreateWorkpackageDto, UpdateWorkpackageDto } from "@ns/dto";
import { HttpUser } from "@ns/decorators";

@Controller("workpackages")
export class WorkpackagesController {
    constructor(private client: NatsClient) {}

    @Get()
    async getView() {
        return await this.client.request(
            workpackagePatterns.getWorkpackagesView
        );
    }

    @Get("allocation/:allocationId")
    async getAllocationView(@Param("allocationId") allocationId: string) {
        return await this.client.request(
            planningPatterns.getAllocation,
            allocationId
        );
    }

    @Get("create-form")
    async getCreateForm() {
        return await Promise.all([
            this.client.request(workpackagePatterns.getWorkpackageCreateForm),
            this.client.request(contractPatterns.getContractOptions),
            this.client.request(
                financialsourcePatterns.getFinancialSourceOptions
            ),
            this.client.request(
                projectManagerPatterns.getProjectManagerOptions
            ),
            this.client.request(workpackagePatterns.getWorkpackageStages),
        ]).then((res) => ({
            record: res[0],
            options: {
                contractOptions: res[1],
                financialSourceOptions: res[2],
                projectManagerOptions: res[3],
                stageOptions: res[4],
            },
        }));
    }

    @Get(":workpackageId")
    async getProfile(@Param("workpackageId") workpackageId: string) {
        return await Promise.all([
            this.client.request(
                workpackagePatterns.getWorkpackageProfile,
                workpackageId
            ),
            this.client.request(planningPatterns.getPlan, workpackageId),
        ]).then((res: [Object, Object]) => ({
            ...res[0],
            planning: res[1],
        }));
    }

    @Post()
    async createWorkpackage(
        @Body() dto: CreateWorkpackageDto,
        @HttpUser() uid: string
    ) {
        return await this.client.request(
            workpackagePatterns.createWorkpackage,
            {
                dto,
                uid,
            }
        );
    }

    @Post(":workpackageId")
    async updateWorkpackage(
        @Param("workpackageId") workpackageId: string,
        @Body() dto: Omit<UpdateWorkpackageDto, "workpackageId">,
        @HttpUser() uid: string
    ) {
        return await this.client.request(
            workpackagePatterns.updateWorkpackage,
            {
                dto: {
                    ...dto,
                    workpackageId,
                },
                uid,
            }
        );
    }

    @Delete(":workpackageId")
    async deleteWorkpackage(
        @Param("workpackageId") workpackageId: string,
        @HttpUser() uid: string
    ) {
        return await this.client.request(
            workpackagePatterns.deleteWorkpackage,
            {
                workpackageId,
                uid,
            }
        );
    }
}
