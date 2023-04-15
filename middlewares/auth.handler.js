const jwt = require('jsonwebtoken')
const boom = require('boom')

const { config } = require('./../config/config')

function authentication(req, res, next){
    try{ 
        const token = req.headers.authheader;
        const decoded = jwt.verify(token, config.authSecret)
        req.headers.id = decoded.id
        next();
    } catch (err) {
        next(err)
    }
}

function authenticationToSelf(req, res, next) {
    const { id } = req.params;
    const originId = req.headers.id;
    if (!(Number(id) === Number(originId))){
        throw boom.unauthorized("Is not allow to use other user")
    }
    next()
}

module.exports = { authentication, authenticationToSelf}