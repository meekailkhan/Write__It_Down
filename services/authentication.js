import jwt from "jsonwebtoken";
const secret = 'B$NL@2025'

function createToken(user){
    const payload = {
        _id : user._id,
        fullName : user.fullName,
        email : user.email,
        profileImage : user.profileImage,
        role : user.role
    }
    const token = jwt.sign(payload,secret);
    return token
}

function validateToken(token){
    const payload = jwt.verify(token,secret)
    return payload
}

export default {
    createToken,
    validateToken
}