import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { HttpUser } from "@ns/decorators";
import { CreateResourceTypeDto, UpdateResourceTypeDto } from "@ns/dto";
import {
    contractPatterns,
    resourceTypePatterns as patterns,
    resourcePatterns,
} from "@ns/endpoints";
import { NatsClient } from "@ns/nats";
@Controller("resourcetypes")
export class ResourceTypesController {
    constructor(private client: NatsClient) {}

    @Get()
    async getView() {
        return await this.client.request(patterns.getResourceTypesView);
    }

    @Get("options")
    async getOptions() {
        return await this.client.request(patterns.getResourceTypeOptions);
    }

    @Post()
    async create(@Body() dto: CreateResourceTypeDto, @HttpUser() uid: string) {
        return await this.client.request(patterns.createResourceType, {
            dto,
            uid,
        });
    }

    @Get("create-form")
    async getCreateForm() {
        return await Promise.all([
            this.client.request(contractPatterns.getContractOptions),
            this.client.request(resourcePatterns.getResourceOptions),
        ]).then((res) => ({
            options: {
                resourceOptions: res[1],
                contractOptions: res[0],
            },
            record: {
                name: "",
                abbrevation: "",
                salesDefault: 0,
                salesOvertime: 0,
                typeNo: "",
                contract:
                    (res[0] as any[]).find(
                        (d) => d.name === "Rådgiverkontrakt"
                    )?.id ?? "",
                resources: [],
            },
        }));
    }

    @Get(":resourcetypeId")
    async getProfile(@Param("resourcetypeId") resourcetypeId: string) {
        return await this.client.request(
            patterns.getResourceTypeProfile,
            resourcetypeId
        );
    }

    @Delete(":resourcetypeId")
    async delete(
        @Param("resourcetypeId") resourcetypeId: string,
        @HttpUser() uid: string
    ) {
        return await this.client.request(patterns.deleteResourceType, {
            resourcetypeId,
            uid,
        });
    }

    @Post(":resourcetypeId")
    async update(
        @Param("resourcetypeId") resourcetypeId: string,
        @Body() dto: Omit<UpdateResourceTypeDto, "resourcetypeId">,
        @HttpUser() uid: string
    ) {
        return await this.client.request(patterns.updateResourceType, {
            dto: {
                ...dto,
                resourcetypeId,
            },
            uid,
        });
    }
}
