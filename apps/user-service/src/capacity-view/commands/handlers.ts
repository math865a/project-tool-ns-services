import { CreateCapacityViewHandler } from "./create-capacity-view";
import { DeleteCapacityViewHandler } from "./delete-capacity-view";
import { UpdateCapacityViewHandler } from "./update-capacity-view";
import { UpdateCapacityViewNameHandler } from "./update-capacity-view-name";
import { UpdateDefaultCapacityViewHandler } from "./update-default-capacity-view";

export const commandHandlers = [
    CreateCapacityViewHandler,
    DeleteCapacityViewHandler,
    UpdateCapacityViewHandler,
    UpdateCapacityViewNameHandler,
    UpdateDefaultCapacityViewHandler,
];
