const Pokeurl = "https://pokeapi.co/api/v2/pokemon/";
const PokeEvoChain = "https://pokeapi.co/api/v2/evolution-chain/";
const Pokeimg = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"

const searchbtn = document.querySelector("#searchButton");
const loader = document.querySelector("#loader");
const chain = document.querySelector("#EvolutionChain");

//Event listener
searchbtn.addEventListener("click", async () => {

    loader.style.display = "block"; // Show loader
    chain.style.display = "none"; // Show evolution chain

    const searchInput = document.querySelector("#pokemonName").value.trim().toLowerCase();

    try{
        const response = await fetch(Pokeurl + searchInput);

        if (!response.ok) {
            throw new Error("Pokemon not found");
            return;
        }
        
        const data = await response.json();

        console.log("pokemon found!");

        const pokeSpecie = data.species.url;

        const response2 = await fetch(pokeSpecie);
        
        const data2 = await response2.json();

        console.log("Specie found!");

        const pokeEvoChainUrl = data2.evolution_chain.url;

        const response3 = await fetch(pokeEvoChainUrl);

        const data3 = await response3.json();

        console.log("Evolution chain found!");

        let pokemons =[]

        let pokename = data3.chain.species.name;
        let pokeimg = Pokeimg + data3.chain.species.url.split("/")[6] + ".png";

        // console.log(pokename);

        let poke = {
            "name": pokename,
            "img": pokeimg
        }
        
        pokemons.push(poke);
        
        let evolves_to = data3.chain.evolves_to;
        
        if(evolves_to.length == 0){
            // console.log("no evolution"); 
            console.log("displaying results");
            displayPokemons(pokemons);
            return;
        }
        
        while(1){
            
            pokename = evolves_to[0].species.name;
            pokeimg = Pokeimg + evolves_to[0].species.url.split("/")[6] + ".png";
            
            poke = {
                "name": pokename,
                "img": pokeimg
            }
            // console.log(poke);
            
            pokemons.push(poke);
            
            
            evolves_to = evolves_to[0].evolves_to;
            
            if(evolves_to.length == 0){
                console.log("displaying results");
                displayPokemons(pokemons);
                return;
            }
            
        }
        
    }
    catch (error) {
        console.log("Error fetching data: ", error);
    }

});

function displayPokemons(pokemons) {

    loader.style.display = "none"; // Hide loader
    chain.style.display = "flex"; // Show evolution chain

    chain.innerHTML = ""; // Clear previous results

    pokemons.forEach(pokemon => {

        //resize image and arrow image size
        
        const pokeDiv = document.createElement("div");
        pokeDiv.classList.add("pokeDiv");
        
        const pokeImg = new Image(100, 100);
        pokeImg.src = pokemon.img;    
        pokeImg.alt = pokemon.name;

        const pokeName = document.createElement("p");
        pokeName.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

        pokeDiv.appendChild(pokeImg);
        pokeDiv.appendChild(pokeName);
        
        pokeDiv.style.display = "flex";
        pokeDiv.style.flexDirection = "column";
        pokeDiv.style.alignItems = "center";

        chain.appendChild(pokeDiv);



        if(pokemon !== pokemons[pokemons.length - 1]) {
            const arrow = new Image(50, 50);
            arrow.src = "arrow.png";
            chain.appendChild(arrow);
        }

    });

}