import Joi from '@hapi/joi';

import { checkBody, checkParams, checkQuery } from '@utils/helpers';
import { NotificationStatuses, NotificationTypes } from '@utils/constants';
import * as schemas from './schemas';

export const create = checkBody(
  Joi.object().keys({
    title: schemas.common.stringLine.required(),
    description: schemas.common.stringLine.required(),
    type: schemas.common.dropdown(NotificationTypes),
    usersIds: schemas.custom.usersIds,
  }),
);

export const update = checkBody(
  Joi.object().keys({
    id: schemas.common.id,
    title: schemas.common.stringLine,
    description: schemas.common.stringLine,
    type: schemas.common.dropdown(NotificationTypes),
    status: schemas.common.dropdown(NotificationStatuses),
  }),
);

export const markAsRead = checkBody(
  Joi.object().keys({
    ids: schemas.common.idArray,
  }),
);

export const getById = checkParams(
  Joi.object().keys({
    id: schemas.common.id,
  }),
);

export const getList = checkQuery(
  Joi.object().keys({
    offset: schemas.common.offset,
    limit: schemas.common.limit,
  }),
);
