import { CreateUserHandler } from "./create-user";
import { DeleteUserHandler } from "./delete-user";
import { LinkUserHandler } from "./link-user";
import { SplitUserHandler } from "./split-user";
import { ToggleActiveStatusHandler } from "./toggle-active-status";
import { UpdateUserAccessGroupsHandler } from "./update-user-access-groups";
import { UpdateUserDetailsHandler } from "./update-user-details";

export const commandHandlers = [
    UpdateUserDetailsHandler,
    CreateUserHandler,
    UpdateUserAccessGroupsHandler,
    ToggleActiveStatusHandler,
    DeleteUserHandler,
    LinkUserHandler,
    SplitUserHandler,
];
