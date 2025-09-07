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
import {homePage} from "./utils/apiHandler"
import { useSession } from "next-auth/react"
import {useState, useEffect} from "react"
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
    const [TopChartData, setTopChartData] = useState([])
    const [genereData, setGenereData] = useState([])
    const [moodData, setMoodData]= useState([])
    const getData = async() =>{
        const res = await homePage({jwtToken : session?.user?.jwtToken})
        if(res.code == 1){
            setSettedData(true)
            setTopChartData(res.data?.topChart?.slice(0,8) || [])
            setGenereData(res.data?.genere)
            setMoodData(res.data?.mood)

        }
    }
    useEffect(()=>{
        if(session?.user?.jwtToken && !settedData){
            getData()
        }
    },[session?.user?.jwtToken])
    return (
        <Layout>
            {/* Hero HeroSection */}
            <HeroSection></HeroSection>
            <UserPlayList></UserPlayList>
            <FeaturedPlayList></FeaturedPlayList>
            {TopChartData && TopChartData.length>0 && <TopChart data={TopChartData} />}
            <FresherFromStudio ></FresherFromStudio>
            <ArtistSpolit></ArtistSpolit>
            <MoodBased></MoodBased>
            <Postcast></Postcast>
            <GenereSection></GenereSection>
            <BehindTheMusic></BehindTheMusic>
            <ConcertTickets></ConcertTickets>
            <DashBoardSection></DashBoardSection>
            <LyricsSong></LyricsSong>
            <MerchantiseShop></MerchantiseShop>
            <CollabrativePlayList></CollabrativePlayList>
            <AwardAndAchivement></AwardAndAchivement>
            <MusicEducation></MusicEducation>
            <ReviewSection ></ReviewSection>
            <LocalArtist></LocalArtist>
        </Layout>
    )
}
export default Home