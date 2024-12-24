const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Environment Variables for MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://preechasr3008:2Jex4nQ6sOnClnRj@cluster0.s3xsz.mongodb.net/';

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Define Post and Reply Schemas
const postSchema = new mongoose.Schema({
    content: String,
    createdAt: { type: Date, default: Date.now },
});

const replySchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    content: String,
    createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);
const Reply = mongoose.model('Reply', replySchema);

// Initialize Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// API Routes
// Get all posts
app.get('/posts', async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
});

// Create a new post
app.post('/posts', async (req, res) => {
    const newPost = new Post({ content: req.body.content });
    await newPost.save();
    res.json(newPost);
});

// Create a reply
app.post('/replies', async (req, res) => {
    const newReply = new Reply({
        postId: req.body.postId,
        content: req.body.content,
    });
    await newReply.save();
    res.json(newReply);
});

// Get replies for a specific post
app.get('/replies/:postId', async (req, res) => {
    const replies = await Reply.find({ postId: req.params.postId }).sort({ createdAt: -1 });
    res.json(replies);
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
