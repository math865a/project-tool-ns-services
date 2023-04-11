import { IsProjectManagerHandler } from "./is-project-manager";
import { ProjectManagerHandler } from "./project-manager";
import { ProjectManagerOptionsQueryHandler } from "./project-manager-options";
import { ProjectManagersHandler } from "./project-managers";

export const queryHandlers = [ProjectManagerOptionsQueryHandler, ProjectManagersHandler, ProjectManagerHandler, IsProjectManagerHandler];