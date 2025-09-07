"use client"
import { useEffect } from "react";
const SongImage = ({props}) =>{
    console.log("PROP DATA ============== ",props)
    if(props != undefined){
        useEffect(() => {
            const image = document.getElementById("imagetag");
            if (image && props) {
                const fileExtension = props.split('.').pop().toLowerCase();
                console.log("File Extension:", fileExtension);
                
                let image_url = process.env.NEXT_PUBLIC_IMAGE_URL;
                const extensionMap = {
                    '.mp3': 'mp3.jpg',
                    '.ogg': 'ogg.jpg', 
                    '.flac': 'flac.jpg',
                    '.acc': 'acc.jpg',
                    '.wav': 'wav.jpg',
                    '.m4a': 'm4a.jpg'
                };
                
                image_url += extensionMap[`.${fileExtension}`] || 'mp3.jpg';
                image.src = image_url;
            }
        }, [props]);

    }
    return (
        <div className="row mt-2">
            <div className="col-12 d-flex justify-content-center align-items-center" id="songImageContainer">
                <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${props}`} id="imagetag"
                style={{
                    height:"250px",
                    width : "auto",
                    borderRadius:"10px"
                }}
                />
            </div>
        </div>
    )
}
export default SongImage