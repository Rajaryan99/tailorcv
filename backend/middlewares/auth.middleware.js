import jwt from 'jsonwebtoken'
import blacklistModel from '../models/blacklist.model.js';

async function authUser(req, res, next){
    try {
        const token = req.cookies?.token ?? req.headers?.authorization?.replace(/^Bearer\s+/i, '');

        if(!token){
            return res.status(401).json({
                message: "Token Not Found!!!"
            })
        }

        const isTokenBlackListed = await blacklistModel.findOne({ token })

        if(isTokenBlackListed){
            return res.status(401).json({
                message: "Invalid Token"
            })
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decode;

        return next();
    } catch (error) {
        if (error?.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }

        if (error?.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid Token' });
        }

        console.error(error)
        return res.status(500).json({message: "error in auth Middleware"})
    }
}

export { authUser };
