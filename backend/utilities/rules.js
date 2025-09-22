const Joi = require("joi")
const { artist } = require("../modules/v1/user/model/userModel")

const newUser = Joi.object({
    email: Joi.string().email().required(),
    loginType: Joi.string().required(),
    name : Joi.string().required(),
    password : Joi.string(),
    social_id : Joi.string()
})

const validateUser = Joi.object({
    email : Joi.string().email().required(),
    password : Joi.string(),
    social_id : Joi.string(),
    loginType: Joi.string().required()
})

const newPost = Joi.object({
    image : Joi.string().required(),
    title : Joi.string().required(),
    description : Joi.string().required()
})


const updateProfile = Joi.object({
    first_name : Joi.string().min(3).required(),
    last_name : Joi.string().min(3).required(),
    profile_picture : Joi.string().min(3).required(),
    
})

const postComment = Joi.object({
    message: Joi.string().min(1).required(),
    song_id: Joi.number().required()
})

const newArtist = Joi.object({
    name : Joi.string().min(3).required(),
    bio : Joi.string().min(8).required(),
    profile_picture:Joi.string().required()
})
const featuredPlaylistValidation = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().min(10).required(),
    image: Joi.string().required(),
    category_id: Joi.number().required()
})
const updatefeaturedPlaylistValidation = Joi.object({
    id:Joi.number().required(),
    name: Joi.string().min(3).required(),
    description: Joi.string().min(10).required(),
    image: Joi.string().required(),
    category_id: Joi.number().required()
})







//####################################################

//admin Rules


const adminValidation = Joi.object({
    email : Joi.string().email().required(),
    password : Joi.string().required()
})

const artistValidation  = Joi.object({
    name : Joi.string().required(),
    bio : Joi.string().required(),
    profile_picture :Joi.string().required()
})

const updateUserRule = Joi.object({
    name : Joi.string().required(),
    email : Joi.string().required(),
    username : Joi.string().required()
})


const updateArtistRule = Joi.object({
    name: Joi.string().min(3).required(),
    bio: Joi.string().min(8).required(),
    profile_picture: Joi.string().optional(),
    id: Joi.number().required()
})

const validateCategory = Joi.object({
    name: Joi.string().min(3).required(),
    image: Joi.string().optional(),
})
const validateSong = Joi.object({
    category_id: Joi.number().required(),
    title: Joi.string().min(5).required(),
    album_name: Joi.string().min(3).required(),
    song: Joi.string().required(),
    cover_image: Joi.string().required(),
    lyrics: Joi.string().optional(),
    duration: Joi.number().required(),
    BPM: Joi.number().optional(),
    language: Joi.string().required(),
    explicit: Joi.number().optional(),
    artist_id: Joi.array().items(Joi.number()).min(1).required().messages({
        'array.base': 'Artist ID must be an array',
        'array.min': 'At least one artist must be selected',
        'any.required': 'Artist selection is required'
    }),
    release_date : Joi.date().max(new Date(), 'Release date cannot be in the future').required(),
    copyright_info : Joi.string().required(),
    tags : Joi.string().required(),
    mood : Joi.string().required(),
    is_featured : Joi.number().optional()

})

const validatePodCast = Joi.object({
    title:Joi.string().min(3).required(),
    taken_by:Joi.string().min(3).required(),
    description : Joi.string().min(8).required(),
    duration : Joi.number().required(),
    video : Joi.string().required(),
    thumbnail : Joi.string().required(),
})
const validateStory = Joi.object({
    title:Joi.string().min(3).required(),
    star_name:Joi.string().min(3).required(),
    description : Joi.string().min(8).required(),
    admin_id:Joi.number().optional()
})

const validateUpdateStory = Joi.object({
  state: Joi.number().optional(),
  is_active: Joi.number().optional(),
  id : Joi.number().required(),
  title: Joi.when("state", {
    is: Joi.exist(), // agar state diya hai
    then: Joi.string().min(3).optional(),
    otherwise: Joi.string().min(3).required()
  }),

  star_name: Joi.when("state", {
    is: Joi.exist(),
    then: Joi.string().min(3).optional(),
    otherwise: Joi.string().min(3).required()
  }),

  description: Joi.when("state", {
    is: Joi.exist(),
    then: Joi.string().min(8).optional(),
    otherwise: Joi.string().min(8).required()
  })
});

module.exports = {
    newUser, 
    validateUser,
    newArtist,
    newPost,
    updateProfile,
    postComment,
    featuredPlaylistValidation,
    updatefeaturedPlaylistValidation,
    adminValidation,
    artistValidation,
    updateArtistRule,
    validateCategory,
    validateSong,
    validatePodCast,
    validateStory,
    validateUpdateStory
}