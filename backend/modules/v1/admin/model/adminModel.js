let database = require("../../../../configure/database")
const responseCode = require("../../../../utilities/responseCode");
const common = require("../../../../utilities/common");
const { OPERATION_FAILED } = require("../../../../utilities/responseCode");
const jwt = require('jsonwebtoken');

class adminModel{
    constructor(){}

    async signin(requestData){
        try{
            const [result] = await database.query("SELECT * FROM tbl_admin WHERE email = ? AND is_active=1 AND is_deleted=0",[requestData.email])
            if(result.length<=0){
                return {
                    code: responseCode.NO_DATA_FOUND,
                    keyword: "email not found",
                    data: "Email Not Found or Entered Wrong Email"
                }
            }
            const hasedPassword = await common.comparePasswords(requestData.password,result[0].password);
            if(!hasedPassword){
                return {
                    code: responseCode.OPERATION_FAILED,
                    keyword: "password not matched",
                    data: "Entered a Wrong Password !"
                }
            }
            let JWTToken = jwt.sign(
                { user_id: result[0].id }, process.env.SECRET_KEY, { "expiresIn": "1d" }
            )
            delete result[0].password
            result[0].msg = "User Login Successfully !"
            result[0].jwtToken = JWTToken
            return {
                code: responseCode.SUCCESS,
                keyword: "success",
                data: result[0]
            }
        }catch(error){
            return {
                code: responseCode.OPERATION_FAILED,
                keyword: "something_went_wrong",
                data: `Error : ${error}`
            }
        }
    }

    async addArtist(requestData){
        try{
            const artist = {
                name : requestData.name,
                bio : requestData.bio,
                profile_picture : requestData.profile_picture
            }
            const [checkArtist] = await database.query("SELECT * FROM tbl_artist WHERE name = ? AND bio = ? AND is_active = 1 AND is_deleted=0",[requestData.name, requestData.bio])
            if(checkArtist.length>0){
                return {
                    code : OPERATION_FAILED,
                    keyword : "Artist Already Exits",
                    data : "Artist Already Exits !"
                }
            }
            const [result] = await database.query("INSERT INTO tbl_artist SET ?",artist)
            if(result.affectedRows <=0 ){
                return {
                    code : OPERATION_FAILED,
                    keyword : "error_in_inserting",
                    data : "Failed to Insertee ! 0 Row Affected !"
                }
            }
            return {
                code : responseCode.SUCCESS,
                keyword : "success",
                data : `Artist Added Successfully !`
            }
        }catch(error){
            return{
                code : OPERATION_FAILED,
                keyword : "something_went_wrong",
                data : `Error : ${error}`
            }
        }
    }

    async AllArtist(requestData){
        try{
            let [result] = await database.query("SELECT * FROM tbl_artist WHERE is_deleted=0 ORDER BY id DESC")
            if(result.length <= 0){
                return {
                    code : responseCode.NO_DATA_FOUND,
                    keyword : "no data found",
                    data : "No Data Found ! Empty"
                }
            }
            return {
                code : responseCode.SUCCESS,
                keyword : "success",
                data : result
            }
        }catch(error){
            return {
                code:OPERATION_FAILED,
                keyword : "something_went_wrong",
                data : error.data || error
            }
        }
    }
    async updateArtist(requestData){
        try{
            const artistData = {
                name : requestData.name,
                bio : requestData.bio,
            }
            if(requestData?.profile_picture){
                artistData.profile_picture = requestData.profile_picture
            }
            const [result] = await database.query("UPDATE tbl_artist SET ? WHERE id = ?",[artistData,requestData.id]);
            if(result.affectedRows <=0){
                return {
                    code: responseCode.OPERATION_FAILED,
                    keyword: "update_failed",
                    data: "Failed to update artist information"
                }
            }
            return {
                code: responseCode.SUCCESS,
                keyword: "success",
                data: "Artist information updated successfully"
            }
        }catch(error){
            return {
                code: responseCode.OPERATION_FAILED,
                keyword: "error_occurred",
                data: error.message || "An error occurred while updating artist information"
            }
        }
    }

    async getArtist(requestData){
        try{
            console.log("This is Artist ID : ",requestData)
        const [result] = await database.query("SELECT * FROM tbl_artist WHERE id = ?", [requestData.id]);
        if(result.length <= 0){
            return {
                code: responseCode.NO_DATA_FOUND,
                keyword: "artist_not_found",
                data: "Artist not found with the given ID"
            }
        }
        return {
            code: responseCode.SUCCESS,
            keyword: "success",
            data: result[0]
        }
        }catch(error){
            return {
                code: responseCode.OPERATION_FAILED,
                keyword: "error_occurred",
                data: error.message || "An error occurred while fetching artist information"
            }
        }
    }

    async AllUsers(requestData){
        try{
            const [result] = await database.query(`SELECT * FROM tbl_user WHERE is_deleted=0`);
            if(result.length<=0){
                return{
                    code : responseCode.NO_DATA_FOUND,
                    keyword : "error_in_fetching",
                    data : "No Data Found"
                }
            }
            delete result.password
            return{
                code : responseCode.SUCCESS,
                keyword : "User Found Successful;ly !",
                data : result
            }
        }catch(error){
            return {
                code : OPERATION_FAILED,
                keyword : "something_went_wrong",
                data : error.data || error
            }
        }
    }

    async deleteUser(requestData){
        try{
            const [result] = await database.query("UPDATE tbl_user SET is_deleted = 1 WHERE id = ?", requestData.id);
            if(result.affectedRows<=0){
                return {
                    code : OPERATION_FAILED,
                    keyword : "error_in_deleting",
                    data : "Error in Deleting Query !"
                }
            }
            return {
                code : responseCode.SUCCESS,
                keyword : "success",
                data:"User Deleted Successfully !"
            }
        }catch(error){
            return{
                code:responseCode.OPERATION_FAILED,
                keyword : "something_went_wrong",
                data : error || error.data || "Something Went Wrong"
            }
        }
    }


    async userBlockAndUnBlock(requestData){
        try{
            const [result] = await database.query("UPDATE tbl_user SET is_active = ? WHERE id = ?", [requestData.is_active == 1 ? 0 : 1, requestData.id]);
            if(result.affectedRows<=0){
                return {
                    code : OPERATION_FAILED,
                    keyword : "error_in_blocking",
                    data : "Error in Blocking Query !"
                }
            }
            return {
                code : responseCode.SUCCESS,
                keyword : "success",
                data: requestData.is_active ? "User Blocked Successfully !" : "User Unblocked Successfully !"
            }
        }catch(error){
            return {
                code: responseCode.OPERATION_FAILED,
                keyword: "something_went_wrong",
                data: error || error.data || "Something Went Wrong"
            }
        }
    }

    async getUser(requestData){
        
    }
    async editUser(requestData){
        try{
            console.log("Edit User : ",requestData.id)
            const [result] = await database.query("SELECT * FROM tbl_user WHERE id = ?", requestData.id);
            if(result.length <= 0){
                return {
                    code : responseCode.NO_DATA_FOUND,
                    keyword : "No Data Found",
                    data : "No Data Found || There no user with this ID !"
                }
            }
            delete result[0].password
            return {
                code : responseCode.SUCCESS,
                keyword : "success",
                data : result[0]
            }
        }catch(error){
            return{
                code : responseCode.OPERATION_FAILED,
                keyword : "something_went_wrong",
                data : error
            }
        }
    }
    async updateUser(requestData){
        try{
            const userData = {
                name : requestData.name,
                email : requestData.email,
                username : requestData.username
            }
            const [result] = await database.query("UPDATE tbl_user SET ? WHERE id = ?",[userData,requestData.id]);
            if(result.affectedRows<=0){
                return{
                    code : responseCode.SUCCESS,
                    keyword : "success",
                    data : "user has upadated"
                }
            }
        }catch(error){
            return{
                code : OPERATION_FAILED,
                keyword : "something_went_wrong",
                data : error
            }
        }
    }

    async deleteArtist(requestData){
        try{
            const [result] = await database.query("UPDATE tbl_artist SET is_deleted = 1 WHERE id = ?",[requestData.id])
            if(result.affectedRows<=0){
                return {
                    code : OPERATION_FAILED,
                    keyword : "error_in_deleting",
                    data : "Errror in Deleting Song Artist !"
                }
            }
            
            return{
                code : responseCode.SUCCESS,
                keyword : "success",
                data : "Artist Deleted Succefully !"
            }
        }catch(error){
            return {
                code : responseCode.OPERATION_FAILED,
                keyword : "something_went_wrong",
                data : error
            }
        }
    }
    async blockArtist(requestData){
        try{
            console.log("There is Data : ",requestData)
            // Convert is_active to number if it's a string
            const currentStatus = typeof requestData.is_active === 'string' ? 
                parseInt(requestData.is_active) : 
                requestData.is_active;
            // Toggle the status
            requestData.is_active = currentStatus === 1 ? 0 : 1;
            console.log("To Be Enter in Data base : ", requestData.is_active);
            const [result] = await database.query("UPDATE tbl_artist SET is_active = ? WHERE id = ?",[requestData.is_active,requestData.id])
            if(result.affectedRows<=0){
                return {
                    code : OPERATION_FAILED,
                    keyword : "error_in_deleting",
                    data : "Errror in Deleting Song Artist !"
                }
            }
            if(requestData.is_active){
                return{
                    code : responseCode.SUCCESS,
                    keyword : "success",
                    data : "Artist Blocked Successfully !"
                }
            }else{
                return{
                    code : responseCode.SUCCESS,
                    keyword : "success",
                    data : "Artist UnBlock Operation Done !"
                }
            }
        }catch(error){
            return {
                code : responseCode.OPERATION_FAILED,
                keyword : "something_went_wrong",
                data : error
            }
        }
    }
    async addcategory(requestData){
        const categoryData = {
            name : requestData.name,
            image : requestData.image
        }
        try{
            const [result] = await database.query("INSERT INTo tbl_category SET ?",categoryData);
            if(result.affectedRows<=0){
                return {
                    code : OPERATION_FAILED,
                    keyword : "error_in_inserting",
                    data : "Error in Inserting Category !"
                }
            }
            return {
                code : responseCode.SUCCESS,
                keyword : "success",
                data : "Category Added Suceessfully !"
            }
        }catch(error){
            return{
                code:OPERATION_FAILED,
                keyword:"something_went_wrong",
                data:error
            }
        }
    }

    async getCategory(requestData){
        try{
            const result  = await common.getCategory(requestData)
            return result
        }catch(error){
            return{
                code:OPERATION_FAILED,
                keyword:"something_went_wrong",
                data:error
            }
        }
    }
    async getAllCategory(requestData){
        try{
            requestData.role == "admin"
            const result  = await common.getAllCategory(requestData)
            return result
        }catch(error){
            return{
                code:OPERATION_FAILED,
                keyword:"something_went_wrong",
                data:error
            }
        }
    }

    async updateCategory(requestData){
        console.log("################Ths update Method is Called !##########")
        try{
            let updateCategoryData = {}
            if(requestData.image){
                updateCategoryData.image = requestData.image
            }
            if(requestData.name){
                updateCategoryData.name = requestData.name
            }
            if(requestData.is_active!=undefined){
                requestData.is_active = parseInt(requestData.is_active)
                updateCategoryData.is_active = requestData.is_active?0:1
            }
            const [result] = await database.query("UPDATE tbl_category SET ? WHERE id = ?",[updateCategoryData, requestData.id])
            if(result.affectedRows<=0){
                return{
                    code : OPERATION_FAILED,
                    keyword : "No Row Affected !",
                    data : "Error in Editing or Deleting Data"
                }
            }
            if(updateCategoryData.is_active !== undefined){
                return{
                    code : responseCode.SUCCESS,
                    keyword : updateCategoryData.is_active ? "category_unblocked" : "category_blocked",
                    data : updateCategoryData.is_active ? "Category Unblocked Successfully!" : "Category Blocked Successfully!"
                }
            }else{
                return {
                    code : responseCode.SUCCESS,
                    keyword : "category_updated",
                    data : "Category Updated Successfully!"
                }
            }
        }catch(error){
            return{
                code:OPERATION_FAILED,
                keyword:"something_went_wrong",
                data:error
            }
        }
    }
    async deleteCategory(requestData){
        try{
            const [result] = await database.query("UPDATE tbl_category SET is_deleted = 1 WHERE id = ?",[requestData.id])
            if(result.affectedRows<=0){
                return{
                    code : OPERATION_FAILED,
                    keyword : "No Row Affected !",
                    data : "Error in Deleteing Data : "
                }
            }
            return {
                code : responseCode.SUCCESS,
                keyword : "category_deleted",
                date : "Category Deleted Successfully !"
            }
        }catch(error){
            return{
                code:OPERATION_FAILED,
                keyword:"something_went_wrong",
                data:error
            }
        }
    }

    async addSong(requestData){
        try{
            let responseData = {}
            const songData = {
                category_id : requestData.category_id,
                title : requestData.title,
                album_name : requestData.album_name,
                song : requestData.song,
                cover_image : requestData.cover_image,
                lyrics : requestData.lyrics,
                duration : requestData.duration,
                BPM : requestData.BPM,
                language : requestData.language,
                explicit : requestData.explicit,
                release_date : requestData.release_date,
                copyright_info : requestData.copyright_info,
                mood : requestData.mood,
                is_featured : requestData.is_featured?1:0,
                play_count : 0,
                download_count:0,
                total_likes : 0,
                total_comments : 0,
            }
            const [result] = await database.query("INSERT INTo tbl_song SET ?",songData);
            if(result.affectedRows <=0){
                return{
                    code: OPERATION_FAILED,
                    keyword : "errror_in_inserting",
                    data : "Error in Inserting Song in to Database",
                }
            }
            const songId = result.insertId;
            for(let i = 0; i < requestData.artist_id.length; i++){
                const singerData = {
                    artist_id : requestData.artist_id[i],
                    song_id : songId
                }
                let [insertArtist] = await database.query("INSERT INTO tbl_artist_songs SET ?",singerData)
                if(insertArtist.affectedRows<=0){
                    return {
                        code : OPERATION_FAILED,
                        keyword : "error_in_inserting",
                        data : "Error || Error in Inserting Singer Junction Table"
                    }
                }
            }
            let tags = requestData.tags;
            tags = tags.split(/[,\s#]+/).filter(tag => tag.trim() !== "");
            for(let i=0; i<tags.length;i++){
                const tagsData = {
                    song_id : songId,
                    tag : tags[i]
                }
                let [insertedTags] = await database.query("INSERT INTO tbl_tags SET ?",tagsData)
                if(insertedTags.affectedRows <=0){
                    return {
                        code : OPERATION_FAILED,
                        keyword : "error_in_inserting",
                        data : "Error || Error in Inserting Tags"
                    }
                }
            }
            let temp = {id :songId, msg :"Song Added Successfully !"}
            Object.assign(temp,songData)
            responseData.songData = temp,
            responseData.artist_id = requestData.artist_id
            requestData.tags = tags
            return {
                code : responseCode.SUCCESS,
                keyword : "success",
                data : responseData
            }
        }catch(error){
            return{
                code: OPERATION_FAILED,
                keyword: "something_went_wrong || model Error", 
                data: error
            }
        }
    }

    async getAllSong(requestData){
        try{
            console.log("THE SONG METHOD CALLED")
            requestData.role == "admin"
            const result = await common.getAllSong(requestData)
            console.log("This is Data : ",result)
            if(result.length<=0){
                return {
                    code: responseCode.NO_DATA_FOUND,
                    keyword : "No data Found",
                    data : "No Data Found || No Song Found"
                }
            }
            return{
                code : responseCode.SUCCESS,
                keyword:"success",
                data : result
            }
        }catch(error){
            return{
                code : OPERATION_FAILED,
                keyword : "something_went_wrong",
                data : error
            }
        }
    }
    async updateSong(requestData){
        try{
            console.log("This is Actual Data : ",requestData)
            let id = requestData.id;
            delete requestData.id
            const artistIds = requestData.artist_id
            delete requestData.artist_id
            if(requestData.is_active != undefined){
                requestData.is_active = requestData.is_active?0:1
                let [result] = await database.query("UPDATE tbl_song SET ? WHERE id = ?",[requestData,id])
                if(result.affectedRows<=0){
                    return{
                        code : OPERATION_FAILED,
                        keyword : "error_in_updating",
                        data : `Error | failed to ${requestData.is_active?"UnBlock" : "Block"} Song`
                    }
                }else{
                    return{
                        code : responseCode.SUCCESS,
                        keyword : "success",
                        data : `Song has been ${requestData.is_active?"UnBlocked":"Block"} sucessfully !`
                    }
                }
            }else{
                let [result] = await database.query("UPDATE tbl_song SET ? WHERE id = ?",[requestData,id])
                if(result.affectedRows<=0){
                    return{
                        code : OPERATION_FAILED,
                        keyword : "error_in_updating",
                        data : `Error | failed to update Song`
                    }
                }else{
                    return {
                        code : responseCode.SUCCESS,
                        keyword : "success",
                        data : `Song has been updated sucessfully !`
                    }
                }
            }
        }catch(error){
            console.log("Error",error)
            return {
                code : OPERATION_FAILED,
                keyword : "something_went_wrong",
                data : error
            }
        }
    }
    async getSong(requestData){
        try{
            let sql = `SELECT s.*, 
                      (SELECT GROUP_CONCAT(t.tag SEPARATOR ', ') 
                       FROM tbl_tags as t 
                       WHERE t.song_id = s.id) as tag 
                      FROM tbl_song as s 
                      WHERE s.id = ? AND s.is_deleted=0`
            const[result] = await database.query(sql,[requestData.id])
            const [artist] = await database.query("SELECT a.* FROM tbl_artist as a JOIN tbl_artist_songs as ats ON a.id = ats.artist_id WHERE ats.song_id = ? ",requestData.id)

            if(result.length<=0){
                return {
                    code : responseCode.NO_DATA_FOUND,
                    keyword : "not_found",
                    data : "Error in Founding Data ! No result found"
                }
            }
            if(artist.length<=0){
                return {
                    code : responseCode.NO_DATA_FOUND,
                    keyword : "not_found",
                    data : "Error in Founding Data ! No result found"
                }
            }
            result[0].artist = artist
            return {
                code : responseCode.SUCCESS,
                keyword : "success",
                data : result[0]
            }
        }catch(error){
            return {
                code : OPERATION_FAILED,
                keyword : "something_went_wrong",
                data : error
            }
        }
    }

    async getAllPlayList(requestData){
        try{
            const [result] = await database.query("SELECT p.*, DATE_FORMAT(p.created_at, '%D %M, %Y') as created_at, (SELECT COUNT(*) FROM tbl_playlist_song as ps WHERE ps.playlist_id = p.id) as songs FROM tbl_playlist as p WHERE p.user_id=?",[requestData.user_id])
            if(result.length<=0){
                return {
                    code : responseCode.NO_DATA_FOUND,
                    keyword : "not_found",
                    data : "No Data Found || No Play List Found !"
                }
            }
            return {
                code : responseCode.SUCCESS,
                keyword : "success",
                data: result
            }
        }catch(error){
            return{
                code : OPERATION_FAILED,
                keyword : "something_went_wrong",
                data : error
            }
        }
    }

    async getPlayListSongs(requestData){
        try{
            let [result] = await database.query(
                `SELECT p.* FROM tbl_playlist as p WHERE p.id = ? AND p.is_active=1 AND p.is_deleted = 0`,
                [requestData.id]
            )

            const [songs] = await database.query(
                `SELECT ps.*, s.id as id, s.*, 
                (SELECT GROUP_CONCAT(a.name) FROM tbl_artist as a 
                    JOIN tbl_artist_songs as artsng ON artsng.artist_id = a.id WHERE artsng.song_id = s.id)
                 as artist_name FROM tbl_playlist_song as ps 
                JOIN tbl_song as s ON s.id = ps.song_id
                JOIN tbl_artist_songs as arsng ON arsng.song_id = s.id
                JOIN tbl_artist as a ON a.id = arsng.artist_id
                WHERE ps.playlist_id = ? AND ps.is_active=1 AND ps.is_deleted=0`,[requestData.id]
            )
            if(result.length<=0){
                return {
                    code : responseCode.NO_DATA_FOUND,
                    keyword : "not_found",
                    data : "No PlayList Found with Thsis ID"
                }
            }
            result = result[0]
            if(songs.length<=0){
                result.songs = "No Song Found ! An Empty Play List"
                return{
                    code : responseCode.NO_DATA_FOUND,
                    keyword : "not_found",
                    data: result,
                }
            }
            result.songs = songs
            return {
                code : responseCode.SUCCESS,
                keyword : "success",
                data : result,
                songs : songs
            }
        }catch(error){
            return{
                code : OPERATION_FAILED,
                keyword : "something_went_wrong",
                data : error
            }
        }
    }

    async deletePlayListSong(requestData){
        try{
            const [result] = await database.query(`UPDATE tbl_playlist_song SET is_deleted = 1 WHERE playlist_id = ? AND song_id = ?`,[requestData.id, requestData.song_id])
            if(result.affectedRows<=0){
                return {
                    code : OPERATION_FAILED,
                    keyword : "error_in_deleting",
                    data : "Error in Deleting Song from Playlist"
                }
            }
            return {
                code : responseCode.SUCCESS,
                keyword : "success",
                data : "Song Deleted From the PlayList "
            }
        }catch(error){
            return{
                code : OPERATION_FAILED,
                keyword : "something_went_wrong",
                data : error
            }
        }
    }

    async getAllUserPlayList(requestData){
        try{
            const [result] = await database.query(`
                SELECT u.*, p.*, p.id as id, (SELECT COUNT(*) FROM tbl_playlist_song as ps WHERE ps.playlist_id = p.id AND ps.is_active=1 AND ps.is_deleted=0) as total_songs FROM tbl_playlist as p JOIN tbl_user as u WHERE u.id = p.user_id
            `)
            if(result.length<=0){
                return {
                    code : responseCode.NO_DATA_FOUND,
                    keyword : "no_data_found",
                    data : "No PlayList Found ! || Empty Playlist"
                }
            }
            return {
                code : responseCode.SUCCESS,
                keyword : "success",
                data : result
            }
        }catch(error){
            return {
                code : OPERATION_FAILED,
                keyword : "something_went_wrong",
                data : error
            }
        }
    }

    async newFeaturedPlayList(requestData){
        try{
            const playList = {
                name : requestData.name,
                description : requestData.description,
                image : requestData.image,
                category_id : requestData.category_id
            }
            const [result] = await database.query("INSERT INTO tbl_featured_playlist SET ?", playList)
            if(result.affectedRows <= 0){
                return {
                    code : OPERATION_FAILED,
                    keyword : "error_in_inserting",
                    data : "Error in Creating Featured PlayList"
                }
            }
            return {
                code : responseCode.SUCCESS,
                keyword : "success", 
                data : "Featured PlayList Created Successfully"
            }
        }catch(error){
            return{
                code : OPERATION_FAILED,
                keyword : "something_went_wrong",
                data : error
            }
        }
    }
    async updateFeaturePlayList(requestData){
        try{
            const playList = {
                name : requestData.name,
                description : requestData.description,
                image : requestData.image,
                category_id : requestData.category_id
            }
            const [result] = await database.query("UPDATE tbl_featured_playlist SET ? WHERE id = ? AND is_active = 1 AND is_deleted=0", [playList, requestData.id])
            if(result.affectedRows <= 0){
                return {
                    code : OPERATION_FAILED,
                    keyword : "error_in_updating",
                    data : "Error in Updating Featured PlayList"
                }
            }
            return {
                code : responseCode.SUCCESS,
                keyword : "success", 
                data : "Featured PlayList Updated Successfully"
            }
        }catch(error){
            return{
                code : OPERATION_FAILED,
                keyword : "something_went_wrong",
                data : error
            }
        }
    }

    async deleteFeaturePlayList(requestData){
        try{
            const [result] = await database.query("UPDATE tbl_featured_playlist SET is_deleted=1 WHERE id = ?", [requestData.id])
            if(result.affectedRows <= 0){
                return {
                    code : OPERATION_FAILED,
                    keyword : "error_in_deleting",
                    data : "Error in Deleting Featured PlayList"
                }
            }
            return {
                code : responseCode.SUCCESS,
                keyword : "success", 
                data : "Featured PlayList Deleted Successfully"
            }
        }catch(error){
            return{
                code : OPERATION_FAILED,
                keyword : "something_went_wrong",
                data : error
            }
        }
    }

    async addSongFeaturedPlaylist(requestData){
        try{
            console.log("Request Data : ",requestData)
            const addSong = {
                song_id : requestData.song_id,
                featured_id : requestData.playList_id
            }
            const [valid] = await database.query("SELECT * FROM tbl_featured_playlist_song WHERE featured_id = ? AND song_id = ? AND is_active = 1 AND is_deleted=0",[addSong.featured_id,addSong.song_id])
            if(valid.length>0){
                return {
                    code : responseCode.REQUEST_ERROR,
                    keyword : "alerady song Added !",
                    data : "Song Already Added !"
                }
            }
            const [result] = await database.query("INSERT INTO tbl_featured_playlist_song SET ?",addSong)
            if(result.affectedRows<=0){
                return{
                    code : OPERATION_FAILED,
                    keyword : "error_in_inserting",
                    data : "Error in Inserting !"
                }
            }
            return {
                code : responseCode.SUCCESS,
                keyword : "success",
                data : "Featured PlayList Created !"
            }
        }catch(error){
            return{
                code : OPERATION_FAILED,
                keyword : "something_went_wrong",
                data : error
            }
        }
    }

    async getAllFeaturedplayList(requestData){
        try{
            let query = "SELECT f.*, c.name as category_name,(SELECT COUNT(*) FROM tbl_featured_playlist_song as fs WHERE fs.is_active = 1 AND fs.is_deleted = 0 AND fs.featured_id = f.id) as songs FROM tbl_featured_playlist as f JOIN tbl_category as c ON c.id = f.category_id WHERE f.is_active = 1 AND f.is_deleted = 0"
            
            if(requestData.id) {
                query += ` AND f.id = ${requestData.id}`
            }
            query += " ORDER BY f.id DESC"
            
            const [result] = await database.query(query)
            if(result.length<=0){
                return {
                    code : responseCode.NO_DATA_FOUND,
                    keyword : "error_in_fetching",
                    data : "No Data Found !"
                }
            }
            if(requestData.id){
                secondQuery = `
                    SELECT s.*, s.id as id  FROM tbl_featured_playlist_song as fs 
                    JOIN tbl_song as s ON s.id = fs.song_id
                    WHERE fs.featured_id = ? AND fs.is_active = 1 AND fs.is_deleted = 0 AND fs.is_active = 1 AND s.is_deleted = 0
                `
                const [songs] = await database.query(secondQuery,[requestData.id])
                console.log("Song In This PlayList : ",songs)
                songs.length>=0 ? result[0].song = songs : result[0].song = "No Song There ! Empty Featured Play List"
                for(let i=0;i<result.length;i++){
                    const [artist] = await database.query(`SELECT a.* FROM tbl_artist as a JOIN tbl_artist_songs as artsng ON artsng.id = a.id WHERE a.is_active = 1 AND a.is_deleted = 0 AND artsng.is_active AND artsng.is_deleted = 0 AND artsng.song_id = ?`,result[i].id)
                    if(artist.length>0){
                        result[i].artistDetails = artist.length == 1 ? artist[0] : artist
                    }
                }
            }
            return {
                code : responseCode.SUCCESS,
                keyword : "success",
                data : result.length == 1 ? result[0] : result
            }
        }catch(error){
            return{
                code : OPERATION_FAILED,
                keyword : "something_went_wrong",
                data : error
            }
        }
    }

    async deleteSongFromFeaturedPlaylist(requestData) {
        try {
            // Check if the song exists in the featured playlist
            const [check] = await database.query(
                "SELECT * FROM tbl_featured_playlist_song WHERE featured_id = ? AND song_id = ? AND is_active = 1 AND is_deleted = 0",
                [requestData.featured_id, requestData.song_id]
            );

            if (check.length <= 0) {
                return {
                    code: responseCode.NO_DATA_FOUND,
                    keyword: "not_found",
                    data: "Song not found in this featured playlist"
                }
            }

            // Soft delete the song from featured playlist
            const [result] = await database.query(
                "UPDATE tbl_featured_playlist_song SET is_deleted = 1 WHERE featured_id = ? AND song_id = ?",
                [requestData.featured_id, requestData.song_id]
            );

            if (result.affectedRows <= 0) {
                return {
                    code: responseCode.OPERATION_FAILED,
                    keyword: "delete_failed",
                    data: "Failed to remove song from featured playlist"
                }
            }

            return {
                code: responseCode.SUCCESS,
                keyword: "success",
                data: "Song removed from featured playlist successfully"
            }

        } catch (error) {
            return {
                code: responseCode.OPERATION_FAILED,
                keyword: "something_went_wrong",
                data: error
            }
        }
    }

    async activeInactiveFeaturedPlaylistSong(requestData) {
        try {
            // Check if song exists in featured playlist
            const [check] = await database.query(
                "SELECT * FROM tbl_featured_playlist_songs WHERE featured_id = ? AND song_id = ? AND is_deleted = 0",
                [requestData.featured_id, requestData.song_id]
            );

            if (check.length <= 0) {
                return {
                    code: responseCode.NO_DATA_FOUND,
                    keyword: "not_found",
                    data: "Song not found in this featured playlist"
                }
            }

            // Toggle is_active status
            const newStatus = check[0].is_active === 1 ? 0 : 1;
            const [result] = await database.query(
                "UPDATE tbl_featured_playlist_songs SET is_active = ? WHERE featured_id = ? AND song_id = ?",
                [newStatus, requestData.featured_id, requestData.song_id]
            );

            if (result.affectedRows <= 0) {
                return {
                    code: responseCode.OPERATION_FAILED,
                    keyword: "update_failed",
                    data: "Failed to update song status in featured playlist"
                }
            }

            const statusMessage = newStatus === 1 ? "activated" : "deactivated";
            return {
                code: responseCode.SUCCESS,
                keyword: "success",
                data: `Song ${statusMessage} in featured playlist successfully`
            }

        } catch (error) {
            return {
                code: responseCode.OPERATION_FAILED,
                keyword: "something_went_wrong",
                data: error
            }
        }
    }
}

module.exports = new adminModel()