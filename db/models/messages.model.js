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
    type: DataTypes.INTEGER
  },
  receiverId: {
    allowNull: false,
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
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'senderId',
      targetKey: 'id',
      as: "senderUser"
    })

    this.belongsTo(models.User, {
      foreignKey: 'receiverId',
      targetKey: 'id',
      as: "receiverUser"
    })
  }

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
