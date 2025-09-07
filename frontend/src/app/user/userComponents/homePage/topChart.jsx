const TopChart = ({data}) => {
    console.log("######################")
    console.log(data)
    const colorsArr = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark', 'dark']
    return (
        <section className="container py-5">
            <h2 className="fw-bold mb-5">Today's Top Charts</h2>
            <div className="row g-4">

                {data.map((item, index)=>(
                     <div key={index} className="col-md-6 col-lg-3">
                     <div className="card">
                         <div className="position-relative">
                             <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.cover_image}`} className="card-img-top" alt="Top Song" />
                                 <div className={`position-absolute top-0 end-0 bg-${colorsArr[index]} text-white px-2 py-1 m-2 rounded`}>#{index + 1}</div>
                         </div>
                         <div className="card-body">
                             <h5 className="card-title">{item.title}</h5>
                             <p className="text-muted">{item.album_name}</p>
                             <div className="d-flex justify-content-between align-items-center">
                                 <span className="text-primary">{item.play_count} streams</span>
                                 <button className="btn btn-sm btn-outline-primary"><i className="fas fa-play"></i></button>
                             </div>
                         </div>
                     </div>
                 </div>
                ))}

            </div>
        </section>
    )
}

export default TopChart