import * as permissionRepository from '@modules/permission/repository';

import { PermissionActions } from '@utils/constants';
import Logger from '@common/libs/logger';

export const getList = async () => {
  Logger.log('getList');

  const fromDb = await permissionRepository.getList();
  const categories = Object.keys(PermissionActions);

  // sort like in constants, even is Db after seeds update
  return fromDb.sort((p1, p2) => {
    if (p1.category === p2.category) {
      const actions = Object.values(PermissionActions[p1.category]);
      return actions.findIndex((c) => c === p1.action) - actions.findIndex((c) => c === p2.action);
    }

    return categories.findIndex((c) => c === p1.category) - categories.findIndex((c) => c === p2.category);
  });
};
export const getPermnissionsByIds = async (permissionsIds) => {
  Logger.log(`getPermnissionsByIds, permissionsIds: ${JSON.stringify(permissionsIds)}`);
  permissionRepository.getPermnissionsByIds(permissionsIds);
};
