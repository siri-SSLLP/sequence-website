import './Trending.css'
import "./Trending.css";
import { trendingCollections } from "../../assets/assets";
import { Link } from 'react-router-dom';


const Trending = () => {

    return (
        <>
            <div>
                <div className="trending-container">
                    {/* TITLE */}
                    <h2 className="trending-title">Trending Collections</h2>
                    {/* GRID */}
                    <div className="trending-grid">
                        {trendingCollections.map((item, index) => (
                            <div className="trending-card" key={index}>
                                <Link to={`/trends ${item.name}`}>
                                    <img
                                        src={`${item.image}?auto=format&fit=crop&w=600&q=80`}
                                        alt={item.name}
                                    />
                                </Link>
                                <p className="trending-name">{item.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Trending