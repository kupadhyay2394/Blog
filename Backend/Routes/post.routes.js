const {Router}= require("express")
const auth= require("../middleware/auth.js")
const { createPost, getAllPosts, getPostById, deletePost, updatePost, toggleLike }=require("../controller/post.controller.js");


const postRouter=Router()
postRouter.use(auth);


postRouter.route("/createpost").post(createPost);
postRouter.route("/getallpost").get(getAllPosts);
postRouter.route("/getpostbyID/:id").get(getPostById);
postRouter.route("/deletpost/:id").delete(deletePost);
postRouter.route("/updatepost/:id").put(updatePost);
postRouter.route("/toggle-like/:id").patch(toggleLike); 

module.exports=postRouter;