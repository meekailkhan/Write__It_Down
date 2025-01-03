import Router from 'express'
import path from 'path'
import User from '../models/user.js'
import { createRequire } from 'module';


const require = createRequire(import.meta.url);
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('./public'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + file.originalname
        cb(null, uniqueSuffix)
    }
})



const upload = multer({ storage })


const router = Router();

router.get('/signin', (req, res) => {
    return res.render('signin')
})

router.get('/signup',(req, res) => {
    return res.render('signup')
})

router.post('/signup',upload.single('profileImage'), async (req, res) => {
    const { fullName, email, password } = req.body;
    const profileImage = req.file ? `/${req.file.filename}` : '/download.png';
    console.log(req.file)
    await User.create({
        fullName,
        email,
        password,
        profileImage
    })
    const token = await User.matchPasswordAndGenToken(email, password);

    return res.cookie('token', token).redirect('/')
})

router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await User.matchPasswordAndGenToken(email, password);

        res.cookie('token', token).redirect('/')
    } catch (err) {
        return res.render('signin', {
            error: 'Invalid Email Or Password'
        })
    }

})

router.get('/logout',(req,res)=>{
    return res.clearCookie('token').redirect('/')
})



export default router