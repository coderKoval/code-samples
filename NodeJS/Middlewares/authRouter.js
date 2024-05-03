import lodash from 'lodash';
import Router from 'koa-router';
import jwt from 'koa-jwt';

import * as userService from '@modules/user/service';

import { config } from '@common/libs/config.manager';

import { ModelsStatus, UserRoles, ErrorMessages, HttpHeaders } from '@utils/constants';
import { ForbiddenError, UnauthorizedError } from '@common/libs/errorClasses';

export const hasAccess = (action) => async (ctx, next) => {
  const { user } = ctx;

  const permission = lodash.find(lodash.get(user, 'roles.permissions'), { action });

  if (!lodash.isObject(permission)) {
    throw new ForbiddenError(ErrorMessages.MSG_NO_ACCESS);
  }

  return next();
};

const initJWTAuthorization = () =>
  jwt({
    secret: config.get('JWT_SECRET'),
    key: 'token',
    getToken: (ctx) =>
      ctx.query[HttpHeaders.HTTP_HEADER_AUTHORIZATION] &&
      ctx.query[ErrorMessages.HTTP_HEADER_AUTHORIZATION].replace('Bearer ', ''),
  });

const handleJWTErrors = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status === 401) {
      throw new UnauthorizedError(ErrorMessages.MSG_NOT_AUTHORIZED);
    }
    throw err;
  }
};
/**
 * Should follow after jwt middleware
 */
const isAllowed = async (ctx, next) => {
  const { user } = ctx;

  if (!user) {
    throw new UnauthorizedError(ErrorMessages.MSG_NOT_AUTHORIZED);
  }

  if (user.status === ModelsStatus.INACTIVE) {
    throw new ForbiddenError({
      message: ErrorMessages.MSG_USER_STATUS_IS_INACTIVE,
    });
  }

  if (user.isBanned) {
    throw new ForbiddenError({
      message: ErrorMessages.MSG_USER_IS_BANNED,
    });
  }

  return next();
};

/**
 * Should follow after jwt middleware
 */
const isClient = (ctx, next) => {
  const { user } = ctx;

  if (![UserRoles.CLIENT].includes(user.role)) {
    throw new ForbiddenError(ErrorMessages.MSG_NO_ACCESS);
  }

  return next();
};

/**
 * Should follow after jwt middleware
 */
const isPartner = (ctx, next) => {
  const { user } = ctx;

  if (![UserRoles.PARTNER].includes(user.role)) {
    throw new ForbiddenError(ErrorMessages.MSG_NO_ACCESS);
  }

  if (!user.isApproved) {
    throw new ForbiddenError(ErrorMessages.UNAPPROVED_ACCOUNT);
  }

  return next();
};

/**
 * Should follow after jwt middleware
 */
const isAdmin = (ctx, next) => {
  const { user } = ctx;

  if (![UserRoles.ADMIN].includes(user.role)) {
    throw new ForbiddenError(ErrorMessages.MSG_NO_ACCESS);
  }

  return next();
};

const setAdminProfile = async (ctx, next) => {
  const { id: userId } = ctx.state.token;

  const user = await userService.getAdminWithRoleAndPermissions(userId);

  if (!user) {
    throw new UnauthorizedError({
      message: ErrorMessages.MSG_NOT_AUTHORIZED,
    });
  }

  ctx.user = user;

  return next();
};

export class AuthRouter extends Router {
  createClientPolicy() {
    return this.use(handleJWTErrors)
      .use(initJWTAuthorization())
      .use(setUserProfile)
      .use(isAllowed)
      .use(isClient);
  }

  createPartnerPolicy() {
    return this.use(handleJWTErrors)
      .use(initJWTAuthorization())
      .use(setUserProfile)
      .use(isAllowed)
      .use(isPartner);
  }

  createAdminPolicy() {
    return this.use(handleJWTErrors)
      .use(initJWTAuthorization())
      .use(setAdminProfile)
      .use(isAllowed)
      .use(isAdmin);
  }

  createPolicy() {
    return this.use(handleJWTErrors)
      .use(initJWTAuthorization())
      .use(setUserProfile)
      .use(isAllowed);
  }
}
