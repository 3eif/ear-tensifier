const Sentry = require('@sentry/node');

module.exports = () => {
    Sentry.init({
        dsn: process.env.SENTRY_URL,
        environment: process.env.SENTRY_ENVIRONMENT,
    });
};