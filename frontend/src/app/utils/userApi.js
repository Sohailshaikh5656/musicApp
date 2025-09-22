import { makeRequest } from "./apiRequest";

// Auth
export const signUp = async (data) => makeRequest({ method: "POST", endpoint: "signup", data });
export const signIn = async (data) => makeRequest({ method: "POST", endpoint: "signin", data });
export const forgetPassword = async (data) => makeRequest({ method: "POST", endpoint: "forgetPassword", data });
export const checkMail = async (data) => makeRequest({ method: "POST", endpoint: "checkMail", data });

// Songs
export const getUserSong = async (data) => makeRequest({ method: "GET", endpoint: "song", data });
export const playCountUpdate = async (data) => makeRequest({ method: "GET", endpoint: "playCount", data });
export const searchKeyword = async (data) => makeRequest({ method: "GET", endpoint: "search", data });

// Comments
export const postComments = async (data) => makeRequest({ method: "POST", endpoint: "comment", data });
export const getComments = async (data) => makeRequest({ method: "GET", endpoint: "comment", data });
export const likeStateManage = async (data) => makeRequest({ method: "POST", endpoint: "likeStateManage", data });

// Playlists
export const newPlayList = async (data) => makeRequest({ method: "POST", endpoint: "playlist", data });
export const getAllPlayList = async (data) => makeRequest({ method: "GET", endpoint: "playlist", data });
export const updatePlaylist = async (data) => makeRequest({ method: "PUT", endpoint: "playlist", data });
export const removeSongFromPlayList = async (data) => makeRequest({ method: "DELETE", endpoint: "playlist", data });

export const getPlayListSongs = async (data) => makeRequest({ method: "GET", endpoint: "playlist-songs", data });
export const addSongToPlayList = async (data) => makeRequest({ method: "POST", endpoint: "addtoplaylist", data });

// Home / Featured
export const getAllFeaturedPlayListSong = async (data) => makeRequest({ method: "GET", endpoint: "featuredPlaylistSong", data });
export const homePage = async (data) => makeRequest({ method: "GET", endpoint: "homePage", data });
export const getAllPodCast = async (data) => makeRequest({ method: "GET", endpoint: "podcast", data });

//Story
export const getAllStory = async (data) => makeRequest({ method: "GET", endpoint: "story", data });

//Genere Songs
export const getAllGenereSongs = async (data) => makeRequest({ method: "GET", endpoint: "genere", data });
export const getAllGenere = async (data) => makeRequest({ method: "GET", endpoint: "genereList", data });


//Feature PlayList
export const getFeature = async(data)=>makeRequest({method:"GET", endpoint:"featuredPlaylist", data})

//Artist
export const getAllArtist = async(data)=>makeRequest({method:"GET", endpoint:"artistList", data})
//Artist Songs
export const getAllArtistSongs = async(data)=>makeRequest({method:"GET", endpoint:"artistSongs", data})

//Discover
export const getDiscover = async(data)=>makeRequest({method:"GET", endpoint:"discover", data})
