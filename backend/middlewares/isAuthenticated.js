import jwt from 'jsonwebtoken'
const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if(!token){
            return res.status(401).json({
                message:"user not authenticated",
                success:false
            })
        }
        const decodedToken=await jwt.verify(token,process.env.JWT_SECRET)
        if(!decodedToken){
            return res.status(401).json({
                message:"Invalid",
                success:false
            })
        }
        req.id=decodedToken.userId
        next()
    } catch (error) {
        console.log("error in isAuthenticated middleware");

    }
}

export default isAuthenticated;