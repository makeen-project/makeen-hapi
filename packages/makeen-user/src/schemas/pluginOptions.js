import Joi from 'joi';
import userSchema from './user';
import accountSchema from './account';

export default {
  jwt: Joi.object().keys({
    key: Joi.string().min(10).required(),
    options: {
      expiresIn: Joi.alternatives()
        .try(Joi.string(), Joi.number())
        .default('1d'),
    },
  }),
  socialPlatforms: Joi.object()
    .keys({
      facebook: Joi.object().keys({
        clientId: Joi.string().required(),
        clientSecret: Joi.string().required(),
      }),

      google: Joi.object().keys({
        clientId: Joi.string().required(),
        clientSecret: Joi.string().required(),
      }),
    })
    .required(),
  userSchema: Joi.object().default(userSchema),
  accountSchema: Joi.object().default(accountSchema),
};
