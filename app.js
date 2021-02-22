//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const homeStartingContent = "Welcome Everyone to my daily Engineering blogs! Blogs are becoming the ultimate way to stay up-to-date on current events in the engineering and science sectors, stimulate creativity, and explore topics of interest in more depth. Industry specific blogs provide new opportunities for engineers to connect and exchange new perspectives and best practices that can directly influence their daily work. In these bizarre coronavirus isolation times, what better way to spend your time than by reading some of the best engineering blogs ever?";
const aboutContent = "I will be sharing the most intelligent and recent technologies.";
const contactContent = "For any feedback or content suggestion feel free to ping me.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true,useUnifiedTopology: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/",function(req,res){
  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/about",function(req,res){
  res.render("about",{StartingContent:aboutContent});
});
app.get("/contact",function(req,res){
  res.render("contact",{StartingContent:contactContent});
});
app.get("/compose",function(req,res){
  res.render("compose");
});

app.post("/compose",function(req,res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId",function(req,res){
  const requestedPostId = req.params.postId;
    Post.findOne({_id: requestedPostId}, function(err, post){
      res.render("post", {
        title: post.title,
        content: post.content
      });
    });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
