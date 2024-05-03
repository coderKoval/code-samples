import { sendResponse as send } from '@utils/helpers';
import { HttpStatuses } from '@utils/constants';
import * as permissionService from '@modules/permission/service';
import Logger from '@common/libs/logger';

export const getAllPermissionList = async (ctx) => {
  Logger.log(`getAllPermissionList, query: ${JSON.stringify(ctx.request.query)}`);

  const permissions = await permissionService.getList();

  return send({
    ctx,
    status: HttpStatuses.HTTP_STATUS_SUCCESS,
    content: permissions,
  });
};
