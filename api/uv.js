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
