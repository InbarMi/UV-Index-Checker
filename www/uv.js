/* document elements */
const container = document.getElementById("container");
const uvbox = document.getElementById("uv-box");
const tip = document.getElementById("current-tip");
const tipbox = document.getElementById("tips-box");
const sunIcon = document.getElementById("sun");
const tipList = document.getElementById("tips-list");
const refresh = document.getElementById("refresh");
const loader = document.getElementById("loader");
const uvTextElem = document.getElementById("uv-text");
const uvMessage = document.getElementById("uv-message");
const pageTitle = document.getElementById("page-title");

const tips = [
    "Wear broad-spectrum sunscreen with at least SPF 30.",
    "Seek shade between 10 a.m. and 4 p.m.",
    "Wear protective clothing, a wide-brimmed hat, and sunglasses.",
    "Reapply sunscreen every two hours, or after swimming or sweating.",
    "Drink plenty of water."
];

// refresh page on click
refresh.addEventListener("click", () => {
    location.reload();
});

// toggle between main uvi display and tips display
sunIcon.addEventListener("click", () => {
    const showingUV = uvbox.style.display !== "none";
    uvbox.style.display = showingUV ? "none" : "block";
    tipbox.style.display = showingUV ? "block" : "none";
    if (showingUV) {
        populateTips();
    }
});

function populateTips() {
    tipList.innerHTML = "";
    tips.forEach(tipText => {
        const li = document.createElement("li");
        li.textContent = tipText;
        tipList.appendChild(li);
    });
}

/**
 * Fetches the current UV index based on the user's geolocation.
 * Calls a backend API that handles the weather API key securely.
 */
function getUVI() {
    loader.style.display = 'block';
    uvTextElem.style.display = 'none';

    navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        console.time('fetch-uv');
        const baseUrl = window.location.hostname === 'localhost'
            ? 'https://uv-index-checker.vercel.app' // running in the Android app
            : ''; // running in the browser on Vercel

        fetch(`${baseUrl}/api/uv?lat=${lat}&lon=${long}`, {
            signal: controller.signal
        })
        .then(res => res.json())
        .then(data => {
            console.timeEnd('fetch-uv');
            clearTimeout(timeoutId);
            const uvindex = data.uvIndex ?? null;
            if (uvindex !== null) {
                updateDisplay(uvindex);
            } else {
                displayError('UV index not available.');
            }
        })
        .catch(error => {
            console.timeEnd('fetch-uv');
            clearTimeout(timeoutId);
            console.error('Error fetching UV:', error);
            if (error.name === 'AbortError') {
                displayError('Request timed out.');
            } else {
                displayError('Failed to load uv index.');
            }
        });
    }, () => {
        displayError('Geolocation permission denied.');
    }, {
        enableHighAccuracy: false,
        maximumAge: 60000,
        timeout: 10000
    });
}

/**
 * Displays error on the page
 */
function displayError(message) {
    loader.style.display = 'none';
    uvTextElem.style.display = 'block';
    uvTextElem.innerText = message;
}

/**
 * Displays the UV index with appropriate
 * color background based on the UV level
 */
function updateDisplay(uvi) {
    loader.style.display = 'none';
    uvTextElem.style.display = 'block';

    uvTextElem.innerText = uvi.toFixed(1);
    uvbox.style.color = 'white';

    if (uvi <= 2.5) {
        pageTitle.innerText = 'All Clear!'
        container.style.backgroundColor = "#32a852";
        tip.innerText = 'Estimated time to burn: 60+ minutes';
        uvMessage.innerText = 'Minimal risk. Sunscreen optional.';
    } else if (uvi <= 5.5) {
        pageTitle.innerText = 'Moderate Risk'
        container.style.backgroundColor = "#dedb33";
        tip.innerText = 'Estimated time to burn: 30–45 minutes';
        uvMessage.innerText = 'Wear sunscreen, hat, and sunglasses.';
    } else if (uvi <= 7.5) {
        pageTitle.innerText = 'High Risk';
        container.style.backgroundColor = "#de8633";
        tip.innerText = 'Estimated time to burn: 20–30 minutes';
        uvMessage.innerText = 'Limit sun exposure midday. Cover up.';
    } else if (uvi <= 10.5) {
        pageTitle.innerText = 'Very High Risk';
        container.style.backgroundColor = "#de3333";
        tip.innerText = 'Estimated time to burn: 10–20 minutes';
        uvMessage.innerText = 'Use SPF 30+, reapply often. Stay in shade.';
    } else {
        pageTitle.innerText = 'Extreme UV';
        container.style.backgroundColor = "#bb23cf";
        tip.innerText = 'Estimated time to burn: <10 minutes';
        uvMessage.innerText = 'Avoid direct sun exposure. Full protection needed.';
    }
}

/**
 * Requests permission to access the user's geolocation.
 * Returns:
 * - true if permission is already granted or granted after prompting
 * - false if permission is denied or an error occurs
 */
async function requestLocationPermission() {
    try {
        const status = await navigator.permissions.query({ name: 'geolocation' });
        if (status.state === 'granted') {
            return true;
        } else if (status.state === 'prompt') {
            // This will prompt the user
            return new Promise((resolve) => {
                navigator.geolocation.getCurrentPosition(
                    () => resolve(true),
                    () => resolve(false)
                );
            });
        } else {
            return false; // permission denied
        }
    } catch (e) {
        console.error('Permission request error:', e);
        return false;
    }
}

/**
 * Requests loccation permission and if granted
 * Gets the UVI, re-fetching the data every 10 minutes
 */
async function init() {
    const granted = await requestLocationPermission();
    if (granted) {
        getUVI();
        setInterval(getUVI, 10 * 60 * 1000); // every 10 minutes
    } else {
        uvTextElem.innerText = 'Location permission denied.';
    }
}

window.addEventListener("DOMContentLoaded", () => {
    init();
});
