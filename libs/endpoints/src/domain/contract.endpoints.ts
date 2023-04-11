function getPattern(action: string) {
    return `${service}.${action}`;
}
const service = 'contract';
export const contractPatterns = {
    getContractOptions: getPattern('get:options'),
    getContractProfile: getPattern('get:profile'),
    getContractsView: getPattern('get:view'),
    createContract: getPattern('create'),
    updateContract: getPattern('update'),
    deleteContract: getPattern('delete'),
};
