const express = require('express');
const path = require("path");
const boom = require('@hapi/boom')

const validationHandler = require('../middlewares/validator.handler');
const { createUserSchema, updateUserSchema, getUserSchema } = require('../schemas/user.schema');
const UserService = require('../services/user.service')

const router = express.Router();
const service = new UserService();

router.get('/',  async (req, res, next) => {
  try {
    res.json(await service.find());
  } catch (error) {
    next(error);
  }
});

router.get('/:id',
  validationHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      user = await service.findOne(id)
      delete user.dataValues.password
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  validationHandler(createUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      res.status(201).json(await service.create(body));
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  validationHandler(getUserSchema, 'params'),
  validationHandler(updateUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      res.status(201).json(await service.update(id, body));
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  validationHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      res.status(200).json(await service.delete(id));
    } catch (error) {
      next(error);
    }
  }
);

router.post("/upload-profilephoto/:id",
  validationHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const profilePhoto = req.files.profilePhoto
      const user = await service.uploadPhoto(profilePhoto, id);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.post("/resetpassword",
  async (req, res, next) => {
    try {
      service.passwordReset('demiancalleros0@gmail.comm')
    } catch (error) {
      next(error);
    }
  }
);


module.exports = router;
