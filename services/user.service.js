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

  async uploadPhoto(photo, id){
    //Conseguir usuario
    const user = await this.findOne(id);
    delete user.dataValues.password;
    
    //Confirmar foto y formato
    if (!photo) {
      throw boom.badRequest('No files were uploaded.')
    }
    if (!(photo.name.substring(photo.name.length - 4) === '.png')) {
      throw boom.badRequest('Only png files.')
    }
    
    //Mover la foto a la carpeta publica
    const path = __dirname + "/../public/" + `profilePhoto${id}.png`;
    photo.mv(path, (err) => {
      if (err) {
        throw boom.internal(err)
      }
    });

    //Aplicar la foto al usuario
    return await this.update(id, {
      photo: `http://localhost:3000/public/profilePhoto${id}.png`
    })
  }

  async sendMail(email) {
    const mail = email || await transporter.sendMail({
      from: '"Development email" <demiancalleros1@gmail.com>',
      to: "demiancalleros1@gmail.com",
      subject: "This is a development email",
      text: "",
      html: "", 
    })

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "demiancalleros1@gmail.com",
        pass: "apohwrseoxukkxjx",   //Password delete don't try
      },
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
