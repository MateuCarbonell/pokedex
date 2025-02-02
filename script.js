const URL = "https://pokeapi.co/api/v2/pokemon?limit=1000"; // Pedimos los primeros 100 Pokémon
const searchInput = document.getElementById("search");
const pokedexContainer = document.getElementById("pokedex");

// Función para obtener y mostrar todos los Pokémon
function searchAllPokemons() {
    fetch(URL)
        .then(response => response.json())
        .then(data => {
            pokedexContainer.innerHTML = ""; // Limpiar el contenedor

            data.results.forEach(pokemon => {
                // Llamar a cada Pokémon para obtener los detalles
                fetch(pokemon.url)
                    .then(response => response.json())
                    .then(data => {
                        // Mostrar detalles de cada Pokémon
                        const pokemonItem = document.createElement("div");
                        pokemonItem.innerHTML = `
                            <h2>${data.name.toUpperCase()}</h2>
                            <img src="${data.sprites.front_default}" alt="${data.name}">
                            <p>Número: ${data.id}</p>
                            <p>Altura: ${data.height / 10} m</p>
                            <p>Peso: ${data.weight / 10} kg</p>
                        `;
                        pokedexContainer.appendChild(pokemonItem);
                    })
                   
            });
        })
       
}

// Función para buscar Pokémon que comienzan con las letras ingresadas en el input
function searchPokemonDynamically() {
    const searchedPokemon = searchInput.value.toLowerCase(); // Convertir a minúsculas

    if (!searchedPokemon) {
        pokedexContainer.innerHTML = "<p>❌.</p>";
        return;
    }

    fetch(URL)
        .then(response => response.json())
        .then(data => {
            pokedexContainer.innerHTML = ""; // Limpiar el contenedor

            let coincide = false;

            // Iterar por todos los resultados y mostrar solo los que coincidan
            data.results.forEach(pokemon => {
                if (pokemon.name.toLowerCase().startsWith(searchedPokemon)) {
                    coincide = true;

                    // Llamar a cada Pokémon para obtener los detalles
                    fetch(pokemon.url)
                        .then(response => response.json())
                        .then(data => {
                            const pokemonItem = document.createElement("div");
                            pokemonItem.innerHTML = `
                                <h2>${data.name.toUpperCase()}</h2>
                                <img src="${data.sprites.front_default}" alt="${data.name}">
                                <p>Número: ${data.id}</p>
                                <p>Altura: ${data.height / 10} m</p>
                                <p>Peso: ${data.weight / 10} kg</p>
                            `;
                            pokedexContainer.appendChild(pokemonItem);
                        })
                        
                }
            });

            if (!coincide) {
                pokedexContainer.innerHTML = "<p>❌ No se encontraron Pokémon que coincidan.</p>";
            }
        })
}
searchInput.addEventListener("input", searchPokemonDynamically);
document.getElementById("mostrar-todos").addEventListener("click", searchAllPokemons);
