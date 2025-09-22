"use client"
import { useFormik } from "formik"
import { useState, useEffect } from "react"
import { Audio } from "react-loader-spinner"
import * as Yup from 'yup'
import Layout from "../../common/layout"
import {  uploadImage } from "@/app/utils/apiHandler"
import { updateSong } from "@/app/utils/adminApi"
import { useSession } from "next-auth/react"
import { addSong } from "@/app/utils/adminApi"
import { ToastContainer, toast } from "react-toastify"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { getAllArtist, getCategory, getSong } from "@/app/utils/adminApi"

const EditSong = () => {
    const params = useParams()
    const id = params.id
    const { data: session } = useSession()
    const [btn, setBtn] = useState(false)
    const [songFile, setSongFile] = useState()
    const [coverFile, setCoverFile] = useState()
    const [artists, setArtists] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedArtists, setSelectedArtists] = useState([])
    const [filteredArtists, setFilteredArtists] = useState([])
    const [song, setSong] = useState(null)
    const router = useRouter()

    const fetchArtist = async () => {
        let artistResponse = await getAllArtist({ jwtToken: session?.user?.jwtToken })
        if (artistResponse.code == 1) {
            setArtists(artistResponse.data)
        }
    }

    const fetchCategory = async () => {
        let categoryresponse = await getCategory({ jwtToken: session?.user?.jwtToken })
        if (categoryresponse.code == 1) {
            setCategories(categoryresponse.data)
        }
    }

    const fetchSong = async () => {
        let songResponse = await getSong({ jwtToken: session?.user?.jwtToken, id: id })
        if (songResponse.code == 1) {
            setSong(songResponse.data)
            setSelectedArtists(songResponse.data.artist)
            
            // Format release date for input field
            const releaseDate = songResponse.data.release_date 
                ? new Date(songResponse.data.release_date).toISOString().split('T')[0]
                : ''
            
            formik.setValues({
                title: songResponse.data.title,
                album_name: songResponse.data.album_name,
                song: songResponse.data.song,
                cover_image: songResponse.data.cover_image,
                lyrics: songResponse.data.lyrics,
                duration: songResponse.data.duration,
                BPM: songResponse.data.BPM,
                language: songResponse.data.language,
                release_date: releaseDate,
                copyright_info: songResponse.data.copyright_info,
                mood: songResponse.data.mood,
                is_featured: songResponse.data.is_featured ? "1" : "0",
                explicit: songResponse.data.explicit ? "1" : "0",
                tags: songResponse.data.tag,
                category_id: songResponse.data.category_id
            })
        }
    }

    useEffect(() => {
        if (session?.user?.jwtToken) {
            fetchArtist()
            fetchCategory()
            fetchSong()
        }
    }, [session])
    const generateRandomString = () => {
        let str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        let token;
        for(let i=0;i<30;i++){
            token += str[Math.floor(Math.random() * 52)]
        }
        return token
    }

    const initalState = {
        title: "",
        album_name: "",
        song: "",
        cover_image: "",
        lyrics: "",
        duration: "",
        language: "",
        BPM: "",
        explicit: "0",
        category_id: 0,
        release_date: "",
        is_featured: "0",
        copyright_info: "",
        tags: "",
        mood: ""
    }

    const validateSchema = Yup.object({
        title: Yup.string().min(5).required(),
        album_name: Yup.string().min(6).required("Album Name is Required !"),
        song: Yup.string().required(),
        cover_image: Yup.string().required(),
        lyrics: Yup.string().min(6).required(),
        duration: Yup.number().required(),
        BPM: Yup.number().required(),
        language: Yup.string().required("Please select a language"),
        category_id: Yup.number().min(1, "Please select a valid category").required("Category is required"),
        release_date: Yup.date().max(new Date(), 'Release date cannot be in the future').required(),
        mood: Yup.string().required("Please select a Mood"),
        copyright_info: Yup.string().optional(),
        tags: Yup.string().optional()
    })

    const formik = useFormik({
        initialValues: initalState,
        validationSchema: validateSchema,
        onSubmit: async (values) => {
            try {
                setBtn(true)
                if (selectedArtists.length <= 0) {
                    formik.setFieldError('artist', 'Please select at least one artist')
                    notify("Please select at least one artist!", "error")
                    return
                }

                const formData = new FormData()
                if (songFile) { 
                    formData.append("profile_img", songFile)
                    const songFileUpload = await uploadImage(formData)
                    if (songFileUpload.code == 1) {
                        formik.values.song = songFileUpload.data
                    } else {
                        notify("Error uploading song file", "error")
                        return
                    }
                }
                if (coverFile) {
                    formData.append("profile_img", coverFile)
                    const coverFileImage = await uploadImage(formData)
                    if (coverFileImage.code == 1) {
                        formik.values.cover_image = coverFileImage.data
                    } else {
                        notify("Error uploading cover image", "error")
                        return
                    }
                }
                
                    
                let updatedSongData = {
                    title: values.title,
                    album_name: values.album_name,
                    lyrics: values.lyrics,
                    BPM: values.BPM,
                    language: values.language,
                    duration: values.duration,
                    release_date: values.release_date,
                    mood: values.mood,
                    category_id: values.category_id,
                    explicit: values.explicit,
                    is_featured: values.is_featured,
                    artist_id: JSON.stringify(selectedArtists.map(a => a.id)),
                    jwtToken: session?.user?.jwtToken,
                    id : song.id
                }
                if(songFile) updatedSongData.song = formik.values.song
                if(coverFile) updatedSongData.cover_image = formik.values.cover_image
                
                if (values.copyright_info) formData.append("copyright_info", values.copyright_info)
                if (values.tags) formData.append("tags", values.tags)

                const res = await updateSong(updatedSongData)
                if (res.code == 1) {
                    console.log("Data Updated !!",res)
                    notify("🎉 Song updated successfully!", "success")
                    setTimeout(()=>{
                        router.push("/admin/allSong")
                    },3000)
                } else {
                    notify("❌ Something went wrong! Please try again.", "error")
                }
            } catch (error) {
                console.error("Error:", error)
                notify("An error occurred", "error")
            } finally {
                setBtn(false)
            }
        }
    })

    const notify = (message, type = "info") => {
        toast[type](message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        })
    }

    const handleFileChange = (e, type) => {
        const file = e.target.files[0]
        if (!file) return

        if (type === 'song') {
            setSongFile(file)
            formik.setFieldValue('song', file.name)
            document.getElementById("songBtn").textContent = file.name
            
            // Create audio preview
            const preview = document.getElementById('songPreview')
            preview.innerHTML = ''
            
            const audio = document.createElement('audio')
            audio.controls = true
            audio.src = URL.createObjectURL(file)
            audio.style.width = '100%'
            preview.appendChild(audio)
        } else {
            setCoverFile(file)
            formik.setFieldValue('cover_image', file.name)
            document.getElementById("coverBtn").textContent = file.name
            
            // Create image preview
            const reader = new FileReader()
            reader.onload = (e) => {
                const preview = document.getElementById('coverPreview')
                preview.innerHTML = ''
                
                const img = document.createElement('img')
                img.src = e.target.result
                img.alt = 'Cover preview'
                img.className = 'img-thumbnail'
                img.style.maxWidth = '200px'
                preview.appendChild(img)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleArtistSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase()
        setFilteredArtists(
            searchTerm ? artists.filter(a => a.name.toLowerCase().includes(searchTerm)) : []
        )
    }

    const handleAddArtist = (artist) => {
        if (!selectedArtists.some(a => a.id === artist.id)) {
            setSelectedArtists([...selectedArtists, artist])
        }
        setFilteredArtists([])
        document.getElementById("artistSearch").value = ""
    }

    const handleRemoveArtist = (id) => {
        setSelectedArtists(selectedArtists.filter(a => a.id !== id))
    }

    return (
        <Layout>
            <ToastContainer />
            <div className="container">
                <div className="row">
                    <div className="col-lg-9 mx-auto mt-4 adminForm p-5">
                        <form onSubmit={formik.handleSubmit}>
                            <div className="row mt-3">
                                <div className="col-12 d-flex align-items-center gap-2">
                                    <i className="bi bi-music-note-beamed text-secondary fs-2"></i>
                                    <h1 className="text-secondary">Edit Song</h1>
                                </div>
                            </div>

                            {/* Basic Information */}
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <label className="form-label d-flex align-items-center gap-2">
                                        <i className="bi bi-pencil-fill text-primary"></i>
                                        Song Title*
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${formik.errors.title && formik.touched.title ? 'is-invalid' : ''}`}
                                        name="title"
                                        value={formik.values.title}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.errors.title && formik.touched.title && (
                                        <div className="text-danger">{formik.errors.title}</div>
                                    )}
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label d-flex align-items-center gap-2">
                                        <i className="bi bi-collection-fill text-primary"></i>
                                        Album Name*
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${formik.errors.album_name && formik.touched.album_name ? 'is-invalid' : ''}`}
                                        name="album_name"
                                        value={formik.values.album_name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.errors.album_name && formik.touched.album_name && (
                                        <div className="text-danger">{formik.errors.album_name}</div>
                                    )}
                                </div>
                            </div>

                            {/* Lyrics */}
                            <div className="row mt-3">
                                <div className="col-12">
                                    <label className="form-label d-flex align-items-center gap-2">
                                        <i className="bi bi-file-text-fill text-primary"></i>
                                        Lyrics*
                                    </label>
                                    <textarea
                                        className={`form-control ${formik.errors.lyrics && formik.touched.lyrics ? 'is-invalid' : ''}`}
                                        name="lyrics"
                                        rows="5"
                                        value={formik.values.lyrics}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    ></textarea>
                                    {formik.errors.lyrics && formik.touched.lyrics && (
                                        <div className="text-danger">{formik.errors.lyrics}</div>
                                    )}
                                </div>
                            </div>

                            {/* Technical Details */}
                            <div className="row mt-3">
                                <div className="col-md-4">
                                    <label className="form-label d-flex align-items-center gap-2">
                                        <i className="bi bi-speedometer2 text-primary"></i>
                                        BPM*
                                    </label>
                                    <input
                                        type="number"
                                        className={`form-control ${formik.errors.BPM && formik.touched.BPM ? 'is-invalid' : ''}`}
                                        name="BPM"
                                        value={formik.values.BPM}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.errors.BPM && formik.touched.BPM && (
                                        <div className="text-danger">{formik.errors.BPM}</div>
                                    )}
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label d-flex align-items-center gap-2">
                                        <i className="bi bi-clock-fill text-primary"></i>
                                        Duration (seconds)*
                                    </label>
                                    <input
                                        type="number"
                                        className={`form-control ${formik.errors.duration && formik.touched.duration ? 'is-invalid' : ''}`}
                                        name="duration"
                                        value={formik.values.duration}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.errors.duration && formik.touched.duration && (
                                        <div className="text-danger">{formik.errors.duration}</div>
                                    )}
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label d-flex align-items-center gap-2">
                                        <i className="bi bi-tags-fill text-primary"></i>
                                        Category*
                                    </label>
                                    <select
                                        className={`form-select ${formik.errors.category_id && formik.touched.category_id ? 'is-invalid' : ''}`}
                                        name="category_id"
                                        value={formik.values.category_id}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        <option value={0}>--SELECT CATEGORY--</option>
                                        {categories.map(cat => (
                                            <option key={`cat-${cat.id}`} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {formik.errors.category_id && formik.touched.category_id && (
                                        <div className="text-danger">{formik.errors.category_id}</div>
                                    )}
                                </div>
                            </div>

                            {/* Artist Selection */}
                            <div className="row mt-3">
                                <div className="col-12">
                                    <label className="form-label d-flex align-items-center gap-2">
                                        <i className="bi bi-person-badge-fill text-primary"></i>
                                        Artists*
                                    </label>
                                    <div className="position-relative">
                                        <input
                                            id="artistSearch"
                                            type="text"
                                            className="form-control"
                                            placeholder="Search artists..."
                                            onChange={handleArtistSearch}
                                        />
                                        {filteredArtists.length > 0 && (
                                            <div className="dropdown-menu show w-100 mt-1">
                                                {filteredArtists.map(artist => (
                                                    <button
                                                        key={`artist-${artist.id}`}
                                                        type="button"
                                                        className="dropdown-item"
                                                        onClick={() => handleAddArtist(artist)}
                                                    >
                                                        <div className="d-flex align-items-center gap-2">
                                                            <img
                                                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${artist.profile_picture}`}
                                                                alt={artist.name}
                                                                width="30"
                                                                height="30"
                                                                className="rounded-circle"
                                                            />
                                                            {artist.name}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {formik.touched.artist && formik.errors.artist && (
                                        <div className="text-danger mt-1">{formik.errors.artist}</div>
                                    )}
                                </div>
                            </div>

                            {/* Selected Artists */}
                            <div className="row mt-2">
                                <div className="col-12">
                                    <div className="d-flex flex-wrap gap-2">
                                        {selectedArtists.map(artist => (
                                            <div key={`selected-artist-${artist.id}-${generateRandomString()}`} className="badge bg-primary d-flex align-items-center">
                                                <img
                                                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${artist.profile_picture}`}
                                                    alt={artist.name}
                                                    width="24"
                                                    height="24"
                                                    className="rounded-circle me-1"
                                                />
                                                {artist.name}
                                                <button
                                                    type="button"
                                                    className="btn-close btn-close-white ms-1"
                                                    onClick={() => handleRemoveArtist(artist.id)}
                                                    aria-label="Remove"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <label className="form-label d-flex align-items-center gap-2">
                                        <i className="bi bi-translate text-primary"></i>
                                        Language*
                                    </label>
                                    <select
                                        className={`form-select ${formik.errors.language && formik.touched.language ? 'is-invalid' : ''}`}
                                        name="language"
                                        value={formik.values.language}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        <option value="">--SELECT LANGUAGE--</option>
                                        <option value="English">English</option>
                                        <option value="Hindi">Hindi</option>
                                        <option value="Spanish">Spanish</option>
                                        <option value="French">French</option>
                                        <option value="German">German</option>
                                    </select>
                                    {formik.errors.language && formik.touched.language && (
                                        <div className="text-danger">{formik.errors.language}</div>
                                    )}
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label d-flex align-items-center gap-2">
                                        <i className="bi bi-calendar-date-fill text-primary"></i>
                                        Release Date*
                                    </label>
                                    <input
                                        type="date"
                                        className={`form-control ${formik.errors.release_date && formik.touched.release_date ? 'is-invalid' : ''}`}
                                        name="release_date"
                                        value={formik.values.release_date}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.errors.release_date && formik.touched.release_date && (
                                        <div className="text-danger">{formik.errors.release_date}</div>
                                    )}
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <label className="form-label d-flex align-items-center gap-2">
                                        <i className="bi bi-emoji-smile-fill text-primary"></i>
                                        Mood*
                                    </label>
                                    <select
                                        className={`form-select ${formik.errors.mood && formik.touched.mood ? 'is-invalid' : ''}`}
                                        name="mood"
                                        value={formik.values.mood}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        <option value="">-- SELECT MOOD--</option>
                                        <option value="happy">Happy</option>
                                        <option value="romantic">Romantic</option>
                                        <option value="sad">Sad</option>
                                        <option value="energetic">Energetic</option>
                                        <option value="chill">Chill</option>
                                    </select>
                                    {formik.errors.mood && formik.touched.mood && (
                                        <div className="text-danger">{formik.errors.mood}</div>
                                    )}
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label d-flex align-items-center gap-2">
                                        <i className="bi bi-c-circle-fill text-primary"></i>
                                        Copyright Info
                                    </label>
                                    <input
                                        className="form-control"
                                        name="copyright_info"
                                        value={formik.values.copyright_info}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col-12">
                                    <label className="form-label d-flex align-items-center gap-2">
                                        <i className="bi bi-tags-fill text-primary"></i>
                                        Tags
                                    </label>
                                    <input
                                        className="form-control"
                                        name="tags"
                                        placeholder="Separate tags with commas"
                                        value={formik.values.tags}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                            </div>

                            {/* File Uploads */}
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <label className="form-label d-flex align-items-center gap-2">
                                        <i className="bi bi-file-earmark-music-fill text-primary"></i>
                                        Song File*
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type="file"
                                            id="songImage"
                                            className="form-control"
                                            accept=".mp3,.wav,.aac,.flac,.ogg,.m4a"
                                            onChange={(e) => handleFileChange(e, 'song')}
                                            hidden
                                        />
                                        <label
                                            htmlFor="songImage"
                                            className="btn btn-outline-primary w-100 text-start"
                                            id="songBtn"
                                        >
                                            {song?.song ? 'Change Song File' : 'Upload Song File'}
                                        </label>
                                    </div>
                                    <div id="songPreview" className="mt-2 text-center">
                                        {song?.song && (
                                            <audio controls className="w-100">
                                                <source src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${song.song}`} type="audio/mpeg" />
                                                Your browser does not support the audio element.
                                            </audio>
                                        )}
                                    </div>
                                    {formik.errors.song && formik.touched.song && (
                                        <div className="text-danger">{formik.errors.song}</div>
                                    )}
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label d-flex align-items-center gap-2">
                                        <i className="bi bi-image-fill text-primary"></i>
                                        Cover Image*
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type="file"
                                            id="coverImage"
                                            className="form-control"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'cover')}
                                            hidden
                                        />
                                        <label
                                            htmlFor="coverImage"
                                            className="btn btn-outline-primary w-100 text-start"
                                            id="coverBtn"
                                        >
                                            {song?.cover_image ? 'Change Cover Image' : 'Upload Cover Image'}
                                        </label>
                                    </div>
                                    <div id="coverPreview" className="mt-2 text-center">
                                        {song?.cover_image && (
                                            <img 
                                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${song.cover_image}`} 
                                                alt="Cover preview" 
                                                className="img-thumbnail" 
                                                style={{ maxWidth: '200px' }}
                                            />
                                        )}
                                    </div>
                                    {formik.errors.cover_image && formik.touched.cover_image && (
                                        <div className="text-danger">{formik.errors.cover_image}</div>
                                    )}
                                </div>
                            </div>

                            {/* Options */}
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="featuredSwitch"
                                            checked={formik.values.is_featured === "1"}
                                            onChange={(e) => formik.setFieldValue('is_featured', e.target.checked ? "1" : "0")}
                                        />
                                        <label className="form-check-label" htmlFor="featuredSwitch">
                                            Featured Song
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="explicitSwitch"
                                            checked={formik.values.explicit === "1"}
                                            onChange={(e) => formik.setFieldValue('explicit', e.target.checked ? "1" : "0")}
                                        />
                                        <label className="form-check-label" htmlFor="explicitSwitch">
                                            Explicit Content
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="row mt-4">
                                <div className="col-12">
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 py-2"
                                        disabled={btn}
                                    >
                                        {btn ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-save me-2"></i>
                                                Update Song
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default EditSong