import PermissionModel from '@modules/permission/model';

export const getList = async () => PermissionModel.query().select();

export const getPermnissionsByIds = async (permissionsIds) => PermissionModel.query().findByIds(permissionsIds);
