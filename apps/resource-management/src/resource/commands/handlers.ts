import { CreateResourceHandler } from "./create-resource";
import { DeleteResourceHandler } from "./delete-resource";
import { UpdateResourceHandler } from "./update-resource";

export const commandHandlers = [CreateResourceHandler, UpdateResourceHandler, DeleteResourceHandler]