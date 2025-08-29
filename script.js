class Fighter {
    constructor(element, x, y, health, controls) {
        this.element = element;
        this.x = x;
        this.y = y;
        this.health = health;
        this.maxHealth = health;
        this.controls = controls;
        this.isPunching = false;
        this.punchCooldown = false;
        this.updatePosition();
    }

    updatePosition() {
        this.element.style.left = this.x + 'px';
        this.element.style.bottom = this.y + 'px';
    }

    moveLeft() {
        if (this.x > 50) {
            this.x -= 10;
            this.updatePosition();
        }
    }

    moveRight() {
        if (this.x < window.innerWidth - 130) {
            this.x += 10;
            this.updatePosition();
        }
    }

    moveUp() {
        if (this.y < window.innerHeight - 220) {
            this.y += 10;
            this.updatePosition();
        }
    }

    moveDown() {
        if (this.y > 50) {
            this.y -= 10;
            this.updatePosition();
        }
    }

    punch() {
        if (this.punchCooldown) return;
        
        this.isPunching = true;
        this.element.classList.add('punching');
        this.punchCooldown = true;

        // Check if punch hits opponent
        const opponent = this === player1 ? player2 : player1;
        const distance = Math.abs(this.x - opponent.x);
        
        if (distance < 100) {
            opponent.takeDamage(20);
        }

        setTimeout(() => {
            this.isPunching = false;
            this.element.classList.remove('punching');
        }, 200);

        setTimeout(() => {
            this.punchCooldown = false;
        }, 500);
    }

    takeDamage(damage) {
        this.health -= damage;
        this.health = Math.max(0, this.health);
        
        this.element.classList.add('hit');
        setTimeout(() => {
            this.element.classList.remove('hit');
        }, 300);

        this.updateHealthBar();

        if (this.health <= 0) {
            endGame(this === player1 ? 'Player 2' : 'Player 1');
        }
    }

    updateHealthBar() {
        const healthPercent = (this.health / this.maxHealth) * 100;
        const healthBar = this === player1 ? 
            document.getElementById('health1') : 
            document.getElementById('health2');
        healthBar.style.width = healthPercent + '%';
    }
}

let player1, player2;
let gameActive = true;
let keys = {};

function initGame() {
    const player1Element = document.getElementById('player1');
    const player2Element = document.getElementById('player2');
    
    player1 = new Fighter(player1Element, 100, 50, 100, {
        left: 'a',
        right: 'd',
        up: 'w',
        down: 's',
        punch: 'f'
    });

    player2 = new Fighter(player2Element, window.innerWidth - 180, 50, 100, {
        left: 'k',
        right: ';',
        up: 'o',
        down: 'l',
        punch: 'j'
    });

    player1.updateHealthBar();
    player2.updateHealthBar();
}

function handleInput() {
    if (!gameActive) return;

    // Player 1 controls
    if (keys['a'] || keys['A']) player1.moveLeft();
    if (keys['d'] || keys['D']) player1.moveRight();
    if (keys['w'] || keys['W']) player1.moveUp();
    if (keys['s'] || keys['S']) player1.moveDown();
    if (keys['f'] || keys['F']) player1.punch();

    // Player 2 controls
    if (keys['k'] || keys['K']) player2.moveLeft();
    if (keys[';']) player2.moveRight();
    if (keys['o'] || keys['O']) player2.moveUp();
    if (keys['l'] || keys['L']) player2.moveDown();
    if (keys['j'] || keys['J']) player2.punch();
}

function endGame(winner) {
    gameActive = false;
    document.getElementById('winner').textContent = winner + ' Wins!';
    document.getElementById('gameOver').style.display = 'block';
}

function restartGame() {
    gameActive = true;
    document.getElementById('gameOver').style.display = 'none';
    
    // Reset fighters
    player1.health = player1.maxHealth;
    player2.health = player2.maxHealth;
    player1.x = 100;
    player1.y = 50;
    player2.x = window.innerWidth - 180;
    player2.y = 50;
    
    player1.updatePosition();
    player2.updatePosition();
    player1.updateHealthBar();
    player2.updateHealthBar();
    
    // Clear all states
    player1.element.className = 'fighter player1';
    player2.element.className = 'fighter player2';
    player1.isPunching = false;
    player2.isPunching = false;
    player1.punchCooldown = false;
    player2.punchCooldown = false;
}

// Event listeners
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Game loop
function gameLoop() {
    handleInput();
    requestAnimationFrame(gameLoop);
}

// Initialize game when page loads
window.addEventListener('load', () => {
    initGame();
    gameLoop();
});

// Handle window resize
window.addEventListener('resize', () => {
    if (player2) {
        player2.x = Math.min(player2.x, window.innerWidth - 130);
        player2.updatePosition();
    }
});
