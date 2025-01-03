import auth from '../services/authentication.js'

function checkForAuthenticationCookie(cookieName){
    return (req,res,next)=>{
        const token = req.cookies[cookieName];
        if(!token) {
            return next()
        }
        try{
            const userPayLoad = auth.validateToken(token);
            req.user = userPayLoad;
        }catch(err){}
        return next()
    }
}

export default {
    checkForAuthenticationCookie
}