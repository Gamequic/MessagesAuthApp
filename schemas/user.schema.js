const Joi = require('joi');

const id = Joi.number().integer();
const email = Joi.string().email();
const password = Joi.string().min(8);
const role = Joi.string().min(5);
const descripcion = Joi.string();
const name = Joi.string();
const lastname = Joi.string();
const username = Joi.string();
const photo = Joi.string();
const token = Joi.string().min(10)

const createUserSchema = Joi.object({
  name: name.required(),
  lastname: lastname.required(),
  username: username.required(),
  email: email.required(),
  password: password.required(),
  role: role,
  descripcion: descripcion,
  photo, photo,
});

const updateUserSchema = Joi.object({
  name: name,
  lastname: lastname,
  username: username,
  email: email,
  password: password,
  role: role,
  descripcion: descripcion,
  photo, photo,
});

const askPasswordReset = Joi.object({
  email: email.required(),
});

const applyPasswordReset = Joi.object({
  password: password.required(),
  token: token.required()
});

const login = Joi.object({
  password: password.required(),
  email: email.required()
});

const getUserSchema = Joi.object({
  id: id.required(),
});

module.exports = { createUserSchema, updateUserSchema, getUserSchema, askPasswordReset, applyPasswordReset, login }
