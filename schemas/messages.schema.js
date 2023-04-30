const Joi = require('joi');

const id = Joi.number().integer();
const content = Joi.string();

const sendMessage = Joi.object({
    receiverId: id.required(),
    content: content.required(),
});

const getMessages = Joi.object({
    receiverId: id.required(),
});

const getMessage = Joi.object({
    userId: id.required(),
});

const getMessageParams = Joi.object({
    msgId: id.required(),
});

module.exports = { sendMessage, getMessages, getMessage, getMessageParams }
