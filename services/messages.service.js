const { Op } = require('sequelize');
const boom = require('@hapi/boom');
const CryptoJS = require('crypto-js')

const UserService = require('../services/user.service')
const { models } = require('../libs/sequelize');
const { config } = require('../config/config')

const userService = new UserService();

//const contentDecryt = CryptoJS.AES.decrypt(contentEncrypt, secretKey).toString(CryptoJS.enc.Utf8)

class MessageService {
    constructor() {}

    async create(senderId, data) {
        const senderUser = await userService.findOne(senderId)
        const receiverUser = await userService.findOne(data.receiverId)

        const secretKey = `${senderUser.crypt}${config.messageSecret}${receiverUser.crypt}`
        delete data.content
        const contentEncrypt = await CryptoJS.AES.encrypt(data.content, secretKey).toString()

        const newMessage = await models.Messages.create({
            ...data,
            senderId,
            content: contentEncrypt
        });
        return newMessage;
    }

    async findMessages(senderId, receiverId) {  
        const messages = await models.Messages.findAll({
            where: {
            [Op.or]: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId },
            ],
            },
        });       
        return messages;
    }

    async findOne(msgId, userId) {
        const message = await models.Messages.findByPk(msgId);
        if (!message) {
            throw boom.notFound('Message not found');
        }
        console.log((message.senderId === userId || message.receiverId === userId))
        if (!(message.senderId === userId || message.receiverId === userId)){
            throw boom.unauthorized("Unauthorized")
        }
        return message;
    }

    async update(id, changes) {
        const message = await this.findOne(msgId, userId);
        const rta = await message.update(changes);
        return rta;
    }

    async delete(msgId, userId) {
        const message = await this.findOne(msgId, userId);
        await message.destroy();
        return { msgId, userId };
    }

}

module.exports = MessageService;
