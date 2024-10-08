const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("scoreEl");
const MAP_ROWS = 13;
const MAP_COLUMNS = 11;
canvas.width = Boundary.width * MAP_COLUMNS;
canvas.height = Boundary.height * MAP_ROWS;

const pellets = [];
const powerUps = [];
let ghost = [];

let player = {};

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

let lastKey = "";
let score = 0;
let animationId;
let prevMs = Date.now();
let accumulatedTime = 0;
const ghostReleasedIntervals = [0, 2, 4, 6];

const boundaries = generateBoundaries();

const game = {
  reset() {
    accumulatedTime = 0;
    player = new Player({
      position: {
        x: Boundary.width + Boundary.width / 2,
        y: Boundary.height + Boundary.height / 2,
      },
      velocity: {
        x: 0,
        y: 0,
      },
    });

    ghost = [
      new Ghost({
        position: {
          x: Boundary.width * 5 + Boundary.width / 2,
          y: Boundary.height * 5 + Boundary.height / 2,
        },
        velocity: {
          x: Ghost.speed * (Math.random() < 0.5) ? -1 : 1,
          y: 0,
        },
        imgSrc: "./img/sprites/redGhost.png",
        state: "active",
      }),
      new Ghost({
        position: {
          x: Boundary.width * 5 + Boundary.width / 2,
          y: Boundary.height * 6 + Boundary.height / 2,
        },
        velocity: {
          x: Ghost.speed * (Math.random() < 0.5) ? -1 : 1,
          y: 0,
        },
        imgSrc: "./img/sprites/greenGhost.png",
      }),
      new Ghost({
        position: {
          x: Boundary.width * 6 + Boundary.width / 2,
          y: Boundary.height * 6 + Boundary.height / 2,
        },
        velocity: {
          x: Ghost.speed * (Math.random() < 0.5) ? -1 : 1,
          y: 0,
        },
        imgSrc: "./img/sprites/orangeGhost.png",
      }),
      new Ghost({
        position: {
          x: Boundary.width * 4 + Boundary.width / 2,
          y: Boundary.height * 6 + Boundary.height / 2,
        },
        velocity: {
          x: Ghost.speed * (Math.random() < 0.5) ? -1 : 1,
          y: 0,
        },
        imgSrc: "./img/sprites/yellowGhost.png",
      }),
    ];
  },

  initStart() {
    player.state = "paused";
    ghost.forEach((ghostNow) => {
      ghostNow.state = null;
    });

    setTimeout(() => {
      ghost[0].state = "active";
      ghost.forEach((actualGhost, i) => {
        if (i === 0) return;
        else ghost.state = null;
      });

      player.state = "active";
    }, 1000);
  },
};

game.reset();

function animate() {
  animationId = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const currentMs = Date.now();
  const delta = (currentMs - prevMs) / 1000;
  prevMs = currentMs;

  if (player.state === "active") accumulatedTime += delta;

  if (keys.w.pressed && lastKey === "w") player.move("up");
  else if (keys.a.pressed && lastKey === "a") player.move("left");
  else if (keys.s.pressed && lastKey === "s") player.move("down");
  else if (keys.d.pressed && lastKey === "d") player.move("right");

  //detect collision between ghosts and player

  //ghost touches player
  for (let i = ghost.length - 1; 0 <= i; i--) {
    const actualGhost = ghost[i];

    if (
      Math.hypot(
        actualGhost.position.x - player.position.x,
        actualGhost.position.y - player.position.y
      ) <
        actualGhost.radius + player.radius &&
      player.state === "active"
    ) {
      if (actualGhost.scared) {
        ghost.splice(i, 1);
      } else {
        player.die();
        ghost.forEach((ghostNow) => {
          ghostNow.state = "paused";
        });
      }
    }
  }

  // win condition
  if (pellets.length === 0) {
    console.log("win");
  }

  //power ups
  for (let i = powerUps.length - 1; 0 <= i; i--) {
    const powerUp = powerUps[i];
    powerUp.draw();

    //player collides with powerup
    if (
      Math.hypot(
        powerUp.position.x - player.position.x,
        powerUp.position.y - player.position.y
      ) <
      powerUp.radius + player.radius
    ) {
      powerUps.splice(i, 1);

      //make ghosts scared

      ghost.forEach((ghost) => {
        ghost.scared = true;

        setTimeout(() => {
          ghost.scared = false;
        }, 5000);
      });
    }
  }

  for (let i = pellets.length - 1; 0 <= i; i--) {
    const pellet = pellets[i];

    pellet.draw();

    if (
      Math.hypot(
        pellet.position.x - player.position.x,
        pellet.position.y - player.position.y
      ) <
      pellet.radius + player.radius
    ) {
      pellets.splice(i, 1);
      score += 10;
      scoreEl.innerText = score;
    }
  }

  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  player.update(delta, boundaries);

  ghost.forEach((ghost, i) => {
    ghost.update(delta, boundaries);

    if (accumulatedTime > ghostReleasedIntervals[i] && !ghost.state)
      ghost.enterGame();
  });

  //end of animation

  if (player.velocity.x > 0) player.rotation = 0;
  else if (player.velocity.x < 0) player.rotation = Math.PI;
  else if (player.velocity.y > 0) player.rotation = Math.PI / 2;
  else if (player.velocity.y < 0) player.rotation = Math.PI * 1.5;
}

animate();
