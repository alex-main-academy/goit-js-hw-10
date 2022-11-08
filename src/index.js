import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const searchInputElement = document.querySelector('#search-box');
const countryListElement = document.querySelector('.country-list');
const countryInfoElement = document.querySelector('.country-info');

const handleSearchCountryByName = event => {
  if (event.target.value.trim()) {
    fetchCountries(event.target.value)
      .then(data => {
        if (data.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (data.length > 1 && data.length <= 10) {
          createCountryListMarkup(data);
        } else {
          console.log(data);
          createCountryInfoMarkup(data);
        }
      })
      .catch(err => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  }

  countryInfoElement.innerHTML = '';
  countryListElement.innerHTML = '';
  return;
};

const createCountryListMarkup = data => {
  data.map(elem => {
    countryInfoElement.innerHTML = '';
    countryListElement.innerHTML += `
            <li>
                <img src="${elem.flags.svg}" width="30" height="30">
                <p>${elem.name.common}</p>
            </li>
        `;
  });
};

const createCountryInfoMarkup = data => {
  data.map(elem => {
    countryInfoElement.innerHTML = `
            <div class="country__fullname">
                <img src="${elem.flags.svg}" alt="" width="30" height="30">
                <p>${elem.name.common}</p>
            </div>
            <ul class="country__list">
                <li><span>Capital:</span> ${elem.capital}</li>
                <li><span>Population:</span> ${elem.population}</li>
                <li class="country__languages"><span>Languages:</span> </li>
            </ul>
        `;

    const countryLanguagesElement = document.querySelector(
      '.country__languages'
    );
    for (let key in elem.languages) {
      countryLanguagesElement.innerHTML += `${elem.languages[key]} `;
    }
  });
};

searchInputElement.addEventListener(
  'input',
  debounce(handleSearchCountryByName, DEBOUNCE_DELAY)
);
