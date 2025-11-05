const gameBoard = document.getElementById('game-board');

// Player
const player = document.createElement('div');
player.classList.add('player');
gameBoard.appendChild(player);

let playerLeft = 275;
player.style.left = playerLeft + 'px';
let gameIsOver = false;

function movePlayer(e) {
    if (gameIsOver) return;
    switch (e.key) {
        case 'ArrowLeft':
            if (playerLeft > 0) {
                playerLeft -= 15;
                player.style.left = playerLeft + 'px';
            }
            break;
        case 'ArrowRight':
            if (playerLeft < 550) {
                playerLeft += 15;
                player.style.left = playerLeft + 'px';
            }
            break;
    }
}

document.addEventListener('keydown', movePlayer);

// Invaders
let invaders = [];
for (let i = 0; i < 24; i++) {
    const invader = document.createElement('div');
    invader.classList.add('invader');
    gameBoard.appendChild(invader);
    invaders.push(invader);
}

let invaderDirection = 1;
let invaderLeft = 0;
let invaderTop = 30;

function moveInvaders() {
    if (gameIsOver) return;
    const firstInvader = invaders[0];
    const lastInvader = invaders[invaders.length - 1];

    if ((invaderDirection === 1 && lastInvader.offsetLeft >= 550) || (invaderDirection === -1 && firstInvader.offsetLeft <= 0)) {
        invaderDirection *= -1;
        invaderTop += 30;
    }

    invaderLeft += 5 * invaderDirection;

    for (let i = 0; i < invaders.length; i++) {
        const invader = invaders[i];
        const initialX = (i % 8) * 60 + 30;
        invader.style.left = initialX + invaderLeft + 'px';
        invader.style.top = invaderTop + Math.floor(i / 8) * 60 + 'px';

        // Game over condition
        const playerRect = player.getBoundingClientRect();
        const invaderRect = invader.getBoundingClientRect();
        if (
            invaderRect.left < playerRect.right &&
            invaderRect.right > playerRect.left &&
            invaderRect.top < playerRect.bottom &&
            invaderRect.bottom > playerRect.top
        ) {
            gameOver();
        }
    }

    // Win condition
    if (invaders.length === 0) {
        alert('You win!');
        gameIsOver = true;
        clearInterval(invaderInterval);
    }
}

let invaderInterval = setInterval(moveInvaders, 200);

// Laser
function fireLaser(e) {
    if (gameIsOver) return;
    if (e.key === ' ') {
        let laser = document.createElement('div');
        laser.classList.add('laser');
        let laserLeft = playerLeft + 20;
        let laserBottom = 70;
        laser.style.left = laserLeft + 'px';
        laser.style.bottom = laserBottom + 'px';
        gameBoard.appendChild(laser);

        function moveLaser() {
            laserBottom += 10;
            laser.style.bottom = laserBottom + 'px';

            // Collision detection
            for (let i = 0; i < invaders.length; i++) {
                const invader = invaders[i];
                const invaderRect = invader.getBoundingClientRect();
                const laserRect = laser.getBoundingClientRect();

                if (
                    laserRect.left < invaderRect.right &&
                    laserRect.right > invaderRect.left &&
                    laserRect.top < invaderRect.bottom &&
                    laserRect.bottom > invaderRect.top &&
                    !invader.classList.contains('dead')
                ) {
                    laser.remove();
                    invader.classList.add('dead');
                    invader.remove();
                    invaders.splice(i, 1);
                    clearInterval(laserInterval);
                }
            }

            if (laserBottom > 400) {
                laser.remove();
                clearInterval(laserInterval);
            }
        }
        let laserInterval = setInterval(moveLaser, 50);
    }
}

document.addEventListener('keydown', fireLaser);

// Invader Laser
function invaderFire() {
    if (gameIsOver || invaders.length === 0) return;
    const randomInvaderIndex = Math.floor(Math.random() * invaders.length);
    const invader = invaders[randomInvaderIndex];
    let laser = document.createElement('div');
    laser.classList.add('invader-laser');
    let laserLeft = invader.offsetLeft + 20;
    let laserTop = invader.offsetTop + 50;
    laser.style.left = laserLeft + 'px';
    laser.style.top = laserTop + 'px';
    gameBoard.appendChild(laser);

    function moveLaser() {
        laserTop += 5;
        laser.style.top = laserTop + 'px';

        const playerRect = player.getBoundingClientRect();
        const laserRect = laser.getBoundingClientRect();

        if (
            laserRect.left < playerRect.right &&
            laserRect.right > playerRect.left &&
            laserRect.top < playerRect.bottom &&
            laserRect.bottom > playerRect.top
        ) {
            laser.remove();
            gameOver();
            clearInterval(laserInterval);
        }

        if (laserTop > 400) {
            laser.remove();
            clearInterval(laserInterval);
        }
    }
    let laserInterval = setInterval(moveLaser, 50);
}

setInterval(invaderFire, 1000);

function gameOver() {
    alert('Game Over');
    gameIsOver = true;
    clearInterval(invaderInterval);
}
