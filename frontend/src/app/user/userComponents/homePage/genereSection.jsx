"use client"
import { useRouter } from "next/navigation"
const GenereSection = ({data}) => {
    // console.log("Data : ",data)
    return (
        <section className="container py-5">
            <h2 className="fw-bold mb-5">Explore By Genre</h2>
            <div className="row g-3">
            {data?.length>0 && data.map((item, index)=>(
                <div key={index} className="col-6 col-md-3" style={{cursor:"pointer"}} onClick={()=>{
                    useRouter().push(`user/generePlayList/${item.id}`)
                }}>
                    <div className="genre-card" style={{background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${process.env.NEXT_PUBLIC_IMAGE_URL}${item.image || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'}) center/cover`}}>
                        <div className="text-center">
                            <i className="fas fa-guitar genre-icon"></i>
                            <div>{item.name}</div>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        </section>
    )
}
export default GenereSection