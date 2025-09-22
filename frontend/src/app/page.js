"use client"
import Layout from "./user/common/layout"
import HeroSection from "./user/userComponents/homePage/heroSection"
import FeaturedPlayList from "./user/userComponents/homePage/featuredPlaylist"
import TopChart from "./user/userComponents/homePage/topChart"
import FresherFromStudio from "./user/userComponents/homePage/fresherFromStudio"
import ArtistSpolit from "./user/userComponents/homePage/artistSpolit"
import MoodBased from "./user/userComponents/homePage/moodBased"
import Postcast from "./user/userComponents/homePage/podCast"
import GenereSection from "./user/userComponents/homePage/genereSection"
import BehindTheMusic from "./user/userComponents/homePage/behindTheMusic"
import ConcertTickets from "./user/userComponents/homePage/concertTickets"
import DashBoardSection from "./user/userComponents/homePage/dashboardSection"
import LyricsSong from "./user/userComponents/homePage/lyricsSong"
import MerchantiseShop from "./user/userComponents/homePage/merchant"
import CollabrativePlayList from "./user/userComponents/homePage/collabrativePlayList"
import AwardAndAchivement from "./user/userComponents/homePage/awardAndAcgivement"
import MusicEducation from "./user/userComponents/homePage/musicEducation"
import ReviewSection from "./user/userComponents/homePage/reviewSection"
import LocalArtist from "./user/userComponents/homePage/localArtist"
import UserPlayList from "./user/userComponents/homePage/userPlayList"
import { ToastContainer, toast } from "react-toastify"
import { homePage } from "./utils/userApi"
import { useSession } from "next-auth/react"
import {useState, useEffect} from "react"
import { Audio } from "react-loader-spinner"

// import Testimonial from "./user/userComponents/homePage/Testimonial"
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

const Home = () =>{
    const [settedData, setSettedData] = useState(false)
    const {data:session} = useSession()
    const [TopChartData, setTopChartData] = useState(null)
    const [genereData, setGenereData] = useState(null)
    const [moodData, setMoodData]= useState(null)
    const [topArtist, setTopArtist] = useState(null)
    const [podcast, setPodcast] = useState(null)
    const [story, setStory] = useState(null)
    const [loading, setLoading]=useState(true)

    const getData = async() =>{
        const res = await homePage({jwtToken : session?.user?.jwtToken})
        console.log("Data: =============",res)
        if(res.code == 1){
            setSettedData(true)
            setTopChartData(res.data?.topChart?.slice(0,8) || [])
            setGenereData(res.data?.genere)
            setMoodData(res.data?.mood)
            setTopArtist(res.data?.topArtist)
            setPodcast(res.data?.podcast)
            setStory(res.data?.story)
            setLoading(false)
        }
    }
    const returnWarning = ()=>{
        return(
            <Layout>
                <div className="container d-flex justify-content-center align-items-center" style={{height:"100vh"}}>
                   <p>Some Thing Has Went Wrong Error : 500</p>
                </div>
            </Layout>
        )
    }
   useEffect(() => {
    const timer = setTimeout(() => {
        if (loading) {
        setLoading(false)  // loader hata do
        setSettedData(false) // isse tum error wala render dikha sakte ho
        }
    }, 30000)
    
    return () => clearTimeout(timer) // cleanup
    }, [loading])

    useEffect(()=>{
        if(session?.user?.jwtToken || !settedData || !topArtist || !podcast){
            getData()
        }
    },[session?.user?.jwtToken])

    if (!loading && !settedData) {
    return returnWarning()
    }
    if (loading) {
        return (
            <Layout>
                <div className="container d-flex justify-content-center align-items-center" style={{height:"100vh"}}>
                   <Audio/>
                </div>
            </Layout>
        )
    }
    if(!TopChartData || !genereData || !podcast ||!topArtist ){
        setLoading(false)
        return (
            <Layout>
                <div className="container d-flex justify-content-center align-items-center" style={{height:"100vh"}}>
                   <Audio/>
                </div>
            </Layout>
        )
    }
    return (
        <Layout>
            {/* Hero HeroSection */}
            <HeroSection></HeroSection>
            <UserPlayList></UserPlayList>
            <FeaturedPlayList></FeaturedPlayList>
            {TopChartData && TopChartData?.length>0 && <TopChart data={TopChartData} />}
            <FresherFromStudio ></FresherFromStudio>
            {topArtist && topArtist?.length>0 && <ArtistSpolit data={topArtist} />}
            {genereData && genereData?.length>0 && <MoodBased data={genereData} />}
            {podcast && podcast?.length>0 && <Postcast data={podcast} />}
            {story && story?.length>0 && <BehindTheMusic data={story}></BehindTheMusic>}
            {/* <ConcertTickets></ConcertTickets> */}
            <DashBoardSection></DashBoardSection>
            <LyricsSong></LyricsSong>
            {/* <MerchantiseShop></MerchantiseShop> */}
            {/* <CollabrativePlayList></CollabrativePlayList> */}
            <AwardAndAchivement></AwardAndAchivement>
            <MusicEducation></MusicEducation>
            <ReviewSection ></ReviewSection>
            <LocalArtist></LocalArtist>
        </Layout>
    )
}
export default Home