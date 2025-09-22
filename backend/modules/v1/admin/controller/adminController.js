const middleware = require("../../../../middleware/validation")
const { decryptPlain } = require("../../../../utilities/encryption")
const validationRules = require("../../../../utilities/rules")
const adminModel = require("../model/adminModel")

class adminController{
    constructor(){}

    async signin(req,res){
        try{
            let requestData = req.body;
            const adminValidation = validationRules.adminValidation
            const {error,value} = adminValidation.validate(requestData)
            if(error){
                console.log("Validation Error : ",error.details)
                return middleware.encriptData(req, res, { error: details[0].message })
            }
            let message = await adminModel.signin(requestData);
            return middleware.encriptData(req, res, message)
        }catch (error) {
            console.log("Something went Wrong : ", error.message)
            return middleware.encriptData(req, res, error.message)
       }
    }

    
    async addArtist(req,res){
        try{
            let requestData = req.body;
            const artistValidation = validationRules.artistValidation
            const {error,value} = artistValidation.validate(requestData)
            if(error){
                console.log("Validation Error : ",error.details)
                return middleware.encriptData(req, res, { error: details[0].message })
            }
            let message = await adminModel.addArtist(requestData);
            return middleware.encriptData(req, res, message)
        }catch (error) {
            console.log("Something went Wrong : ", error.message)
            return middleware.encriptData(req, res, error.message)
       }
    }
    
    async AllArtist(req, res){
        try{
            let requestData = req.body;
            let message = await adminModel.AllArtist(requestData)
            return middleware.encriptData(req,res,message)
        }catch(error){
            console.log("Something Went Wrong :",error.message)
            return middleware.encriptData(req,res,error.message)    
        }
    }
    
    async AllUsers(req, res){
        try{
            let requestData = req.body;
            let message = await adminModel.AllUsers(requestData)
            return middleware.encriptData(req,res,message)
        }catch(error){
            console.log("Something Went Wrong :",error.message)
            return middleware.encriptData(req,res,error.message)    
        }
    }
    async deleteUser(req, res){
        try{
            let requestData = {};
            requestData.id = req.params.id
            let message = await adminModel.deleteUser(requestData)
            return middleware.encriptData(req,res,message)
        }catch(error){
            console.log("Something Went Wrong :",error.message)
            return middleware.encriptData(req,res,error.message)    
        }
    }
    async userBlockAndUnBlock(req, res){
        try{
            let requestData = {};
            requestData.id = req.params.id
            requestData.is_active = req.params.is_active
            let message = await adminModel.userBlockAndUnBlock(requestData)
            return middleware.encriptData(req,res,message)
        }catch(error){
            console.log("Something Went Wrong :",error.message)
            return middleware.encriptData(req,res,error.message)    
        }
    }
    async editUser(req, res){
        try{
            let requestData = {};
            requestData.id = req.params.id
            let message = await adminModel.editUser(requestData)
            return middleware.encriptData(req,res,message)
        }catch(error){
            console.log("Something Went Wrong :",error.message)
            return middleware.encriptData(req,res,error.message)    
        }
    }
    async updateUser(req,res){
        try{
            let requestData = req.body;
            const updateUserRule = validationRules.updateUserRule
            const {error,value} = updateUserRule.validate(requestData)
            if(error){
                console.log("Validation Error : ",error.details)
                return middleware.encriptData(req, res, { error: details[0].message })
            }
            let message = await adminModel.updateUser(requestData);
            return middleware.encriptData(req, res, message)
        }catch (error) {
            console.log("Something went Wrong : ", error.message)
            return middleware.encriptData(req, res, error.message)
       }
    }

    async getArtist(req, res) {
        try {
            let requestData = {};
            requestData.id = req.params.id;
            let message = await adminModel.getArtist(requestData);
            return middleware.encriptData(req, res, message);
        } catch (error) {
            console.log("Something Went Wrong:", error.message);
            return middleware.encriptData(req, res, error.message);
        }
    }

    async updateArtist(req, res) {
        try {
            let requestData = req.body;
            const updateArtistRule = validationRules.updateArtistRule;
            const { error, value } = updateArtistRule.validate(requestData);
            if (error) {
                console.log("Validation Error:", error.details);
                return middleware.encriptData(req, res, { error: error.details[0].message });
            }
            let message = await adminModel.updateArtist(requestData);
            return middleware.encriptData(req, res, message);
        } catch (error) {
            console.log("Something Went Wrong:", error.message);
            return middleware.encriptData(req, res, error.message);
        }
    }
    async deleteArtist(req,res){
        try{
            let requestData = {}
            requestData.id = req.params.id;
            let message = await adminModel.deleteArtist(requestData);
            return middleware.encriptData(req,res,message);
        }catch(error){
            console.log("Somnething Went Wrong :",error)
            return middleware.encriptData(req, res, error.message);
        }
    }
    async blockArtist(req,res){
        try{
            let requestData = {}
            requestData.id = req.params.id;
            requestData.is_active = req.params.is_active
            let message = await adminModel.blockArtist(requestData);
            return middleware.encriptData(req,res,message);
        }catch(error){
            console.log("Somnething Went Wrong :",error)
            return middleware.encriptData(req, res, error.message);
        }
    }

    async addCategory(req,res){
        try{
            let requestData = req.body;
            let validateCategory = validationRules.validateCategory;
            const {error,value} = validateCategory.validate(requestData);
            if(error){
                console.log("Validation Error : ",error.details)
                return middleware.encriptData(req, res, { error: details[0].message })
            }
            let message = await adminModel.addcategory(requestData);
            return middleware.encriptData(req,res,message)
        }catch(error){
            return middleware.encriptData(req, res, error.message);
        }
    }
    
    async getCategory(req,res){
        try{
            let requestData = {}
            requestData.id = req.params.id;
            let message = await adminModel.getCategory(requestData);
            return middleware.encriptData(req,res,message);
        }catch(error){
            console.log("Somnething Went Wrong :",error)
            return middleware.encriptData(req, res, error.message);
        }
    }
    async getAllCategory(req,res){
        try{
            let requestData = {}
            let message = await adminModel.getAllCategory(requestData);
            return middleware.encriptData(req,res,message);
        }catch(error){
            console.log("Somnething Went Wrong :",error)
            return middleware.encriptData(req, res, error.message);
        }
    }
    async updateCategory(req,res){
        try{
            let requestData = req.body
            let message = await adminModel.updateCategory(requestData);
            return middleware.encriptData(req,res,message);
        }catch(error){
            console.log("Somnething Went Wrong :",error)
            return middleware.encriptData(req, res, error.message);
        }
    }
    async deleteCategory(req,res){
        try{
            let requestData = {}
            requestData.id = req.params.id
            let message = await adminModel.deleteCategory(requestData);
            return middleware.encriptData(req,res,message);
        }catch(error){
            console.log("Somnething Went Wrong :",error)
            return middleware.encriptData(req, res, error.message);
        }
    }
    async addSong(req,res){
        try{
            let requestData = req.body;
            let validateSong = validationRules.validateSong;
            const {error,value} = validateSong.validate(requestData);
            if(error){
                console.log("Validation Error : ",error.details)
                return middleware.encriptData(req, res, { error: details[0].message })
            }
            let message = await adminModel.addSong(requestData);
            return middleware.encriptData(req,res,message)
        }catch(error){
            return middleware.encriptData(req, res, error.message);
        }
    }
    async getAllSong(req,res){
        try{
            let requestData = {}
            let message = await adminModel.getAllSong(requestData);
            return middleware.encriptData(req,res,message);
        }catch(error){
            console.log("Somnething Went Wrong :",error)
            return middleware.encriptData(req, res, error.message);
        }
    }

    async updateSong(req, res){
        try{
            let requestData = req.body;
            let message = await adminModel.updateSong(requestData);
            return middleware.encriptData(req,res,message);
        }catch(error){
            return middle.encriptData(req,res,error.message)
        }
    }
    async getSong(req, res){
        try{
            let requestData = {};
            requestData.id = req.params.id
            let message = await adminModel.getSong(requestData);
            return middleware.encriptData(req,res,message);
        }catch(error){
            return middle.encriptData(req,res,error.message)
        }
    }

     async getAllPlayList(req,res){
          try{
               let requestData = {};
               requestData.user_id = req.params.id
               let message = await adminModel.getAllPlayList(requestData);
               return middleware.encriptData(req,res,message)
          }catch(error){
               return middleware.encriptData(req,res,error.message)
          }
     }
     async getPlayListSongs(req,res){
          try{
               let requestData = {};
               requestData.id = req.params.id
               let message = await adminModel.getPlayListSongs(requestData);
               return middleware.encriptData(req,res,message)
          }catch(error){
               return middleware.encriptData(req,res,error.message)
          }
     }
    async deletePlayListSong(req,res){
        try{
            let requestData = {};
            requestData.id = req.params.id
            requestData.song_id = req.params.song_id
            let message = await adminModel.deletePlayListSong(requestData);
            return middleware.encriptData(req,res,message)
        }catch(error){
            return middleware.encriptData(req,res,error.message)
        }
    }
    async getAllUserPlayList(req,res){
        try{
            let requestData = {};
            let message = await adminModel.getAllUserPlayList(requestData);
            return middleware.encriptData(req,res,message)
        }catch(error){
            return middleware.encriptData(req,res,error.message)
        }
    }

    async addSongFeaturedPlaylist(req,res){
        try{
             let requestData = req.body;
             console.log("Request Data : ",requestData)
             let message = await adminModel.addSongFeaturedPlaylist(requestData);
             return middleware.encriptData(req,res,message)
        }catch(error){
             return middleware.encriptData(req,res,error.message)
        }
    }

    async getAllFeaturedplayList(req,res){
        try{
            console.log("Gwt All List Called !")
            let requestData = {};
            if(req.params.id)requestData.id = req.params.id
            let message = await adminModel.getAllFeaturedplayList(requestData);
            return middleware.encriptData(req,res,message)
       }catch(error){
            return middleware.encriptData(req,res,error.message)
       }
    }

    async newFeaturedPlayList(req,res){
        try{
            let requestData = req.body;
            const featuredPlaylistValidation = validationRules.featuredPlaylistValidation;
            const {error, value} = featuredPlaylistValidation.validate(requestData);
            if(error){
                console.log("Validation Error :", error.details);
                return middleware.encriptData(req, res, { error: error.details[0].message });
            }
            let message = await adminModel.newFeaturedPlayList(requestData);
            return middleware.encriptData(req,res,message);
        }catch(error){
            return middleware.encriptData(req,res,error.message)
        }
    }
    // async updateFeaturePlayList(req, res) {
    //     try {
    //         let requestData = req.body;
    //         const featuredPlaylistValidation = validationRules.updatefeaturedPlaylistValidation;
    //         const {error, value} = featuredPlaylistValidation.validate(requestData);
    //         if(error){
    //             console.log("Validation Error :", error.details);
    //             return middleware.encriptData(req, res, { error: error.details[0].message });
    //         }
    //         let message = await adminModel.updateFeaturePlayList(requestData);
    //         return middleware.encriptData(req,res,message);
    //     } catch(error) {
    //         return middleware.encriptData(req,res,error.message);
    //     }
    // }

    async deleteFeaturePlayList(req, res) {
        try {
            let requestData = {};
            requestData.id = req.params.id;
            
            let message = await adminModel.deleteFeaturePlayList(requestData);
            return middleware.encriptData(req,res,message);
        } catch(error) {
            return middleware.encriptData(req,res,error.message);
        }
    }

    async deleteSongFromFeaturedPlaylist(req, res) {
        try {
            let requestData = {};
            requestData.featured_id = req.params.featured_id;
            requestData.song_id = req.params.song_id;
            console.log("Request Data: ",req.params)
            let message = await adminModel.deleteSongFromFeaturedPlaylist(requestData);
            return middleware.encriptData(req, res, message);
        } catch (error) {
            return middleware.encriptData(req, res, error.message);
        }
    }

    async activeInactiveFeaturedPlaylistSong(req, res) {
        try {
            let requestData = {};
            requestData.featured_id = req.params.featured_id;
            requestData.song_id = req.params.song_id;
            let message = await adminModel.activeInactiveFeaturedPlaylistSong(requestData);
            return middleware.encriptData(req, res, message);
        } catch (error) {
            return middleware.encriptData(req, res, error.message);
        }
    }
    async updateFeaturedPlayList(req,res){
        try {
            let requestData = req.body
            let message = await adminModel.updateFeaturedPlayList(requestData);
            return middleware.encriptData(req, res, message);
        } catch (error) {
            return middleware.encriptData(req, res, error.message);
        }
        
    }


    //PodCast 
    async addPodCast(req,res){
        try {
            let requestData = req.body
            const PodCastValidation = validationRules.validatePodCast;
            const {error, value} = PodCastValidation.validate(requestData);
            if(error){
                console.log("Validation Error :", error.details);
                return middleware.encriptData(req, res, { error: error.details[0].message });
            }
            let message = await adminModel.addPodCast(requestData);
            return middleware.encriptData(req, res, message);
        } catch (error) {
            return middleware.encriptData(req, res, error.message);
        }
    }

     async getAllPodCast(req,res){
        try {
            let requestData = {}
            if(req.params.id) requestData.id = req.params.id
            let message = await adminModel.getAllPodCast(requestData);
            return middleware.encriptData(req, res, message);
        } catch (error) {
            return middleware.encriptData(req, res, error.message);
        }
        
    }

    async updatePodCast(req,res){
        try {
            let requestData = req.body
            let message = await adminModel.updatePodCast(requestData);
            return middleware.encriptData(req, res, message);
        } catch (error) {
            return middleware.encriptData(req, res, error.message);
        }
    }

    async deletePodCast(req,res){
        try {
            let requestData = {}
            requestData.id = req.params.id
            let message = await adminModel.deletePodCast(requestData);
            return middleware.encriptData(req, res, message);
        } catch (error) {
            return middleware.encriptData(req, res, error.message);
        }
    }
    async addStory(req,res){
        try {
            let requestData = req.body
            requestData.admin_id = req?.admin_id
            const validateStory = validationRules.validateStory;
            const {error, value} = validateStory.validate(requestData);
            if(error){
                console.log("Validation Error :", error.details);
                return middleware.encriptData(req, res, { error: error.details[0].message });
            }
            let message = await adminModel.addStory(requestData);
            return middleware.encriptData(req, res, message);
        } catch (error) {
            return middleware.encriptData(req, res, error.message);
        }
    }
    async getAllStory(req,res){
        try {
            console.log("Request Params : ",req.params)
            let requestData = {}
            if(req.params.id) requestData.id = req.params.id
            let message = await adminModel.getAllStory(requestData);
            return middleware.encriptData(req, res, message);
        } catch (error) {
            return middleware.encriptData(req, res, error.message);
        }
    }
    async updateStory(req,res){
        try {
            let requestData = req.body
            const validateUpdateStory = validationRules.validateUpdateStory;
            const {error, value} = validateUpdateStory.validate(requestData);
            if(error){
                console.log("Validation Error :", error.details);
                return middleware.encriptData(req, res, { error: error.details[0].message });
            }
            if(req?.admin_id)requestData.admin_id = req?.admin_id
            let message = await adminModel.updateStory(requestData);
            return middleware.encriptData(req, res, message);
        } catch (error) {
            return middleware.encriptData(req, res, error.message);
        }
    }
    async deleteStory(req,res){
        try {
            let requestData = {}
            requestData.id = req.params.id
            let message = await adminModel.deleteStory(requestData);
            return middleware.encriptData(req, res, message);
        } catch (error) {
            return middleware.encriptData(req, res, error.message);
        }
    }
}

module.exports = new adminController()