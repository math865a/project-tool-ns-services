import { CreateAccessGroupHandler } from "./create-access-group";
import { DeleteAccessGroupHandler } from "./delete-access-group";
import { UpdateAccessGroupHandler } from "./update-access-group/update-access-group.handler";


export const commandHandlers = [CreateAccessGroupHandler, DeleteAccessGroupHandler, UpdateAccessGroupHandler]