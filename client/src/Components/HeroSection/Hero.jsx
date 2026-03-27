import React from 'react'
import './Hero.css'


const Hero = () => {
    return (
        <>
            <div className="carousel container-fluid">
                <div
                    id="carouselExample"
                    className="carousel slide"
                    data-bs-ride="carousel"
                >

                    {/* Indicators (Dots) */}
                    <div className="carousel-indicators">
                        <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="0" className="active"></button>
                        <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="1"></button>
                        <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="2"></button>
                        <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="3"></button>
                        <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="4"></button>
                    </div>

                    <div className="carousel-inner">

                        <div className="carousel-item active">
                            <img
                                src="https://materialdepot-images-hbh2cjbvbtfmanhx.z02.azurefd.net/application_image/floating-materials-homepage-desktop.jpg?width=800"
                                className="d-block w-100 carousel-img"
                                alt="..."
                            />
                        </div>

                        <div className="carousel-item">
                            <img
                                src="https://materialdepot-images-hbh2cjbvbtfmanhx.z02.azurefd.net/application_image/karigari-laminate-home-page-main-banner.jpg?width=800"
                                className="d-block w-100 carousel-img"
                                alt="..."
                            />
                        </div>

                        <div className="carousel-item">
                            <img
                                src="https://materialdepot-images-hbh2cjbvbtfmanhx.z02.azurefd.net/application_image/karigari-laminate-home-page-main-banner.jpg?width=800"
                                className="d-block w-100 carousel-img"
                                alt="..."
                            />
                        </div>

                        <div className="carousel-item">
                            <img
                                src="https://materialdepot-images-hbh2cjbvbtfmanhx.z02.azurefd.net/application_image/home-page-tile-main-banner-web.webp?width=800"
                                className="d-block w-100 carousel-img"
                                alt="..."
                            />
                        </div>

                        <div className="carousel-item">
                            <img
                                src="https://materialdepot-images-hbh2cjbvbtfmanhx.z02.azurefd.net/application_image/home-page-tile-main-banner-web.webp?width=800"
                                className="d-block w-100 carousel-img"
                                alt="..."
                            />
                        </div>

                    </div>

                    {/* Previous Button */}
                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#carouselExample"
                        data-bs-slide="prev"
                    >
                        <span className="carousel-control-prev-icon"></span>
                    </button>

                    {/* Next Button */}
                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#carouselExample"
                        data-bs-slide="next"
                    >
                        <span className="carousel-control-next-icon"></span>
                    </button>

                </div>
            </div>
        </>
    )
}

export default Hero