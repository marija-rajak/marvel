const searchField = document.getElementById('searchInput');
const container = document.getElementById('container');
const baseURL = 'http://gateway.marvel.com/v1/public/characters?apikey=069e5f498025d779169cc4f23fe0e56b&hash=b019d95f3ca74d6d390a341b0013f98b&ts=258'
const header = document.getElementById('header');

let query;

searchField.addEventListener('input', function () {
	getQuery();
	console.log(query);
	fetch(baseURL + '&nameStartsWith=' + query)
		.then(response => response.json())
		.then(characters => {

			reset();

			if (characters.data.results.length) {
				characters.data.results.forEach(character => {
					container.innerHTML += `
				<div class="character">
				 <img src="${character.thumbnail.path}.${character.thumbnail.extension}">
				 <div class="imgHeader">${character.name}<span><i class="fa-solid fa-star"></i></span>
				 </div>
			`
				});
			} else {
				header.innerHTML += '<p>No hero with such name.Please, try another one.</p>';

			}

		});
});

function getQuery() {
	query = searchField.value;
	console.log(query);
}

function reset() {
	container.innerHTML = '';
	
}