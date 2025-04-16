"use client"
import { useEffect, useState } from "react";

const Weather = () => {
const [show, setShow] = useState(false);
const [forecast, setForecast] = useState<string>("");
const [temperature, setTemperature] = useState<string>("");
const [city, setCity] = useState<string>("Loading...");
const [latitude, setLatitude] = useState<number>(34.052235); // Default: Los Angeles
const [longitude, setLongitude] = useState<number>(-118.243683);

const fetchForecast = async (lat: number, lon: number) => {
    try {
    // Step 1: Get city + forecast URL
    const res = await fetch(`https://api.weather.gov/points/${lat},${lon}`);
    const data = await res.json();
    const forecastURL = data.properties.forecast;

    // Extract city name
    const cityName = data.properties.relativeLocation.properties.city;
    const stateCode = data.properties.relativeLocation.properties.state;
    setCity(`${cityName}, ${stateCode}`);

    // Step 2: Get forecast
    const forecastRes = await fetch(forecastURL);
    const forecastData = await forecastRes.json();

    setForecast(forecastData.properties.periods[0].shortForecast);
    setTemperature(forecastData.properties.periods[0].temperature);
    } catch (err) {
    console.error("Error fetching weather:", err);
    setCity("Unknown Location");
    }
};

useEffect(() => {
    setShow(true);

    if (typeof window !== "undefined" && "geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        setLatitude(lat);
        setLongitude(lon);

        fetchForecast(lat, lon);
        },
        (error) => {
        console.warn("User denied geolocation or error occurred:", error);
        fetchForecast(latitude, longitude); // fallback to default
        }
    );
    } else {
    console.log("Geolocation not supported");
    fetchForecast(latitude, longitude);
    }
}, []);

return (
    <div className="w-full flex flex-col items-center justify-center p-5 pb-0">
    <section
        className={`w-full h-full flex flex-col justify-center items-center bg-neutral-100 text-center rounded-2xl border-3 border-gray-500 shadow-lg p-8 transition-opacity duration-1000 ease-in-out ${
        show ? "opacity-100" : "opacity-0"
        }`}
    >
        <h2 className="text-2xl font-semibold">{city}</h2>
        {temperature ? (
        <p className="text-6xl font-bold">{temperature}°</p>
        ) : (
        <p className="text-4xl font-bold">--°</p>
        )}
        <p className="text-lg tracking-wide">{forecast || "Loading..."}</p>
    </section>
    </div>
);
};

export default Weather;