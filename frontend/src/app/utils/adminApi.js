"use client"
import { makeRequest } from "./apiRequest";

// Auth
export const adminSignIn = async (data) => makeRequest({ method: "POST", endpoint: "signin", data, role: "admin" });

// Artist
export const addArtist = async (data) => makeRequest({ method: "POST", endpoint: "artist", data, role: "admin" });
export const getAllArtist = async (data) => makeRequest({ method: "GET", endpoint: "artist", data, role: "admin" });
export const updateArtist = async (data) => makeRequest({ method: "POST", endpoint: "updateArtist", data, role: "admin" });
export const getArtist = async (data) => makeRequest({ method: "GET", endpoint: "getArtist", data, role: "admin" });
export const deleteArtist = async (data) => makeRequest({ method: "DELETE", endpoint: "deleteArtist", data, role: "admin" });
export const blockArtist = async (data) => makeRequest({ method: "GET", endpoint: "blockArtist", data, role: "admin" });

// Users
export const getAllUser = async (data) => makeRequest({ method: "GET", endpoint: "user", data, role: "admin" });
export const deleteUser = async (data) => makeRequest({ method: "GET", endpoint: "deleteUser", data, role: "admin" });
export const blockUser = async (data) => makeRequest({ method: "GET", endpoint: "userBlockAndUnBlock", data, role: "admin" });
export const editUser = async (data) => makeRequest({ method: "GET", endpoint: "editUser", data, role: "admin" });
export const updateUser = async (data) => makeRequest({ method: "POST", endpoint: "updateUser", data, role: "admin" });

// Category
export const addCategory = async (data) => makeRequest({ method: "POST", endpoint: "category", data, role: "admin" });
export const getCategory = async (data) => makeRequest({ method: "GET", endpoint: "category", data, role: "admin" });
export const updateCategory = async (data) => makeRequest({ method: "PUT", endpoint: "category", data, role: "admin" });
export const deleteCategory = async (data) => makeRequest({ method: "DELETE", endpoint: "category", data, role: "admin" });

// Songs
export const addSong = async (data) => makeRequest({ method: "POST", endpoint: "song", data, role: "admin" });
export const getSong = async (data) => makeRequest({ method: "GET", endpoint: "song", data, role: "admin" });
export const updateSong = async (data) => makeRequest({ method: "PUT", endpoint: "song", data, role: "admin" });

// Playlists / Featured
export const getUserPlayList = async (data) => makeRequest({ method: "GET", endpoint: "getPlayList", data, role: "admin" });
export const getUserPlayListSongs = async (data) => makeRequest({ method: "GET", endpoint: "getPlayListSongs", data, role: "admin" });
export const deletePlayListSong = async (data) => makeRequest({ method: "DELETE", endpoint: "playListSongs", data, role: "admin" });
export const getAllUserPlayList = async (data) => makeRequest({ method: "GET", endpoint: "playList", data, role: "admin" });

export const addFeaturePlayList = async (data) => makeRequest({ method: "POST", endpoint: "newFeaturedPlayList", data, role: "admin" });
export const updateFeaturedPlayList = async (data) => makeRequest({ method: "PUT", endpoint: "featuredPlayList", data, role: "admin" });
export const deleteFeaturePlayList = async (data) => makeRequest({ method: "DELETE", endpoint: "featuredPlayList", data, role: "admin" });
export const getAllFeaturedPlayList = async (data) => makeRequest({ method: "GET", endpoint: "featuredPlayList", data, role: "admin" });
export const addSongToFeaturedPlayList = async (data) => makeRequest({ method: "POST", endpoint: "featuredPlayListSong", data, role: "admin" });
export const deleteSongFromFeaturedPlayList = async (data) => makeRequest({ method: "DELETE", endpoint: "featuredPlayListSong", data, role: "admin" });
export const getAllFeaturedPlayListSongs = async (data) => makeRequest({ method: "GET", endpoint: "featuredPlayList", data, role: "admin" });
export const addPodCast = async (data) => makeRequest({ method: "POST", endpoint: "podcast", data, role: "admin" });
export const getAllPodCast = async (data) => makeRequest({ method: "GET", endpoint: "podcast", data, role: "admin" });
export const updatedPodCast = async (data) => makeRequest({ method: "PUT", endpoint: "podcast", data, role: "admin" });
export const deletePodCast = async (data) => makeRequest({ method: "DELETE", endpoint: "podcast", data, role: "admin" });
//Story
export const addStory = async (data) => makeRequest({ method: "POST", endpoint: "story", data, role: "admin" });
export const updateStory = async (data) => makeRequest({ method: "PUT", endpoint: "story", data, role: "admin" });
export const getAllStory = async (data) => makeRequest({ method: "GET", endpoint: "story", data, role: "admin" });
export const deleteStory = async (data) => makeRequest({ method: "DELETE", endpoint: "story", data, role: "admin" });
