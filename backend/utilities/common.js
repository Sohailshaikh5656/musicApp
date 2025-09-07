let database = require("../configure/database")
let responseCode = require("../utilities/responseCode")
const bcrypt = require("bcrypt")
require('dotenv').config();
const nodemailer = require('nodemailer');


class common{

    async genereateToken(){
        let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz123456789"
        let token = ''
        for(let i=0;i<20;i++){
            token = token + str[Math.floor(Math.random() * 60)];
        }
        return token
    }
    async checkUsername(username){
            let usernameQuery = "SELECT * FROM tbl_user WHERE username = ? AND is_deleted = 0"; // Check only active users
            const [res] = await database.query(usernameQuery, [username])
            if(res.length>0){
                return true
            }else{
                return false
            }
    }
    async checkEmail(email){
        let emailQuery = "SELECT * FROM tbl_user WHERE email = ? AND is_deleted = 0"; // Check only active users
        const [res] = await database.query(emailQuery, [email])
        if(res.length>0){
            return true
        }else{
            return false
        }
}
    
    async getHashedPassword(password) {
        const saltRounds = 10
        try{
            const hashedPassword = await bcrypt.hash(password,saltRounds);
            return hashedPassword
        }catch(err){
            return {
                code : responseCode.OPERATION_FAILED,
                keyword : "error in password bycrypt !",
                data : "Error in ByCrypt in Password !"
            }
        }
    }

    async comparePasswords(plainPassword, hashedPassword) {
        try {
            const match = await bcrypt.compare(plainPassword, hashedPassword);
            if (match) {
                console.log(" Password matched");
                return true;
            } else {
                console.log(" Password did not match");
                return false;
            }
        } catch (error) {
            console.error("Error during password comparison:", error);
            return false;
        }
    }
    async generateOrderNumber() {
        let DigitToken = ""; // Initialize as an empty string
        let StrToken = "";   // Initialize as an empty string
        let digits = "123456789";
        let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
        for (let i = 0; i < 10; i++) {
            DigitToken += digits[Math.floor(Math.random() * digits.length)];
        }
        for (let i = 0; i < 10; i++) {
            StrToken += str[Math.floor(Math.random() * str.length)];
        }
    
        return DigitToken + StrToken;
    }

    async getCategory(requestData){
        try{
            const [result] = await database.query("SELECT * FROM tbl_category WHERE id = ?",[requestData.id]);
            if(result.length<=0){
                return {
                    code : OPERATION_FAILED,
                    keyword : "error_in_fetching",
                    data : "Error No Category Selected !"
                }
            }
            return {
                code : responseCode.SUCCESS,
                keyword : "success",
                data : result[0]
            }
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
            let query = "SELECT * FROM tbl_category WHERE is_deleted=0";
            if(requestData.role == "user"){
                query +=`AND is_active = 1`
            }
            const [result] = await database.query(query);
            if(result.length<=0){
                return {
                    code : OPERATION_FAILED,
                    keyword : "error_in_fetching",
                    data : "Error in Fetching All Category data | No Category Selected !"
                }
            }
            return {
                code : responseCode.SUCCESS,
                keyword : "success",
                data : result
            }
        }catch(error){
            return{
                code:OPERATION_FAILED,
                keyword:"something_went_wrong",
                data:error
            }
        }
    }

    async getAllSong(requestData){
        try{
            let query = "SELECT * FROM tbl_song where is_deleted=0";
            if(requestData.role == "user"){
                query += "AND is_active=1"
            }
            const [result] = await database.query(query);
            return result
        }catch(error){
            return error
        }
    }


    async getUser(user_id){
        const [result] = await database.query("SELECT * FROM tbl_usser where id = ?",[user_id])
        return result
    }

    sendMail(subject, to_email, message, callback) {
        var transporter = nodemailer.createTransport({
            host: process.env.HOST_MAIL,
            service : "gmail",
            port: process.env.MAIL_PORT,
            secure: false, // true for 465, false for other ports                     
            auth: {
                user: process.env.MAILER_EMAIL, // generated ethereal user               
                pass: process.env.MAILER_PASSWORD // generated ethereal password           
            }
        }); // setup email data with unicode symbols        
        var mailOptions = {
            from: process.env.HOST_MAIL, // sender address     
            to: to_email, // list of receivers      
            subject: subject, // Subject line   
            html: message
        };
        // send mail with defined transport object     
        transporter.sendMail(mailOptions, (error, info) => {

            if (error) {
                //     console.log("ERROR FOUND :::::::: ++++++++++++++ ")
                console.log(error); //callback(true); 
                callback("", info);
                //callback(error, []);
            } else {
                callback("", info);
            }

        });
    }
}

module.exports = new common()