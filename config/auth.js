const jwt = require('jsonwebtoken');
const user = require('../controller/user');
exports.verifyUserToken = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) return res.status(401).send("Access Denied / Unauthorized request");
​
    try {
        token = token.split(' ')[1] // Remove Bearer from string
​
        if (token === 'null' || !token) return res.status(401).send('Unauthorized request');
​
        let verifiedUser = jwt.verify(token, process.env.JWT_SECRET);  
        if (!verifiedUser) return res.status(401).send('Unauthorized request')
​
        req.user = verifiedUser; // user_id & role
        next();
​
    } catch (error) {
        res.status(400).send("Invalid Token");
    }
​
}
​
exports.IsUser = async (req, res, next) => {
    if (req.user.role=== 'user') {
        next();
    }
    return res.status(401).send("Unauthorized!");   
}
exports.IsAdmin = async (req, res, next) => {
    if (req.user.role === 'admin') {
        next();
    }
    return res.status(401).send("Unauthorized!");
​
}