import { Model, snakeCaseMappers } from 'objection';
import { ModelNames, PermissionCategories } from '@utils/constants';

const path = require('path');

export default class PermissionsModel extends Model {
  static get tableName() {
    return ModelNames.MODEL_NAME__PERMISSIONS;
  }

  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  async $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  async $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static get relationMappings() {
    return {
      roles: {
        relation: Model.ManyToManyRelation,
        modelClass: path.resolve(__dirname, '../role/model.js'),
        join: {
          from: 'permissions.id',
          through: {
            from: 'roles_permissions.permission_id',
            to: 'roles_permissions.role_id',
          },
          to: 'roles.id',
        },
      },
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['category', 'title'],

      properties: {
        id: {
          type: 'integer',
        },
        category: {
          type: 'enum',
          enum: Object.values(PermissionCategories),
        },
        title: {
          type: 'string',
        },
        action: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
        createdAt: {
          type: 'timestamp',
          default: new Date().toISOString(),
        },
        updatedAt: {
          type: 'timestamp',
          default: new Date().toISOString(),
        },
      },
    };
  }
}
