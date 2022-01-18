import { GraficoChile } from '/Covid19/assets/dom.js'

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

  // Hito 2

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


// Función para generar objetos con los datos necesarios para el gráfico (en chart.data.DataPoints)
function ObjetosDatos(confir, muer, recu) {
    let confirmados = [];
    let muertos = [];
    let recuperados = [];
    for (let i=0; i < confir.length; i += 30) {
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
    GraficoChile(confirmados, muertos, recuperados)
}

export { getToken, getAllCountriesData, getCountryData, getDataChile, SplitArr, moreThan10000, ObjetosDatos };