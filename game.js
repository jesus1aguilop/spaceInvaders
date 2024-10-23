class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;

        // Inicializar jugador
        this.player = {
            x: this.canvas.width / 2,
            y: this.canvas.height - 30,
            width: 50,
            height: 30,
            speed: 5
        };

        // Inicializar enemigos
        this.enemies = [];
        this.createEnemies();

        // Inicializar disparos
        this.bullets = [];

        // Controles
        this.keys = {};

        // Inicializar dirección y velocidad de los enemigos
        this.enemyDirection = 1; // 1 para derecha, -1 para izquierda
        this.enemySpeed = 1;

        // Estado del juego
        this.gamePaused = false;

        // Iniciar el juego
        this.gameLoop();
        this.setupEventListeners();
    }
    createEnemies() {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 10; j++) {
                this.enemies.push({
                    x: j * 60 + 50,
                    y: i * 50 + 30,
                    width: 40,
                    height: 30
                });
            }
        }
    }

    setupEventListeners() {
        // Escuchar eventos de teclado
        window.addEventListener('keydown', (e) => this.keys[e.code] = true);
        window.addEventListener('keyup', (e) => this.keys[e.code] = false);
    }

    movePlayer() {
        // Mover jugador izquierda/derecha
        if (this.keys['ArrowLeft'] && this.player.x > 0) {
            this.player.x -= this.player.speed;
        }
        if (this.keys['ArrowRight'] && this.player.x < this.canvas.width - this.player.width) {
            this.player.x += this.player.speed;
        }

        // Disparar
        if (this.keys['Space']) {
            this.shoot();
            this.keys['Space'] = false; // Evitar disparo continuo
        }
    }

    shoot() {
        this.bullets.push({
            x: this.player.x + this.player.width / 2,
            y: this.player.y,
            width: 3,
            height: 10,
            speed: 7
        });
    }

    updateBullets() {
        this.bullets.forEach((bullet, index) => {
            bullet.y -= bullet.speed;
            if (bullet.y < 0) {
                this.bullets.splice(index, 1);
            }
        });
    }

    checkCollisions() {
        this.bullets.forEach((bullet, bulletIndex) => {
            this.enemies.forEach((enemy, enemyIndex) => {
                if (
                    bullet.x < enemy.x + enemy.width &&
                    bullet.x + bullet.width > enemy.x &&
                    bullet.y < enemy.y + enemy.height &&
                    bullet.y + bullet.height > enemy.y
                ) {
                    // Colisión detectada
                    this.bullets.splice(bulletIndex, 1);
                    this.enemies.splice(enemyIndex, 1);
                }
            });
        });
    }

    draw() {
        // Limpiar canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Dibujar jugador
        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);

        // Dibujar enemigos
        this.ctx.fillStyle = 'red';
        this.enemies.forEach(enemy => {
            this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        });

        // Dibujar balas
        this.ctx.fillStyle = 'white';
        this.bullets.forEach(bullet => {
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
    }

    gameLoop() {
        this.movePlayer();
        this.updateBullets();
        this.checkCollisions();
        this.draw();

        requestAnimationFrame(() => this.gameLoop());
    }
    moveEnemies() {
        let changeDirection = false;

        this.enemies.forEach(enemy => {
            enemy.x += this.enemySpeed * this.enemyDirection;

            // Verificar si algún enemigo toca los bordes
            if (enemy.x <= 0 || enemy.x + enemy.width >= this.canvas.width) {
                changeDirection = true;
            }
        });

        // Cambiar dirección y mover hacia abajo si es necesario
        if (changeDirection) {
            this.enemyDirection *= -1;
            this.enemies.forEach(enemy => {
                enemy.y += 20; // Mover hacia abajo
            });
        }
    }

    checkVictory() {
        if (this.enemies.length === 0) {
            this.pauseGame();
            if (confirm("¡Felicidades! Has derrotado a todos los invasores. ¿Quieres jugar de nuevo?")) {
                this.restart();
            }
        }
    }

    pauseGame() {
        this.gamePaused = true;
    }

    resumeGame() {
        this.gamePaused = false;
        this.gameLoop();
    }

    restart() {
        // Reiniciar el juego
        this.enemies = [];
        this.createEnemies();
        this.bullets = [];
        this.player.x = this.canvas.width / 2;
        this.gamePaused = false;
        this.gameLoop();
    }

    gameLoop() {
        if (this.gamePaused) return;

        this.movePlayer();
        this.moveEnemies();
        this.updateBullets();
        this.checkCollisions();
        this.checkVictory();
        this.draw();

        requestAnimationFrame(() => this.gameLoop());
    }
}



// Iniciar el juego cuando se carga la página
window.onload = () => new Game();