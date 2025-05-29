# SunSmart ☀️

This is a simple mobile app that shows the current UV index based on your location. This app is built with HTML, CSS, and JavaScript, and wrapped as an Android app using Capacitor. It can also run directly in the browser (hosted on Vercel). This was created as a mini learning project to explore geolocation, API integration, and mobile packaging.

## Features
- Automatically detects your location and fetches the UV index
- Color-coded UV risk levels
- Personalized safety tips for sun protection
- Manual refresh

## Running the App
### Web Version
You can try the deployed version at [uv-index-checker.vercel.app](https://uv-index-checker.vercel.app/)

### Android App

This app is packaged using Capacitor. To run locally:

> **Note:** You’ll need [Node.js](https://nodejs.org/), [Capacitor](https://capacitorjs.com/docs/getting-started), and [Android Studio](https://developer.android.com/studio) installed.

1. Clone this repository and change to the root project directory
2. Install dependencies using `npm install`
3. Add your own OpenWeather API key as a `WEATHER_KEY` environment variable (e.g., in Vercel or using `.env` for local testing)  
4. Run `npx cap sync` to sync web assets to the native platform  
5. Open the Android project with `npx cap open android`  
6. Build and run the app from Android Studio
