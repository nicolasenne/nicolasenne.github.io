class SnakeGame {
  constructor(canvas, scoreEl) {
    this.initialized = false;
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;

    this.cellSize = 20;
    this.baseSpeed = 50;

    this.bgColor = "#f4f4f4";
    this.snakeColor = "#ffffff";
    this.foodColor = "#ffffff";
    this.textColor = "#ffffff";

    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());

    this.reset();
    this.initialized = true;
    this.bindEvents();
    this.bindTouchEvents();
  }

  resizeCanvas() {
    const prevWidth = this.canvasSizeX;
    const prevHeight = this.canvasSizeY;

    const rawWidth = window.innerWidth;
    const rawHeight = window.innerHeight;

    this.canvasSizeX =
      Math.floor(rawWidth / this.cellSize) * this.cellSize;
    this.canvasSizeY =
      Math.floor(rawHeight / this.cellSize) * this.cellSize;

    this.canvas.width = this.canvasSizeX;
    this.canvas.height = this.canvasSizeY;

    if (this.initialized) {
      const scaleX = this.canvasSizeX / prevWidth;
      const scaleY = this.canvasSizeY / prevHeight;

      this.snake = this.snake.map(segment => ({
        x: Math.floor((segment.x * scaleX) / this.cellSize) * this.cellSize,
        y: Math.floor((segment.y * scaleY) / this.cellSize) * this.cellSize
      }));

      const newFoodX =
        Math.floor((this.food.x * scaleX) / this.cellSize) * this.cellSize;
      const newFoodY =
        Math.floor((this.food.y * scaleY) / this.cellSize) * this.cellSize;

      const foodOutOfBounds =
        newFoodX < 0 ||
        newFoodY < 0 ||
        newFoodX >= this.canvasSizeX ||
        newFoodY >= this.canvasSizeY;

      this.food = foodOutOfBounds
        ? this.spawnFood()
        : { x: newFoodX, y: newFoodY };

      this.draw();
    }
  }

  reset() {
    const startX =
      Math.floor(this.canvasSizeX / 4 / this.cellSize) * this.cellSize;
    const startY =
      Math.floor(this.canvasSizeY / 2 / this.cellSize) * this.cellSize;

    this.snake = Array.from({ length: 5 }, (_, i) => ({
      x: startX - i * this.cellSize,
      y: startY,
    }));

    this.direction = { x: 1, y: 0 };
    this.food = this.spawnFood();
    this.score = 0;
    this.running = false;
    this.gameOver = false;

    this.food = this.spawnFirstFood();
    this.draw();
  }

  start() {
    if (this.running) return;

    this.running = true;
    this.loop = setInterval(() => this.update(), this.baseSpeed);
  }

  stop() {
    clearInterval(this.loop);
    this.running = false;
    this.gameOver = true;
    this.draw();
  }

  bindEvents() {
    window.addEventListener("keydown", (e) => this.handleKey(e));
  }

  bindTouchEvents() {
    let startX = 0;
    let startY = 0;

    this.canvas.addEventListener("touchstart", e => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
    });

    this.canvas.addEventListener("touchend", e => {
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (absX < 20 && absY < 20) {
        if (!this.running || this.gameOver) {
          this.reset();
          this.start();
        }
        return;
      }

      if (absX > absY) {
        this.direction = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
      } else {
        this.direction = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
      }
    });
  }

  handleKey(e) {
    if (e.code === "Space") {
      e.preventDefault();

      if (this.gameOver) {
        this.reset();
        this.start();
        return;
      }

      if (!this.running) {
        this.start();
      }

      return;
    }

    const map = {
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
    };

    if (!map[e.key]) return;

    e.preventDefault();

    const next = map[e.key];

    if (this.direction.x + next.x === 0 && this.direction.y + next.y === 0) {
      return;
    }

    this.direction = next;
  }

  update() {
    if (!this.running) return;

    const head = this.snake[0];
    let nextHead = {
      x: head.x + this.direction.x * this.cellSize,
      y: head.y + this.direction.y * this.cellSize,
    };

    nextHead = this.wrapPosition(nextHead);

    if (this.isSelfCollision(nextHead)) {
      this.stop();
      return;
    }

    this.snake.unshift(nextHead);

    if (this.isFood(nextHead)) {
      this.score += 1;
      this.food = this.spawnFood();
    } else {
      this.snake.pop();
    }

    this.draw();
  }

  wrapPosition(pos) {
    if (pos.x < 0) pos.x = this.canvasSizeX - this.cellSize;
    if (pos.x >= this.canvasSizeX) pos.x = 0;

    if (pos.y < 0) pos.y = this.canvasSizeY - this.cellSize;
    if (pos.y >= this.canvasSizeY) pos.y = 0;

    return pos;
  }

  isSelfCollision(pos) {
    return this.snake.slice(1).some(
      (segment) => segment.x === pos.x && segment.y === pos.y
    );
  }

  isFood(pos) {
    return pos.x === this.food.x && pos.y === this.food.y;
  }

  spawnFirstFood() {
    const cols = Math.floor(this.canvasSizeX / this.cellSize);

    const snakeHead = this.snake[0];

    const blackSideStartCol =
      Math.floor(cols * 0.7);

    const minCol =
      Math.floor(snakeHead.x / this.cellSize) + 3;

    const col = Math.max(blackSideStartCol, minCol);

    return {
      x: Math.min(col, cols - 2) * this.cellSize,
      y: snakeHead.y,
    };
  }

  spawnFood() {
    const cols = Math.floor(this.canvasSizeX / this.cellSize);
    const rows = Math.floor(this.canvasSizeY / this.cellSize);

    let position;
    let collision;

    do {
      position = {
        x: Math.floor(Math.random() * cols) * this.cellSize,
        y: Math.floor(Math.random() * rows) * this.cellSize,
      };

      collision = this.snake.some(
        segment => segment.x === position.x && segment.y === position.y
      );
    } while (collision);

    return position;
  }

  drawDiamond(x, y, size) {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - size);
    this.ctx.lineTo(x + size, y);
    this.ctx.lineTo(x, y + size);
    this.ctx.lineTo(x - size, y);
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawFood() {
    const cx = this.food.x + this.cellSize / 2;
    const cy = this.food.y + this.cellSize / 2;
    const size = this.cellSize / 5;
    const offset = size * 1.5;

    this.drawDiamond(cx, cy - offset, size);
    this.drawDiamond(cx + offset, cy, size);
    this.drawDiamond(cx, cy + offset, size);
    this.drawDiamond(cx - offset, cy, size);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvasSizeX, this.canvasSizeY);

    const half = this.canvasSizeX / 2;

    this.ctx.globalCompositeOperation = "source-over";

    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(0, 0, half, this.canvasSizeY);

    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(half, 0, half, this.canvasSizeY);

    this.ctx.globalCompositeOperation = "difference";

    this.drawScore();

    this.ctx.fillStyle = "#ffffff";
    this.snake.forEach((s) =>
      this.ctx.fillRect(s.x, s.y, this.cellSize, this.cellSize)
    );

    // food
    // this.ctx.fillRect(
    //   this.food.x,
    //   this.food.y,
    //   this.cellSize,
    //   this.cellSize
    // );

    this.ctx.fillStyle = "#ffffff";
    this.drawFood();

    if (!this.running && !this.gameOver) {
      this.drawCenteredText("Press SPACE to start");
    }

    if (this.gameOver) {
      this.drawCenteredText("Game Over - Press SPACE to restart");
    }

    this.ctx.globalCompositeOperation = "source-over";
  }

  drawCenteredText(text) {
    this.ctx.fillStyle = this.textColor;
    this.ctx.font = `500 1.25rem FSLucasPro, system-ui, sans-serif`;
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      text,
      this.canvasSizeX / 2,
      this.canvasSizeY / 2
    );
  }

  drawScore() {
    const padding = this.cellSize * 2;

    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = `600 18px FSLucasPro, system-ui, sans-serif`;

    this.ctx.textAlign = "right";
    this.ctx.textBaseline = "bottom";

    this.ctx.fillText(
      `Score: ${this.score}`,
      this.canvasSizeX - padding,
      this.canvasSizeY - padding
    );
  }
}

const canvas = document.getElementById("snake-canvas");
const game = new SnakeGame(canvas);