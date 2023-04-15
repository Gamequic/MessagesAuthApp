const boom = require('@hapi/boom');
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');

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
    return newUser;
  }

  async find() {
    const rta = await models.User.findAll({
      attributes: { exclude: ['password'] }
    });
    return rta;
  }

  async findOne(id) {
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

    var mail = email || {
      from: '"Development email" <demiancalleros1@gmail.com>',
      to: "demiancalleros1@gmail.com",
      subject: "This is a development email",
      text: "",
      html: "", 
    }

    let transporter = nodemailer.createTransport({
      host: config.emailService,
      port: 465,
      secure: true,
      auth: {
        user: config.email,
        pass: config.emailpassword,
      },
    });

    return await transporter.sendMail(mail)
  }

  async askPasswordReset(email){
    //Probar que el usuario exista
    const user = await models.User.findOne({
      where: {
        email: email
      }
    });
    if (!user) {
      throw boom.notFound("User not found")
    }
    delete user.dataValues.password;

    //Generar token
    const token = jwt.sign({
      id: user.dataValues.id,
      email: user.dataValues.email,
      name: `${user.dataValues.name} ${user.dataValues.lastname}`,
      descripcion: user.dataValues.descripcion
    }, config.authSecret, { expiresIn: 900 });

    //Enviar email
    return await this.sendMail({
      from: '"Password reset" <demiancalleros1@gmail.com>',
      to: email,
      subject: "Password reset",
      text: `The token is: ${token}\n\nThis would be prettier in the future. The token is expiring in 15 minutes`,
     html: "", 
    });
  }

  async applyPasswordReset(token, password){
    return new Promise((resolve, reject) => {
      //Verificar token
      jwt.verify(token, config.authSecret, async (err, decoded) => {
        if (err) {
          reject(boom.unauthorized("The token is not valid"));
        } else {
          //Actualizar contraseña
          const user = await this.update(decoded.id, {password: bcrypt.hashSync(password, parseInt(config.saltRounds))});
          delete user.dataValues.password;
          resolve(user);
        }
      });
    });
  }

  async logIn(email, password){
    //Probar que el usuario exista
    const user = await models.User.findOne({
      where: {
        email: email
      }
    });
    if (!user) {
      throw boom.notFound("User not found")
    }
    
    //Comprobar contraseña
    const result = await bcrypt.compare(password, user.dataValues.password);
    if (!result){  //Contraseña incorrecta
      throw boom.unauthorized("Password is wrong")
    }

    //Generar token
    const token = await jwt.sign({
      id: user.dataValues.id,
      email: user.dataValues.email,
      name: `${user.dataValues.name} ${user.dataValues.lastname}`,
      descripcion: user.dataValues.descripcion
    }, config.authSecret, { expiresIn: 1800 }); //30 min

    return token
  }
}

module.exports = UserService;
