require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'dev',
  isProd: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 3000,
  dbUrl: process.env.DATABASE_URL,
  saltRounds: process.env.SALTROUNDS,
  authSecret: process.env.AUTHSECRET,
  messageSecret: process.env.MESSAGESECRET,
  emailService: process.env.EMAILSERVICE,
  email: process.env.EMAIL,
  emailpassword: process.env.EMAILPASSWORD,
  ipAddress: process.env.IPADDRESS
}

module.exports = { config };
