async function updatePiValue() {
    // Trigger a new calculation of Pi
    console.log('Updating and calculating Pi value...');
    await getPiValue(true);
}

async function getCurrentPiValue() {
    // Get the current Pi value without triggering a new calculation
    console.log('Getting current Pi value...');
    await getPiValue(false);
}

async function getPiValue(shouldUpdatePi = false) {
    const piValueElement = document.getElementById('piValue');
    const circumferenceElement = document.getElementById('circumference');
    const loadingElement = document.getElementById('loading');
    const getPiBtn = document.getElementById('getPiBtn');
    const updatePiBtn = document.getElementById('updatePiBtn');
    const getCurrentPiBtn = document.getElementById('getCurrentPiBtn');

    try {
        piValueElement.innerText = 'Pi value will be displayed here';
        circumferenceElement.innerText = 'Circumference of the Sun will be displayed here';
        loadingElement.style.display = 'block';

        const method = shouldUpdatePi ? 'POST' : 'GET';
        const response = await fetch('http://localhost:3000/pi', { method });
        const data = await response.json();
        const piValue = data.pi;
        piValueElement.innerText = `The value of Pi is: ${piValue}`;

        const radiusOfSun = 696340; // in kilometers
        const circumference = 2 * piValue * radiusOfSun;
        circumferenceElement.innerText = `The circumference of the Sun is approximately ${circumference.toLocaleString()} kilometers.`;
    } catch (error) {
        console.error('Error fetching Pi value:', error);
        piValueElement.innerText = 'Failed to get Pi value. Please try again later.';
        circumferenceElement.innerText = 'Failed to calculate the circumference of the Sun.';
    } finally {
        loadingElement.style.display = 'none';
        getPiBtn.disabled = false;
        updatePiBtn.disabled = false;
        getCurrentPiBtn.disabled = false;
    }
}
