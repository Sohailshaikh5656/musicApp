"use client"
import { useRouter } from "next/navigation"

const TopChart = ({data}) => {
    const router = useRouter()
    const colorsArr = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark', 'dark']
    
    return (
        <section className="container py-5">
            <h2 className="fw-bold mb-5">Today's Top Charts</h2>
            <div className="row g-4">

                {data.map((item, index)=>(
                     <div key={index} className="col-md-6 col-lg-3" onClick={()=>{router.push(`/user/playSong2/${item.id}`)}}>
                     <div className="card h-100 d-flex flex-column">
                         <div className="position-relative flex-grow-0">
                             <img 
                                 src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.cover_image}`} 
                                 className="card-img-top object-fit-cover" 
                                 alt="Top Song" 
                                 style={{ height: "200px" }}
                             />
                             <div className={`position-absolute top-0 end-0 bg-${colorsArr[index]} text-white px-2 py-1 m-2 rounded`}>#{index + 1}</div>
                         </div>
                         <div className="card-body d-flex flex-column flex-grow-1">
                             <h5 className="card-title text-truncate">{item.title}</h5>
                             <p className="text-muted mb-2 text-truncate">{item.album_name}</p>
                             <div className="d-flex justify-content-between align-items-center mt-auto">
                                 <span className="text-primary">{item.play_count} streams</span>
                                 <button className="btn btn-sm btn-outline-primary">
                                    <i className="bi bi-play-fill"></i>
                                 </button>
                             </div>
                         </div>
                     </div>
                 </div>
                ))}

            </div>
            
            <style jsx>{`
                .card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    cursor: pointer;
                }
                .card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }
                .object-fit-cover {
                    object-fit: cover;
                }
            `}</style>
        </section>
    )
}

export default TopChart