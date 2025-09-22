"use client"
import { useFormik } from "formik"
import { useState, useEffect } from "react"
import { Audio } from "react-loader-spinner"
import * as Yup from 'yup'
import Layout from "../common/layout"
import { getAllArtist, getCategory } from "@/app/utils/adminApi"
import { uploadImage } from "@/app/utils/apiHandler"
import { useSession } from "next-auth/react"
import { addSong } from "@/app/utils/adminApi"
import { ToastContainer, toast } from "react-toastify"

const AddSong = () => {
    const { data: session } = useSession()
    const [btn, setBtn] = useState(false)
    const [songFile, setSongFile] = useState()
    const [coverFile, setCoverFile] = useState()
    const [artist, setArtist] = useState()
    const [category, setCategory] = useState()
    const [selectedArtist, setSelectedArtist] = useState([])
    const [filteredArtists, setFilteredArtists] = useState([]);
    const fetchArtist = async () => {
        let artistResponse = await getAllArtist({ jwtToken: session?.user?.jwtToken })
        if (artistResponse.code == 1) {
            setArtist(artistResponse.data)
        }
    }
    const fetchCategory = async () => {
        let categoryresponse = await getCategory({ jwtToken: session?.user?.jwtToken })
        if (categoryresponse.code == 1) {
            setCategory(categoryresponse.data)
        }
    }
    useEffect(() => {
        if(session?.user?.jwtToken && !artist && !category){
            fetchArtist()
            fetchCategory()
        }
    }, [session])
    const initalState = {
        title: "",
        album_name: "",
        song: "",
        cover_image: "",
        lyrics: "",
        duration: "",
        language: "",
        BPM:"",
        explicit: "",
        category : 0,
        release_date : "",
        is_featured:"",
        copyright_info:"",
        tags:"",
        mood:"",
        added_by:""

    }
    const validateSchema = Yup.object({
        title: Yup.string().min(5).required(),
        album_name: Yup.string().min(6).required("Album Name is Required !"),
        song: Yup.string().min(6).required(),
        cover_image: Yup.string().min(6).required(),
        lyrics: Yup.string().min(6).required(),
        duration: Yup.number().required(),
        BPM : Yup.number().required(),
        language: Yup.string().required("Please select a language"),
        category: Yup.number().min(1, "Please select a valid category").required("Category is required"),
        release_date : Yup.date().max(new Date(), 'Release date cannot be in the future').required(),
        mood : Yup.string().required("Please select a Mood"),
        copyright_info : Yup.string().optional(),
        tags : Yup.string().optional()
    })

    const formik = useFormik({
        initialValues: initalState,
        validationSchema: validateSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                setBtn(true)
                if(!selectedArtist || selectedArtist.length <= 0){
                    formik.setFieldError('artist', 'Please select at least one artist');
                    alert("Please Select Artist!");
                    setBtn(false);
                    return;
                }
                const artistArray = []
                selectedArtist.map((singer)=>{
                    artistArray.push(singer.id)
                })
                console.log("Artist Array : ",artistArray)
                const songData = {
                    category_id : values.category,
                    title : values.title,
                    album_name : values.album_name,
                    lyrics: values.lyrics,
                    BPM : values.BPM,
                    artist_id : artistArray,
                    language : values.language,
                    song : values.song || values.song.name,
                    cover_image : values.cover_image || values.cover_image,
                    duration : values.duration,
                    explicit : values.explicit?1:0,
                    release_date : values.release_date,
                    copyright_info : values.copyright_info,
                    tags : values.tags,
                    mood : values.mood,
                    is_featured : values.is_featured?1:0,
                    jwtToken : session?.user?.jwtToken
                }
                if(songFile){
                    let formData = new FormData()
                    formData.append("profile_img", songFile);
                    let songResponse = await uploadImage(formData)
                    if(songResponse.code != 1){
                        notify("Error in Uploading Song")
                        return;
                    }
                    songData.song = songResponse.data
                    console.log(songResponse)
                }
                if(coverFile){
                    let formData = new FormData()
                    formData.append("profile_img", coverFile);
                    let coverFileResponse = await uploadImage(formData)
                    if(coverFileResponse.code != 1){
                        notify("Error in Uploading Song")
                        return;
                    }
                    songData.cover_image = coverFileResponse.data
                    console.log(coverFileResponse)
                }
                console.log("The Data Ready to Inserted !",songData)
                const res = await addSong(songData);
                if(res.code == 1){
                    notify("🎉 Song added successfully!")
                    resetForm()
                    EmptyAllform()
                }else{
                    console.log("Error : ",res)
                    notify("❌ Something went wrong! Please try again.")
                }

            } catch (error) {
                alert("Error : ", error)
                console.log("Error : ", error)
            } finally {
                setBtn(false);
            }
        }
    })
    const EmptyAllform = () =>{
        const selectedArtistElement = document.getElementById("selectedArtist");
        if (selectedArtistElement) {
            selectedArtistElement.innerHTML = '';
        }
        setSelectedArtist([]);
        const artistSelectElement = document.getElementById("artistSelect");
        if (artistSelectElement) {
            artistSelectElement.selectedIndex = 0;
        }
        const durationInput = document.querySelector('input[name="duration"]');
        if (durationInput) {
            durationInput.value = '';
        }
        const songImagePreview = document.getElementById('songImagePreview');
        const coverImagePreview = document.getElementById('CoverImagePreview');
        const songImageInput = document.getElementById("songImage");
        const coverImageInput = document.getElementById("coverImage");
        const songBtn = document.getElementById("songBtn");
        const coverBtn = document.getElementById("coverBtn");
        const artistListElement = document.getElementById("artistList");
        if (artistListElement) {
            artistListElement.style.display = 'none';
        }
        if (songImagePreview) {
            songImagePreview.innerHTML = '';
            songImagePreview.style.display = 'none';
        }
        if (coverImagePreview) {
            coverImagePreview.innerHTML = '';
            coverImagePreview.style.display = 'none';
        }
        if (songImageInput) songImageInput.value = '';
        if (coverImageInput) coverImageInput.value = '';
        if (songBtn) songBtn.innerText = 'Upload Song';
        if (coverBtn) coverBtn.innerText = 'Upload Cover Image';
    }
    const songImageEnable = () => {
        document.getElementById("songImage").click()
    }
    const songCoverImageEnable = () => {
        document.getElementById("coverImage").click()
    }
    const hangleSongPreview = (e) => {

        const songImagePreview = document.getElementById('songImagePreview');
        songImagePreview.style.display = 'block';
        const file = e.target.files[0];
        const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
        let image_url = process.env.NEXT_PUBLIC_IMAGE_URL
        if(fileExtension == ".mp3"){
            image_url += "mp3.jpg"
        }else if(fileExtension == ".ogg"){
            image_url += "ogg.jpg"
        }else if(fileExtension == ".flac"){
            image_url += "flac.jpg"
        }else if(fileExtension == ".acc"){
            image_url += "acc.jpg"
        }else if(fileExtension == ".wav"){
            image_url += "wav.jpg"
        }else if(fileExtension == ".m4a"){
            image_url += "m4a.jpg"
        }else{
            image_url += "mp3.jpg"
        }
        if (file) {
            setSongFile(file)
            formik.setFieldValue('song', file.name);
            const reader = new FileReader();
            document.getElementById("songBtn").innerText = file.name;
            reader.onload = function (e) {
                const imagePreview = document.getElementById('songImagePreview');
                imagePreview.style.marginTop = '10px';
                imagePreview.style.marginBottom = '10px';
                imagePreview.style.paddingTop = '10px';
                imagePreview.style.paddingBottom = '10px';
                imagePreview.style.borderRadius = '8px';
                imagePreview.style.backgroundColor = '#fff';
                imagePreview.innerHTML = '';

                const img = document.createElement('img');
                img.src = image_url;
                img.alt = 'Song Preview';
                img.style.maxWidth = '200px';
                img.style.height = 'auto';
                img.style.marginTop = '10px';
                img.style.borderRadius = '8px';
                img.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                img.style.display = "block";
                img.style.marginLeft = "auto";
                img.style.marginRight = "auto";

                imagePreview.appendChild(img);
                formik.setFieldValue('image', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }
    const handleCoverImagePreview = (e) => {
        const coverImagePreview = document.getElementById('CoverImagePreview');
        coverImagePreview.style.display = 'block';
        const file = e.target.files[0];
        if (file) {
            setCoverFile(file)
            formik.setFieldValue('cover_image', file.name);
            const reader = new FileReader();
            document.getElementById("coverBtn").innerText = file.name;
            reader.onload = function (e) {
                const imagePreview = document.getElementById('CoverImagePreview');
                imagePreview.style.marginTop = '10px';
                imagePreview.style.marginBottom = '10px';
                imagePreview.style.paddingTop = '10px';
                imagePreview.style.paddingBottom = '10px';
                imagePreview.style.borderRadius = '8px';
                imagePreview.style.backgroundColor = '#fff';
                imagePreview.innerHTML = '';

                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Cover Preview';
                img.style.maxWidth = '200px';
                img.style.height = 'auto';
                img.style.marginTop = '10px';
                img.style.borderRadius = '8px';
                img.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                img.style.display = "block";
                img.style.marginLeft = "auto";
                img.style.marginRight = "auto";

                imagePreview.appendChild(img);
                formik.setFieldValue('image', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }
    const handleList = (item) => {
        const container = document.getElementById("artistList");
        container.style.display = "block"
        container.classList.add("mt-3");

        // Create or get the selected artists container
        let selectedContainer = document.getElementById('selectedArtists');
        if (!selectedContainer) {
            selectedContainer = document.createElement('div');
            selectedContainer.id = 'selectedArtists';
            selectedContainer.classList.add('col-12');
            selectedContainer.className = 'd-flex flex-wrap gap-2';
            selectedContainer.style.backgroundColor = 'white';
            selectedContainer.style.padding = '10px';
            selectedContainer.style.borderRadius = '8px';
            selectedContainer.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            selectedContainer.style.marginBottom = '10px';
            container.appendChild(selectedContainer);
        }

        // Check if artist already exists
        const existingArtist = Array.from(selectedContainer.children).find(
            div => div.querySelector('span').innerText === item.name
        );
        if (existingArtist) return;

        // Add new artist
        const artistDiv = document.createElement('div');
        artistDiv.className = 'd-flex align-items-center gap-2';
        artistDiv.style.backgroundColor = '#f0f8ff';
        artistDiv.style.padding = '8px';
        artistDiv.style.borderRadius = '6px';
        artistDiv.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';

        const artistName = document.createElement('span');
        artistName.innerText = item.name;
        artistName.style.fontSize = '14px';
        artistName.style.color = '#333';

        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '&times;';
        removeBtn.className = 'btn btn-sm btn-danger';
        removeBtn.style.padding = '2px 6px';
        removeBtn.style.borderRadius = '50%';
        removeBtn.style.fontSize = '12px';
        removeBtn.onclick = () => {
            artistDiv.remove();
            setSelectedArtist(prev => prev.filter(artist => artist.name !== item.name));
        };

        artistDiv.appendChild(artistName);
        artistDiv.appendChild(removeBtn);
        selectedContainer.appendChild(artistDiv);

        // Update state
        setSelectedArtist(prev => [...prev, item]);
    }
    const notify = (msg) => {
        toast(msg, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

    return (
        <Layout>
            <ToastContainer/>
            <div className="container">
                <div className="row">
                    <div className="col-sm-6 col-md-9 col-xl-9 col-lg-9 mx-auto mt-4 adminForm p-5">
                        <form noValidate onSubmit={formik.handleSubmit}>
                            <div className="row mt-3">
                                <div className="col-12 d-flex align-items-center gap-2">
                                    <i className="bi bi-music-note-beamed text-secondary" style={{ fontSize: '2rem' }}></i>
                                    <h1 className="text-secondary">Add New Song</h1>
                                </div>
                            </div>
                            
                            {/* Song Title */}
                            <div className="row mt-3">
                                <div className="col-12">
                                    <label className="form-label d-flex align-items-center gap-2">
                                        <i className="bi bi-pencil-fill text-primary"></i>
                                        Song Title
                                    </label>
                                    <input type="text" className="form-control" name="title" placeholder="Enter Song Title or Name" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.title} />
                                    {formik.errors.title && formik.touched.title && <div className="text-danger">{formik.errors.title}</div>}
                                </div>
                            </div>

                            {/* Album Name */}
                            <div className="row mt-3">
                                <div className="col-12">
                                    <label className="form-label d-flex align-items-center gap-2">
                                        <i className="bi bi-collection-fill text-primary"></i>
                                        Album Name
                                    </label>
                                    <input type="text" className="form-control" name="album_name" placeholder="Enter Album Name" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.album_name} />
                                    {formik.errors.album_name && formik.touched.album_name && <div className="text-danger">{formik.errors.album_name}</div>}
                                </div>
                            </div>

                            {/* Lyrics */}
                            <div className="row mt-3">
                                <div className="col-12">
                                    <label className="form-label d-flex align-items-center gap-2">
                                        <i className="bi bi-file-text-fill text-primary"></i>
                                        Song Lyrics
                                    </label>
                                    <textarea className="form-control" name="lyrics" placeholder="Enter Song Lyrics of Song" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.lyrics}></textarea>
                                    {formik.errors.lyrics && formik.touched.lyrics && <div className="text-danger">{formik.errors.lyrics}</div>}
                                </div>
                            </div>

                            {/* BPM */}
                            <div className="row mt-3">
                                <div className="col-12">
                                    <label className="form-label d-flex align-items-center gap-2">
                                        <i className="bi bi-speedometer2 text-primary"></i>
                                        BPM (Beats Per Minute)
                                    </label>
                                    <input type="number" className="form-control" name="BPM" placeholder="Enter BPM of Song" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.BPM} />
                                    {formik.errors.BPM && formik.touched.BPM && <div className="text-danger">{formik.errors.BPM}</div>}
                                </div>
                            </div>

                            <div className="row" id="artistList"></div>

                            {/* Artist and Category */}
                            <div className="row mt-3">
                                <div className="col-6">
                                    <label className="form-label d-flex align-items-center gap-2">
                                        <i className="bi bi-person-badge-fill text-primary"></i>
                                        Artist
                                    </label>
                                    <div className="position-relative">
                                        <input
                                            type="text"
                                            name="artist"
                                            className="form-control"
                                            placeholder="Search or select artist"
                                            onBlur={formik.handleBlur}
                                            onChange={(e) => {
                                                formik.handleChange(e);
                                                const filtered = artist.filter(item => 
                                                    item.name.toLowerCase().includes(e.target.value.toLowerCase())
                                                );
                                                setFilteredArtists(filtered);
                                            }}
                                        />
                                        {filteredArtists.length > 0 && (
                                            <div 
                                                className="dropdown-menu show w-100 position-absolute bg-white border rounded mt-1"
                                                onBlur={() => setFilteredArtists([])}
                                                tabIndex={0}
                                            >
                                                {filteredArtists.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="dropdown-item"
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => {
                                                            handleList(item);
                                                            const currentValue = formik.values.artist || '';
                                                            const newValue = currentValue ? `${currentValue},${item.id}` : item.id;
                                                            formik.setFieldValue('artist', newValue);
                                                            setFilteredArtists([]);
                                                            document.querySelector('input[name="artist"]').value = '';
                                                        }}
                                                    >
                                                        <div className="d-flex align-items-center gap-2">
                                                            <img 
                                                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.profile_picture}`}
                                                                alt={item.name} 
                                                                style={{
                                                                    width: '30px',
                                                                    height: '30px',
                                                                    borderRadius: '50%',
                                                                    objectFit: 'cover'
                                                                }}
                                                            />
                                                            {item.name}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {formik?.touched?.artist && formik?.errors?.artist && (
                                        <div className="text-danger" style={{ marginTop: '5px' }}>
                                            {formik.errors.artist}
                                        </div>
                                    )}
                                </div>
                                <div className="col-6">
                                    <label className="form-label d-flex align-items-center gap-2">
                                        <i className="bi bi-tags-fill text-primary"></i>
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        className="form-select form-select-lg mb-3"
                                        style={{
                                            width: '100%',
                                            padding: '0.5rem 1rem',
                                            fontSize: '1rem',
                                            borderRadius: '0.375rem',
                                            border: '1px solid #ced4da',
                                            appearance: 'none',
                                            backgroundColor: '#fff',
                                            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 0.75rem center',
                                            backgroundSize: '16px 12px'
                                        }}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        value={formik.values.category}
                                    >
                                        <option value={''} className="text-muted">--SELECT LANGUAGE--</option>
                                        {category != "" && category && category.length > 0 && (category.map((item) => (
                                            <option key={item.id} value={item.id} className="dropdown-item">{item.name}</option>
                                        )))}
                                    </select>
                                    {formik.errors.category && formik.touched.category && <div className="text-danger mt-1">{formik.errors.category}</div>}
                                </div>
                            </div>

                            {/* Language and Duration */}
                            <div className="row mt-3">
                                <div className="col-6">
                                    <label className="form-label d-flex align-items-center gap-2">
                                        <i className="bi bi-translate text-primary"></i>
                                        Language
                                    </label>
                                    <select
                                        name="language"
                                        className="form-select form-select-lg mb-3"
                                        style={{
                                            width: '100%',
                                            padding: '0.5rem 1rem',
                                            fontSize: '1rem',
                                            borderRadius: '0.375rem',
                                            border: '1px solid #ced4da',
                                            appearance: 'none',
                                            backgroundColor: '#fff',
                                            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 0.75rem center',
                                            backgroundSize: '16px 12px'
                                        }}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        value={formik.values.language}
                                    >
                                        <option value={''} disabled className="text-muted">--SELECT SONG LANGUAGE--</option>
                                        <option value={'English'} className="dropdown-item">English</option>
                                        <option value={'Hindi'} className="dropdown-item">Hindi</option>
                                        <option value={'Spanish'} className="dropdown-item">Spanish</option>
                                        <option value={'French'} className="dropdown-item">French</option>
                                        <option value={'German'} className="dropdown-item">German</option>
                                    </select>
                                    {formik.errors.language && formik.touched.language && <div className="text-danger mt-1">{formik.errors.language}</div>}
                                </div>
                                <div className="col-6">
                                    <label className="form-label d-flex align-items-center gap-2">
                                        <i className="bi bi-clock-fill text-primary"></i>
                                        Duration
                                    </label>
                                    <input type="text" className="form-control" name="duration" placeholder="Enter Duration in second" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.duration} />
                                    {formik.errors.duration && formik.touched.duration && <div className="text-danger">{formik.errors.duration}</div>}
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-6">
                                    <label className="form-label d-flex align-items-center gap-2">
                                        <i className="bi bi-calendar-date-fill text-primary"></i>
                                        Release Date
                                    </label>
                                    <input type="date" className="form-control" name="release_date" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.release_date} />
                                    {formik.errors.release_date && formik.touched.release_date && <div className="text-danger">{formik.errors.release_date}</div>}    
                                </div>
                                <div className="col-6">
                                    <label className="form-label d-flex align-items-center gap-2">
                                        <i className="bi bi-emoji-smile-fill text-primary"></i>
                                        Select Mood
                                    </label>
                                    <select className="form-select" name="mood" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.mood}>
                                        <option value={''}>-- SELECT MOOD--</option>
                                        <option value={'happy'}>Happy</option>
                                        <option value={'sad'}>Sad</option>
                                        <option value={'romantic'}>Romantic</option>
                                        <option value={'chill'}>Chill</option>
                                        <option value={'energetic'}>Energetic</option>
                                        <option value={'dark'}>Dark</option>
                                        <option value={'angry'}>Angry</option>
                                        <option value={'hopeful'}>Hopeful</option>
                                        <option value={'nostalgic'}>Nostalgic</option>
                                        <option value={'party'}>Party</option>
                                        <option value={'Reflective & Meditative'}>Reflective & Meditative</option>
                                        <option value={'Motivational / Uplifting'}>Motivational / Uplifting</option>

                                    </select>
                                    {formik.errors.mood && formik.touched.mood && <div className="text-danger">{formik.errors.mood}</div>}
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-12">
                                    <label className="form-label d-flex align-items-center gap-2">
                                        <i className="bi bi-c-circle-fill text-primary"></i>
                                        Copyright Info
                                    </label>
                                    <input className="form-control" name="copyright_info" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.copyright_info} />
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-12">
                                    <label className="form-label d-flex align-items-center gap-2">
                                        <i className="bi bi-tags-fill text-primary"></i>
                                        Tags
                                    </label>
                                    <input className="form-control" name="tags" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.tags} />
                                    {formik.errors.tags && formik.touched.tags && <div className="text-danger">{formik.errors.tags}</div>}
                                
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-12">
                                    <div className="imageUploadContainer" onClick={(e) => { e.preventDefault(), songImageEnable() }}>
                                        <div className="uploadIcon">
                                            <i className="bi bi-file-earmark-music-fill" style={{ fontSize: '3rem' }}></i>
                                        </div>
                                        <div className="imageUploadLabel" id="songBtn">
                                            Upload Song File
                                        </div>
                                        <div className="uploadText">
                                            Click to upload or drag and drop
                                        </div>
                                    </div>
                                    {formik.errors.song && formik.touched.song && <div className="text-danger">{formik.errors.song}</div>}
                                </div>
                            </div>
                            <div className="" id="songImagePreview"></div>
                            <div className="row mt-3">
                                <div className="col-12">
                                    <div className="imageUploadContainer" onClick={(e) => { e.preventDefault(), songCoverImageEnable() }}>
                                        <div className="uploadIcon">
                                            <i className="bi bi-image-fill" style={{ fontSize: '3rem' }}></i>
                                        </div>
                                        <div className="imageUploadLabel" id="coverBtn">
                                            Upload Song Cover Image
                                        </div>
                                        <div className="uploadText">
                                            Click to upload or drag and drop
                                        </div>
                                    </div>
                                    {formik.errors.cover_image && formik.touched.cover_image && <div className="text-danger">{formik.errors.cover_image}</div>}
                                </div>
                            </div>
                            <div className="" id="CoverImagePreview"></div>
                            <div className="row mt-3" style={{ display: "none" }}>
                                <input type="file" name="song" id="songImage" accept=".mp3,.wav,.aac,.flac,.ogg,.m4a" onBlur={formik.handleBlur} onChange={(e) => { formik.handleChange; hangleSongPreview(e) }} />
                                <input type="file" name="cover_image" id="coverImage" accept="Image" onBlur={formik.handleBlur} onChange={(e) => { formik.handleChange; handleCoverImagePreview(e) }} />
                            </div>
                            <div className="row mt-3">
                                <div className="col-12">
                                    <div className="form-check d-flex align-items-center gap-2">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="featured"
                                            checked={formik.values.is_featured == "1"}
                                            onChange={(e) => formik.setFieldValue('is_featured', e.target.checked ? "1" : "0")}
                                        />
                                        <label htmlFor="explicitCheck" className="form-check-label text-muted">
                                            Mark as  is_featured
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-12">
                                    <div className="form-check d-flex align-items-center gap-2">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="explicitCheck"
                                            checked={formik.values.explicit === "1"}
                                            onChange={(e) => formik.setFieldValue('explicit', e.target.checked ? "1" : "0")}
                                        />
                                        <label htmlFor="explicitCheck" className="form-check-label text-muted">
                                            Mark as Explicit Content (18+)
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col-12">
                                <button type="submit" className="btn btn-primary w-100" disabled={btn} style={{ opacity: btn ? 0.5 : 1 }}>{btn ? <>
                                    <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                                        <Audio
                                            height="30"
                                            width="60"
                                            color="#4fa94d"
                                            ariaLabel="audio-loading"
                                            wrapperStyle={{}}
                                            wrapperClass="wrapper-class"
                                            visible={true}
                                        />
                                    </div>
                                </> : <><i className="bi bi-music-note-beamed me-2"></i>Add Song</>}</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default AddSong