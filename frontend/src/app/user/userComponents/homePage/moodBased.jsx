"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
const MoodBased = ({data}) => {
    const router = useRouter()
    
    return (
      <div className="container mt-4 mb-5">
        <h2 className="fw-bold mb-5">Mood Genere</h2>
        
        {/* Compact genre cards with horizontal expand on hover */}
        <div className="genre-container mt-4">
          {data && data.length > 0 ? (
            <div className="genre-grid">
              {data.map((item, index) => (
                <div key={index} className="genre-card">
                  <div className="genre-image-container">
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.image}`}
                      alt={item.name}
                      className="genre-img"
                    />
                    <div className="genre-overlay">
                      <h5 className="genre-name">{item.name}</h5>
                      <div className="genre-actions">
                        <Link className="btn btn-dark rounded-pill px-3 py-2" href={`/user/generePlayList/${item.id}`}>
                          Listen Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <h5 className="text-center text-muted">No Genre Found!</h5>
          )}
        </div>
        
        <style jsx>{`
          .genre-container {
            padding: 0 15px;
          }
            .container{
                margin-bottom:200px;
            }
          
          .genre-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            justify-content: center;
          }
          
          .genre-card {
            position: relative;
            width: 100px;
            height: 320px;
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            flex-shrink: 0;
          }
          
          .genre-card:hover {
            width: 400px;
            z-index: 10;
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
          }
          
          .genre-image-container {
            width: 100%;
            height: 100%;
            position: relative;
          }
          
          .genre-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
          }
          
          .genre-card:hover .genre-img {
            transform: scale(1.05);
          }
          
          .genre-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            padding: 15px;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            opacity: 0;
          }
          
          .genre-card:hover .genre-overlay {
            opacity: 1;
            backdrop-filter: blur(5px);
          }
          
          .genre-name {
            font-weight: 700;
            font-size: 0;
            margin: 0;
            color: white;
            text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.6);
            text-align: center;
            transition: all 0.3s ease 0.2s;
          }
          
          .genre-card:hover .genre-name {
            font-size: 24px;
            margin-bottom: 15px;
          }
          
          .genre-actions {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease 0.3s;
          }
          
          .genre-card:hover .genre-actions {
            opacity: 1;
            transform: translateY(0);
          }
          
          @media (max-width: 768px) {
            .genre-card {
              width: 60px;
              height: 170px;
            }
            
            .genre-card:hover {
              width: 350px;
            }
            
            .genre-grid {
              gap: 12px;
            }
          }
          
          @media (max-width: 576px) {
            .genre-card {
              width: 50px;
              height: 140px;
            }
            
            .genre-card:hover {
              width: 300px;
            }
            
            .genre-grid {
              gap: 10px;
            }
            
            .genre-card:hover .genre-name {
              font-size: 20px;
            }
          }
        `}</style>
      </div>
    )
}

export default MoodBased