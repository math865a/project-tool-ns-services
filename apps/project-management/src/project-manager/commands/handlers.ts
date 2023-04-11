import { AssignProjectManagerHandler } from "./assign-project-manager";
import { CreateProjectManagerHandler } from "./create-project-manager";
import { RemoveProjectManagerHandler } from "./remove-project-manager";
import { UpdateProjectManagerHandler } from "./update-project-manager";

export const commandHandlers = [
    AssignProjectManagerHandler,
    CreateProjectManagerHandler,
    RemoveProjectManagerHandler,
    UpdateProjectManagerHandler
];
