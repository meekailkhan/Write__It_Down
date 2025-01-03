import Router from 'express';
import path from 'path';
import Blog from '../models/blog.js'
import Comment from '../models/comments.js'
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('./public/uploads'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + file.originalname
        cb(null, uniqueSuffix)
    }
})



const upload = multer({ storage })

const router = Router()

router.get('/add-new', (req, res) => {
    return res.render('addBlog', {
        user: req.user
    })
})

router.get('/:id',async (req,res)=>{
    let blog = await Blog.findById(req.params.id).populate('createdBy');
    let comments = await Comment.find({blogId : req.params.id}).populate('createdBy')

    console.log(comments)
    return res.render('blog',{
        blog : blog,
        user : req.user,
        comments : comments
    })
})

router.post('/', upload.single('coverImage'),async (req, res) => {
    const {title,body} = req.body;
    const blog = await Blog.create({
        body,
        title,
        createdBy:req.user._id,
        coverImage : `/uploads/${req.file.filename}`
    })
    return res.redirect(`/blog/${blog._id}`)
})

router.post('/comment/:blogId',async (req,res)=>{
    await Comment.create({
        content : req.body.content,
        blogId : req.params.blogId,
        createdBy : req.user._id
    })
    return res.redirect(`/blog/${req.params.blogId}`)
})

export default router