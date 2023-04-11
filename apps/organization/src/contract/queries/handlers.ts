import { ContractOptionsHandler, ContractOptionsQuery } from "./contract-options";
import { ContractProfileQueryHandler } from "./contract-profile";
import { ContractViewQueryHandler } from "./contracts-view";
import { ValidateContractHandler } from "./validate-contract";

export const queryHandlers = [ContractViewQueryHandler, ContractProfileQueryHandler, ContractOptionsHandler, ValidateContractHandler]