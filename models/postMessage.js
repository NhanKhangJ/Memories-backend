import mongoose from "mongoose";


//mongoose allow us to give some sort of uniformity to our document
const postSchema = mongoose.Schema({
    title: String,
    message: String,
    name: String,
    creator: String,
    tags: [String],// array of string
    selectedFile: String,
    likes: {
        type: [String],
        default: []
    },
    comments: { type: [String], default:[]},
    createdAt: {
        type: Date,
        default: new Date(),
    }
})


//allow you to use find, create, delete, update, like and collection
const PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage