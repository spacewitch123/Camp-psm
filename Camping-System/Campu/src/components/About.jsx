import React from 'react';
import Footer from './Footer';
import './About.css';
import backgroundVideo from '../assets/backgroundVideo.mp4'

function About() {
    return (

        <div className="About">
            <video className="background-video" autoPlay loop muted>
                <source src={backgroundVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="content-wrapper">
                <div className="home-content">

                    <h1>About Us</h1>
                    <p>This System Is Developed By UTM to Provide A Complete Streamlined Process For the Booking Camps Accorss Malaysia.</p>
                </div>
            </div>

        </div>
    );
}

export default About;
