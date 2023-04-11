function getPattern(action: string) {
    return `${service}.${action}`;
}

const service = 'financialsources';

export const financialsourcePatterns = {
    getFinancialSourceOptions: getPattern('get:options'),
    getFinancialSourceProfile: getPattern('get:profile'),
    getFinancialSourcesView: getPattern('get:view'),
    createFinancialSource: getPattern('create'),
    updateFinancialSource: getPattern('update'),
    deleteFinancialSource: getPattern('delete'),
};
