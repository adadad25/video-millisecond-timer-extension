const videoUpload = document.getElementById("videoUpload");
const video = document.getElementById("video");
const timer = document.getElementById("overlayTimer");

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const lapBtn = document.getElementById("lapBtn");
const exportBtn = document.getElementById("exportBtn");

const lapsList = document.getElementById("laps");

let startTime = 0;
let elapsed = 0;
let running = false;
let animationFrame;
let laps = [];

// Upload video
videoUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    video.src = URL.createObjectURL(file);
    resetTimer();
  }
});

// High precision timer loop
function updateTimer() {
  if (!running) return;

  elapsed = performance.now() - startTime;
  timer.textContent = `${Math.floor(elapsed)} ms`;

  animationFrame = requestAnimationFrame(updateTimer);
}

// Start
startBtn.addEventListener("click", () => {
  if (running) return;

  running = true;
  startTime = performance.now() - elapsed;
  video.play();

  updateTimer();
});

// Stop
stopBtn.addEventListener("click", () => {
  running = false;
  cancelAnimationFrame(animationFrame);
  video.pause();
});

// Auto stop when video pauses
video.addEventListener("pause", () => {
  running = false;
  cancelAnimationFrame(animationFrame);
});

// Auto stop at end
video.addEventListener("ended", () => {
  running = false;
  cancelAnimationFrame(animationFrame);
});

// Lap marker
lapBtn.addEventListener("click", () => {
  const lapTime = Math.floor(elapsed);
  laps.push(lapTime);

  const li = document.createElement("li");
  li.textContent = `Lap ${laps.length}: ${lapTime} ms`;
  lapsList.appendChild(li);
});

// Export CSV
exportBtn.addEventListener("click", () => {
  let csv = "Lap,Milliseconds\n";
  laps.forEach((lap, i) => {
    csv += `${i + 1},${lap}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "laps.csv";
  a.click();
});

// Reset
function resetTimer() {
  running = false;
  elapsed = 0;
  laps = [];
  lapsList.innerHTML = "";
  timer.textContent = "0 ms";
}
