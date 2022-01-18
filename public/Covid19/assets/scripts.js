import { domLogin, renderTabla, dataLink, iniciarGrafico, GraficoChile } from '/Covid19/assets/dom.js'
import { getToken, getAllCountriesData, getCountryData, getDataChile, SplitArr, moreThan10000, ObjetosDatos } from '/Covid19/assets/fetch.js'

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

dataLink();

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


$('#chile').on('click', async function () {
  $('#chartContainer').hide();
  $('#table').hide();
  $('#chile').addClass('active');
  $('#home').removeClass('active');
  const token = localStorage.getItem('token');
  const confirmados = await getDataChile(token, 'confirmed');
  const muertes = await getDataChile(token, 'deaths');
  const recuperados = await getDataChile(token, 'recovered');
  SplitArr(confirmados);
  SplitArr(muertes);
  SplitArr(recuperados);
  ObjetosDatos(confirmados, muertes, recuperados);
});

  // Volver a desplegar Home al hacer click en botón Home del navbar
  $('#home').on('click', function() {
    $('#chartContainer').show();
    $('#table').show();
    $('#chile').removeClass('active');
    $('#home').addClass('active');
})
