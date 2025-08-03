let chart;

function graficarFuncion() {
  const input = document.getElementById("funcionUsuario").value;
  const x = [];
  const y = [];

  let funcion;
  try {
    funcion = math.compile(input);
  } catch (error) {
    alert("Error en la función ingresada. Verifica la sintaxis.");
    return;
  }

  for (let i = -10; i <= 10; i += 0.1) {
    const xi = parseFloat(i.toFixed(2));
    try {
      const yi = funcion.evaluate({ x: xi });
      if (typeof yi === "number" && isFinite(yi)) {
        x.push(xi);
        y.push(yi);
      }
    } catch {
      continue;
    }
  }

  document.getElementById("expresion").innerHTML = `\\( f(x) = ${input} \\)`;
  MathJax.typeset(); // Renderiza la fórmula en MathJax
  
  const ctx = document.getElementById("grafico").getContext("2d");

  if (chart) chart.destroy();

  function convertirFuncionLegible(str) {
    return str
      .replace(/\^2/g, '²')
      .replace(/\^3/g, '³')
      .replace(/\^1\/2/g, '√') // Opcional: reemplaza potencias de 1/2 por raíz
      .replace(/\*/g, '') // Elimina el * para que se vea más limpio
      .replace(/\\/g, ''); // Elimina doble barra si el usuario escribió \frac o similares
  }
  
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: x,
      datasets: [{
        label: convertirFuncionLegible(input),
        data: y,
        borderColor: "#0f766e",
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      animation: false,
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          min: -10,
          max: 10,
          ticks: {
            stepSize: 1,
            color: '#000',
            font: {
              size: 12
            }
          },
          grid: {
            color: (ctx) => ctx.tick.value === 0 ? '#000' : '#ccc',
            lineWidth: (ctx) => ctx.tick.value === 0 ? 2 : 1,
          },
          title: {
            display: true,
            text: 'x',
            color: '#000',
            font: {
              weight: 'bold',
              size: 14
            }
          }
        },
        y: {
          type: 'linear',
          position: 'left',
          min: -10,
          max: 10,
          ticks: {
            stepSize: 1,
            color: '#000',
            font: {
              size: 12
            }
          },
          grid: {
            color: (ctx) => ctx.tick.value === 0 ? '#000' : '#ccc',
            lineWidth: (ctx) => ctx.tick.value === 0 ? 2 : 1,
          },
          title: {
            display: true,
            text: 'y',
            color: '#000',
            font: {
              weight: 'bold',
              size: 14
            }
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          labels: {
            color: '#000'
          }
        }
      }
    }
  });
}
