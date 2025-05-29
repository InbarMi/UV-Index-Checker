/**
 * API route handler for retrieving the current UV index based on geographic coordinates.
 *
 * Query parameters:
 * - `lat`: Latitude
 * - `lon`: Longitude
 *
 * Returns:
 * - 200 OK with JSON: { uvIndex: number } if successful
 * - 400 Bad Request if parameters are missing
 * - 500 Internal Server Error if the external weather API call fails
 *
 * Uses OpenWeatherMap One Call API (v3.0) and secures the API key via an environment variable (`WEATHER_KEY`).
 * Adds CORS headers to allow access from frontend applications.
 */
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    const lat = req.query.lat;
    const lon = req.query.lon;

    if (!lat || !lon) {
        return res.status(400).json({error: "Missing lat/lon parameters"});
    }

    try {
        const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_KEY}`);
        const data = await response.json();
        const uvIndex = data.current?.uvi ?? null;
        res.status(200).json({uvIndex});
    } catch (error) {
        console.error("Error fetching uv data:", error);
        res.status(500).json({error: "Failed to fetch UV data"});
    }
}
