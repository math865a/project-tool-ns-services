import { CreateWorkpackageHandler } from "./create-workpackage";
import { DeleteWorkpackageHandler } from "./delete-workpackage";
import { UpdateBookingStageHandler } from "./update-booking-stage";
import { UpdateStageHandler } from "./update-stage";
import { UpdateWorkpackageHandler } from "./update-workpackage";

export const commandHandlers = [
    CreateWorkpackageHandler,
    UpdateWorkpackageHandler,
    DeleteWorkpackageHandler,
    UpdateBookingStageHandler,
    UpdateStageHandler
];
