var jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        var getToken = req.headers.authorization;
        var verify = jwt.verify(getToken, "secretkey");
        req.userData = verify;
        next();
    } catch(middlewareError) {
        console.log(middlewareError);
        res.status(401).json({
            message: "Auth is failed"
        });
    }
}