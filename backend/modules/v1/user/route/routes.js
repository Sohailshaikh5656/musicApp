const userController = require("../controller/userController");
const upload = require("../../../../middleware/multer")
const Auth = require("../controller/userController")
const AuthModel = require("../model/userModel")
const express = require('express');
const router = express.Router();

const userInstance = userController
const userRoute = (app)=>{
    app.post("/v1/user/signup",userInstance.signup);
    app.post("/v1/user/forgetPassword",userInstance.forgetPassword);
    app.post('/v1/user/upload-profile',upload.single('profile_img'),userController.uploadProfile);
    app.post("/v1/user/signin",userInstance.signin);
    app.post("/v1/user/checkMail",userInstance.checkMail);
    app.post("/v1/user/artist",userInstance.artist);
    app.post("/v1/user/comment",userInstance.postComment);
    app.get("/v1/user/comment/:id",userInstance.fetchComments);
    app.get("/v1/user/myPostListing",userInstance.myPostListing);
    app.get("/v1/user/getAllPosts",userInstance.getAllPosts);
    app.post("/v1/user/followStateManage",userInstance.followStateManage);
    app.post("/v1/user/likeStateManage",userInstance.likeStateManage);
    app.get("/v1/user/getAllUsers",userInstance.getAllUsers);
    app.post("/v1/user/updateProfile",userInstance.updateProfile);
    app.get("/v1/user/getProfile",userInstance.getProfile);
    app.get("/v1/user/getOtherProfile/:id",userInstance.getOtherProfile);
    app.get("/v1/user/getOtherPost/:id",userInstance.getOtherPost);

    app.get("/v1/user/playCount/:id",userInstance.playCount);
    app.get("/v1/user/song/:id",userInstance.song);
    app.get("/v1/user/search/:keyword",userInstance.searchSong);
    app.post("/v1/user/playList",userInstance.newPlayList);
    app.get("/v1/user/playList",userInstance.getAllPlayList);
    app.get("/v1/user/playList/:id",userInstance.getAllPlayList);
    app.put("/v1/user/playList",userInstance.updatePlaylist);

    //delete PlayList Songs
    app.delete("/v1/user/playList/:song_id/:playlist_id",userInstance.deletePlayListSongs);

    app.get("/v1/user/playlist-songs/:id",userInstance.getPlayListSongs);
    app.post("/v1/user/addtoplaylist", userInstance.addPlayListSong);
    app.get("/v1/user/featuredPlaylist/:id", userInstance.getFeaturedPlayList);
    app.get("/v1/user/featuredPlaylist", userInstance.getFeaturedPlayList);
    //Feature Song List
    app.get("/v1/user/featuredPlaylistSong/:id", userInstance.getSongFromFeaturedList);
    //HomePage
    app.get("/v1/user/homepage", userInstance.homepage);
    
    //PodCast
    app.get("/v1/user/podcast", userInstance.getAllPodCast);
    app.get("/v1/user/podcast/:id", userInstance.getAllPodCast);
    app.get("/v1/user/podcast/:id/:recommended", userInstance.getAllPodCast);
    
    //Story
    app.get("/v1/user/story", userInstance.getAllStory);
    app.get("/v1/user/story/:id", userInstance.getAllStory);


    app.get("/v1/user/genere/:id", userInstance.getGenereSongs);
    
    //Artist
    app.get("/v1/user/artistList/:id", userInstance.getAllArtist);
    app.get("/v1/user/artistList", userInstance.getAllArtist);  
    
    //pages
    app.get("/v1/user/genereList", userInstance.getGenere);
    //Artist Songs
    app.get("/v1/user/artistSongs/:id", userInstance.artistSongs);
    
    //Discover
    app.get("/v1/user/discover", userInstance.discover);








}
module.exports = userRoute