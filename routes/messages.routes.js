const express = require('express');

const validationHandler = require('../middlewares/validator.handler');
const { sendMessage, getMessages, getMessage, getMessageParams } = require('../schemas/messages.schema');
const MessageService = require('../services/messages.service')
const { authentication } = require('./../middlewares/auth.handler')

const router = express.Router();
const service = new MessageService();

router.get('/chat/:receiverId',
    validationHandler(getMessages, 'params'),
    authentication,
    async (req, res, next) => {
    try {
        const rta = await service.findMessages(req.headers.id, req.params.receiverId);
        res.status(201).json(rta);
    } catch (error) {
        next(error);
    }
});

router.get('/:msgId',
    validationHandler(getMessageParams, 'params'),
    authentication,
    async (req, res, next) => {
    try {
        const userId = req.headers.id;
        const { msgId } = req.params;
        const rta = await service.findOne(Number(msgId), userId)
        res.status(201).json(rta)
    } catch (error) {
        next(error);
    }
});

router.post('/',
    validationHandler(sendMessage, 'body'),
    authentication,
    async (req, res, next) => {
    try {
        const body = req.body;
        const rta = await service.create(req.headers.id, body)
        res.status(201).json(rta);
    } catch (error) {
        next(error);
    }
    }
);

module.exports = router;
