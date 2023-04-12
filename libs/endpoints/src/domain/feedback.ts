function getPattern(action: string) {
    return `${service}.${action}`;
}

const service = "feedbackk";

export const feedbackPatterns = {
    submitFeedback: getPattern("submit"),
};
