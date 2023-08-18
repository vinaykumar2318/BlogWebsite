//jshint esversion:6
import express from "express";
import bodyParser from "body-parser";
import _ from "lodash";
import ejs from "ejs";
import mongoose from "mongoose";

const homeStartingContent = "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis repellat mollitia fuga similique voluptas tenetur, porro soluta, quidem excepturi repudiandae iure numquam. Magnam cum accusamus animi sit rem blanditiis fugiat optio eaque architecto repellat at consequuntur, provident fuga! Similique aspernatur sit ratione quisquam esse assumenda suscipit debitis fuga ad itaque vel voluptatem pariatur saepe consequuntur, numquam dolores laudantium at nisi accusamus minus! Eum tempore natus ipsam dolorem possimus quisquam assumenda doloribus. Alias, facilis, veritatis impedit error quaerat doloribus quo magni reiciendis rerum fuga nihil dignissimos in esse quos corporis id. Ipsa consequuntur minus nam pariatur rem quibusdam ad, tenetur qui perferendis voluptatibus suscipit.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

mongoose.connect("mongodb://127.0.0.1:27017/post",{useNewUrlParser: true});

const postSchema = new mongoose.Schema({
  postTitle:{
        type: String,
        required: [true,"Please check your data entry, No data specified."]
  },
  postContent: {
        type: String,
        required: [true,"Please check your data entry, No data specified."]
  }
});

const Post = mongoose.model("Post",postSchema);

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/",function(req,res){
  Post.find().then((posts) => {
        res.render("home",{homePara: homeStartingContent,posts: posts});
  });
});

app.get("/about",function(req,res){
  res.render("about",{aboutPara: aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{contactPara: contactContent});
});

app.get("/compose",function(req,res){
  res.render("compose");
});

app.get("/posts/:postId",function(req,res){
  let postId = req.params.postId;
  Post.findOne({_id:postId}).then((found) => {
      res.render("post",{finalTitle: found.postTitle,finalContent: found.postContent});
  });
});

app.post("/compose",function(req,res){
  let postTitle = req.body.postTitle;
  let postContent = req.body.postContent;
  const post = new Post({
    postTitle: postTitle,
    postContent: postContent
  });
  post.save();
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});