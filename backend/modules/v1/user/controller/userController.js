const message = require("../../../../language/en")
const middleware = require("../../../../middleware/validation")
const { decryptPlain } = require("../../../../utilities/encryption")
const validationRules = require("../../../../utilities/rules")
const userModel = require("../model/userModel")

class userController {
     constructor() {

     }
     async signup(req, res) {
          try {
               let requestData = req.body
               const newUser = validationRules.newUser
               const { error, value } = newUser.validate(requestData)
               if (error) {
                    console.log("Validation Error :", error.details)
                    return middleware.encriptData(req, res, { error: details[0].message })
               }

               let message = await userModel.signup(requestData);
               return middleware.encriptData(req, res, message)
          } catch (error) {
               console.log("Something went Wrong : ", error.message)
               return middleware.encriptData(req, res, error.message)
          }
     }

     uploadProfile(req, res) {
          try {
              const responseData = userModel.uploadProfile(req);
              return middleware.encriptData(req, res, responseData)
          } catch (error) {
               return middleware.encriptData(req, res, error);
          }
      }

     async signin(req, res) {
          try {
               let requestData = req.body
               const validateUser = validationRules.validateUser
               const { error, value } = validateUser.validate(requestData)
               if (error) {
                    console.log("Validation Error :", error.details)
                    return middleware.encriptData(req, res, { error: details[0].message })
               }

               let message = await userModel.signin(requestData);
               return middleware.encriptData(req, res, message)
          } catch (error) {
               console.log("Something went Wrong : ", error.message)
               return middleware.encriptData(req, res, error.message)
          }
     }

     async forgetPassword(req,res){
          try{
               console.log("Controller Calledv !")
               let requestData = req.body;
               let message = await userModel.forgetPassword(requestData)
               return middleware.encriptData(req,res,message)
          }catch(error){
               console.log("Error : ",error)
               return middleware.encriptData(req,res,error.message)
          }
     }

     async song(req, res){
          try{
               let requestData={}
               requestData.id = req.params.id;
               requestData.user_id = req.user_id
               let message = await userModel.song(requestData)
               return middleware.encriptData(req,res,message)
          }catch(error){
               return middleware.encriptData(req,res,error.message)
          }
     }
     async checkMail(req, res) {
          try {
               let requestData = req.body
               let message = await userModel.checkMail(requestData);
               return middleware.encriptData(req, res, message)
          } catch (error) {
               console.log("Something went Wrong : ", error.message)
               return middleware.encriptData(req, res, error.message)
          }
     }

     async artist(req,res){
          try{
               let requestData = req.body
               const validateArtist = validationRules.newArtist
               const {error, value} = validateArtist.validate(requestData)
               if(error){
                    console.log("Validate went Wrong : ",error.details)
                    return middleware.encriptData(req, res, { error: details[0].message })
               }

               let message = await userModel.artist(requestData); 
               return middleware.encriptData(req, res, message)   
          }catch (error) {
                    console.log("Something went Wrong : ", error.message)
                    return middleware.encriptData(req, res, error.message)
               }
     }
     async playCount(req,res){
          try{
               let requestData = {}
               requestData.id = req.params.id
               let message = await userModel.playCount(requestData);
               return middleware.encriptData(req,res,message)
          }catch(error){
               console.log("Something went Wrong : ", error.message)
               return middleware.encriptData(req, res, error.message)
          }
     }
     async searchSong(req,res){
          try{
               let requestData = {}
               requestData.keyword = req.params.keyword
               let message = await userModel.searchSong(requestData);
               return middleware.encriptData(req,res,message)
          }catch(error){
               console.log("Something went Wrong : ", error.message)
               return middleware.encriptData(req, res, error.message)
          }
     }

     async newPlayList(req,res){
          try{
               let requestData = req.body;
               requestData.user_id = req.user_id
               let message = await userModel.newPlayList(requestData);
               return middleware.encriptData(req,res,message)
          }catch(error){
               return middleware.encriptData(req,res,error.message)
          }
     }
     async getPlayListSongs(req,res){
          try{
               let requestData= {}
               requestData.id = req.params.id;
               requestData.user_id = req.user_id
               let message = await userModel.getPlayListSongs(requestData);
               return middleware.encriptData(req,res,message)
          }catch(error){
               return middleware.encriptData(req,res,error.message)
          }
     }
     async addPlayListSong(req,res){
          try{
               let requestData= req.body
               let message = await userModel.addPlayListSong(requestData);
               return middleware.encriptData(req,res,message)
          }catch(error){
               return middleware.encriptData(req,res,error.message)
          }
     }
     async getAllPlayList(req,res){
          try{
               let requestData = {};
               requestData.user_id = req.user_id
               if(req.params.id) requestData.id = req.params.id
               let message = await userModel.getAllPlayList(requestData);
               return middleware.encriptData(req,res,message)
          }catch(error){
               return middleware.encriptData(req,res,error.message)
          }
     }
     async updatePlaylist(req,res){
          try{
               let requestData = req.body;
               let message = await userModel.updatePlaylist(requestData);
               return middleware.encriptData(req,res,message)
          }catch(error){
               return middleware.encriptData(req,res,error.message)
          }
     }

     async deletePlayListSongs(req,res){
          try{
               let requestData = {};
               requestData.user_id = req.user_id;
               requestData.song_id = req.params.song_id
               requestData.playlist_id = req.params.playlist_id
               let message = await userModel.deletePlayListSongs(requestData);
               return middleware.encriptData(req,res,message)
          }catch(error){
               return middleware.encriptData(req,res,error.message)
          }
     }
     async getFeaturedPlayList(req,res){
          try{
               let requestData = {};
               if(req.params?.id) requestData.id = req.params?.id
               let message = await userModel.getFeaturedPlayList(requestData);
               return middleware.encriptData(req,res,message)
          }catch(error){
               return middleware.encriptData(req,res,error.message)
          }
     }
     async getSongFromFeaturedList(req,res){
          try{
               console.log("This ID : ",req.params)
               let requestData = {}
               requestData.id = req.params.id
               requestData.user_id = req.user_id
               console.log("This ID : ",requestData)
               let message = await userModel.getSongFromFeaturedList(requestData);
               return middleware.encriptData(req,res,message)
          }catch(error){
               return middleware.encriptData(req,res,error.message)
          }
     }
    
     async newPost(req, res) {
          try {
               let requestData = req.body
               const newPost = validationRules.newPost
               const { error, value } = newPost.validate(requestData)
               if (error) {
                    console.log("Validation Error :", error.details)
                    return middleware.encriptData(req, res, { error: details[0].message })
               }
               requestData.user_id = req.user_id
               let message = await userModel.newPost(requestData);
               return middleware.encriptData(req, res, message)
          } catch (error) {
               console.log("Something went Wrong : ", error.message)
               return middleware.encriptData(req, res, error.message)
          }
     }
     async postComment(req, res) {
          try {
               let requestData = req.body
               const postComment = validationRules.postComment
               const { error, value } = postComment.validate(requestData)
               if (error) {
                    console.log("Validation Error :", error.details)
                    return middleware.encriptData(req, res, { error: details[0].message })
               }
               requestData.user_id = req.user_id
               let message = await userModel.postComment(requestData);
               return middleware.encriptData(req, res, message)
          } catch (error) {
               console.log("Something went Wrong : ", error.message)
               return middleware.encriptData(req, res, error.message)
          }
     }

     async fetchComments(req, res) {
          try {
               console.log("Comments Called")
               let requestData = {}
               requestData.id = req.params.id
               requestData.user_id = req.user_id
               let message = await userModel.fetchComments(requestData);
               return middleware.encriptData(req, res, message)
          } catch (error) {
               console.log("Something went Wrong : ", error.message)
               return middleware.encriptData(req, res, error.message)
          }
     }
     async myPostListing(req, res) {
          try {
               let requestData = {}
               requestData.user_id = req.user_id
               let message = await userModel.myPostListing(requestData);
               return middleware.encriptData(req, res, message)
          } catch (error) {
               console.log("Something went Wrong : ", error.message)
               return middleware.encriptData(req, res, error.message)
          }
     }
     async getAllPosts(req, res) {
          try {
               let requestData = {}
               requestData.user_id = req.user_id
               let message = await userModel.getAllPosts(requestData);
               return middleware.encriptData(req, res, message)
          } catch (error) {
               console.log("Something went Wrong : ", error.message)
               return middleware.encriptData(req, res, error.message)
          }
     }
     
     async followStateManage(req, res) {
          try {
               let requestData = req.body
               requestData.user_id = req.user_id
               console.log("User ID : ",req.user_id)
               let message = await userModel.followStateManage(requestData);
               return middleware.encriptData(req, res, message)
          } catch (error) {
               console.log("Something went Wrong : ", error.message)
               return middleware.encriptData(req, res, error.message)
          }
     }
     
     async likeStateManage(req, res) {
          try {
               let requestData = req.body
               requestData.user_id = req.user_id
               let message = await userModel.likeStateManage(requestData);
               return middleware.encriptData(req, res, message)
          } catch (error) {
               console.log("Something went Wrong : ", error.message)
               return middleware.encriptData(req, res, error.message)
          }
     }
     async getAllUsers(req, res) {
          try {
               let requestData = {}
               requestData.user_id = req.user_id
               let message = await userModel.getAllUsers(requestData);
               return middleware.encriptData(req, res, message)
          } catch (error) {
               console.log("Something went Wrong : ", error.message)
               return middleware.encriptData(req, res, error.message)
          }
     }
     async getOtherProfile(req, res) {
          try {
               let requestData = {}
               requestData.id = decryptPlain(req.params.id)
               console.log("ID : ",requestData.id)
               requestData.user_id = req.user_id  
               let message = await userModel.getOtherProfile(requestData);
               return middleware.encriptData(req, res, message)
          } catch (error) {
               console.log("Something went Wrong : ", error.message)
               return middleware.encriptData(req, res, error.message)
          }
     }
     async getOtherPost(req, res) {
          try {
               let requestData = {}
               requestData.id = decryptPlain(req.params.id)
               console.log("ID : ",requestData.id)
               requestData.user_id = req.user_id  
               let message = await userModel.getOtherPost(requestData);
               return middleware.encriptData(req, res, message)
          } catch (error) {
               console.log("Something went Wrong : ", error.message)
               return middleware.encriptData(req, res, error.message)
          }
     }
     async getProfile(req,res){
          try {
               console.log("Data !")
               let requestData = {}
               requestData.user_id = req.user_id
               let message = await userModel.getProfile(requestData);
               return middleware.encriptData(req, res, message)
          } catch (error) {
               console.log("Something went Wrong : ", error.message)
               return middleware.encriptData(req, res, error.message)
          }
     }
     async updateProfile(req,res){
          try {
               let requestData = req.body
               requestData.user_id = req.user_id
               let message = await userModel.updateProfile(requestData);
               return middleware.encriptData(req, res, message)
          } catch (error) {
               console.log("Something went Wrong : ", error.message)
               return middleware.encriptData(req, res, error.message)
          }
     }
     async homepage(req, res) {
          try {
               let requestData = {}
               requestData.user_id = req.user_id
               let message = await userModel.homePage(requestData);
               return middleware.encriptData(req, res, message)
          } catch (error) {
               console.log("Something went Wrong : ", error.message)
               return middleware.encriptData(req, res, error.message)
          }
     }
     async getAllPodCast(req, res) {
          try {
               let requestData = {}
               requestData.user_id = req.user_id
               if(req.params.id)requestData.id = req.params.id;
               if(req.params.recommended) requestData.recommended = req.params.recommended
               let message = await userModel.getAllPodCast(requestData);
               return middleware.encriptData(req, res, message)
          } catch (error) {
               console.log("Something went Wrong : ", error.message)
               return middleware.encriptData(req, res, error.message)
          }
     }
     //All Stories with Recommended
     async getAllStory(req, res) {
          try {
               let requestData = {}
               requestData.user_id = req.user_id
               requestData.id = req.params.id;
               let message = await userModel.getAllStory(requestData);
               return middleware.encriptData(req, res, message)
          } catch (error) {
               console.log("Something went Wrong : ", error.message)
               return middleware.encriptData(req, res, error.message)
          }
     }
     async getGenereSongs(req, res) {
          try {
               let requestData = {}
               requestData.user_id = req.user_id
               requestData.id = req.params.id;
               let message = await userModel.getGenereSongs(requestData);
               return middleware.encriptData(req, res, message)
          } catch (error) {
               console.log("Something went Wrong : ", error.message)
               return middleware.encriptData(req, res, error.message)
          }
     }
     async getAllArtist(req, res) {
          try {
               let requestData = {}
               requestData.user_id = req.user_id
               if(req.params.id)requestData.id = req.params.id;
               let message = await userModel.getAllArtist(requestData);
               return middleware.encriptData(req, res, message)
          } catch (error) {
               console.log("Something went Wrong : ", error.message)
               return middleware.encriptData(req, res, error.message)
          }
     }
     async getGenere(req, res) {
          try {
               let requestData = {}
               requestData.user_id = req.user_id
               if(req.params.id)requestData.id = req.params.id;
               let message = await userModel.getGenere(requestData);
               return middleware.encriptData(req, res, message)
          } catch (error) {
               console.log("Something went Wrong : ", error.message)
               return middleware.encriptData(req, res, error.message)
          }
     }
     async artistSongs(req, res) {
          try {
               let requestData = {}
               console.log("Params Called !",req.params)
               requestData.user_id = req.user_id
               if(req.params.id)requestData.id = req.params.id;
               let message = await userModel.artistSongs(requestData);
               return middleware.encriptData(req, res, message)
          } catch (error) {
               console.log("Something went Wrong : ", error.message)
               return middleware.encriptData(req, res, error.message)
          }
     }
     async discover(req, res) {
          try {
               let requestData = {}
               console.log("Params Called !",req.params)
               requestData.user_id = req.user_id
               if(req.params.id)requestData.id = req.params.id;
               let message = await userModel.discover(requestData);
               return middleware.encriptData(req, res, message)
          } catch (error) {
               console.log("Something went Wrong : ", error.message)
               return middleware.encriptData(req, res, error.message)
          }
     }
}

module.exports = new userController()