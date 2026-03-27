import React from 'react'
import Hero from '../Components/HeroSection/Hero'
import ApplicationCategory from '../Components/ApplicationCategory/ApplicationCategory'
import NewLaunch from '../Components/NewLaunch/NewLaunch'
import CategorySection from '../Components/CategorySection/CategorySection'
import PhotoLinks from '../Components/PhotoLinks/PhotoLinks'
import Theme from '../Components/Theme/Theme'
import Inspiration from '../Components/Inspiration/Inspiration'
import Trending from '../Components/Trending/Trending'

import LovedSection from '../Components/LovedSection/LovedSection'

const Home = () => {
    return (
        <div>
            <Hero></Hero>
            <NewLaunch></NewLaunch>
            <ApplicationCategory name='Find Your Perfect Fit' title='Application'></ApplicationCategory>
            <CategorySection name='Explore Our Categories'></CategorySection>
            <PhotoLinks link='3Dvisualisation'></PhotoLinks>
            <Theme></Theme>
            <Inspiration></Inspiration>
            <Trending></Trending>
            <LovedSection></LovedSection>
            <PhotoLinks link='3Dvisualisation'></PhotoLinks>
        </div>
    );
};

export default Home