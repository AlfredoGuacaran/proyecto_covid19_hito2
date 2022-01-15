/// autenticacion
async function getToken(email, password) {
  try {
    const response1 = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (!response1.status) return;

    const { token } = await response1.json();

    return token;
  } catch (error) {
    console.log('error');
  }
}

// funcion para esconder el login y mostrar el contenido
function domLogin() {
  $('#div-form').removeClass('d-block').addClass('d-none');
  $('#contenido').removeClass('d-none').addClass('d-block');
}

// funcion para traer data de todos los paises, retorna array de objetos
async function getAllCountriesData() {
  try {
    const response = await fetch('http://localhost:3000/api/total');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
  }
}

// funcion para traer data de un pais, retorna array de objetos
async function getCountryData(country) {
  try {
    const response = await fetch(
      ` http://localhost:3000/api/countries/${country}`
    );
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
  }
}

//funcion para filtrar y ordenar la data, retorna array de objetos
async function moreThan10000() {
  try {
    const allCountriesData = await getAllCountriesData();

    const moreThan1000 = allCountriesData.filter(
      (country) => country.deaths >= 50000
    );

    const moreThan1000Sort = moreThan1000.sort((a, b) => b.deaths - a.deaths);
    // console.log(moreThan1000Sort);

    return moreThan1000Sort;
  } catch (error) {
    console.error(error);
  }
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

  dataLink();
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
  for (pais of dataGrafico) {
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

/// login form
$('#login-form').on('submit', async function (event) {
  try {
    //Previene recarga de pag
    event.preventDefault();
    //Captura datos del formulario
    const email = $('#email-input').val();
    const password = $('#password-input').val();

    //primera llamada a api para solicitar Token
    const token = await getToken(email, password);

    //en caso de que las credenciales sean invalidas
    if (!token) return $('.form-control').addClass('is-invalid');

    //guarda token en localStorage
    localStorage.setItem('token', token);

    //esconde el login y muestra el contenido...
    domLogin();

    // render del grafico
    const graficoData = await moreThan10000();
    iniciarGrafico(graficoData);

    // render tabla
    const tablaData = await getAllCountriesData();
    renderTabla(tablaData);
  } catch (error) {
    console.log('Error');
    console.error(error);
  }
});
//logout button
$('#logout').on('click', function () {
  localStorage.removeItem('token');
  window.location.reload();
});

// funcion de inicio
(async function init() {
  const token = localStorage.getItem('token');
  // console.log(token);
  // si no existe token
  if (token == null) {
    return;
  } else {
    //si existe el token
    try {
      // logea
      domLogin();

      // render del grafico
      const graficoData = await moreThan10000();
      iniciarGrafico(graficoData);

      // render tabla
      const tablaData = await getAllCountriesData();
      renderTabla(tablaData);
    } catch (error) {
      console.log('Error');
      console.error(error);
    }
  }
})();

///////////////////////////////////////////////////HITO 2

$('#chile').on('click', async function () {
  $('#chartContainer').hide();
  $('#table').hide();
  $('#chile').addClass('active');
  const token = localStorage.getItem('token');
  const confirmados = await getDataChile(token, 'confirmed');
  const muertes = await getDataChile(token, 'deaths');
  const recuperados = await getDataChile(token, 'recovered');
  SplitArr(confirmados);
  SplitArr(muertes);
  SplitArr(recuperados);
  GraficoChile(confirmados, muertes, recuperados);
});

/// funcion para las peticiones APIs
async function getDataChile(token, finalUrl) {
  const response = await fetch(`http://localhost:3000/api/${finalUrl}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data.data;
}
// Separar la fecha en distintos elementos año, mes y día
function SplitArr(arr){
  arr = arr.map(elem => {
    let DateSplit = elem.date.split('/');
    elem.year = DateSplit[2]
    elem.year = 20 + elem.year;
    elem.month = DateSplit[0]
    elem.day = DateSplit[1]
  })
}
// Gráfico de línea para casos Chile
function GraficoChile(confir, muer, recu) {
  let confirmados = [];
  let muertos = [];
  let recuperados = [];
  for (let i=0; i < confir.length; i += 10) {
    confirmados.push({
      x: new Date(confir[i].year, confir[i].month, confir[i].day),
      y: confir[i].total
    })
    muertos.push({
      x: new Date(muer[i].year, muer[i].month, muer[i].day),
      y: muer[i].total
    })
    recuperados.push({
      x: new Date(recu[i].year, recu[i].month, recu[i].day),
      y: recu[i].total
    })
  }
  
  var chart = new CanvasJS.Chart("chartContainer-chile", {
    title: {
      text: "House Median Price"
    },
    axisX: {
      valueFormatString: "DD MM YY"
    },
    axisY2: {
      title: "Median List Price",
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
      markerSize: 0,
      yValueFormatString: "$#,###k",
      dataPoints: confirmados
    },
    {
      type: "line",
      axisYType: "secondary",
      name: "Muertos",
      showInLegend: true,
      markerSize: 0,
      yValueFormatString: "$#,###k",
      dataPoints: muertos
    },
    {
      type: "line",
      axisYType: "secondary",
      name: "Recuperados",
      showInLegend: true,
      markerSize: 0,
      yValueFormatString: "$#,###k",
      dataPoints: recuperados
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