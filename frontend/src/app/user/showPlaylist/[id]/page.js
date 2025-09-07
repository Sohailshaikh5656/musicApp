"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { getAllPlayList, addSongToPlayList } from "@/app/utils/apiHandler"
import Layout from "../../common/layout"

const ShowPlayListPage = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const [playLists, setPlayLists] = useState([])
  const [noPlayList, setNoPlayList] = useState(false)
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })
  const id = params.id

  const fetchPlayLists = async () => {
    try {
      setLoading(true)
      const res = await getAllPlayList({ jwtToken: session?.user?.jwtToken })
      if (res.code == 1) {
        setPlayLists(res.data)
        setNoPlayList(false)
      } else if (res.code == 2) {
        setNoPlayList(true)
        setPlayLists([])
      } else {
        setMessage({ text: "Failed to fetch playlists", type: "error" })
      }
    } catch (error) {
      console.error("Error : ", error)
      setMessage({ text: "An error occurred while fetching playlists", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const handleAddToPlaylist = async (playlistId) => {
    try {
      setLoading(true)
      const res = await addSongToPlayList({
        jwtToken: session?.user?.jwtToken,
        playlist_id: playlistId,
        song_id: id,
      })

      if (res.code == 1) {
        setMessage({ text: "Song added to playlist successfully!", type: "success" })
        setTimeout(() => {
          setMessage({ text: "", type: "" })
          router.back()
        }, 2000)
      } else {
        setMessage({ text: res.message || "Failed to add song to playlist", type: "error" })
      }
    } catch (error) {
      console.error("Error adding song to playlist: ", error)
      setMessage({ text: "An error occurred while adding the song", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const handlePlaylistSelect = (playlist) => {
    if (loading) return
    setSelectedPlaylist(playlist.id)
    handleAddToPlaylist(playlist.id)
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  useEffect(() => {
    if (session?.user?.jwtToken && playLists.length === 0) {
      fetchPlayLists()
    }
  }, [session?.user?.jwtToken])

  return (
    <Layout>
      <div className="container-fluid bg-light min-vh-100 py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="p-4 p-md-5 bg-white rounded">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary mb-2">Select a Playlist</h2>
                <p className="text-muted">Choose a playlist to add this song</p>
              </div>

              {message.text && (
                <div
                  className={`alert ${
                    message.type === "success" ? "alert-success" : "alert-danger"
                  } mb-4`}
                >
                  {message.text}
                </div>
              )}

              {loading && !message.text && !selectedPlaylist ? (
                <div className="d-flex justify-content-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : noPlayList ? (
                <div className="text-center py-4">
                  <h3 className="h4 fw-medium text-dark mb-2">No Playlists Yet</h3>
                  <p className="text-muted mb-4">You haven't created any playlists yet.</p>
                  <button
                    onClick={() => router.push("/playlists/create")}
                    className="btn btn-primary"
                  >
                    Create Your First Playlist
                  </button>
                </div>
              ) : (
                <div className="row g-3">
                  {playLists.map((playlist) => (
                    <div key={playlist.id} className="col-12">
                      <button
                        type="button"
                        onClick={() => handlePlaylistSelect(playlist)}
                        disabled={!!selectedPlaylist || loading}
                        className="w-100 text-start p-3 border rounded bg-white"
                      >
                        <div className="d-flex align-items-center">
                          <div className="flex-shrink-0 me-3">
                            <img
                              src={
                                `${process.env.NEXT_PUBLIC_IMAGE_URL}${playlist.image}` ||
                                "https://placehold.co/80x80/6f42c1/white?text=🎵"
                              }
                              alt={playlist.title || "Playlist"}
                              className="rounded"
                              style={{ width: "70px", height: "70px", objectFit: "cover" }}
                              onError={(e) => {
                                e.target.src =
                                  "https://placehold.co/80x80/6f42c1/white?text=🎵"
                              }}
                            />
                          </div>
                          <div className="flex-grow-1">
                            <h5 className="fw-semibold mb-1 text-truncate">
                              {playlist.title || "Untitled Playlist"}
                            </h5>
                            <div className="d-flex flex-wrap align-items-center text-muted small mb-1">
                              <span className="me-2">
                                <i className="bi bi-music-note-beamed me-1"></i>
                                {playlist.songCount || 0} songs
                              </span>
                              {playlist.createdAt && (
                                <>
                                  <span className="me-1">•</span>
                                  <span>
                                    <i className="bi bi-calendar3 me-1"></i>
                                    {formatDate(playlist.createdAt)}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex-shrink-0 ms-2">
                            {selectedPlaylist == playlist.id && loading ? (
                              <div
                                className="spinner-border spinner-border-sm text-primary"
                                role="status"
                              >
                                <span className="visually-hidden">Loading...</span>
                              </div>
                            ) : (
                              <i className="bi bi-plus-circle fs-5 text-primary"></i>
                            )}
                          </div>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                <button
                  onClick={() => router.back()}
                  className="btn btn-outline-secondary"
                  disabled={!!selectedPlaylist || loading}
                >
                  <i className="bi bi-arrow-left me-1"></i> Cancel
                </button>
                <button
                  onClick={() => router.push("/playlists/create")}
                  className="btn btn-primary"
                  disabled={!!selectedPlaylist || loading}
                >
                  <i className="bi bi-plus-circle me-1"></i> New Playlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css"
      />
    </Layout>
  )
}

export default ShowPlayListPage
