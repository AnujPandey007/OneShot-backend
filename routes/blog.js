const blogModel = require('../models/blogModel');

const express = require('express');

const router = express.Router();

router.post('/addBlog', async(req, res)=>{
    try{
      const blog = await blogModel.create({
        userId: req.body.userId,
        userName: req.body.userName,
        userImage: req.body.userImage,
        blogText: req.body.blogText,
        blogTitle: req.body.blogTitle,
        likes: req.body.likes,
        blogTag:req.body.blogTag,
        blogImage:req.body.blogImage,
      });
      res.json(blog);
    }catch(e){
      console.log(e.message);
      res.status(404).json(e.message);
    }
});

router.get('/getBlogs', async(req, res)=>{
    try{
      const blog = await blogModel.find().sort({blogTime: 'descending'});
      //For an ascending sort, you can use "ascending".
      res.json(blog);
    }catch(e){
      console.log(e.message);
      res.status(404).json(e.message);
    }
});

router.get('/getBlog/:id', async(req, res)=>{
    try{
      const blog = await blogModel.find({_id: req.params.id});
      res.json(blog[0]);
    }catch(e){
      console.log(e.message);
      res.status(404).json(e.message);
    }
});
  
router.put('/updateBlog/:id', async(req, res)=>{
    try{
      const blog = await blogModel.findByIdAndUpdate(
        req.params.id, {
          userId: req.body.userId,
          userName: req.body.userName,
          userImage: req.body.userImage,
          blogText: req.body.blogText,
          blogTitle: req.body.blogTitle,
          likes: req.body.likes,
          blogTag: req.body.blogTag,
          blogImage: req.body.blogImage
        },
        {new: true},
      );
      res.json(blog);
    }catch(e){
      console.log(e.message);
      res.status(404).json(e.message);
    }
});
  
router.delete('/deleteBlog/:id', async (req, res)=>{
    try{
      await blogModel.findByIdAndDelete(req.params.id);
      res.json("Deleted Successfully");
    }catch(e){
      console.log(e.message);
      res.status(404).json(e.message);
    }
});

module.exports = router;
  