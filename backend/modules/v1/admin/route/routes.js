const adminController = require("../controller/adminController");
// const upload = require("../../../../middleware/multer")
// const Auth = require("../controller/admin")
// const AuthModel = require("../model/userModel")
// const express = require('express');
// const router = express.Router();

const adminInstance = adminController
const adminRoute = (app)=>{
    app.post("/v1/admin/signin",adminInstance.signin);
    app.post("/v1/admin/artist",adminInstance.addArtist);
    app.get("/v1/admin/artist",adminInstance.AllArtist);
    app.get("/v1/admin/user",adminInstance.AllUsers);
    app.get("/v1/admin/deleteUser/:id",adminInstance.deleteUser);
    app.get("/v1/admin/userBlockAndUnBlock/:id/:is_active",adminInstance.userBlockAndUnBlock);
    app.get("/v1/admin/editUser/:id",adminInstance.editUser);
    app.get("/v1/admin/getArtist/:id", adminInstance.getArtist);
    app.post("/v1/admin/updateArtist", adminInstance.updateArtist);
    app.get("/v1/admin/deleteArtist/:id", adminInstance.deleteArtist);
    app.get("/v1/admin/blockArtist/:id/:is_active", adminInstance.blockArtist);
    app.post("/v1/admin/category", adminInstance.addCategory);
    app.get("/v1/admin/category/:id", adminInstance.getCategory);
    app.get("/v1/admin/category", adminInstance.getAllCategory);
    app.put("/v1/admin/category", adminInstance.updateCategory);
    app.delete("/v1/admin/category/:id", adminInstance.deleteCategory);
    app.post("/v1/admin/song", adminInstance.addSong);
    app.get("/v1/admin/song", adminInstance.getAllSong);
    app.put("/v1/admin/song", adminInstance.updateSong);
    app.get("/v1/admin/song/:id", adminInstance.getSong);
    app.get("/v1/admin/getPlayList/:id",adminInstance.getAllPlayList);
    app.get("/v1/admin/getPlayListSongs/:id",adminInstance.getPlayListSongs);
    app.delete("/v1/admin/playListSongs/:id/:song_id",adminInstance.deletePlayListSong);
    app.get("/v1/admin/playList",adminInstance.getAllUserPlayList);
    //Featured playList : 
    app.put("/v1/admin/featuredPlayList/:id", adminInstance.updateFeaturePlayList);
    app.delete("/v1/admin/featuredPlayList/:id", adminInstance.deleteFeaturePlayList);
    app.get("/v1/admin/featuredPlayList",adminInstance.getAllFeaturedplayList);
    app.get("/v1/admin/featuredPlayList/:id",adminInstance.getAllFeaturedplayList);
    app.post("/v1/admin/newFeaturedPlayList",adminInstance.newFeaturedPlayList);
    //Featured PlayList Song: 
    app.post("/v1/admin/featuredPlayListSong",adminInstance.addSongFeaturedPlaylist);
    app.delete("/v1/admin/featuredPlayListSong/:featured_id/:song_id", adminInstance.deleteSongFromFeaturedPlaylist);
    app.put("/v1/admin/featuredPlayListSong/:featured_id/:song_id", adminInstance.activeInactiveFeaturedPlaylistSong);

}
module.exports = adminRoute