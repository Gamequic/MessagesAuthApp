const { UserSchema, User } = require('./auth.model')
const { MessagesSchema, Message } = require('./messages.model')
const { ConversationsSchema, Conversation } = require('./conversations.model')

function setupModels(sequelize) {
  User.init(UserSchema, User.config(sequelize))
  Message.init(MessagesSchema, Message.config(sequelize))
  Conversation.init(ConversationsSchema, Conversation.config(sequelize))

  Conversation.associate(sequelize.models);
  // Customer.associate(sequelize.models);
  // Category.associate(sequelize.models);
  // Product.associate(sequelize.models);
  // Order.associate(sequelize.models);
}

module.exports = setupModels;
