const boom = require('@hapi/boom');
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");

const { models } = require('../libs/sequelize');
const { config } = require('../config/config')

class UserService {
  constructor() {}

  async create(data) {
    const newUser = await models.User.create({
      ...data,
      password: bcrypt.hashSync(data.password, parseInt(config.saltRounds))
    });
    delete newUser.dataValues.password
    console.log(newUser)
    return newUser;
  }

  async find() {
    const rta = await models.User.findAll();
    return rta;
  }

  async findOne(id) {
    console.log(id)
    const user = await models.User.findByPk(id);
    if (!user) {
      throw boom.notFound('user not found');
    }
    delete user.dataValues.password
    return user;
  }

  async update(id, changes) {
    const user = await this.findOne(id);
    const rta = await user.update(changes);
    return rta;
  }

  async delete(id) {
    const user = await this.findOne(id);
    await user.destroy();
    return { id };
  }

  async resetPassword() {

  }
}

module.exports = UserService;
