export class UpdateBookingStageDto {
    constructor(
        public readonly workpackageId: string,
        public readonly bookingStage: string
    ) { }
}