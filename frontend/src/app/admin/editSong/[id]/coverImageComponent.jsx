"use client"
import { useEffect } from "react";
const CoverImage = ({props}) =>{
    console.log("PROP DATA ============== ",props)

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
export default CoverImage