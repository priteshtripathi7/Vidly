const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');
    if(!token) return res.status(400).send('Invalid Token')

    try {
        const decode = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decode;
        next();
    }
    catch(err) {
        res.status(401).send('Access Denied');
    }
}