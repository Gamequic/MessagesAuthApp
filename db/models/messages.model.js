const { Model, DataTypes, Sequelize } = require('sequelize');

const MESSAGES_TABLE = 'messages';

const MessagesSchema = {
  id: {
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  senderId: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  conversationId: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  content: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: undefined,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: Sequelize.NOW
  }
}

class Message extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: MESSAGES_TABLE,
      modelName: 'Messages',
      timestamps: false
    }
  }
}


module.exports = { MESSAGES_TABLE, MessagesSchema, Message }
