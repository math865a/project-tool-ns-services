import { CreateResourceTypeHandler } from "./create-resourcetype";
import { DeleteResourceTypeHandler } from "./delete-resourcetype";
import { UpdateResourceTypeHandler } from "./update-resourcetype";

export const commandHandlers = [CreateResourceTypeHandler, UpdateResourceTypeHandler, DeleteResourceTypeHandler]