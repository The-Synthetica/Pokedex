import React from "react"
import ReactDOM from "react-dom/client"
import { Pokemon } from "./Pokemon"
import InfiniteScroll from "react-infinite-scroll-component"

import { useState, useEffect } from "react"
import { NavBar } from "./NavBar"

import { pokemonFetching, usePokemonFetching } from "./pokemonFetching"

import "./styles/app.css"
import "./styles/loader.css"

const root= ReactDOM.createRoot(document.getElementById("root"))


function App(){


    const { pokemones, morePokemons, verMas, pokeFilter, pokeSearch, loading} = usePokemonFetching()
        
    // Activan un filtro:
    const filterHandler = async (event) => {

        const isChecked = event.target.checked;
        const id= event.target.id;

        await pokeFilter(isChecked, id)

    }

    // Buscan un pokemon:
     async function submitHandler (event) {
        event.preventDefault()
        await pokeSearch(event.target[0].value)
    }

    // La razon por la que utilizo sets es para eliminar los pokemones que se repiten en la llamada doble
    // Cuando no hay suficientes pokemones el scroll infinito no funciona
    // Y el componente obliga a tener si o si un scroll down para activarse
    // Por lo que para no utilizar componentes de scroll que cambien de estado, simplemente elimino los pocos repetidos que se generan
    // Aunque la solucion total seria utlizar otro componente

    const noRepPokemons = new Set()
    pokemones.forEach( item => {
                const info = JSON.stringify(item)
                noRepPokemons.add(info)
    })
    const recoveredPokemons = Array.from(noRepPokemons).map(jsonString => JSON.parse(jsonString));

    // Retornamos los pokemones obtenidos en la app
    return (
    <div>

        <InfiniteScroll
        dataLength={pokemones.length}
        next={morePokemons}
        hasMore={verMas}
        loader={<h3 className="loader">Loading...</h3>}
        endMessage={ <h4  style={{width:"100%", textAlign:"center", padding:"100px"}}> Srry! No more pokemons :( </h4>}
        className="pokedex">

            <NavBar loading= {loading} submitprops={submitHandler} filterprops={filterHandler}/>
            
            {
                console.log(pokemones)}
                {
                    recoveredPokemons.map( ({name, types, height, weight, imgref}) => {
                        return (<Pokemon key={name} name={name} types={types} height={height} weight={weight} imgref={imgref}/>)
                    })
                }
            
            <span id="spinLoader" className="loader isLoaded"><span className="loader-box"></span><span className="loader-box"></span><span className="loader-box"></span></span>

        </InfiniteScroll>

    </div>
    )
    }


root.render(
    <>  
        <App/>

    </>
)
