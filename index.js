import path from 'path'
import express from 'express';
import userRoute from './routes/user.js'
import blogRoute from './routes/blog.js'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser';
import middleware from './middleware/authentication.js'
import Blog from './models/blog.js';

const app = express();
const PORT = 8000;

mongoose.connect('mongodb://127.0.0.1:27017/bloomBlog').then(e => console.log('mongoDB connected'))

app.set("view engine","ejs");
app.set('views',path.resolve('./views'));

app.use(express.urlencoded({extended:false}))
app.use(cookieParser());
app.use(middleware.checkForAuthenticationCookie('token'))
app.use(express.static(path.resolve('./public')))

app.get('/',async (req,res)=>{
    const allBlog = await Blog.find({})
    return res.render('home',{
        user : req.user,
        blogs : allBlog
    })
})

app.use('/user',userRoute)
app.use('/blog',blogRoute)

app.listen(PORT,()=> console.log(`Server Started at PORT:${PORT}`))