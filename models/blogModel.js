const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userImage: {
        type: String,
        required: true
    },
    blogTitle: {
        type: String,
        required: true
    },
    blogText: {
        type: String,
        required: true
    },
    blogImage: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    blogTag:{
        type: String,
        default: "",
        required: true,
    },
    blogTime : { 
        type : Date,
        default : Date.now
    }
});

module.exports = mongoose.model("Blog", blogSchema);