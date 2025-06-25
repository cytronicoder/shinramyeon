const flash = document.getElementById('flashlight');
const lightSwitch = document.getElementById('lightSwitch');
let lightsOn = false;

window.addEventListener('mousemove', e => {
    if (!lightsOn) {
        flash.style.setProperty('--x', e.clientX + 'px');
        flash.style.setProperty('--y', e.clientY + 'px');
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