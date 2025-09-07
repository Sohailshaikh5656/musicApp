let database = require("../../../../configure/database")
const responseCode = require("../../../../utilities/responseCode");
const common = require("../../../../utilities/common");
const { OPERATION_FAILED } = require("../../../../utilities/responseCode");
const jwt = require('jsonwebtoken');
const template = require("../../../../utilities/template")

require('dotenv').config();


class userModel {
    constructor() { }

    async signup(requestData) {
        try {
            const userData = {
                name : requestData.name,
                email: requestData.email,
                login_type : requestData.loginType
            }
            const checkEmail = await common.checkEmail(requestData.email)
            console.log("this is ", checkEmail)
            if (checkEmail) {
                return {
                    code: responseCode.OPERATION_FAILED,
                    keyword: "Email Already Exits",
                    data: `Error in Inserting User | Email Already Exists Try with Another Email !`
                }
            }
            
            let a = requestData.email
            let arr = a.split("@")
            userData.username = arr[0];
            if(requestData.loginType == "S"){
                userData.password = await common.getHashedPassword(requestData.password)
            }else{
                userData.social_id = requestData.social_id
            }
            const [result] = await database.query("INSERT INTO tbl_user SET ?", userData, (error) => {
                if (error) {
                    throw new Error(`Database Error  : ${error}`)
                }
            })

            if (result.affectedRows <= 0) {
                return {
                    code: responseCode.OPERATION_FAILED,
                    keyword: "error_in_inserting",
                    data: `Error in Inserting User | No Row Affected !`
                }
            }
            let JWTToken = jwt.sign(
                { user_id: result.insertId }, process.env.SECRET_KEY, { "expiresIn": "1d" }
            )
            console.log("this is User ID", result.insertId)
            
            return {
                code: responseCode.SUCCESS,
                keyword: "success",
                data: {
                    message: "user Register Successfully !",
                    email: requestData.email,
                    jwtToken: JWTToken,
                    id: result.insertId
                }
            }
        } catch (error) {
            console.log("This is Error", error)
            return {
                code: responseCode.OPERATION_FAILED,
                keyword: "something_went_wrong",
                data: error.data || error
            }
        }
    }

    uploadProfile(req) {
        console.log("File Upload Called !")
        console.log("Filename:", req?.file)
        console.log("File Upload Called 2!")
        if (!req.file) {
            return {
                code: responseCode.OPERATION_FAILED,
                message: { keyword: 'text_upload_profile_fail', content: {} },
                data: {}
            }
        } else {
            return {
                code: responseCode.SUCCESS,
                message: { keyword: 'text_upload_profile_success', content: {} },
                data: req.file.filename
            }
        }
    }

    async signin(requestData) {
        try {
            console.log("Data : ",requestData)
            let email = requestData.email;
            let result;
            const checkEmail = await common.checkEmail(requestData.email)
            console.log("this is ", checkEmail)
            if (!checkEmail) {
                return {
                    code: responseCode.NO_DATA_FOUND,
                    keyword: "Email Not Exits",
                    data: `Error in Verfing User | Email Not Exists Try to Register !`
                }
            }
            if(requestData.loginType == "S"){
                let [res] = await database.query("SELECT * FROM tbl_user WHERE is_active=1 AND is_deleted=0 AND email = ?", [email])
                const compare = await common.comparePasswords(requestData.password, res[0].password)
                if (!compare) {
                    return {
                        code: responseCode.OPERATION_FAILED,
                        keyword: "password not matched",
                        data: "Entered a Wrong Password !"
                    }
                }
                result = res[0]

            }else{
                let [res] = await database.query("SELECT * from tbl_user WHERE is_active=1 AND is_deleted=0 AND email = ? AND social_id = ?",[email,requestData.social_id])
                if(res.length<=0){
                    return {
                        code : OPERATION_FAILED,
                        keyword : "social_id not mateched",
                        data : "Social ID not Matched Error !"
                    }
                }
                result = res[0]
            }
            
            let JWTToken = jwt.sign(
                { user_id: result.id }, process.env.SECRET_KEY, { "expiresIn": "1d" }
            )
            delete result.password
            result.msg = "User Login Successfully !"
            result.jwtToken = JWTToken
            return {
                code: responseCode.SUCCESS,
                keyword: "success",
                data: result
            }

        } catch (error) {
            console.log("Error : ", error)
            return {
                code: responseCode.OPERATION_FAILED,
                keyword: "something_went_wrong",
                data: error.data || error
            }
        }
    }
    async forgetPassword(requestData){
        try{
            console.log("Thsi is Credintaial 1 : ", requestData.emailOrUsername)
            let email = requestData.emailOrUsername;
            console.log("Thsi is Credintaial : ", email)
            const [result] = await database.query("SELECT * FROM tbl_user WHERE (email = ? OR username = ?) AND is_active = 1 AND is_deleted=0",[email,email])
            if(result.length<=0){
                return {
                    code : responseCode.NO_DATA_FOUND,
                    keyword : "no data found",
                    data : "No Register Email Found !"
                }
            }else if(result[0].login_type.toLowerCase() == "g"){
                return {
                    code : responseCode.NOT_REGISTER,
                    keyword : "no data found",
                    data : "This is Google Acoount ! Try Google Login !"
                }
            }
            const token = await common.genereateToken()
            const user_id = result[0].id
            const [tokenGenerated] = await database.query("INSERT INTO tbl_forget_password(user_id,token,expire_at) VALUES(?,?,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 5 MINUTE))",[user_id, token])
            if(tokenGenerated.affectedRows <= 0){
                return {
                    code: OPERATION_FAILED,
                    keyword: "error_in_generating_token",
                    data: "Error in generating forget password token"
                }
            }
            result[0].token = token
            common.sendMail("Change Password !",result[0].email,template.forgetPassword(result[0]))
        return {
            code: responseCode.SUCCESS,
            keyword: "success",
            data: "Password reset email sent successfully"
        }
        }catch(error){
            return {
                code : OPERATION_FAILED,
                keyword : "somethibg_went_wrong",
                data : error
            }
        }
    }

    async searchSong(requestData){
        try{
            const keyword = `%${requestData.keyword.toLowerCase()}%`
            const [result] = await database.query(`SELECT s.id as id,s.*, c.name as genere,
                (SELECT GROUP_CONCAT(art.name) FROM tbl_artist as art JOIN tbl_artist_songs as artsng ON art.id = artsng.artist_id WHERE s.id = artsng.song_id) as artist_name 
                FROM tbl_song as s
                JOIN tbl_artist_songs as ar ON ar.song_id = s.id 
                JOIN tbl_artist as a ON a.id = ar.artist_id 
                JOIN tbl_category as c ON c.id = s.category_id
                WHERE LOWER(s.title) LIKE ? OR LOWER(a.name) LIKE ? OR LOWER(s.album_name) LIKE ? OR LOWER(a.name) LIKE ?`,[keyword,keyword, keyword, keyword])
                if(result.length<=0){
                    return {
                        code : responseCode.NO_DATA_FOUND,
                        keyword : "no_data_found",
                        data : "No Song SELECTED"
                    }
                }
                const uniqueData = [];
                for(let i=0;i<result.length;i++){
                    let flag = false;
                    for(let j=0;j<uniqueData.length;j++){
                        if(result[i].id == uniqueData[j].id){
                            flag = true;
                            break
                        }
                    }
                    if(!flag){
                        uniqueData.push(result[i])
                    }
                    
                }
                return{
                    code : responseCode.SUCCESS,
                    keyword : "success",
                    data : uniqueData
                }
        }catch(error){
            return{
                code : OPERATION_FAILED,
                keyword : "something_went_wrong",
                data : error
            }
        }
    }
    async song(requestData){
        try {
            // First query to get the main song details
            console.log("USER ID : ",requestData.user_id)
            const [result] = await database.query(`
                SELECT DISTINCT s.*, a.name as artist_name, 
                (SELECT GROUP_CONCAT(art.name SEPARATOR ', ') 
                 FROM tbl_artist as art 
                 JOIN tbl_artist_songs as artsng ON artsng.artist_id = art.id 
                 WHERE artsng.song_id = s.id) as all_artist_name,
                a.bio, a.profile_picture, c.name as genre,
                 CASE 
                    WHEN EXISTS(SELECT 1 FROM tbl_likes WHERE user_id = ? AND song_id = ?) THEN "LIKED"
                    ELSE "NOTLIKED"
                END as LIKESTATUS
                FROM tbl_song s
                JOIN tbl_artist_songs ar ON ar.song_id = s.id
                JOIN tbl_artist a ON a.id = ar.artist_id
                JOIN tbl_category c ON c.id = s.category_id
                WHERE s.id = ? AND s.is_deleted = 0 AND s.is_active = 1
            `, [requestData.user_id, requestData.id,requestData.id]);

            if (!result || result.length === 0) {
                return {
                    code: responseCode.NO_DATA_FOUND,
                    keyword: "no_data_found",
                    data: "No Song Found with the Given ID"
                };
            }
            console.log()
            const song = result[0];
            console.log("This is Song Data : ",song)
            // Second query to get related songs
            const [relatedSongs] = await database.query(`
                SELECT DISTINCT s.id, s.*, 
                (SELECT GROUP_CONCAT(art.name SEPARATOR ', ') 
                 FROM tbl_artist as art 
                 JOIN tbl_artist_songs as artsng ON artsng.artist_id = art.id 
                 WHERE artsng.song_id = s.id) as artist_name, 
                a.bio, a.profile_picture, c.name as genre,
                CASE 
                    WHEN EXISTS(SELECT 1 FROM tbl_likes WHERE user_id = ? AND song_id = ?) THEN "LIKED"
                    ELSE "NOTLIKED"
                END as LIKESTATUS
                FROM tbl_song s
                JOIN tbl_artist_songs ar ON ar.song_id = s.id
                JOIN tbl_artist a ON a.id = ar.artist_id
                JOIN tbl_category c ON c.id = s.category_id
                WHERE s.is_deleted = 0 AND s.is_active = 1 
                AND (a.name = ? OR c.name = ?)
            `, [requestData.user_id, requestData.id,song.artist_name, song.genre]);
            
            console.log("This is Next Song Data : ",relatedSongs)
            // Combine results with main song first
            let data = [song, ...relatedSongs];
            let uniqueSongs = [];
            for (let i = 0; i < data.length; i++) {
                let isDuplicate = false;
                for (let k = 0; k < uniqueSongs.length; k++) {
                    if (data[i].id === uniqueSongs[k].id) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    uniqueSongs.push(data[i]);
                }
            }

            return {
                code: responseCode.SUCCESS,
                keyword: "success",
                data: uniqueSongs
            };

        } catch (error) {
            console.error("Error in song model:", error);
            return {
                code: responseCode.OPERATION_FAILED,
                keyword: "something_went_wrong",
                data: error.message || error
            };
        }
    }

    async checkMail(requestData){
        const checkEmail = await common.checkEmail(requestData.email)
            console.log("this is ", checkEmail)
            if (checkEmail) {
                return {
                    code: responseCode.SUCCESS,
                    keyword: "Email Already Exits",
                    data: `Email Already Exists Try with Another Email !!!`
                }
            }else{
                return {
                    code: responseCode.OPERATION_FAILED,
                    keyword: "Email Not Exits",
                    data: `Email Not Exists !`
                }
            }

    }

    async artist(requestData){
        try{
            const [isArtist] = await database.query('SELECT * FROM tbl_artist WHERE is_active = 1 AND is_deleted=0 AND name = ?',[requestData.name]);
            if(isArtist.length > 0){
                return {
                    code : OPERATION_FAILED,
                    keyword : "Already Exists",
                    data : "Artist Already Exists"
                }
            }
            const [result] = await database.query(`INSERT INTO tbl_artist SET ?`,requestData)
            if(result.affectedRows<=0){
                return {
                    code : responseCode.OPERATION_FAILED,
                    keyword : "error_in_inserting",
                    data : "Error in Inserting | 0 Row Affected !"
                }
            }
            return {
                code : responseCode.SUCCESS,
                keyword : "success",
                data : "New Artist Added !"
            }
        }catch(error){
            return {
                code : OPERATION_FAILED,
                keyword : "something went wrong",
                data : error.data || error
            }
        }
    }

    async likeStateManage(requestData) {
        try {
            if (requestData.state == "unlike") {
                let [response] = await database.query("DELETE FROM tbl_likes WHERE song_id = ? AND user_id = ?", [requestData.song_id, requestData.user_id])
                if (response.affectedRows <= 0) {
                    return {
                        code: responseCode.OPERATION_FAILED,
                        keyword: "error_in_deleting",
                        data: "Error in Remove Likes From Post"
                    }
                }
            } else {
                let likeData = {
                    song_id: requestData.song_id,
                    user_id: requestData.user_id
                }
                let [response] = await database.query(`INSERT INTO tbl_likes SET ?`, likeData)
                if (response.affectedRows <= 0) {
                    return {
                        code: responseCode.OPERATION_FAILED,
                        keyword: "error_in_inserting",
                        data: "Error in Liking Post"
                    }
                }
            }

            const [result] = await database.query(`UPDATE tbl_song SET total_likes = (SELECT COUNT(*) FROM tbl_likes WHERE song_id = ?) WHERE id = ?`, [requestData.song_id, requestData.song_id])
            if (result.affectedRows <= 0) {
                return {
                    code: responseCode.OPERATION_FAILED,
                    keyword: "error_in_updating",
                    data: "Error in Updating The Total Post Likes"
                }
            }

            return {
                code: responseCode.SUCCESS,
                keyword: "success",
                data: "Like Status Changed"
            }
        } catch (error) {
            console.log("Error : ", error)
            return {
                code: responseCode.OPERATION_FAILED,
                keyword: "something_went_wrong",
                data: error?.data || error
            }
        }
    }
    async playCount(requestData){
        try{
            console.log("ID : ",requestData)
            const [result] = await database.query(`
                    UPDATE tbl_song SET play_count = play_count+1 WHERE id = ?
                `,[requestData.id])
            if(result.affectedRows<=0){
                return{
                    code : OPERATION_FAILED,
                    keyword : "error_in_updating_countplay",
                    data : "Error in Updating Count Play !"
                }
            }
            return {
                code : responseCode.SUCCESS,
                keyword : "success",
                data : "Count Updated !"
            }
        }catch(error){
            return{
                code : OPERATION_FAILED,
                keyword : "something_went_wrong",
                data : error
            }
        }
    }
    async newPost(requestData) {
        try {
            let newPostData = {
                title: requestData.title,
                description: requestData.description,
                image: requestData.image,
                user_id: requestData.user_id
            }

            const [result] = await database.query("INSERT INTO tbl_post SET ?", newPostData)
            if (result.affectedRows <= 0) {
                return {
                    code: responseCode.OPERATION_FAILED,
                    keyword: "error_in_insertion",
                    data: "Error in Insertion"
                }
            }
            return {
                code: responseCode.SUCCESS,
                keyword: "post_created",
                data: "Post Created Successfully"
            }
        } catch (error) {
            console.log("Error : ", error)
            return {
                code: responseCode.OPERATION_FAILED,
                keyword: "something_went_wrong",
                data: error.data || error
            }
        }
    }

    async postComment(requestData) {
        try {
            const comment = {
                song_id: requestData.song_id,
                user_id: requestData.user_id,
                message: requestData.message
            }
            const [result] = await database.query("INSERT INTO tbl_comments SET ?", comment)

            if (result.affectedRows <= 0) {
                return {
                    code: responseCode.OPERATION_FAILED,
                    keyword: "error_in_insertion",
                    data: "Error in posting comment"
                }
            }

            const [calculateComments] = await database.query("UPDATE tbl_song SET total_comments = (SELECT COUNT(*) FROM tbl_comments WHERE song_id = ?) WHERE id = ?", [requestData.song_id, requestData.song_id])
            if (calculateComments.affectedRows <= 0) {
                return {
                    code: responseCode.OPERATION_FAILED,
                    keyword: "error_in_updating_comment_count",
                    data: "Error in updating comment count"
                }
            }
            return {
                code: responseCode.SUCCESS,
                keyword: "comment_posted",
                data: "Comment posted successfully"
            }
        } catch (error) {
            console.log("Error : ", error)
            return {
                code: responseCode.OPERATION_FAILED,
                keyword: "something_went_wrong",
                data: error.data || error
            }
        }
    }

    async fetchComments(requestData) {
        try {
            console.log("ID : ",requestData)
            const [result] = await database.query(
                `SELECT c.*,
                DATE_FORMAT(c.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
                CASE 
                    WHEN TIMESTAMPDIFF(MINUTE, c.created_at, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, c.created_at, NOW()), ' minutes ago')
                    WHEN TIMESTAMPDIFF(HOUR, c.created_at, NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, c.created_at, NOW()), ' hours ago')
                    WHEN TIMESTAMPDIFF(DAY, c.created_at, NOW()) < 30 THEN CONCAT(TIMESTAMPDIFF(DAY, c.created_at, NOW()), ' days ago')
                    ELSE CONCAT(TIMESTAMPDIFF(MONTH, c.created_at, NOW()), ' months ago')
                END AS comment_time,
                u.username FROM tbl_comments as c
                JOIN tbl_user u ON c.user_id = u.id 
                WHERE c.song_id = ? AND c.is_active=1 AND c.is_deleted=0 ORDER BY c.id DESC`,
                [requestData.id]
            );
            if (result.length <= 0) {
                return {
                    code: responseCode.OPERATION_FAILED,
                    keyword: "no_comments",
                    data: "No Comments Found"
                }
            }
            console.log(result)
            return {
                code: responseCode.SUCCESS,
                keyword: "comments_fetched",
                data: result
            }
        } catch (error) {
            console.log("Error : ", error)
            return {
                code: responseCode.OPERATION_FAILED,
                keyword: "something_went_wrong",
                data: error.data || error
            }
        }
    }

    async newPlayList(requestData){
        try{
            const playListData = {
                title : requestData.name,
                image : requestData.image,
                user_id : requestData.user_id
            }

            const [result] = await database.query(`INSERT INTO tbl_playlist SET ?`,playListData)
            if(result.affectedRows<=0){
                return {
                    code : OPERATION_FAILED,
                    keyword : "error_in_inserting",
                    data : "Error in Creating a New PlayList"
                }
            }
            return {
                code : responseCode.SUCCESS,
                keyword : "success",
                data : "New PlayList Created !"
            }
        }catch(error){
            return {
                code : OPERATION_FAILED,
                keyword : "something_went_wrong",
                data : error
            }
        }
    }

    async myPostListing(requestData) {
        try {
            const [result] = await database.query(`SELECT p.*,
            CASE 
            WHEN EXISTS(SELECT 1 FROM tbl_likes WHERE user_id = ? AND post_id = p.id AND is_deleted=0 AND is_active=1) THEN "LIKED"
            ELSE "NOTLIKED"
            END as LIKESTATUS
            FROM tbl_post as p WHERE p.is_active = 1 AND p.is_deleted=0 AND p.user_id=?`, [requestData.user_id, requestData.user_id])
            if (result.length <= 0) {
                return {
                    code: responseCode.NO_DATA_FOUND,
                    keyword: "no_post",
                    data: "No Post There"
                }
            }
            return {
                code: responseCode.SUCCESS,
                keyword: "post_fetched",
                data: result
            }
        } catch (error) {
            console.log("Error : ", error)
            return {
                code: responseCode.OPERATION_FAILED,
                keyword: "something_went_wrong",
                data: error.data || error
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

    async addPlayListSong(requestData){
        try{
            console.log("############################# This Function Called !")
            const playListData = {
                song_id : requestData.song_id,
                playlist_id : requestData.playlist_id
            }
            const [checkSong] = await database.query("SELECT * FROM tbl_playlist_song WHERE playlist_id = ? AND song_id = ? AND is_active=1 AND is_deleted=0",[requestData.playlist_id, requestData.song_id])
            if(checkSong.length>0){
                return{
                    code : responseCode.REQUEST_ERROR,
                    keyword : "song already added !",
                    data : "This song is already in the playlist"
                }
            }
            const [result] = await database.query(
                `INSERT INTO tbl_playlist_song SET ?`,playListData
            )
            if(result.affectedRows<=0){
                return{
                    code : OPERATION_FAILED,
                    keyword : "error_in_inserting",
                    data : "Error in Insrting || Not Added into Playlist"
                }
            }
            return {
                code : responseCode.SUCCESS,
                keyword : "success",
                data : "Successfully Song Added to Play List"
            }
        }catch(error){
            return{
                code : OPERATION_FAILED,
                keyword : "something_went_wrong",
                data : error
            }
        }
    }

    async getFeaturedPlayList(requestData){
        try{
            let query = "SELECT f.*, (SELECT COUNT(*) FROM tbl_featured_playlist_song as fs WHERE fs.is_active = 1 AND fs.is_deleted = 0 AND fs.featured_id = f.id) as songs FROM tbl_featured_playlist as f WHERE f.is_active = 1 AND f.is_deleted=0"
            if(requestData.id) query+= `AND f.id = ${requestData.id}`
            query += `ORDER BY f.id DESC`
            const [result] = await database.query(query)
            if(result.length<=0){
                return{
                    code : responseCode.NO_DATA_FOUND,
                    keyword : "no_data_found",
                    data : "No Featured Playlist Found !"
                }
            }
            return {
                code : responseCode.SUCCESS,
                keyword : "success",
                data : result.length == 1?result[0]:result
            }
        }catch(error){
            return{
                code : OPERATION_FAILED,
                keyword : "soemthing_went_wrong",
                data: error
            }
        }
    }

    async homePage(requestData){
        try{
            let result = {}
            // const featuredPlaylist = await this.getFeaturedPlayList({})
            // if(featuredPlaylist.code == 1){
            //     result.featuredPlaylist = featuredPlaylist
            // }
            const [topChart] = await database.query("SELECT * FROM tbl_song WHERE is_active = 1 AND is_deleted = 0 ORDER BY play_count")
            if(topChart.length > 0) {
                result.topChart = topChart
            }
            const [genere] = await database.query("SELECT * FROM tbl_category WHERE is_active = 1 AND is_deleted = 0")
            if(genere.length>0){
                result.genere = genere
            }
            const [mood] = await database.query("SELECT distinct mood FROM tbl_song WHERE is_active = 1 AND is_deleted = 0")
            if(mood.length>0){
                result.mood = mood
            }
            return {
                code: responseCode.SUCCESS,
                keyword: "success",
                data: result
            }
        }catch(error){
            return {
                code: OPERATION_FAILED,
                keyword: "something_went_wrong",
                data: error
            }
        }
    }

    //##################################
    async getAllPosts(requestData) {
        try {
            const [result] = await database.query(`
            SELECT p.*,(SELECT username FROM tbl_user WHERE id = p.user_id) as username,
                    CASE 
                        WHEN EXISTS(
                            SELECT 1 
                            FROM tbl_likes 
                            WHERE user_id = ? 
                                AND post_id = p.id 
                                AND is_deleted = 0 
                                AND is_active = 1
                        ) THEN "LIKED"
                        ELSE "NOTLIKED"
                    END as LIKESTATUS
                FROM tbl_post as p
                WHERE p.user_id IN (
                    SELECT f.user_id 
                    FROM tbl_followers as f
                    JOIN tbl_user as u ON u.id = f.user_id
                    WHERE f.follow_id = ?
                        AND u.privacy NOT IN ("private")
                )
                AND p.is_active = 1
                AND p.is_deleted = 0 ORDER BY p.id DESC;
            `, [requestData.user_id, requestData.user_id])
            if (result.length <= 0) {
                return {
                    code: responseCode.NO_DATA_FOUND,
                    keyword: "no_post",
                    data: "No Post There !"
                }
            }
            return {
                code: responseCode.SUCCESS,
                keyword: "post_fetched",
                data: result
            }
        } catch (error) {
            console.log("Error : ", error)
            return {
                code: responseCode.OPERATION_FAILED,
                keyword: "something_went_wrong",
                data: error.data || error
            }
        }
    }
    async getAllUsers(requestData) {
        try {
            const [result] = await database.query(
                "SELECT id, username, avtar, name FROM tbl_user WHERE is_active=1 AND is_deleted=0 AND id NOT IN (?)",
                [[requestData.user_id]]  // Note the double array for single value
            );
            if (result.length <= 0) {
                return {
                    code: responseCode.NO_DATA_FOUND,
                    keyword: "error_in_fetching",
                    data: "No User Found !"
                }
            }
            return {
                code: responseCode.SUCCESS,
                keyword: "success",
                data: result
            }
        } catch (error) {
            console.log("Error : ", error)
            return {
                code: responseCode.OPERATION_FAILED,
                keyword: "something_went_wrong",
                data: error.data || error
            }
        }
    }
    
    async updateProfile(requestData) {
        try {
            const userData = {
                username: requestData.username,
                name: requestData.name,
                email: requestData.email,
                bio: requestData.bio,
                privacy: requestData.privacy
            }
            if (requestData.avatar && typeof requestData.avatar === 'string' && requestData.avatar.trim() !== "" && requestData.avatar !== "[object Object]") {
                userData.avtar = requestData.avatar;
            }
            const [result] = await database.query("UPDATE tbl_user SET ? WHERE id = ? AND is_active=1 AND is_deleted=0", [userData, requestData.user_id])
            if (result.affectedRows <= 0) {
                return {
                    code: responseCode.OPERATION_FAILED,
                    keyword: "error_in_updating",
                    data: "Failed to Update Profile"
                }
            }
            return {
                code: responseCode.SUCCESS,
                keyword: "success",
                data: "Profile Updated Successfully !"
            }
        } catch (error) {
            console.log("Error : ", error)
            return {
                code: responseCode.OPERATION_FAILED,
                keyword: "something_went_wrong",
                data: error?.data || error
            }
        }
    }

    async getProfile(requestData) {
        try {
            const [result] = await database.query("SELECT *, (SELECT COUNT(*) FROM tbl_post as p WHERE p.is_active=1 AND p.is_deleted=0 AND p.user_id = u.id) as posts FROM tbl_user as u WHERE u.id = ? AND u.is_active=1 AND u.is_deleted = 0", [requestData.user_id])
            if (result.length <= 0) {
                return {
                    code: responseCode.NO_DATA_FOUND,
                    keyword: "error_in_fetching",
                    data: "Error | No User Found !"
                }
            }
            // console.log("This is User :",result[0])
            delete result[0].password
            return {
                code: responseCode.SUCCESS,
                keyword: "success",
                data: result[0]
            }
        } catch (error) {
            console.log("Error : ", error)
            return {
                code: responseCode.OPERATION_FAILED,
                keyword: "something_went_wrong",
                data: error?.data || error
            }
        }
    }

    async getOtherProfile(requestData) {
        try {
            requestData.id = parseInt(requestData.id.toString().replace(/"/g, ''));
            const [result] = await database.query(`SELECT * , 
                CASE 
                    WHEN EXISTS(SELECT 1 FROM tbl_followers WHERE user_id = ? AND follow_id = ?) THEN "FOLLOWED"
                    ELSE "NOTFOLLOWED"
                END as FOLLOWMARK
                FROM tbl_user WHERE id = ? AND is_active=1 AND is_deleted=0`, [requestData.id, requestData.user_id, requestData.id])

            if (result.length <= 0) {
                return {
                    code: responseCode.NO_DATA_FOUND,
                    keyword: "error_in_fetching",
                    data: "Error | No User Found !"
                }
            }

            delete result[0].password
            return {
                code: responseCode.SUCCESS,
                keyword: "success",
                data: result[0]
            }
        } catch (error) {
            console.log("Error : ", error)
            return {
                code: responseCode.OPERATION_FAILED,
                keyword: "something_went_wrong",
                data: error?.data || error
            }
        }
    }


    async getOtherPost(requestData) {
        try {
            requestData.id = parseInt(requestData.id.toString().replace(/"/g, ''));
            const [isRestricted] = await database.query(`SELECT privacy FROM tbl_user WHERE id = ?`, [requestData.id])
            if (isRestricted[0].privacy == "follower") {
                const [checkFollower] = await database.query("SELECT follow_id FROM tbl_followers WHERE user_id = ? AND follow_id = ?", [requestData.id, requestData.user_id])
                if (checkFollower.length <= 0) {
                    return {
                        code: responseCode.NO_DATA_FOUND,
                        keyword: "restricetd",
                        data: "Private Account"
                    }
                }
            } else if (isRestricted[0].privacy == "private") {
                return {
                    code: responseCode.NO_DATA_FOUND,
                    keyword: "restricetd",
                    data: "Private Account"
                }
            }
            const [result] = await database.query(`SELECT *, CASE 
                WHEN EXISTS(SELECT 1 FROM tbl_likes WHERE user_id = ? AND post_id = p.id AND is_deleted=0 AND is_active=1) THEN "LIKED"
                ELSE "NOTLIKED"
                END as LIKESTATUS FROM tbl_post as p WHERE is_active = 1 AND is_deleted=0 AND user_id=?`, [requestData.user_id, requestData.id])
            if (result.length <= 0) {
                return {
                    code: responseCode.OPERATION_FAILED,
                    keyword: "no_post",
                    data: "No Post There"
                }
            }
            return {
                code: responseCode.SUCCESS,
                keyword: "post_fetched",
                data: result
            }
        } catch (error) {
            console.log("Error : ", error)
            return {
                code: responseCode.OPERATION_FAILED,
                keyword: "something_went_wrong",
                data: error?.data || error
            }
        }
    }

    async followStateManage(requestData) {
        try {
            console.log("This is Request Data", requestData)
            if (requestData.status == "unfollow") {
                const [response] = await database.query("DELETE FROM tbl_followers WHERE user_id = ? AND follow_id = ?", [requestData.id, requestData.user_id])
                if (response.affectedRows <= 0) {
                    return {
                        code: responseCode.OPERATION_FAILED,
                        keyword: "error_in_deleting",
                        data: "Error in Unfollowing User"
                    }
                }
            } else {
                const data = {
                    user_id: requestData.id,
                    follow_id: requestData.user_id
                }
                const [response] = await database.query("INSERT INTO tbl_followers SET ? ", data)
                if (response.affectedRows <= 0) {
                    return {
                        code: responseCode.OPERATION_FAILED,
                        keyword: "error_in_inserting",
                        data: "Error in Following User"
                    }
                }
            }
            const [followerCount] = await database.query(`UPDATE tbl_user SET followers = (SELECT COUNT(*) FROM tbl_followers WHERE user_id = ?) WHERE id = ? `, [requestData.id, requestData.id])
            const [followingCount] = await database.query(`UPDATE tbl_user SET following = (SELECT COUNT(*) FROM tbl_followers WHERE follow_id = ?) WHERE id = ? `, [requestData.user_id, requestData.user_id])
            if (followerCount.affectedRows <= 0 && followingCount.affectedRows <= 0) {
                return {
                    code: responseCode.OPERATION_FAILED,
                    keyword: "error_in_updating",
                    data: "Error in Managing Follower and Following"
                }
            }
            return {
                code: responseCode.SUCCESS,
                keyword: "success",
                data: "State Changed !"
            }
        } catch (error) {
            console.log("Error : ", error)
            return {
                code: responseCode.OPERATION_FAILED,
                keyword: "something_went_wrong",
                data: error?.data || error
            }
        }
    }
    async getSongFromFeaturedList(requestData){
        try{
            const [result] = await database.query(
                `SELECT f.*, c.name as category_name 
                FROM tbl_featured_playlist as f 
                JOIN tbl_category as c ON c.id = f.category_id 
                WHERE f.is_active = 1 AND f.is_deleted = 0 
                AND c.is_active = 1 AND c.is_deleted = 0 
                AND f.id = ?`, 
                [requestData.id]
            );
            
            if(result.length <= 0){
                return {
                    code: responseCode.NO_DATA_FOUND,
                    keyword: "no_data_found",
                    data: "No Featured Playlist Found!"
                }
            }
            
            const [songs] = await database.query(
                `SELECT DISTINCT s.*, a.name as artist_name, 
                (SELECT GROUP_CONCAT(art.name SEPARATOR ', ') 
                 FROM tbl_artist as art 
                 JOIN tbl_artist_songs as artsng ON artsng.artist_id = art.id 
                 WHERE artsng.song_id = s.id) as all_artist_name,
                a.bio, a.profile_picture, c.name as genre, fs.featured_id,
                 CASE 
                    WHEN EXISTS(SELECT 1 FROM tbl_likes WHERE user_id = ? AND song_id = s.id) THEN "LIKED"
                    ELSE "NOTLIKED"
                END as LIKESTATUS
                FROM tbl_song s
                JOIN tbl_artist_songs ar ON ar.song_id = s.id
                JOIN tbl_artist a ON a.id = ar.artist_id
                JOIN tbl_category c ON c.id = s.category_id
                JOIN tbl_featured_playlist_song fs ON fs.song_id = s.id
                WHERE s.is_deleted = 0 AND s.is_active = 1 AND fs.featured_id = ?`, 
                [requestData.user_id, requestData.id]
            );
            
            if(songs.length <= 0){
                return {
                    code: responseCode.NO_DATA_FOUND,
                    keyword: "no_songs_found",
                    data: "No Songs Found in This Playlist"
                }
            }
            
            result[0].songs = songs;
            return {
                code: responseCode.SUCCESS,
                keyword: "success",
                data: result[0]
            }
        }catch(error){
            return{
                code : OPERATION_FAILED,
                keyword : "something_went_wrong",
                data : error
            }
        }
    }

}

module.exports = new userModel()