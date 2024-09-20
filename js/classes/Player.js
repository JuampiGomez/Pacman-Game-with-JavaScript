class Player {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
    this.radians = 0.75;
    this.oprenRate = 0.12;
    this.rotation = 0;
  }

  draw() {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation);
    ctx.translate(-this.position.x, -this.position.y);
    ctx.beginPath();
    ctx.arc(
      this.position.x,
      this.position.y,
      this.radius,
      this.radians,
      Math.PI * 2 - this.radians
    );
    ctx.lineTo(this.position.x, this.position.y);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }

  moveUp(boundaries) {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];

      if (
        circleCollidesWithRectangle({
          circle: {
            ...this,
            velocity: {
              x: 0,
              y: -5,
            },
          },
          rectangle: boundary,
        })
      ) {
        this.velocity.y = 0;
        break;
      } else {
        this.velocity.y = -5;
      }
    }
  }

  moveLeft(boundaries) {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];

      if (
        circleCollidesWithRectangle({
          circle: {
            ...player,
            velocity: {
              x: -5,
              y: 0,
            },
          },
          rectangle: boundary,
        })
      ) {
        player.velocity.x = 0;
        break;
      } else {
        player.velocity.x = -5;
      }
    }
  }

  moveDown(boundaries) {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];

      if (
        circleCollidesWithRectangle({
          circle: {
            ...player,
            velocity: {
              x: 0,
              y: 5,
            },
          },
          rectangle: boundary,
        })
      ) {
        player.velocity.y = 0;
        break;
      } else {
        player.velocity.y = 5;
      }
    }
  }

  moveUp(boundaries) {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];

      if (
        circleCollidesWithRectangle({
          circle: {
            ...player,
            velocity: {
              x: 5,
              y: 0,
            },
          },
          rectangle: boundary,
        })
      ) {
        player.velocity.x = 0;
        break;
      } else {
        player.velocity.x = 5;
      }
    }
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.radians < 0 || this.radians > 0.75) {
      this.oprenRate = -this.oprenRate;
    }
    this.radians += this.oprenRate;
  }
}
