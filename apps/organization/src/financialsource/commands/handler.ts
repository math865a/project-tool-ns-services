import { CreateFinancialSourceHandler } from "./create-financialsource";
import { DeleteFinancialSourceHandler } from "./delete-financialsource";
import { UpdateFinancialSourceHandler } from "./update-financialsource";

export const commandHandlers = [CreateFinancialSourceHandler, UpdateFinancialSourceHandler, DeleteFinancialSourceHandler]