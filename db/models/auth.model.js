const { Model, DataTypes, Sequelize } = require('sequelize');

const config = require('./../../config/config')

const USER_TABLE = 'users';

const UserSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  crypt: {
    allowNull: false,
    type: DataTypes.STRING,
    default: undefined
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: undefined,
  },
  hexaColor: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: undefined,
  },
  lastname: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: undefined,
  },
  username: {
    unique: true,
    allowNull: true,
    type: DataTypes.STRING,
    defaultValue: undefined,
  },
  descripcion: {
    allowNull: true,
    type: DataTypes.STRING,
    defaultValue: undefined,
  },
  photo: {
    allowNull: true,
    type: DataTypes.STRING,
    defaultValue: `http://${config.config.ipAddress}/public/user-default.svg`
  },
  role: {
    allowNull: true,
    type: DataTypes.STRING,
    defaultValue: 'user'
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: Sequelize.NOW
  }
}

class User extends Model {
  static associate(models) {
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: 'User',
      timestamps: false
    }
  }
}


module.exports = { USER_TABLE, UserSchema, User }
