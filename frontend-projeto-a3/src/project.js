const canvases = document.querySelectorAll(".graph-container canvas");

canvases.forEach((canvas, index) => {
  const ctx = canvas.getContext("2d");

  // Dados diferentes para cada gráfico
  const dados = [10, 20, 30, 40, 50].map(v => v + index * 5);

  const barWidth = 30;
  const gap = 10;
  const base = canvas.height - 20;

  // Desenha barras
  dados.forEach((valor, i) => {
    const x = i * (barWidth + gap) + 20;
    const y = base - valor * 2;
    ctx.fillStyle = "#2196f3";
    ctx.fillRect(x, y, barWidth, valor * 2);
  });

  // Escreve o título
  ctx.fillStyle = "#000";
  ctx.font = "10px Segoe UI";
  ctx.fillText(`Gráfico ${index + 1}`, 10, 20);
});
