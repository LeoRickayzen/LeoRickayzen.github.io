const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let mouseX = 0;
let mouseY = 0;
const mouseRadius = 30;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.radius = 2;
        this.color = '#B0E0E6';
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;
    }

    checkTextCollisions() {
        const textElements = [
            document.querySelector('h1'),
            ...document.querySelectorAll('.projects a')
        ];

        textElements.forEach(element => {
            if (element) {
                const rect = element.getBoundingClientRect();
                const padding = 5;
                const left = rect.left - padding;
                const right = rect.right + padding;
                const top = rect.top - padding;
                const bottom = rect.bottom + padding;

                if (this.x + this.radius > left && this.x - this.radius < right &&
                    this.y + this.radius > top && this.y - this.radius < bottom) {
                    
                    const distToLeft = Math.abs(this.x - left);
                    const distToRight = Math.abs(this.x - right);
                    const distToTop = Math.abs(this.y - top);
                    const distToBottom = Math.abs(this.y - bottom);
                    
                    const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);
                    
                    if (minDist === distToLeft || minDist === distToRight) {
                        this.vx = -this.vx;
                        this.x = minDist === distToLeft ? left - this.radius : right + this.radius;
                    } else {
                        this.vy = -this.vy;
                        this.y = minDist === distToTop ? top - this.radius : bottom + this.radius;
                    }
                }
            }
        });
    }

    checkMouseCollision() {
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseRadius + this.radius) {
            const angle = Math.atan2(dy, dx);
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            
            this.vx = Math.cos(angle) * speed * 1.2;
            this.vy = Math.sin(angle) * speed * 1.2;
            
            const overlap = mouseRadius + this.radius - distance;
            this.x += Math.cos(angle) * overlap;
            this.y += Math.sin(angle) * overlap;
        }
    }

    checkAvatarCollision() {
        const avatar = document.getElementById('avatar');
        const avatarLink = document.getElementById('avatar-link');
        if (avatar && avatarLink) {
            const rect = avatarLink.getBoundingClientRect();
            const avatarX = rect.left + rect.width / 2;
            const avatarY = rect.top + rect.height / 2;
            const avatarRadius = 100;

            const dx = this.x - avatarX;
            const dy = this.y - avatarY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < avatarRadius + this.radius) {
                const angle = Math.atan2(dy, dx);
                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                
                this.vx = Math.cos(angle) * speed * 1.2;
                this.vy = Math.sin(angle) * speed * 1.2;
                
                const overlap = avatarRadius + this.radius - distance;
                this.x += Math.cos(angle) * overlap;
                this.y += Math.sin(angle) * overlap;
            }
        }
    }

    checkEdgeCollisions() {
        if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
            this.vx = -this.vx;
            this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
        }
        if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
            this.vy = -this.vy;
            this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));
        }
    }

    update() {
        this.move();
        this.checkTextCollisions();
        this.checkMouseCollision();
        this.checkAvatarCollision();
        this.checkEdgeCollisions();
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

const particleCount = 100;
const particles = [];

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

const particlesCheckbox = document.getElementById('particles-checkbox');
let particlesEnabled = true;

particlesCheckbox.addEventListener('change', (e) => {
    particlesEnabled = e.target.checked;
    if (!particlesEnabled) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});

function animate() {
    if (particlesEnabled) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
    }

    requestAnimationFrame(animate);
}

animate();
