'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');



///////////////////////////////////////

const renderCountry = function (data, className = '') {

    const language = data.languages;
    const lang = Object.values(language)[0];

    const currency = data.currencies;
    const curr = Object.values(currency)[0]


    const html = `
    <article class="country ${className}">
          <img class="country__img" src="${data.flags.svg}" />
          <div class="country__data">
            <h3 class="country__name">${data.name.common}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(data.population / 1000000).toFixed()}M people</p>
            <p class="country__row"><span>🗣️</span>${lang}</p>
            <p class="country__row"><span>💰</span>${curr.name}</p>
          </div>
        </article>
    `;

    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;

}

const renderError = function (msg) {
    countriesContainer.insertAdjacentText('beforeend', msg);
    countriesContainer.style.opacity = 1;
}


const getPosition = function () {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    })
}



const whereAmI = async function () {

    try {
        // Geolocation
        const pos = await getPosition();
        const { latitude: lat, longitude: lng } = pos.coords;


        const apiKey = '805642878269877507505x69213';
        // Get county from coordinates
        const resPos = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json&auth=${apiKey}`);

        // console.log(resPos.ok, resPos.status);
        if (!resPos.ok) throw new Error(`❌Wrong Coordinates!❌`);

        const resPosData = await resPos.json();



        // Get country data
        const resCountry = await fetch(`https://restcountries.com/v3.1/name/${resPosData.country}`);

        // console.log(resCountry.ok, resCountry.status);
        if (!resCountry.ok) throw new Error(`❌No Country Found!❌`);

        const resCountryData = await resCountry.json();

        // Render country data
        renderCountry(resCountryData[0])

        // Return whereAmI function (optional)
        return `You are in ${resPosData.country}.`;
    }
    catch (err) {
        renderError(`❌${err.message}❌`);

        // Reject Promises returned form async function
        throw err;
    }
}


btn.addEventListener('click', function () {
    // whereAmI()
    // .then(message => console.log(message))
    // .catch(err => console.error(err))


    (async function () {
        try {
            const country = await whereAmI();
            console.log(country);
        }
        catch (err) {
            console.error(`❌${err.message}❌`);
        }
    })();

    setTimeout(() => btn.style.display = 'none', 200)

})


