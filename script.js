const searchField = document.getElementById('searchInput');
const container = document.getElementById('container');
let query;

searchField.addEventListener('input', getQuery)

function getQuery() {
	query = this.value;
}


const ts = "258";
const hash = "b019d95f3ca74d6d390a341b0013f98b"


fetch('http://gateway.marvel.com/v1/public/characters?apikey=069e5f498025d779169cc4f23fe0e56b&ts=' + ts + '&hash=' + hash)
	.then(response => response.json())
	.then(characters => {
		console.log(characters);
		characters.data.results.forEach(character => {
			container.innerHTML +=`
				${character.id} ${character.name} <br>
			`
		});;
	}

	)