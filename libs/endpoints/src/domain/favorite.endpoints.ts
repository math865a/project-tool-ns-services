function getPattern(action: string) {
    return `${service}.${action}`;
}

const service = 'favorite';

export const favoritePatterns = {
    addFavorite: getPattern('add'),
    removeFavorite: getPattern('remove'),
    getFavorites: getPattern('get'),
};
