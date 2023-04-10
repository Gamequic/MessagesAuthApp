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

  async sendMail() {
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "demiancalleros1@gmail.com",
        pass: "apohwrseoxukkxjx",
      },
    });

    let info = await transporter.sendMail({
      from: '"Fred Foo 👻" <demiancalleros1@gmail.com>',
      to: "demiancalleros1@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });
  }

  async passwordReset(email){
    const usuarioEncontrado = await models.User.findOne({
      where: {
        email: email
      }
    });
    
  }
}

module.exports = UserService;
