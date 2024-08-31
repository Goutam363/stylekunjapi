import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
    PORT: Joi.number().default(5000),
    STAGE: Joi.string().required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().default(5432).required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_DATABASE: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    FB_API_KEY: Joi.string().required(),
    FB_AUTH_DOMAIN: Joi.string().required(),
    FB_PROJECT_ID: Joi.string().required(),
    FB_STORAGE_BUCKET: Joi.string().required(),
    FB_MESSAGING_SENDER_ID: Joi.string().required(),
    FB_APP_ID: Joi.string().required(),
    FB_MEASUREMENT_ID: Joi.string().required(),
    STYLEKUNJ_MAIL: Joi.string().required(),
    STYLEKUNJ_MAIL_PASSWORD: Joi.string().required(),
    ROOT_USER_MAIL: Joi.string().required(),
    F2S_API_KEY: Joi.string().required(),
});