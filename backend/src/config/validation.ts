import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().required(),

  MONGO_URI: Joi.string().required(),

  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),

  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
});