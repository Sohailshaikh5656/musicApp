"use client"
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { updateFeaturedPlayList, getAllFeaturedPlayList, getCategory } from '@/app/utils/adminApi';
import { useFormik } from 'formik';
import * as Yup from "yup"
import { ToastContainer, toast } from 'react-toastify';
import { Audio } from 'react-loader-spinner';
import { uploadImage } from '@/app/utils/apiHandler';
import Layout from '../../common/layout';

const EditFeaturedPlaylistPage = () => {
    const router = useRouter();
    const { id } = useParams();
    const { data: session } = useSession();
    const [playlist, setPlaylist] = useState(null);
    const [imagePreview, setImagePreview] = useState();
    const [imagePreviewBool, setImagePreviewBool] = useState(false);
    const [category, setCategory] = useState([])
    const initialValues = {
        name: '',
        image: '',
        description: "",
        category_id: ""
    };

    const validationSchema = Yup.object({
        name: Yup.string()
            .required('Featured Playlist name is required')
            .min(3, 'Playlist name must be at least 3 characters')
            .max(50, 'Playlist name must be at most 50 characters'),
        image: Yup.string()
            .required('Image is required'),
        description: Yup.string().min(8).required(),
        category_id: Yup.number().min(1).required(),
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                if (imagePreview) {
                    const formData = new FormData()
                    formData.append("profile_img", imagePreview)
                    const imageResponse = await uploadImage(formData)
                    if (imageResponse.code == 1) {
                        values.image = imageResponse.data
                    } else {
                        notify("failed to upload image !")
                    }
                }
                const updateData = {
                    name: values.name,
                    image: values.image,
                    description: values.description,
                    category_id: values.category_id,
                    id: id,
                    jwtToken: session?.user?.jwtToken
                }

                console.log("Data Going to Update : ", updateData)

                const res = await updateFeaturedPlayList(updateData)

                if (res.code == 1) {
                    notify("Play List Updated !")
                    resetForm()
                    setTimeout(() => {
                        const baseUrl = process.env.NEXTAUTH_URL || '/';
                        router.push("/admin/allFeaturePlayList");
                    }, 3000)
                }
            } catch (error) {
                console.error('Error updating playlist:', error);
            } finally {
                resetForm()
            }
        }
    });
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

    useEffect(() => {
        const fetchPlaylistData = async () => {
            // if (!session?.user?.jwtToken) return;

            try {
                const playlistData = await getAllFeaturedPlayList({ id: id, jwtToken: session.user.jwtToken });
                if (playlistData.code == 1) {
                    setPlaylist(playlistData.data);
                    console.log("thsi sis Data : ",playlistData)
                    formik.setValues({
                        name: playlistData.data.name,
                        image: playlistData.data.image,
                        description: playlistData.data.description,
                        category_id: playlistData.data.category_id
                    });

                }
                const categoryData = await getCategory({ jwtToken: session?.user?.jwtToken })
                if (categoryData.code == 1) {
                    setCategory(categoryData.data)
                }
            } catch (error) {
                console.error('Error fetching playlist data:', error);
            }
        };

        fetchPlaylistData();
    }, [id, session?.user?.jwtToken]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                formik.setFieldValue('image', reader.result);
                setImagePreviewBool(true)
            };
            reader.readAsDataURL(file);
        }
    };

    if (!playlist) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Audio
                    height="80"
                    width="80"
                    color="#0d6efd"
                    ariaLabel="audio-loading"
                    wrapperStyle={{}}
                    wrapperClass="wrapper-class"
                    visible={true}
                />
            </div>
        );
    }

    return (
        <Layout>
            <div className="container py-5">
                <ToastContainer />
                <div className="row">
                    <div className="col-md-8 p-5 mx-auto adminForm">
                        <h1 className="mb-4 text-gradient flex items-center gap-2">
                            🎧 Edit Playlist
                        </h1>
                        <form onSubmit={formik.handleSubmit} noValidate className="mb-5">
                            <div className="mb-4">
                                <label htmlFor="name" className="form-label fw-bold">Featured Playlist Name</label>
                                <input
                                    type="text"
                                    className={`form-control rounded-pill py-2 px-3 ${formik.errors.name && formik.touched.name ? 'is-invalid' : ''}`}
                                    id="name"
                                    name="name"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.name}
                                    placeholder='Enter Play List Name or Title...'
                                />
                                {formik.errors.name && formik.touched.name && (
                                    <div className='invalid-feedback'>{formik.errors.name}</div>
                                )}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="Description" className="form-label fw-bold">Description</label>
                                <textarea
                                    className={`form-control rounded-pill py-2 px-3 ${formik.errors.name && formik.touched.name ? 'is-invalid' : ''}`}
                                    id="description"
                                    name="description"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.description}
                                    placeholder='Enter Play List Description...'
                                >{formik.values.description}</textarea>
                                {formik.errors.name && formik.touched.name && (
                                    <div className='invalid-feedback'>{formik.errors.description}</div>
                                )}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="Category" className="form-label fw-bold">Category</label>

                                <select
                                    className={`form-select ${formik.errors.category_id && formik.touched.category_id ? 'is-invalid' : ''}`}
                                    name="category_id"
                                    value={formik.values.category_id || playlist.category_id || ''}   // bind selected value here
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                >
                                    <option value="">Select Category</option>
                                    {category && category.map((item, index) => (
                                        <option key={index} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>

                                {formik.errors.category_id && formik.touched.category_id && (
                                    <div className='invalid-feedback'>{formik.errors.category_id}</div>
                                )}
                            </div>

                            <div className="mb-4">
                                <h6 className="fw-bold mb-3">Current Playlist Cover</h6>
                                <div className="card border-0 shadow-sm">
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${playlist?.image}`}
                                        alt="Current Playlist Cover"
                                        className="img-fluid rounded"
                                        style={{ height: '250px', objectFit: 'cover' }}
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="imageUpload" className="form-label fw-bold">Upload New Cover Image</label>
                                <input
                                    type="file"
                                    className={`form-control rounded-pill ${formik.errors.image && formik.touched.image ? 'is-invalid' : ''}`}
                                    id="imageUpload"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.errors.image && formik.touched.image && (
                                    <div className='invalid-feedback'>{formik.errors.image}</div>
                                )}
                            </div>
                            {imagePreviewBool && imagePreviewBool != null ? (
                                <div className="mb-4">
                                    <h6 className="fw-bold mb-3">New Cover Preview</h6>
                                    <div className="card border-0 shadow-sm">
                                        <img
                                            src={imagePreview}
                                            alt="New Playlist Cover Preview"
                                            className="img-fluid rounded"
                                            style={{ height: '250px', objectFit: 'cover' }}
                                        />
                                    </div>
                                </div>
                            ) : null}
                            <div className="d-flex gap-3">
                                <button
                                    type="submit"
                                    className="btn btn-primary rounded-pill px-4 py-2 fw-bold"
                                    style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' }}
                                    disabled={formik.isSubmitting}
                                >
                                    {formik.isSubmitting ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-bold"
                                    onClick={() => router.push('/user')}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default EditFeaturedPlaylistPage;
