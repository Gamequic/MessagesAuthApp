const { Model, DataTypes, Sequelize } = require('sequelize');

const MESSAGES_TABLE = 'messages';

const MessagesSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
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
    defaultValue: "http://localhost:3000/public/user-default.svg"
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