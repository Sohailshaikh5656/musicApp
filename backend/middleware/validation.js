const { t, default: localizify } = require('localizify');

const jwt = require("jsonwebtoken")
const { response } = require('express');
const responseCode = require("../utilities/responseCode")
let bypassMethods = ["signup","signin","login","verifyOTP","resendOTP","forgetPassword","resetPassword","adminLogin","tokenCheck","upload-profile","checkMail"];
const database = require("../configure/database");
// const common = require('../utilities/common');
let en = require("../language/en");
let ar = require("../language/ar");
require("dotenv").config()
const { encryptPlain, decryptPlain } = require('../utilities/encryption');
let middleware = {
    
    // checkValidationRules: function (req, res, request, rules, message, keywords) {
    //     const v = Validator.make(request, rules, message, keywords);
    //     if (v.fails()) {
    //         const errors = v.getErrors();  // Fetch all errors correctly
    //         console.log("Validation Errors:", errors);
    
    //         let errorMessage = Object.values(errors)[0][0]; //  Extract first error
    
    //         res.send(common.encrypt({  //  Send response
    //             code: 0,
    //             message: errorMessage
    //         }));
    
    //         return false;  //  Stop execution
    //     }
    
    //     return true;
    // },        

    sendResponse : function(req,res,message){
        
        this.getMessage(req.language, { keyword: message.keyword, content : message.content }, (translatedMessage) => {
            console.log(translatedMessage);
            let responseData = {  
                code: message.code,
                message: translatedMessage, 
                data: message.data ?? null,  
            };

            res.send(responseData)
        })
    },

    getMessage : function(language,message,callback){
        localizify
        .add('en',en)
        .add('ar',ar)
        .setLocale(language);
        console.log(message);
        

        if (typeof message === "string") {
            message = { keyword: message };
        }
        let translatedMessage = t(message.keyword || message.keywords || "default_fallback_message");
        

        if (message.content) {
            Object.keys(message.content).forEach(key => {
                translatedMessage = translatedMessage.replace(`{ ${key} }`, message.content[key]);
            });
        }
        


        callback(translatedMessage);
    },
    extractHeaderLanguage: function (req, res, next) {
        let headerlang = req.headers['accept-language'] && req.headers['accept-language'] !== "" 
            ? req.headers['accept-language'] 
            : 'en';
    
        req.lang = headerlang;
        req.language = headerlang === 'en' ? en : ar;
    
        localizify
            .add('en', en)
            .add('ar', ar)
            .setLocale(req.lang);
    
        next(); // Ensure it proceeds to the next middleware
    },

    validateApiKey : function(req,res,callback){
        let pathData = req.path.split("/");
        if(pathData[1] === "uploads"){
            return callback()
        }
        let api_key = (req.headers['api_key'] != undefined && req.headers['api_key'] != "") ? req.headers["api_key"] : '';
        if(api_key != ""){
            try{
                // api_key = await decryptPlan(api_key)
                console.log("ENV API KEY : ",process.env.api_key)
                console.log("Header API KEY : ",decryptPlain(api_key))
                if(api_key != "" && decryptPlain(api_key) == process.env.API_KEY){
                    callback()
                }else{
                    let responseData = {
                        code : responseCode.OPERATION_FAILED,
                        keyword : "Invalid_Api_Key"
                    }

                    res.status(401)
                    middleware.sendResponse(req,res,responseData)
                }
            }catch(error){
                let responseData = {
                    code : responseCode.OPERATION_FAILED,
                    keyword : "Invalid_Api_Key"
                }

                middleware.sendResponse(req,res,responseData)
            }
        }else{
            let responseData = {
                code : responseCode.OPERATION_FAILED,
                keyword : "Invalid_Api_Key"
            }

            middleware.sendResponse(req,res,responseData)
        }
    },
    validateHeaderToken: function (req, res, callback) {
        let headerToken = req.headers['jwt_token'] && req.headers['jwt_token'] !== "" ? req.headers['jwt_token'] : '';
        let pathData = req.path.split("/");
        if (pathData[1] === "uploads") {
            return callback();
        }
        else if (bypassMethods.indexOf(pathData[3]) === -1 && pathData[1] !== "uploads") {
            if (headerToken !== "") {
                try {
                    console.log("Header token : ",headerToken)
                    // ✅ STEP 1: Verify the JWT
                    const decoded = jwt.verify(headerToken, process.env.SECRET_KEY);

                    console.log("Decoded : ",decoded)
                    // ✅ STEP 2: Decrypt the ID inside payload
                    const decryptedId = decoded.user_id
                    console.log("Decrypted ID:", decryptedId);
    
                    // ✅ STEP 3: Route-based identity check
                    if (pathData[2] === "user") {
                        req.user_id = decryptedId;
                        callback();
                    } else if (pathData[2] === "admin") {
                        req.admin_id = decryptedId;
                        callback();
                    } else if (pathData[2] === "driver") {
                        req.driver_id = decryptedId;
                        callback();
                    } else {
                        res.status(401);
                        return middleware.sendResponse(req, res, {
                            code: responseCode.OPERATION_FAILED,
                            keyword: "Invalid_Role"
                        });
                    }
    
                } catch (error) {
                    console.error("Token validation error:", error.message);
                    res.status(401);
                    middleware.sendResponse(req, res, {
                        code: responseCode.OPERATION_FAILED,
                        keyword: "Invalid_Token_Provided"
                    });
                }
            } else {
                res.status(401);
                middleware.sendResponse(req, res, {
                    code: responseCode.OPERATION_FAILED,
                    keyword: "Token_Missing"
                });
            }
        }
        else {
            callback();
        }
    },

    DecriptData : function(req, res, next){
        console.log("Middleware called !")
        try {
            console.log("this is Data in Middle Ware: ",req.body)
            let pass=false
            let pathData = req.path.split("/");
            if(pathData[3]=="upload-profile"){
                pass=true
            }

            if (req.body && Object.keys(req.body).length > 0 && !pass){
                let encriptedData = decryptPlain(req.body)
                req.body = JSON.parse(encriptedData)
                console.log("Decrypted data 1:", req.body)
            }
            if(req.params && Object.keys(req.params).length>0){
                let encriptData = decryptPlain(req.params)
                req.params = JSON.parse(encriptData)
                console.log("Decrypted Params : ",req.params)
            }
    
            next() // Call next to continue to the next middleware/route handler
        } catch (error) {
            console.error("Decryption error:", error)
            return res.status(400).send({ error: "Invalid encrypted data" })
        }
    },
    encriptData : function(req,res,data){
        return res.send(encryptPlain(JSON.stringify(data)));
    }
};

module.exports = middleware;
