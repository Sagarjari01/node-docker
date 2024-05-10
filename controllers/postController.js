const Posts = require("../models/postSchema");

exports.creatPost = async (req, res) => {
    const {title,body} = req.body
    if(!title || !body) return res.status(400).json({ error: 'Title and body are required' });
  try {
    const post = await new Posts({title,body});
    post.save();
    res.status(201).send(post);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getPosts = async (req, res) => {
  try {
    console.log("called in posts")
    const posts = await Posts.find();
    res.status(200).send(posts);
  } catch (err) {
    res.status(500).json({ error:err });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    res.status(200).send(post);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Posts.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).send(post);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Posts.findByIdAndDelete(req.params.id);
    if(post){
        res.status(200).send("Post deleted successfully");
    }else{
        res.status(404).send("Post not found");
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
