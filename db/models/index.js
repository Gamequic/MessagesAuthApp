const { UserSchema, User } = require('./auth.model')

function setupModels(sequelize) {
  User.init(UserSchema, User.config(sequelize))

  // User.associate(sequelize.models);
  // Customer.associate(sequelize.models);
  // Category.associate(sequelize.models);
  // Product.associate(sequelize.models);
  // Order.associate(sequelize.models);
}

module.exports = setupModels;
