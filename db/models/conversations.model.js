const { Model, DataTypes, Sequelize } = require('sequelize');

const CONVERSATIONS_TABLE = 'conversations';

const ConversationsSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  receiverId: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  senderId: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER
  }
}

class Conversation extends Model {
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'receiverId',
      sourceKey: 'id',
      as: "receiverUser"
    });

    this.belongsTo(models.User, {
      foreignKey: 'senderId',
      sourceKey: 'id',
      as: "senderUser"
    });
    
    // this.hasMany(models.Messages, {
    //   foreignKey: 'id',
    //   sourceKey: 'conversationId',
    //   as: 'conversation'
    // })
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CONVERSATIONS_TABLE,
      modelName: 'Conversations',
      timestamps: false
    }
  }
}


module.exports = { CONVERSATIONS_TABLE, ConversationsSchema, Conversation }
