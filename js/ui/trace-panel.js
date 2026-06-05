export function renderTracePanel() {
  return `
    <section class="trace-panel">
      <div class="trace-header">
        <div>
          <p class="eyebrow">Live Trace</p>
          <h2>Signal Movement</h2>
        </div>

        <span class="trace-label">
          Eye · Head · Expression
        </span>
      </div>

      <canvas 
        id="signal-trace" 
        class="signal-trace"
        width="640"
        height="220"
      ></canvas>
    </section>
  `;
}

export function updateTracePanel(state) {
  const canvas = document.querySelector("#signal-trace");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const points = state.trace.points || [];

  clearCanvas(ctx, canvas);

  drawGrid(ctx, canvas);

  if (points.length < 2) {
    drawEmptyState(ctx, canvas);
    return;
  }

  drawLine(ctx, canvas, points, "eyeOpenness", 0, 0.35);
  drawLine(ctx, canvas, points, "headStability", 0, 1);
  drawLine(ctx, canvas, points, "expressionVariability", 0, 0.03);

  drawLegend(ctx, canvas);
}

function clearCanvas(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawGrid(ctx, canvas) {
  ctx.save();

  ctx.globalAlpha = 0.22;
  ctx.lineWidth = 1;

  for (let i = 1; i < 4; i += 1) {
    const y = (canvas.height / 4) * i;

    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawEmptyState(ctx, canvas) {
  ctx.save();

  ctx.font = "22px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.globalAlpha = 0.42;
  ctx.fillText("Waiting for signal trace", canvas.width / 2, canvas.height / 2);

  ctx.restore();
}

function drawLine(ctx, canvas, points, key, min, max) {
  const validPoints = points.filter(point => Number.isFinite(point[key]));

  if (validPoints.length < 2) return;

  ctx.save();

  ctx.lineWidth = 2.5;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  ctx.beginPath();

  validPoints.forEach((point, index) => {
    const x = (index / (validPoints.length - 1)) * canvas.width;
    const y = valueToY(point[key], min, max, canvas.height);

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  ctx.restore();
}

function valueToY(value, min, max, height) {
  const normalised = clamp((value - min) / (max - min), 0, 1);

  return height - normalised * height;
}

function drawLegend(ctx, canvas) {
  ctx.save();

  ctx.font = "12px system-ui, sans-serif";
  ctx.globalAlpha = 0.72;

  ctx.fillText("eye openness", 14, 20);
  ctx.fillText("head stability", 14, 38);
  ctx.fillText("expression variability", 14, 56);

  ctx.restore();
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}