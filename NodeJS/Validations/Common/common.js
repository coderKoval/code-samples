import Joi from '@hapi/joi';
import { OrderFilter } from '@utils/constants';

export default {
  limit: Joi.number()
    .integer()
    .min(1)
    .max(200)
    .default(10),
  offset: Joi.number()
    .integer()
    .min(0)
    .default(0),
  order: Joi.string()
    .valid(OrderFilter.SORT_ORDER_ASC, OrderFilter.SORT_ORDER_DESC)
    .default(OrderFilter.SORT_ORDER_ASC),
  search: Joi.string()
    .lowercase()
    .optional()
    .allow(null)
    .allow('')
    .default(null),

  // TODO: only one id
  id: Joi.number().required(),
  clientId: Joi.number(),
  userId: Joi.number(),
  idArray: Joi.array()
    .items(Joi.number())
    .optional()
    .allow(null),

  number: Joi.number()
    .optional()
    .allow(null),
  numberWithDefaultValue: (defaultValue) =>
    Joi.number()
      .optional()
      .allow(null)
      .default(defaultValue),
  boolean: Joi.boolean()
    .optional()
    .allow(null),
  stringLine: Joi.string()
    .max(255)
    .optional()
    .allow('', null),
  stringWithLength: (length) =>
    Joi.string()
      .max(length)
      .optional()
      .allow('', null),
  stringArray: Joi.array()
    .items(Joi.string())
    .optional()
    .allow(null),
  dropdown: (values, defaultValue = null) =>
    Joi.string()
      .valid(...Object.values(values))
      .optional()
      .allow(null)
      .default(defaultValue),
  dropdownWithMultichecking: (values) =>
    Joi.alternatives().try(
      Joi.array()
        .items(Joi.string().valid(...Object.values(values)))
        .optional()
        .allow(null)
        .default(null),
      Joi.string().valid(...Object.values(values)),
    ),
  date: Joi.date()
    .timestamp('javascript')
    .optional()
    .iso()
    .allow(null),
  object: Joi.object()
    .optional()
    .allow(null),
  email: Joi.string()
    .email()
    .optional()
    .allow(null),
  entity: (validEntities) =>
    Joi.string()
      .required()
      .valid(...validEntities),
};
