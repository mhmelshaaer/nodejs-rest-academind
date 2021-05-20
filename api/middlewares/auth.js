import jsonwebtoken from 'jsonwebtoken';

const auth = (req, res, next) => {

    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jsonwebtoken.verify(token, process.env.JWT_PRIVATE_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            message: `Unauthorized`
        });
    }

};


export { auth as AuthMiddleware }