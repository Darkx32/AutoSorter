const ctx = document.getElementById("myChart").getContext("2d");

const dados = [30, 80, 45, 60, 20, 90];
const barWidth = 10;
const gap = 2;
const base = 180;

dados.forEach((valor, i) => {
  const x = i * (barWidth + gap);
  const y = base - valor * 2;
  ctx.fillStyle = '#2196f3';
  ctx.fillRect(x, y, barWidth, valor * 2);
});