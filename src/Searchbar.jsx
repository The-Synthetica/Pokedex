import "./styles/navbar.css"


export function SearchBar({loading, submitHandler}){
        
    return <form className="searchcont" onSubmit={
        submitHandler}>
        <input className="searchbar" placeholder="Busca tu pokemon!"></input>
        <button className="searchbutton" disabled={loading} type="submit">🔎</button>
    </form>

}