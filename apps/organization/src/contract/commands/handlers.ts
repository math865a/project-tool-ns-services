import { CreateContractHandler } from "./create-contract";
import { DeleteContractHandler } from "./delete-contract";
import { UpdateContractHandler } from "./update-contract";

export const commandHandlers = [CreateContractHandler, DeleteContractHandler, UpdateContractHandler]