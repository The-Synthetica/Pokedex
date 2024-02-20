import { useEffect, useState } from "react";


let defaultUrl= "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0"
    

export function usePokemonFetching () {
    
    // Guardamos los pokemones en el estado
    const [pokemones, setPokemones] = useState([])
    const [siguienteUrl, setSiguienteUrl] = useState("")
    const [verMas, setVerMas] = useState(true)
    
    
    const [ busqueda, setBusqueda ] = useState('')
    const [ tiposBusqueda, setTiposBusqueda] = useState([])
    
    const abortController = new AbortController();

    const [loading, setLoading] = useState(false)
    

    console.log("useStateHook : ",busqueda, tiposBusqueda)
    
    const fetchPokemons = async (url = defaultUrl) => {

        let nextUrl= defaultUrl
        let res=[]

        console.log("Fetching", pokemones)
        
        try{
            // Obtenemos los pokemones
            const response = await fetch(url, {
                signal: abortController.signal,
            })
            const data = await response.json()
            nextUrl= data.next
            const newPokemons = data.results.map(async element => {
                
                // Por cada pokemon obtenemos su informacion
                const response = await fetch(element.url, {
                    signal: abortController.signal,
                })

                const data= await response.json()
                const typeListHandled = data.types.map(type => type.type.name);

                // Aseguremos que nuestro pokemon tiene lo que buscamos
                const flag= tiposBusqueda.every(item => typeListHandled.includes(item))
                
                if( data.name.startsWith(busqueda) && (flag || tiposBusqueda.length==0)){
                    return({
                        name: data.name, 
                        types: typeListHandled, 
                        height: (data.height / 10), 
                        weight: (data.weight / 10),
                        // Algunos pokemones no tienen la fotito que me gusta 
                        imgref: data.sprites.other.dream_world.front_default || data.sprites.front_default || data.sprites.other.official_artwork.front_default
                    });
                }

            });

            // Esperamos a que todas las promises se resuelvan
            const pokemonRes= await Promise.all(newPokemons)

            res= []
            
            pokemonRes.map( elem => {
                if( elem != undefined )
                    res.push(elem)
            })

        }
        catch(error){
            console.log("ME ABORTASTE",error.message)
        }

        return {nextUrl, res}

    }

    // Carga pokemones al estado por primera vez
    const chargePokemons = async () => {
        const response= await fetchPokemons()
        
        const nextUrl = response.nextUrl
        const pokemons= response.res
        
        setPokemones(pokemons)
        setSiguienteUrl(nextUrl)
    }
    
    // Los añade al estado para renderizarlos
    const morePokemons = async () => {

        let response= await fetchPokemons(siguienteUrl)
        
        let nextUrl = response.nextUrl
        let pokemons= response.res
        
        let accumulatedPokemons = []
        accumulatedPokemons = accumulatedPokemons.concat(pokemons)
        
        while( accumulatedPokemons.length<20 && nextUrl!= null){
            console.log("ENTRO")
            
            response= await fetchPokemons(nextUrl)
            nextUrl = response.nextUrl
            pokemons= response.res
            
            accumulatedPokemons = accumulatedPokemons.concat(pokemons)  
        }

        if(nextUrl == null){setVerMas(false)}
        else {setSiguienteUrl(nextUrl)}
        setPokemones( prev => [...prev, ...accumulatedPokemons])

        setLoading(false)

    }

    const pokeFilter= async (isChecked, id) => {
        console.log("Filter trigger", pokemones)
            setTiposBusqueda( prev => {
                    if (isChecked){
                        return prev.concat(id)
                    }
                    else {
                        let newArr = []
        
                        prev.map( (elem) => {
                            if (elem != id)
                                newArr.push(elem)
                        })
        
                        return newArr
                    }
            })

            abortController.abort();
            
            setPokemones([])
            console.log("pokemones setted down", pokemones)
            setSiguienteUrl("https://pokeapi.co/api/v2/pokemon?limit=20&offset=0")
            setVerMas(true)

            setLoading(true)
    }

    const pokeSearch = async (search) => {
            
            console.log("submit trigger", pokemones)
            abortController.abort();
            setPokemones([])
            console.log("pokemones setted down", pokemones)
            setSiguienteUrl("https://pokeapi.co/api/v2/pokemon?limit=20&offset=0")
            setVerMas(true)
            setBusqueda(search)
            
            setLoading(true)
            
    }
    

    // Por recomendacion combiene usar useEffect 
    // para ejecutar las peticiones desde aca
    useEffect( () => {
        chargePokemons()
        }, [] )

    useEffect( () => {
        if(loading){
            console.log("Loading")
            const loader = document.getElementById("spinLoader")
            loader.classList.remove("isLoaded")
            loader.classList.add("isLoading")
        }
        else{
            console.log("Loaded")
            const loader = document.getElementById("spinLoader")
            loader.classList.remove("isLoading")
            loader.classList.add("isLoaded")
        }
    }, [loading])
    
    
    useEffect(() => {
        if(loading && verMas){
            morePokemons()   
        }

    }, [loading])
    
    return {pokemones, morePokemons, verMas, pokeFilter, pokeSearch, loading}
        
    }