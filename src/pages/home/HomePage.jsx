import HeroSection from "../../components/heroSection/HeroSection";
import Layout from "../../components/layout/Layout";
import Category from "../../components/category/Category"
import HomePageProductCard from "../../components/homePageProductCard/HomePageProductCard";
import Track from "../../components/track/Track";
import Loader from "../../components/loader/Loader";


const HomePage = () => {
    return (
        <Layout>
            <HeroSection/>
            <Category/>
            <HomePageProductCard/>
            <Track/>
            <Loader/>
        </Layout>
    );
}

export default HomePage;