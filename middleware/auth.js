const jwt = require('jsonwebtoken')
function auth (req,res,next){
    try{
        // console.log(req.cookies);
        const token = req.cookies.token

        if(!token){
            return res.json({errorMessage:"unauthorized"})
        }
        const verified = jwt.verify(token, process.env.JWT_SECRETE)
        res.user = verified.user
        next()

    }
    catch(err){
        console.log(err);
        res.json({errorMessage:'unauthorized'})
    }
}

module.exports = auth