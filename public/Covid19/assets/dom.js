import { getCountryData } from '/Covid19/assets/fetch.js'

// funcion para esconder el login y mostrar el contenido
function domLogin() {
    $('#div-form').removeClass('d-block').addClass('d-none');
    $('#contenido').removeClass('d-none').addClass('d-block');
    $('#home').addClass('active');
  }


// funcion para renderizar tabla con todos los paises
function renderTabla(dataCounries) {
    dataCounries.forEach((country) => {
      $('#tabla-body').append(`
          <tr>
              <th scope="row"> <div class="d-flex"><p class="mr-3">${country.location}</p><a class="link-primary link-modal" href="#" data-country=${country.location}>Ver detalle..</a></div></th>
              <td>${country.confirmed}</td>
              <td>${country.recovered}</td>
              <td>${country.active}</td>
              <td>${country.deaths}</td>
          </tr>
      `);
    });
}

//funcion para abrir modal
function dataLink() {
    try {
      $('.link-modal').on('click', async function (event) {
        const country = $(this).attr('data-country');
  
        const dataCountry = await getCountryData(country);
  
        // console.log(dataCountry);
  
        $('#country-modal').modal('show');
        // $('.modal-body').html(
        //   `<div id="chartContainer-country" style="height: 100%; width: 100%;"></div>`
        // );
  
        iniciarGrafico([dataCountry], 'chartContainer-country');
      });
    } catch (error) {
      console.error(error);
    }
  }

  
// funcion para renderizar el grafico
function iniciarGrafico(dataGrafico, container = 'chartContainer') {
    // datapoints
    const confirmados = [];
    const muertos = [];
    for (let pais of dataGrafico) {
      confirmados.push({
        label: pais.location,
        y: pais.confirmed,
      });
      muertos.push({
        label: pais.location,
        y: pais.deaths,
      });
    }
  
    const covidData = [
      {
        type: 'column',
        name: 'Casos Muertos',
        legendText: 'Casos Muertos',
        showInLegend: true,
        dataPoints: muertos,
      },
      {
        type: 'column',
        name: 'Casos Confirmados',
        legendText: 'Casos Confirmados',
        showInLegend: true,
        dataPoints: confirmados,
      },
    ];
  
    let tituloGrafico = 'Países con Covid19';
    if (dataGrafico.length == 1) tituloGrafico = dataGrafico[0].location;
    // console.log(dataGrafico);
    const chart = new CanvasJS.Chart(container, {
      animationEnabled: true,
      title: {
        text: tituloGrafico,
      },
      axisY: {
        titleFontColor: '#4F81BC',
        lineColor: '#4F81BC',
        labelFontColor: '#4F81BC',
        tickColor: '#4F81BC',
      },
      toolTip: {
        shared: true,
      },
      legend: {
        cursor: 'pointer',
      },
      data: covidData,
    });
    // console.log(chart);
  
    // console.log(chart.width, chart.height);
  
    chart.width = +chart.width + 40;
    chart.height = +chart.height + 40;
  
    $('.modal-dialog').css('max-width', chart.width);
    $('.modal-content').css('height', chart.height);
  
    chart.render();
  }


///////////////////////////////////////////////////HITO 2

  
  // Gráfico de línea para casos Chile
function GraficoChile(confir, muer, recu) {
    let chart = new CanvasJS.Chart("chartContainer-chile", {
      title: {
        text: "Situación Covid-19 en Chile"
      },
      axisX: {
        valueFormatString: "DD MM YY"
      },
      axisY2: {
        title: "N° Casos",
        prefix: "$",
        suffix: "K"
      },
      toolTip: {
        shared: true
      },
      legend: {
        cursor: "pointer",
        verticalAlign: "top",
        horizontalAlign: "center",
        dockInsidePlotArea: true,
        itemclick: toogleDataSeries
      },
      data: [{
        type:"line",
        axisYType: "secondary",
        name: "Confirmados",
        showInLegend: true,
        markerSize: 10,
        yValueFormatString: "$#,###k",
        dataPoints: confir
      },
      {
        type: "line",
        axisYType: "secondary",
        name: "Muertos",
        showInLegend: true,
        markerSize: 10,
        yValueFormatString: "$#,###k",
        dataPoints: muer
      },
      {
        type: "line",
        axisYType: "secondary",
        name: "Recuperados",
        showInLegend: true,
        markerSize: 10,
        yValueFormatString: "$#,###k",
        dataPoints: recu
      }]
    });
    chart.render();
  
    function toogleDataSeries(e){
      if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
      } else{
        e.dataSeries.visible = true;
      }
      chart.render();
    }
}

export { domLogin, renderTabla, dataLink, iniciarGrafico, GraficoChile }