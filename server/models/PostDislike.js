const mongoose = require('mongoose');

const PostDislike = new mongoose.Schema({
userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
       },
    postId: {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Post'
    }},
{timestamps: true}
);

module.exports = mongoose.model('PostDislike', PostDislike);

