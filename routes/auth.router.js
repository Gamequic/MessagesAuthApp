const express = require('express');
const path = require("path");
const boom = require('@hapi/boom')

const validationHandler = require('../middlewares/validator.handler');
const { createUserSchema, updateUserSchema, getUserSchema } = require('../schemas/user.schema');
const UserService = require('./../services/auth.service')

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
      //Conseguir parametros
      const { id } = req.params;
      const user = await service.findOne(id);
      delete user.dataValues.password;
      
      //Confirmar foto y formato
      if (!req.files.myFile) {
        throw boom.badRequest('No files were uploaded.')
      }
      if (!(req.files.myFile.name.substring(req.files.myFile.name.length - 4) === '.png')) {
        throw boom.badRequest('Only png files.')
      }
      
      //Mover la foto a la carpeta publica
      const file = req.files.myFile;
      const path = __dirname + "/../public/" + `profilePhoto${id}.png`;
      file.mv(path, (err) => {
        if (err) {
          throw boom.internal(err)
        }
      });

      //Aplicar la foto al usuario y contenstar solicitud
      res.status(201).json(await service.update(id, {
        photo: `http://localhost:3000/public/profilePhoto${id}.png`
      }));
    } catch (error) {
      next(error);
    }
  }
);


module.exports = router;
