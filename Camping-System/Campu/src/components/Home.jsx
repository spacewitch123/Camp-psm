import React from 'react';
import './Home.css';
import backgroundVideo from '../assets/backgroundVideo.mp4'

function Home() {
    return (
        <div className="Home">
            <video className="background-video" autoPlay loop muted>
                <source src={backgroundVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="content-wrapper">
                <div className="home-content">
                    <h1>Welcome To Camping System</h1>
                    <p>Your one stop for finding and reserving camps across Malaysia.</p>
                </div>
            </div>
        </div>
    );
}

export default Home;
