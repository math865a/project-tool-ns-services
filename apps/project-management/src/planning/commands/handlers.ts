import { CreateActivityHandler } from "./create-activity";
import { CreateAllocationHandler } from "./create-allocation";
import { CreateAssignmentHandler } from "./create-assignment";
import { DeleteActivityHandler } from "./delete-activity";
import { DeleteAssignmentHandler } from "./delete-assignment";
import { UpdateActivityNameHandler } from "./update-activity-name";
import { UpdateAllocationHandler } from "./update-allocation";
import { UpdatePeriodHandler } from "./update-period";

export const commandHandlers = [
    CreateActivityHandler,
    CreateAllocationHandler,
    CreateAssignmentHandler,
    DeleteActivityHandler,
    DeleteAssignmentHandler,
    UpdateAllocationHandler,
    UpdatePeriodHandler,
    UpdateActivityNameHandler,
    UpdateActivityNameHandler
];
