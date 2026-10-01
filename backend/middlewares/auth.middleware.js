import jwt from 'jsonwebtoken'

function authUser(req, res, next){
    try {

        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({
                message: "Token Not Found!!!"
            })
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decode;

        next()
        
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "error in auth Middleware"})
        
    }
}

export { authUser };
