const URL = "https://pokeapi.co/api/v2/pokemon?limit=5000";
const searchInput = document.getElementById("search");
const typeInput = document.getElementById("type");
const pokedexContainer = document.getElementById("pokedex");

// Función para mostrar el loading
function showLoading() {
    pokedexContainer.innerHTML = `
        <div class="d-flex flex-column align-items-center">
            <p>Loading...</p>
            <div class="spinner-border" role="status">
                <span class="sr-only">Cargando...</span>
            </div>
        </div>
    `;
}

// Función para ocultar el loading
function hideLoading() {
    pokedexContainer.innerHTML = "";
}

// Función para obtener y mostrar todos los Pokémon
async function searchAllPokemons() {
    showLoading();
    const response = await fetch(URL);
    const data = await response.json();

    // Obtener todos los Pokémon y ordenarlos por ID
    const pokemonList = await Promise.all(data.results.map(async (pokemon) => {
        const pokemonResponse = await fetch(pokemon.url);
        return pokemonResponse.json();
    }));
    hideLoading();

    // Ordenar por ID
    pokemonList.sort((a, b) => a.id - b.id);

    // Mostrar los Pokémon ordenados
    pokemonList.forEach(pokemonData => {
        const pokemonItem = document.createElement("div");
        // la altura y el peso estan divididos por 10 para obtener los valores en metros y kilogramos ya que vienen en decímetros y hectogramos
        pokemonItem.innerHTML = `
            <h2>${pokemonData.name.toUpperCase()}</h2>
            <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
            <p>Número: ${pokemonData.id}</p>
            <p>Altura: ${pokemonData.height / 10} m</p> 
            <p>Peso: ${pokemonData.weight / 10} kg</p>
        `;
        pokedexContainer.appendChild(pokemonItem);
    });
}

// Función para buscar Pokémon (por nombre o tipo)
async function searchPokemonDynamically(filterByType = false) {
    let searchValue;
    if (filterByType) {
        searchValue = typeInput.value.toLowerCase();
    } else {
        searchValue = searchInput.value.toLowerCase();
    }

    if (!searchValue) {
        // Si no hay texto, mostrar todos los Pokémon ordenados por ID
        searchAllPokemons();
        return;
    }

    showLoading();
    const response = await fetch(URL);
    const data = await response.json();

    let coincide = false;

    // Obtener todos los Pokémon y ordenarlos por ID
    const pokemonList = await Promise.all(data.results.map(async (pokemon) => {
        const pokemonResponse = await fetch(pokemon.url);
        return pokemonResponse.json();
    }));
    hideLoading();

    // Ordenar por ID
    pokemonList.sort((a, b) => a.id - b.id);

    // Filtrar y mostrar los Pokémon
    for (const pokemonData of pokemonList) {
        let matchesSearch = false;
        if (filterByType) {
            // Filtramos por tipo
            for (let i = 0; i < pokemonData.types.length; i++) {
                if (pokemonData.types[i].type.name.toLowerCase() === searchValue) {
                    matchesSearch = true;
                    break;
                }
            }
        } else {
            // Filtramos por nombre
            matchesSearch = pokemonData.name.toLowerCase().startsWith(searchValue);
        }

        if (matchesSearch) {
            coincide = true;
            const pokemonItem = document.createElement("div");
            pokemonItem.innerHTML = `
                <h2>${pokemonData.name.toUpperCase()}</h2>
                <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
                <p>Número: ${pokemonData.id}</p>
                <p>Altura: ${pokemonData.height / 10} m</p>
                <p>Peso: ${pokemonData.weight / 10} kg</p>
            `;
            pokedexContainer.appendChild(pokemonItem);
        }
    }

    if (!coincide) {
        pokedexContainer.innerHTML = "<p>❌ No se encontraron Pokémon que coincidan.</p>";
    }
}

// Event listeners
searchInput.addEventListener("input", () => searchPokemonDynamically(false));
document.getElementById("mostrar-todos").addEventListener("click", searchAllPokemons);
document.getElementById("search-type").addEventListener("click", () => searchPokemonDynamically(true));

// Cargar todos los Pokémon ordenados al iniciar la página
searchAllPokemons();
