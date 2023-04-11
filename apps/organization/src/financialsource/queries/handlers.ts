import { FinancialSourceOptionsQueryHandler } from "./financialsource-options";
import { FinancialSourceProfileQueryHandler } from "./financialsource-profile";
import { FinancialSourceViewQueryHandler } from "./financialsources-view";
import { ValidateFinancialSourceNameQueryHandler } from "./validate-financialsource-name";

export const queryHandlers = [
    ValidateFinancialSourceNameQueryHandler,
    FinancialSourceViewQueryHandler,
    FinancialSourceOptionsQueryHandler,
    FinancialSourceProfileQueryHandler,
];
