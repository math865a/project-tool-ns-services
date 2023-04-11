function getPattern(action: string) {
    return `${service}.${action}`;
}

const service = 'mailer';

export const mailerPatterns = {
    mailPasswordReset: getPattern('mail:password-reset'),
    mailWelcome: getPattern('mail:welcome'),
    mailCredentials: getPattern('mail:credentials'),
};
