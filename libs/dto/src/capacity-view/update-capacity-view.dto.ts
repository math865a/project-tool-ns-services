import {OmitType} from "@nestjs/mapped-types"
import { CreateCapacityViewDto } from "./create-capacity-view.dto";
export class UpdateCapacityViewDto extends OmitType(CreateCapacityViewDto, ["name"]){
    public readonly resourcesToDelete: string[];
    public readonly bookingStagesToDelete: string[];
}