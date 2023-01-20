//You can extract all the function from the a other routes here in the controller folder to help things more organized
import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js"

//The json() method of the Response interface takes a Response stream and reads it to completion. It returns a promise which resolves with the result of parsing the body text as JSON.
export const getPost = async(req,res) =>{
    const { id } = req.params;
    try {
        const post = await PostMessage.findById(id);
        res.status(200).json(post)
    } catch (error) {
        res.status(404).json({ message: error.message})
    }
}

export const getPosts = async (req,res) =>{
    const {page} = req.query
   try {
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
    const total = await PostMessage.countDocuments({})
     // skip() in mongoosse is used to specify the number of document to skip
     const posts = await PostMessage.find().sort({_id: -1}).limit(LIMIT).skip(startIndex) 
     
    //  console.log(postMessages);
     res.status(200).json({data : posts, currentPage: Number(page), numberOfPages: Math.ceil(total /LIMIT) })
   } catch (error) {
    res.status(404).json({ message: error.message})
   }
}

export const getPostsBySearch = async(req,res) =>{
    const { searchQuery, tags} = req.query

    try {
        const title = new RegExp(searchQuery, 'i');
        const posts = await PostMessage.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ]});


        res.json({data: posts});
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

// with post request, you will be able to access to the req.body
export const createPost = async (req, res) =>{
    const post = req.body;
    
    const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() });
    // paid attention to the creator: req.userid, we set the creator of the post equal ot userId
    try {
       await newPost.save();

       res.status(201).json(newPost)
    } catch (error) {
        res.status(409).json({ message: error.message })
    }


}

export const updatePost = async(req,res) =>{
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`); // check this id is really an mongoose Id

    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
}

export const deletePost = async(req,res) =>{
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await PostMessage.findByIdAndRemove(id);

    res.json({ message: 'Post deleted susccessfully'})
}

export const likePost = async(req, res) =>{
    const {id} = req.params;
     
    if(!req.userId) return res.json({ message: 'Unauthenticated'})
      //req.userId is taken from the middleware 
      // if you call the middleware before the specific action then you can populate the request then you will have access to that request right into the next action that you have 
    //   console.log(req.userId) check to see if you have it
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
     const post = await PostMessage.findById(id);

     const index = post.likes.findIndex((id) => id === String(req.userId));//check if the user's id is already in the like section(it's mean the user is already make a like request)
     //each likes is going to be the id from a specfic person that how we are going to know who like the specific post
    console.log(index)
     if(index === -1){
        post.likes.push(req.userId)
     } else{
        // like the post
        post.likes = post.likes.filter((id) => id !== String(req.userId))// remove the like(userId) from the post 
     } 

     const updatedPost = await PostMessage.findByIdAndUpdate(id, post,{ new:true})
    
     res.json(updatedPost) 
}

export const commentPost = async (req, res) =>{
    const {id} = req.params; //http:test/:params
    const { value } = req.body;

    const post = await PostMessage.findById(id);

    post.comments.push(value);
    
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new : true});

    res.json(updatedPost) 
}