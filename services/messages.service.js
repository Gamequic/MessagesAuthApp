const { Op } = require('sequelize');
const boom = require('boom');
const CryptoJS = require('crypto-js')

const UserService = require('../services/user.service')
const { models } = require('../libs/sequelize');
const { config } = require('../config/config')

const userService = new UserService();

class MessageService {
    constructor() {}

    async create(senderId, data) {
        const senderUser = await userService.findOne(senderId)
        const receiverUser = await userService.findOne(data.receiverId)

        const secretKey = `${senderUser.crypt}${config.messageSecret}${receiverUser.crypt}`;
        const contentEncrypt = await CryptoJS.AES.encrypt(data.content, secretKey).toString();
        delete data.content

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
            }
        });

        const sender = await userService.findOne(senderId);
        const receiver = await userService.findOne(receiverId);

        const senderSecretKey = `${sender.dataValues.crypt}${config.messageSecret}${receiver.dataValues.crypt}`
        const receiverSecretKey = `${receiver.dataValues.crypt}${config.messageSecret}${sender.dataValues.crypt}`

        let decrypMessages = []

        for (let i in messages){
            if (messages[i].dataValues.senderId === sender.dataValues.id) {
                var decrypMessage = CryptoJS.AES.decrypt(messages[i].dataValues.content, senderSecretKey).toString(CryptoJS.enc.Utf8);
            } else {
                var decrypMessage = CryptoJS.AES.decrypt(messages[i].dataValues.content, receiverSecretKey).toString(CryptoJS.enc.Utf8);
            }
            decrypMessages.push({
                ...messages[i].dataValues,
                content: decrypMessage
            });
        };

        return decrypMessages;
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
