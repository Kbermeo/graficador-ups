function identificarTipoFuncion(expr) {
  expr = expr.toLowerCase();

  if (/sin|cos|tan|cot|sec|csc/.test(expr)) {
    return "Función trigonométrica";
  } else if (/log|ln/.test(expr)) {
    return "Función logarítmica";
  } else if (/e\^|exp/.test(expr)) {
    return "Función exponencial";
  } else if (/x[^x]*\/[^x]*x|\/x/.test(expr)) {
    return "Función racional";
  } else if (/x\^3/.test(expr)) {
    return "Función cúbica";
  } else if (/x\^2/.test(expr)) {
    return "Función cuadrática";
  } else if (/x\^4/.test(expr)) {
    return "Función polinomial de cuarta grado";
  } else if (/x\^5/.test(expr)) {
    return "Función polinomial de quinta grado";
  } else if (/x/.test(expr)) {
    return "Función lineal";
  } else {
    return "Función constante o no identificada";
  }
}

let chart;

function graficarFuncion() {
  const input = document.getElementById("funcionUsuario").value;
  const x = [];
  const y = [];

  // Identificar tipo de función y mostrarlo
  const tipo = identificarTipoFuncion(input);
  document.getElementById("tipoFuncion").innerText = "Tipo de función: " + tipo;

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
  MathJax.typeset();

  const ctx = document.getElementById("grafico").getContext("2d");

  if (chart) chart.destroy();

  function convertirFuncionLegible(str) {
    return str
      .replace(/\^2/g, '²')
      .replace(/\^3/g, '³')
      .replace(/\^1\/2/g, '√')
      .replace(/\*/g, '')
      .replace(/\\/g, '');
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
