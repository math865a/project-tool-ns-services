import { UserQueryHandler } from "./user";
import { UserOptionsQueryHandler } from "./user-options";
import { UserConnectOptionsHandler } from "./user-connect-options";
import { UsersViewQueryHandler } from "./users-view";

export const queryHandlers = [UserQueryHandler, UsersViewQueryHandler, UserOptionsQueryHandler, UserConnectOptionsHandler]