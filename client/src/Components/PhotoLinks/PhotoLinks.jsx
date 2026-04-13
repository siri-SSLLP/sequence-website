import './PhotoLinks.css'
import { Link } from 'react-router-dom'

const PhotoLinks = ({link}) => {
    return (
        <>
            <div className='phtlk-outer' >
                <Link to={`/${link}`}>
                    <img className='phtlk-img' src='https://materialdepot-images-hbh2cjbvbtfmanhx.z02.azurefd.net/application_image/3d-visualization-banner-web.webp?width=500' alt='banner image for link'></img>
                </Link>
            </div>
        </>
    )
}

export default PhotoLinks