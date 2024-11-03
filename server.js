import express from 'express';
import axios from 'axios';
import path from 'path';


const app = express();
const PORT = process.env.PORT || 3000;


// Your OpenCage API key
const OPENCAGE_API_KEY = 'd4741bf160b94cd6bbd337367b54a84f'; // Replace with your OpenCage API key


// Function to convert Celsius to Fahrenheit
const celsiusToFahrenheit = (celsius) => (celsius * 9/5) + 32;


// Route to get the current temperature based on ZIP code
// Route to get the current temperature based on ZIP code
app.get('/temperature', async (req, res) => {
    const zipCode = req.query.zip;


    const geocodeApiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${zipCode}&key=${OPENCAGE_API_KEY}`;


    try {
        const geocodeResponse = await axios.get(geocodeApiUrl);
        console.log(geocodeResponse.data); // Log geocoding response for inspection
       
        const results = geocodeResponse.data.results;


        // Filter to find US locations, allowing for variations in naming
        const usResults = results.filter(result => {
            const country = result.components.country;
            return country === 'United States of America' || country === 'USA' || country.includes('United States');
        });


        if (usResults.length === 0) {
            return res.status(400).json({ error: 'Invalid ZIP code or not in the United States.' });
        }


        // Sort by confidence and select the best result
        const bestResult = usResults.reduce((prev, current) => {
            return (prev.confidence > current.confidence) ? prev : current;
        });


        const { lat: latitude, lng: longitude } = bestResult.geometry;
        console.log(`Geocoding: Latitude: ${latitude}, Longitude: ${longitude}`); // Log lat/lng


        const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;


        const weatherResponse = await axios.get(weatherApiUrl);
        console.log(weatherResponse.data); // Log weather response for inspection
       
        const temperatureCelsius = weatherResponse.data.current_weather.temperature;
        const temperatureFahrenheit = celsiusToFahrenheit(temperatureCelsius);


        res.json({ temperature: temperatureFahrenheit });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch temperature.' });
    }
});


// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'client', 'public', 'weather.html'));
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



