const { UserSchema, User } = require('./auth.model')
const { MessagesSchema, Message } = require('./messages.model')
const { ConversationsSchema, Conversations } = require('./conversations.model')

function setupModels(sequelize) {
  User.init(UserSchema, User.config(sequelize))
  Message.init(MessagesSchema, Message.config(sequelize))
  Conversations.init(ConversationsSchema, Conversations.config(sequelize))

  Conversations.associate(sequelize.models);
  // Customer.associate(sequelize.models);
  // Category.associate(sequelize.models);
  // Product.associate(sequelize.models);
  // Order.associate(sequelize.models);
}

module.exports = setupModels;
