import React, { useState, useEffect } from "react";
import axios from 'axios';
import './ExistingCamps.css';
import Sidebar from "./Sidebar";
import MapComponent from './Map';
import SearchLocationInput from './GooglePlcasesApi';

function ExistingCamps() {
    axios.defaults.withCredentials = true;
    const [camps, setCamps] = useState([]);

    useEffect(() => {
        // Fetch existing camps data from the server
        axios.get("http://localhost:3001/ExistingCamps")
            .then(response => {
                setCamps(response.data);
            })
            .catch(error => {
                console.error("Error fetching existing camps:", error);
            });
    }, []);

    const nextSlide = (index) => {
        const slides = document.querySelectorAll(`#camp-${index} .image-slideshow img`);
        const totalSlides = slides.length;
        let currentSlide = 0;

        slides.forEach((slide, index) => {
            if (slide.classList.contains('active')) {
                currentSlide = index;
                slide.classList.remove('active');
            }
        });

        currentSlide = (currentSlide + 1) % totalSlides;
        slides[currentSlide].classList.add('active');
    };

    const prevSlide = (index) => {
        const slides = document.querySelectorAll(`#camp-${index} .image-slideshow img`);
        const totalSlides = slides.length;
        let currentSlide = 0;

        slides.forEach((slide, index) => {
            if (slide.classList.contains('active')) {
                currentSlide = index;
                slide.classList.remove('active');
            }
        });

        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        slides[currentSlide].classList.add('active');
    };

    return (
        <div className="existing-camps">
            <Sidebar />
            {camps.map((camp, index) => (
                <div key={camp._id} className="camp-card" id={`camp-${index}`}>
                    <h3>{camp.campName}</h3>
                    <p>Price: {camp.price}</p>
                    <div className="image-slideshow">
                        {camp.images.map((image, index) => (
                            <img key={index} src={`http://localhost:3001${image}`} alt={`Camp ${camp.campName} - Image ${index}`} className={index === 0 ? 'active' : ''} />
                        ))}
                        <button className="prev" onClick={() => prevSlide(index)}>&#10094;</button>
                        <button className="next" onClick={() => nextSlide(index)}>&#10095;</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ExistingCamps;
