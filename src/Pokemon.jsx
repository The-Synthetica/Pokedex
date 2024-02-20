/*
Son 17 tipos de pokemones distintos
Pueden ser combinados.
Asi que types, es un vector que contiene los tipos adentro y la magia la hacemos con css

*/

import "./styles/pokemon.css"
import "./styles/types.css"

export function Pokemon({name, types, height, weight, imgref}){

    return <div className={"pokemon"}>
        {/* Imagen Referencial */}
        <img src={imgref}></img>

        {/* Nombre e ID del pokemon */}
        <h3 className="name">{name}</h3>

        {/* Por cada tipo existente genera un div */}
        <div className="typesList">

        {types.map( (elem, key) => {
            return (<p key={key} className={elem} >
                {elem}
            </p>)
        })}

        </div>

        {/* Informacion de tamaño */}
        <div className="size">
            <p>{height}m</p>
            <p>{weight}kg</p>
        </div>

    </div>
}