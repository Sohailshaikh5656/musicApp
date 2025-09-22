"use client";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllArtist } from "@/store/slice/allSlicer";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Layout from "../common/layout";
import { useRouter } from "next/navigation";
import useAuthSession from "@/app/components/getSession";
import Loader from "../common/loader";
import { useRef } from "react";
import { deleteArtist } from "@/app/utils/adminApi";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { blockArtist } from "@/app/utils/adminApi";

const AllArtistPage = () => {
  const route = useRouter();
  const [query, setQuery] = useState("");

  let allArtist = useSelector((state) => state.allSlicer.allArtist);
  const status = useSelector((state) => state.allSlicer.status);
  const dispatch = useDispatch();
  const [artistState, setArtistState] = useState(null)
  const [oldArtist, setOldArtist] = useState(null)
  const timeOutRef = useRef(null)

  const { user, sessionLoading } = useAuthSession();

  // Fetch artists when session available
  useEffect(() => {
    if (user?.jwtToken) {
      dispatch(fetchAllArtist(user.jwtToken));
    }
  }, [user?.jwtToken, dispatch]);

  // Update artistState when allArtist changes
  useEffect(() => {
    if (allArtist) {
      setArtistState(allArtist);
      setOldArtist(allArtist);
    }
  }, [allArtist]);

  // ✅ Proper combined loading check
  const isDataLoading = sessionLoading || status === "loading";

  if (isDataLoading) {
    return <Loader />;
  }

  const editArtist = (id) => {
    route.push(`/admin/editArtist/${id}`);
  };

  const deleteArtistFunc = async (id) => {
    const res = await deleteArtist({ jwtToken: user?.jwtToken, id: id })
    if (res.code == 1) {
      const updatedArtists = artistState.filter((item) => item.id != id)
      setArtistState(updatedArtists)
      setOldArtist(updatedArtists)
      notify(<div><i className="bi bi-check-circle-fill text-success"></i> Artist Deleted Successfully!</div>)
    } else {
      notify(<div><i className="bi bi-x-circle-fill text-danger"></i> Error in Deleting Artist!</div>)
    }
  }
  const blockArtistFunc = async (artist) => {
    const res = await blockArtist({ jwtToken: user?.jwtToken, id: artist.id, is_active:artist.is_active })
    if (res.code == 1) {
      const updatedArtists = artistState.map((item) => {
        if(item.id === artist.id){
          return {
            ...item,
            is_active : artist.is_active?0:1
          }
        }
        return item
      })
      setArtistState(updatedArtists)
      setOldArtist(updatedArtists)
      if(artist.is_active){

        notify(<div><i className="bi bi-check-circle-fill text-success"></i> Artist Blocked Successfully!</div>)
      }else{
        notify(<div><i className="bi bi-check-circle-fill text-success"></i> Artist UnBlocked Successfully!</div>)
      }
    } else {
      notify(<div><i className="bi bi-x-circle-fill text-danger"></i> Error in Blocked Artist!</div>)
    }
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
  const handleSearch = (searchValue) => {
    searchValue = searchValue.toLowerCase()
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current)
    }
    timeOutRef.current = setTimeout(() => {
      if (searchValue === "") {
        setArtistState(oldArtist); // Reset to original data if search is cleared
      } else {
        const filteredData = oldArtist.filter(artist =>
          (artist.name.toLowerCase().includes(searchValue)) ||
          (artist.bio.toLowerCase().includes(searchValue))
          
        );
        setArtistState(filteredData);
      }
    }, 700);
  };

  return (
    <Layout>
      <ToastContainer />
      <div className="col-10 mx-auto">
        <h2 className="mb-4 text-center">🔍 Search by Artist</h2>

        {/* Search Input */}
        <input
          type="text"
          className="form-control mb-4"
          placeholder="Search artist..."
          onChange={(e) => handleSearch(e.target.value)}
          ref={timeOutRef}
        />

        {/* Search Results */}
        <ul className="list-group">
          {Array.isArray(artistState) && artistState.length > 0 ? artistState.map((artist) => (
            <li
              key={artist.id}
              className="list-group-item d-flex align-items-center justify-content-between search-result"
            >
              <div className="d-flex align-items-center">
                <Link href={`/otherProfile/${artist.id}`}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${artist.profile_picture}`}
                    alt="Avatar"
                    width={50}
                    height={50}
                    className="rounded-circle me-3"
                  />
                </Link>
                <div>
                  <div className="fw-bold">@{artist.name}</div>
                  <small className="text-muted">{artist.bio}</small>
                </div>
              </div>
              <div className="d-flex gap-2">
                <a
                  className="btn btn-warning btn-sm"
                  title="Edit"
                  onClick={(e) => {
                    e.preventDefault();
                    editArtist(artist.id);
                  }}
                >
                  <i className="bi bi-pencil"></i>
                </a>
                <a onClick={(e) => { e.preventDefault(); deleteArtistFunc(artist.id) }} className="btn btn-danger btn-sm" title="Delete">
                  <i className="bi bi-trash"></i>
                </a>
                {artist.is_active ?
                  <a onClick={(e) => { e.preventDefault(); blockArtistFunc(artist) }} className="btn btn-secondary btn-sm" title="Block">
                    <i className="bi bi-slash-circle"></i>
                  </a> :
                  <a onClick={(e) => { e.preventDefault(); blockArtistFunc(artist) }} className="btn btn-success btn-sm" title="Unblock">
                    <i className="bi bi-check-circle"></i>
                  </a>
                }
              </div>
            </li>
          )) : (
            <li className="list-group-item text-center text-muted">
              No artists found
            </li>
          )}
        </ul>
      </div>
    </Layout>
  );
};

export default AllArtistPage;
