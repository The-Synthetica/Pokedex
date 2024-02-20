import { SearchBar } from "./Searchbar"
import "./styles/navbar.css"
import "./styles/types.css"

export function NavBar( {loading, submitprops, filterprops} ){

    return(
        <nav className="navbar">
            <SearchBar loading={loading} submitHandler={submitprops}/>
            <h2>Tambien podes usar los filtros!</h2>
            <Filters loading= {loading} filterHandler={filterprops}/>
        </nav>
    )
}

const types=["normal","fire","water","electric","grass","ice","fighting","poison","ground","flying","psychic","bug","rock","ghost","dragon","dark","steel","fairy","stellar"]

function Filters({loading, filterHandler}){
        // Recordemos hacer el toggle! sino la accesibilidad se cae
        const eventhandler = (event) => {
        }

        const changeHandler = (event) => {
            console.log(event.target.checked, event.target.id)

            // Recuperamos info valiosa.
            const elemId= event.target.id;
            const elemState= event.target.checked;
            if (elemState) {
                const elem= document.getElementById(elemId)
                const parent= elem.parentNode;

                parent.classList.add("isCheked")
                // document.getElementById(elemId).checked= true
            }

            else{
                const elem= document.getElementById(elemId)
                const parent= elem.parentNode;

                parent.classList.remove("isCheked")
                // document.getElementById(elemId).checked= false
            }

            filterHandler(event)
        }

    return(
        <ul className="filters">

                {
                    types.map( (elem) => {
                        return(
                            <li key={elem} className={elem}> 
                            <input id={elem} onChange={changeHandler} type="checkbox" disabled={loading} ></input>
                            <label id={elem} onClick={eventhandler} htmlFor={elem}>{elem}</label>  </li>
                        )
                    })
                }
            </ul>
    )
}