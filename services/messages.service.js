const boom = require('@hapi/boom');
const bcrypt = require('bcrypt')

const { models } = require('../libs/sequelize');
const { config } = require('../config/config')

class UserService {
    constructor() {}

    async create(data) {
        const newUser = await models.Messages.create({
            
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

}

module.exports = UserService;
