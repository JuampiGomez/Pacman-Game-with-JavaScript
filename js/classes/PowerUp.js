class PowerUp {
  constructor({ position }) {
    this.position = position;

    this.radius = 8;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "violet";
    ctx.fill();
    ctx.closePath();
  }
}
