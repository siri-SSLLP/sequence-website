import './AboutUsHero.css'
import image from '../../assets/aboutusimage.jpeg'

const AboutUsHero = () => {
    return (
        <>
        <div>
            <div className="about-hero-img-div">
                <img className='about-hero-img' src={image} alt="hero page"></img>
            </div>
        </div>
            
        </>
    );

};

export default AboutUsHero