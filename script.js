const flash = document.getElementById('flashlight');
const lightSwitch = document.getElementById('lightSwitch');
const warmZones = document.querySelectorAll('.warm-zone');
let lightsOn = false;

// const targetDate = new Date('2025-08-03T00:00:00+09:00');

// function updateCountdown() {
//     const now = new Date();
//     const difference = targetDate - now;

//     if (difference > 0) {
//         const days = Math.floor(difference / (1000 * 60 * 60 * 24));
//         const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//         const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
//         const seconds = Math.floor((difference % (1000 * 60)) / 1000);

//         document.getElementById('days').textContent = days.toString().padStart(2, '0');
//         document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
//         document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
//         document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
//     } else {
//         document.getElementById('days').textContent = '00';
//         document.getElementById('hours').textContent = '00';
//         document.getElementById('minutes').textContent = '00';
//         document.getElementById('seconds').textContent = '00';
//     }
// }

// setInterval(updateCountdown, 1000);
// updateCountdown();

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


class BirthdayCake {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('cake-canvas'),
            alpha: true,
            antialias: true
        });

        this.candles = [];
        this.candleLights = [];
        this.litCandles = 0;

        this.init();
    }

    init() {
        this.renderer.setSize(300, 300);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.camera.position.set(0, 3, 5);
        this.camera.lookAt(0, 0, 0);

        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        this.createCake();
        this.createCandles();
        this.setupControls();
        this.animate();
    }

    createCake() {
        const baseGeometry = new THREE.CylinderGeometry(3, 3, 1.2, 32);
        const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Brown
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -0.6;
        base.castShadow = true;
        base.receiveShadow = true;
        this.scene.add(base);

        const frostingGeometry = new THREE.CylinderGeometry(2.7, 2.7, 0.9, 32);
        const frostingMaterial = new THREE.MeshLambertMaterial({ color: 0xFFB6C1 }); // Pink
        const frosting = new THREE.Mesh(frostingGeometry, frostingMaterial);
        frosting.position.y = 0.45;
        frosting.castShadow = true;
        frosting.receiveShadow = true;
        this.scene.add(frosting);

        for (let i = 0; i < 8; i++) {
            const cherryGeometry = new THREE.SphereGeometry(0.15, 8, 8);
            const cherryMaterial = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
            const cherry = new THREE.Mesh(cherryGeometry, cherryMaterial);

            const angle = (i / 8) * Math.PI * 2;
            cherry.position.x = Math.cos(angle) * 2.0;
            cherry.position.z = Math.sin(angle) * 2.0;
            cherry.position.y = 0.9;
            cherry.castShadow = true;
            this.scene.add(cherry);
        }
    }

    createCandles() {
        const candleCount = 7;

        for (let i = 0; i < candleCount; i++) {
            const candleGeometry = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8);
            const candleMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFACD });
            const candle = new THREE.Mesh(candleGeometry, candleMaterial);

            const angle = (i / candleCount) * Math.PI * 2;
            candle.position.x = Math.cos(angle) * 1.2;
            candle.position.z = Math.sin(angle) * 1.2;
            candle.position.y = 1.5;
            candle.castShadow = true;

            const wickGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.15, 4);
            const wickMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
            const wick = new THREE.Mesh(wickGeometry, wickMaterial);
            wick.position.y = 0.675;
            candle.add(wick);

            const flameGeometry = new THREE.SphereGeometry(0.12, 6, 6);
            const flameMaterial = new THREE.MeshBasicMaterial({
                color: 0xFFA500,
                transparent: true,
                opacity: 0
            });
            const flame = new THREE.Mesh(flameGeometry, flameMaterial);
            flame.position.y = 0.825;
            flame.scale.y = 1.5;
            candle.add(flame);

            const flameLight = new THREE.PointLight(0xFFA500, 0, 3);
            flameLight.position.copy(flame.position);
            flameLight.position.y += 0.15;
            candle.add(flameLight);

            this.scene.add(candle);
            this.candles.push({ candle, flame, flameLight, lit: false });
        }
    }

    setupControls() {
        const canvas = document.getElementById('cake-canvas');

        canvas.addEventListener('click', (event) => {
            const rect = canvas.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera({ x, y }, this.camera);

            const candleMeshes = this.candles.map(c => c.candle);
            const intersects = raycaster.intersectObjects(candleMeshes);

            if (intersects.length > 0) {
                const clickedCandle = intersects[0].object;
                const candleData = this.candles.find(c => c.candle === clickedCandle);

                if (candleData && !candleData.lit) {
                    this.lightCandle(candleData);
                }
            }
        });
    }

    lightCandle(candleData) {
        candleData.lit = true;
        candleData.flame.material.opacity = 0.9;
        candleData.flameLight.intensity = 0.5;
        this.litCandles++;

        const animateFlame = () => {
            if (candleData.lit) {
                candleData.flame.scale.x = 1 + Math.sin(Date.now() * 0.01) * 0.1;
                candleData.flame.scale.z = 1 + Math.cos(Date.now() * 0.008) * 0.1;
                candleData.flameLight.intensity = 0.5 + Math.sin(Date.now() * 0.005) * 0.1;
            }
        };

        this.animateFlame = animateFlame;

        if (this.litCandles === this.candles.length) {
            setTimeout(() => this.celebrationEffect(), 1000);
        }
    }

    celebrationEffect() {
        const particleCount = 50;
        const particles = new THREE.Group();

        for (let i = 0; i < particleCount; i++) {
            const particleGeometry = new THREE.SphereGeometry(0.02, 4, 4);
            const particleMaterial = new THREE.MeshBasicMaterial({
                color: Math.random() * 0xffffff
            });
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);

            particle.position.set(
                (Math.random() - 0.5) * 4,
                2 + Math.random() * 2,
                (Math.random() - 0.5) * 4
            );

            particle.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.1,
                Math.random() * 0.1,
                (Math.random() - 0.5) * 0.1
            );

            particles.add(particle);
        }

        this.scene.add(particles);

        const animateParticles = () => {
            particles.children.forEach(particle => {
                particle.position.add(particle.velocity);
                particle.velocity.y -= 0.003; // gravity

                if (particle.position.y < -2) {
                    particle.position.y = 4;
                    particle.velocity.y = Math.random() * 0.1;
                }
            });

            setTimeout(animateParticles, 16);
        };

        animateParticles();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.scene.rotation.y += 0.005;

        if (this.animateFlame) {
            this.animateFlame();
        }

        this.renderer.render(this.scene, this.camera);
    }

    show() {
        document.getElementById('cake-container').classList.add('visible');
    }

    hide() {
        document.getElementById('cake-container').classList.remove('visible');
    }
}


let birthdayCake;
window.addEventListener('load', () => {
    birthdayCake = new BirthdayCake();
});

window.addEventListener('mousemove', e => {
    if (!lightsOn) {
        flash.style.setProperty('--x', e.clientX + 'px');
        flash.style.setProperty('--y', e.clientY + 'px');
        updateFlashlightTemperature(e.clientX, e.clientY);
        if (e.clientY > window.innerHeight * 0.6 && birthdayCake) {
            birthdayCake.show();
        } else if (birthdayCake) {
            birthdayCake.hide();
        }
    }
});
