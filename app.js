const proposalContainer = document.getElementById('proposalContainer');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
const loveMessage = document.getElementById('loveMessage');

// Configuración inicial
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];
let animationId;
let isFireworksActive = false;
let gradientInterval;

// Clase para partículas individuales
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = Math.random() * 2 + 1;
        this.velocity = {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 8
        };
        this.alpha = 1;
        this.gravity = 0.02;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.008;
        this.draw();
    }
}

// Clase para fuegos artificiales
class Firework {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetY = Math.random() * (canvas.height / 2);
        this.speed = 15;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.particles = [];
        this.exploded = false;
    }

    launch() {
        this.y -= this.speed;
        
        if(this.y <= this.targetY) {
            this.explode();
        }
    }

    explode() {
        for(let i = 0; i < 100; i++) {
            this.particles.push(new Particle(this.x, this.y, this.color));
        }
        this.exploded = true;
    }

    update() {
        if(!this.exploded) {
            this.launch();
        } else {
            this.particles.forEach((particle, index) => {
                if(particle.alpha <= 0) {
                    this.particles.splice(index, 1);
                } else {
                    particle.update();
                }
            });
        }
    }
}

// Animación principal
function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach((firework, index) => {
        firework.update();
        if(firework.exploded && firework.particles.length === 0) {
            fireworks.splice(index, 1);
        }
    });

    if(isFireworksActive && Math.random() < 0.05) {
        fireworks.push(new Firework());
    }

    animationId = requestAnimationFrame(animate);
}

// Event Listeners
noBtn.addEventListener('mouseover', () => {
    const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
    const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);
    noBtn.style.transform = `translate(${x}px, ${y}px)`;
});

noBtn.addEventListener('click', () => {
    const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
    const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);
    noBtn.style.transform = `translate(${x}px, ${y}px)`;
});

yesBtn.addEventListener('click', () => {
    proposalContainer.style.opacity = '0';
    loveMessage.style.display = 'block';
    
    setTimeout(() => {
        proposalContainer.style.display = 'none';
        canvas.style.opacity = '1';
        loveMessage.style.opacity = '1';
        isFireworksActive = true;
        
        // Animación del gradiente
        gradientInterval = setInterval(() => {
            loveMessage.style.background = `linear-gradient(
                ${Math.random() * 360}deg, 
              
            )`;
        }, 2000);
        
        animate();
    }, 1000);
});

// Resize handler
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Limpiar al cerrar
window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(animationId);
    clearInterval(gradientInterval);
});