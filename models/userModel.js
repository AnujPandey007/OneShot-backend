const mongoose = require('mongoose');
const {v4} = require('uuid');

const userSchema = new mongoose.Schema({
    // userId: {
    //     type: String,
    //     default: v4()
    // },
    userName: {
        type: String,
        required: true
    },
    userImage: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        lowercase: true,
        required: true
    },
    userPriority:{
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("User", userSchema);