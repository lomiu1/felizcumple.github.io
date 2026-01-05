// Configurar canvas de confeti
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let confettiPieces = [];
let stars = [];

// Clase para piezas de confeti
class ConfettiPiece {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 8 + 4;
        this.speedX = (Math.random() - 0.5) * 8;
        this.speedY = Math.random() * 5 + 3;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 20;
        this.color = this.getRandomColor();
        this.gravity = 0.2;
        this.life = 1;
    }

    getRandomColor() {
        const colors = ['#ff6b6b', '#4facfe', '#ffd89b', '#ff69b4', '#00ff00', '#ffd700', '#ff1493'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += this.gravity;
        this.rotation += this.rotationSpeed;
        this.life -= 0.01;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }

    isAlive() {
        return this.life > 0 && this.y < canvas.height;
    }
}

// Crear confeti
function createConfetti(x, y, amount = 30) {
    for (let i = 0; i < amount; i++) {
        confettiPieces.push(new ConfettiPiece(x, y));
    }
}

// Crear confeti desde todos los lados
function createConfettiAllSides(amount = 100) {
    // Confeti desde arriba
    for (let i = 0; i < amount / 4; i++) {
        const piece = new ConfettiPiece(Math.random() * window.innerWidth, -50);
        piece.speedY = Math.random() * 3 + 2;
        confettiPieces.push(piece);
    }
    
    // Confeti desde abajo
    for (let i = 0; i < amount / 4; i++) {
        const piece = new ConfettiPiece(Math.random() * window.innerWidth, window.innerHeight + 50);
        piece.speedY = -(Math.random() * 3 + 2);
        confettiPieces.push(piece);
    }
    
    // Confeti desde izquierda
    for (let i = 0; i < amount / 4; i++) {
        const piece = new ConfettiPiece(-50, Math.random() * window.innerHeight);
        piece.speedX = Math.random() * 3 + 2;
        confettiPieces.push(piece);
    }
    
    // Confeti desde derecha
    for (let i = 0; i < amount / 4; i++) {
        const piece = new ConfettiPiece(window.innerWidth + 50, Math.random() * window.innerHeight);
        piece.speedX = -(Math.random() * 3 + 2);
        confettiPieces.push(piece);
    }
}

// Animar confeti
function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiPieces = confettiPieces.filter(piece => piece.isAlive());

    confettiPieces.forEach(piece => {
        piece.update();
        piece.draw();
    });

    if (confettiPieces.length > 0) {
        requestAnimationFrame(animateConfetti);
    }
}

// Crear estrella
function createStar() {
    const starsContainer = document.querySelector('.stars-container');
    const star = document.createElement('div');
    
    const colors = ['star-gold', 'star-pink', 'star-cyan', 'star-purple', 'star-lime'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Tamaños variados de estrellas
    const sizes = [30, 45, 60, 75, 90];
    const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
    
    star.classList.add('star', randomColor);
    star.innerHTML = '★';
    star.style.fontSize = randomSize + 'px';
    star.style.width = randomSize + 'px';
    star.style.height = randomSize + 'px';
    
    const randomLeft = Math.random() * window.innerWidth;
    star.style.left = randomLeft + 'px';
    star.style.bottom = '-100px';
    
    starsContainer.appendChild(star);
    
    // Hacer que la estrella suba
    let bottom = -100;
    const speed = Math.random() * 1 + 0.5;
    
    const floatInterval = setInterval(() => {
        bottom += speed;
        star.style.bottom = bottom + 'px';
        
        // Movimiento horizontal suave
        const wiggle = Math.sin(bottom * 0.02) * 20;
        star.style.transform = `translateX(${wiggle}px) rotate(${wiggle * 2}deg)`;
        
        if (bottom > window.innerHeight + 100) {
            clearInterval(floatInterval);
            star.remove();
        }
    }, 30);
    
    // Click para explotar estrella
    star.addEventListener('click', function(e) {
        e.stopPropagation();
        explotarEstrella(star, randomLeft, window.innerHeight - bottom);
    });
    
    stars.push({ element: star, interval: floatInterval });
}

// Función para explotar estrella
function explotarEstrella(star, x, y) {
    // Crear confeti en la posición de la estrella
    createConfetti(x, y, 20);
    
    // Remover estrella
    star.style.opacity = '0';
    star.style.transform = 'scale(0)';
    
    setTimeout(() => {
        star.remove();
    }, 300);
    
    // Animar confeti
    animateConfetti();
}

// Función celebrar
function celebrar() {
    // Reproducir audio
    const audio = document.getElementById('birthday-music');
    audio.currentTime = 0; // Reiniciar desde el inicio
    audio.play();
    
    // Mostrar la tarta
    mostrarTarta();
    
    // Crear confeti masivo
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    createConfetti(centerX, centerY, 100);
    animateConfetti();
    
    // Crear varias estrellas
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createStar();
        }, i * 200);
    }
    
    // Efecto visual del botón
    const btn = event.target;
    btn.style.transform = 'scale(0.9)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 200);
}

// Crear estrellas iniciales al cargar
window.addEventListener('load', () => {
    // Crear muchas estrellas al inicio
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            createStar();
        }, i * 200);
    }
});

// Crear estrellas periódicamente con más frecuencia
setInterval(() => {
    if (Math.random() > 0.5) {
        createStar();
    }
}, 1500);

// Función para mostrar la tarta
function mostrarTarta() {
    const cakeContainer = document.querySelector('.cake-container');
    const cake = document.createElement('div');
    cake.classList.add('cake');
    
    const cakeImg = document.createElement('img');
    cakeImg.classList.add('cake-image');
    cakeImg.src = 'https://2.bp.blogspot.com/-j9b-XDOiKd4/VjdBMp50cPI/AAAAAAAA61E/mi_mkqwmnnQ/s1600/mine.png';
    cakeImg.alt = 'Tarta de cumpleaños';
    
    cake.appendChild(cakeImg);
    cakeContainer.appendChild(cake);
    
    // Después de 2 segundos, explotar la tarta
    setTimeout(() => {
        explotarTarta(cake);
    }, 2000);
}

// Función para explotar la tarta
function explotarTarta(cake) {
    cake.classList.add('explode');
    
    // Crear confeti desde todos los lados
    createConfettiAllSides(80);
    animateConfetti();
    
    // Remover el elemento después de la animación
    setTimeout(() => {
        cake.remove();
    }, 600);
}

// Confeti al hacer click en la página
document.addEventListener('click', (e) => {
    // No crear confeti si se hace click en el botón
    if (e.target.classList.contains('celebrate-btn')) {
        return;
    }
    
    createConfetti(e.clientX, e.clientY, 15);
    animateConfetti();
});

// Ajustar canvas cuando se redimensiona la ventana
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Iniciar animación de confeti
animateConfetti();
