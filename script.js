const searchField = document.getElementById('searchInput');
const container = document.getElementById('container');
const baseURL = 'http://gateway.marvel.com/v1/public/characters';
const authentication = 'apikey=069e5f498025d779169cc4f23fe0e56b&hash=b019d95f3ca74d6d390a341b0013f98b&ts=258';
const header = document.getElementById('header');
const loader = document.getElementById('loader');
let query;

var typingTimeout;

searchField.addEventListener('input', getInput);

function getInput() {
	document.getElementById('loader').style.display = 'block';
	query = this.value;

	if (query !== "") {
		container.innerHTML = '';
		setTimeout(getCharacters, 1000);

	} else {
		loader.style.display = 'none';
		showFavourites();
	}
}

window.addEventListener('load', showFavourites);

function getCharacters() {
	let favourites = localStorage.getItem('favourites');
	fetch(baseURL + '?nameStartsWith=' + query + "&" + authentication)
		.then(response => response.json())
		.then(characters => {
			if (characters.data.results.length) {
				let favourites = JSON.parse(localStorage.getItem('favourites'));
				let favouriteIds = [];
				if (favourites) {
					favouriteIds = favourites.map(function (fav) {
						return parseInt(fav.id);
					});
				}
				characters.data.results.forEach(character => {
					container.innerHTML += `
						<div class="character">
						<img src="${character.thumbnail.path}.${character.thumbnail.extension}">
						<div class="imgFooter">${character.name} ${addFooter(character.id, favouriteIds, character)} </div>`;
				});
			} else {
				//ako se poruka upise u element header, ne moze se nastaviti pretraga; ako se upise u container, program i dalje radi???
				//header.innerHTML += '<div class="info">Nema nikoga s tim imenom. Probajte neku drugu pretragu</div>';
				container.innerHTML += '<div class="info">Nema nikoga s tim imenom. Probajte neku drugu pretragu</div>';
			}
			loader.style.display = 'none';
		});
}

function manageFavourites(characterName, characterId) {

	let favouriteCharacter = {
		name: characterName,
		id: characterId
	}

	container.onclick = function (e) {
		let star = e.target;
		if (star.style.color === 'rgb(255, 217, 0)') {
			star.style.color = 'rgb(247, 209, 209)';
			star.nextElementSibling.innerHTML = "add to favourites"
		} else {
			star.style.color = 'rgb(255, 217, 0)';
			star.nextElementSibling.innerHTML = "remove from favourites"
		}
	};

	let favouritesSet = JSON.parse(localStorage.getItem('favourites'));

	if (!favouritesSet) {
		favouritesSet = [];
	}

	let add = true;

	favouritesSet.forEach(function (favourite, index) {
		if (favourite.id === favouriteCharacter.id) {
			favouritesSet.splice(index, 1);
			add = false;
		}
	});

	if (add) {
		favouritesSet.push(favouriteCharacter);
	}
	localStorage.setItem('favourites', JSON.stringify(favouritesSet));
}

function showFavourites() {
	container.innerHTML = "";
	let bookmarks = JSON.parse(localStorage.getItem('favourites'));

	if (bookmarks) {
		bookmarks.forEach(function (bookmark) {
			fetch(baseURL + "/" + bookmark.id + "?" + authentication)
				.then(function (response) {
					return response.json();

				}).then(function (bookmarked) {
					let character = bookmarked.data.results[0];
					container.innerHTML += `
				<div class="character">
				<img src="${character.thumbnail.path}.${character.thumbnail.extension}">
				<div class="imgFooter">${character.name}
					<i class="fa-solid fa-star" style="color: rgb(255, 217, 0);" onclick="manageFavourites('${character.name}', '${character.id}')"></i>
					<p class="tooltip">remove from favourites</p>
				</div>`;
				});
		});
	}
}


function addFooter(id, array, obj) {
	let footer;
	if (array.includes(id)) {
		footer =
			`<i class="fa-solid fa-star" style="color: rgb(255, 217, 0);" onclick="manageFavourites('${obj.name}', '${obj.id}')"></i>
			<p class="tooltip">remove from favourites</p>`;
	} else {
		footer =
		`<i class="fa-solid fa-star" onclick="manageFavourites('${obj.name}', '${obj.id}')"></i>
		<p class="tooltip">add to favourites</p>`;
	}

		return footer;

}