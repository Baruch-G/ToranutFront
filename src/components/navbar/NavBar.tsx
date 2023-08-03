import { Link } from "react-router-dom"
import "./NavBar.css"

function NavBar() {
    return (
        <div className="navbar">
            <Link to={"/duties-table"}>רשימת תורנויות</Link>
            <Link to={"/"}>בית</Link>
        </div>
    )
}

export default NavBar
