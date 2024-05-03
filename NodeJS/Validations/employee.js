import Joi from '@hapi/joi';
import { checkBody, checkParams, checkQuery } from '@utils/helpers';
import * as schemas from './schemas';

export const register = checkBody(
  Joi.object().keys({
    jobTitle: schemas.common.stringLine.required(),
    email: schemas.common.email.required(),
    firstName: schemas.common.stringWithLength(255).required(),
    lastName: schemas.common.stringWithLength(255).required(),
    roleId: schemas.common.id,
  }),
);

export const activateAccount = checkBody(
  Joi.object().keys({
    token: schemas.common.stringLine.required(),
  }),
);

export const updateEmployee = checkBody(
  Joi.object().keys({
    roleId: schemas.common.number,
    jobTitle: schemas.common.stringLine,
    firstName: schemas.common.stringWithLength(255),
    lastName: schemas.common.stringWithLength(255),
  }),
);

export const editRole = checkBody(
  Joi.object().keys({
    roleId: schemas.common.id,
  }),
);

export const getOne = checkParams(
  Joi.object().keys({
    userId: schemas.common.id,
  }),
);

export const filters = checkQuery(
  Joi.object().keys({
    isApproved: schemas.common.stringLine.default(true),
    search: schemas.common.search,
    limit: schemas.common.limit.min(1),
    offset: schemas.common.offset.min(0),
    order: schemas.common.order,
    orderBy: schemas.custom.orderBy,
  }),
);
