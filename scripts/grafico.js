    let test= 1
    let chart;
    let datosAgrupados = {};

    // Cargar el JSON y preparar el selector
    fetch("../datos/datos.json")
      .then(res => res.json())
      .then(datos => {
        // Agrupar por país
        datos.forEach(item => {
          const pais = item.pais;
          if (!datosAgrupados[pais]) {
            datosAgrupados[pais] = [];
          }
          datosAgrupados[pais].push({
            year: item.año,
            valor: item.valor.toFixed(2) // redondeado a 2 decimales
          });
        });

        // Llenar el selector
        const selector = document.getElementById("selector");
        Object.keys(datosAgrupados).sort().forEach(pais => {
          const option = document.createElement("option");
          option.value = pais;
          option.textContent = pais;
          selector.appendChild(option);
        });

        // Mostrar el país inicial
        mostrarGrafica(selector.value);

        // Evento para cambiar país
        selector.addEventListener("change", () => {
          var test = 2
          mostrarGrafica(selector.value);
          console.log('soy el teest 2'.test);
        });
      });

      function mostrarGrafica(pais) {
        const datosPais = datosAgrupados[pais];
        const labels = datosPais.map(d => d.year);
        const valores = datosPais.map(d => d.valor);
        const ctx = document.getElementById("grafica").getContext("2d");
        
        if (chart) chart.destroy(); // Evitar duplicar
      chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: `Energía Renovable en ${pais}`,
            data: valores,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: `Consumo de Energía Renovable (% del total primario)`
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
    