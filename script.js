const flash = document.getElementById('flashlight');
const lightSwitch = document.getElementById('lightSwitch');
const warmZones = document.querySelectorAll('.warm-zone');
let lightsOn = false;

const targetDate = new Date('2025-08-03T00:00:00+09:00');

function updateCountdown() {
    const now = new Date();
    const difference = targetDate - now;

    if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    } else {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
    }
}

setInterval(updateCountdown, 1000);
updateCountdown();

function isPointInElement(x, y, element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const radius = rect.width / 2;
    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    return distance <= radius;
}

function updateFlashlightTemperature(x, y) {
    let warmth = 0;
    let inWarmZone = false;

    warmZones.forEach(zone => {
        if (isPointInElement(x, y, zone)) {
            const zoneWarmth = parseFloat(zone.dataset.warmth);
            warmth = Math.max(warmth, zoneWarmth);
            inWarmZone = true;
            zone.style.opacity = '1';
        } else {
            zone.style.opacity = '0';
        }
    });

    if (inWarmZone) {
        const warmColor = `rgba(255, ${Math.round(147 + warmth * 50)}, ${Math.round(41 + warmth * 30)}, ${0.15 * warmth})`;
        flash.style.background = `
            radial-gradient(
                circle 150px at ${x}px ${y}px,
                ${warmColor} 0%,
                transparent 20%,
                rgba(0, 0, 0, 0.05) 30%,
                rgba(0, 0, 0, 0.2) 50%,
                rgba(0, 0, 0, 0.5) 70%,
                rgba(0, 0, 0, 0.75) 85%,
                rgba(0, 0, 0, 0.9) 100%
            )
        `;
    } else {
        flash.style.background = `
            radial-gradient(
                circle 150px at ${x}px ${y}px,
                transparent 0%,
                rgba(0, 0, 0, 0.05) 30%,
                rgba(0, 0, 0, 0.2) 50%,
                rgba(0, 0, 0, 0.5) 70%,
                rgba(0, 0, 0, 0.75) 85%,
                rgba(0, 0, 0, 0.9) 100%
            )
        `;
    }
}

window.addEventListener('mousemove', e => {
    if (!lightsOn) {
        flash.style.setProperty('--x', e.clientX + 'px');
        flash.style.setProperty('--y', e.clientY + 'px');
        updateFlashlightTemperature(e.clientX, e.clientY);
    }
});

lightSwitch.addEventListener('click', () => {
    lightsOn = !lightsOn;

    if (lightsOn) {
        document.body.classList.add('lights-on');
        lightSwitch.classList.add('on');
    } else {
        document.body.classList.remove('lights-on');
        lightSwitch.classList.remove('on');
    }
});