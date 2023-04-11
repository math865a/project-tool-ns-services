import { Module } from "@nestjs/common";
import { ContractModule } from "./contract/contract.module";
import { FinancialsourceModule } from "./financialsource/financialsource.module";
import { ServiceModule } from "@ns/service-deps";

@Module({
    imports: [
        ServiceModule,
        ContractModule,
        FinancialsourceModule,
    ],
})
export class OrganizationModule {}
