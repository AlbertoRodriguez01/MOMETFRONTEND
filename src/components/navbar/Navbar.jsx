import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../searchBar/SearchBar";
import { useSelector } from "react-redux";


const Navbar = () => {
    const user =  JSON.parse(localStorage.getItem('users'))

    const navigate = useNavigate();

    const logout = () => {
        const confirmed = window.confirm("¿Estás seguro de que deseas cerrar sesión?");
        if (confirmed) {
            localStorage.removeItem('users');
            navigate('/');
        }
    };
    
    const cartItems = useSelector((state) => state.cart)

    // navList Data
    const navList = (
        <ul className="flex space-x-3 text-white font-medium text-md px-5 ">
            {/* Inicio */}
            <li>
                <Link to={'/'}>Inicio</Link>
            </li>

            {/* Todos los Productos */}
            <li>
                <Link to={'/allproduct'}>Todos los productos</Link>
            </li>

            {/* Signup */}
            {!user ? <li><Link to={'/signup'}>Registrarse</Link></li> : ""}

            {/* Login */}
            {!user ? <li><Link to={'/login'}>Iniciar Sesion</Link></li> : ""}

            {/* Usuario */}
            {user?.role === "user" && <li><Link to={'/user-dashboard'}>{user?.name}</Link></li>}

            {/* Admin */}
            {user?.role === "admin" && <li><Link to={'/admin-dashboard'}>{user?.name}</Link></li>}

            {/* Logout */}
            {user && <li className="cursor-pointer" onClick={logout}>Cerrar Sesion</li>}

            {/* Carrito */}
            <li><Link to={'/cart'}>Carrito({cartItems.length})</Link></li>
        </ul>
    );

    return (
        <nav className="bg-pink-600 sticky top-0">
            {/* main */}
            <div className="lg:flex lg:justify-between items-center py-3 lg:px-3 ">
                {/* left */}
                <div className="left py-3 lg:py-0">
                    <Link to={'/'}>
                        <h2 className="font-bold text-white text-2xl text-center">Momentos Eternos</h2>
                    </Link>
                </div>

                {/* right */}
                <div className="right flex justify-center mb-4 lg:mb-0">
                    {navList}
                </div>

                {/* Search Bar */}
                <SearchBar />
            </div>
        </nav>
    );
};

export default Navbar;
