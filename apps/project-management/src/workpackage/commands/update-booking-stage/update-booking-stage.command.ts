import { UpdateBookingStageDto } from "@ns/dto";


export class UpdateBookingStageCommand{
   constructor(public readonly dto: UpdateBookingStageDto, public readonly uid: string){}
};

