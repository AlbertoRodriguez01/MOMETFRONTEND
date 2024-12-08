import Layout from "../../components/layout/Layout";
import { useContext } from "react";
import myContext from "../../context/myContext";
import Loader from "../../components/loader/Loader";
import { useNavigate } from "react-router-dom";


const UserDashboard = () => {
    const user = JSON.parse(localStorage.getItem('users'));
    const navigate = useNavigate();
    const context = useContext(myContext);
    const { loading, getAllOrder } = context;

    // Imagen predeterminada
    const defaultImage = "https://firebasestorage.googleapis.com/v0/b/momentos-eternos-5e14f.appspot.com/o/usuario.png?alt=media&token=b69683c7-9502-412c-8909-072c08f722c2";
    const profileImageURL = user?.imageURL || defaultImage;

    return (
        <Layout>
            <div className="container mx-auto px-4 py-5 lg:py-8">
                {/* Top  */}
                <div className="top">
                    <div className="bg-pink-50 py-5 rounded-xl border border-pink-100">
                        {/* Imagen */}
                        <div className="flex justify-center">
                            <img src={profileImageURL} alt="User Profile" style={{ width: '100px', height: 'auto' }} />
                        </div>
                        {/* Texto */}
                        <div>
                            <h1 className="text-center text-lg"><span className="font-bold">Nombre: </span>{user?.name}</h1>
                            <h1 className="text-center text-lg"><span className="font-bold">Email: </span>{user?.email}</h1>
                            <h1 className="text-center text-lg"><span className="font-bold">Rol: </span>{user?.role}</h1>
                        </div>
                        {/* <div className="flex justify-center mt-4">
                            <button
                                type="button"
                                onClick={() => navigate(`/updateprofile/${user?.uid}`)}
                                className="bg-pink-500 hover:bg-pink-600 w-full sm:w-auto text-white text-center py-2 font-bold rounded-md"
                            >
                                Editar datos
                            </button>
                        </div> */}
                    </div>
                </div>

                {/* Bottom  */}
                <div className="bottom">
                    <div className="mx-auto my-4 max-w-6xl px-2 md:my-6 md:px-0">
                        <h2 className="text-2xl lg:text-3xl font-bold">Mis Ordenes</h2>
                        <div className="flex justify-center relative top-10">
                            {loading && <Loader />}
                        </div>

                        {/* Mostrar órdenes del usuario */}
                        {getAllOrder.filter((obj) => obj.userid === user?.uid).map((order, index) => {
                            return (
                                <div key={index}>
                                    {order.cartItems.map((item, index) => {
                                        const { id, date, quantity, price, title, productImageURL, category } = item;
                                        const { status } = order;
                                        return (
                                            <div key={index} className="mt-5 flex flex-col overflow-hidden rounded-xl border border-pink-100 md:flex-row">
                                                {/* Información de la orden */}
                                                <div className="w-full border-r border-pink-100 bg-pink-50 md:max-w-xs">
                                                    <div className="p-8">
                                                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-1">
                                                            <div className="mb-4">
                                                                <div className="text-sm font-semibold text-black">Id Orden</div>
                                                                <div className="text-sm font-medium text-gray-900">#{id}</div>
                                                            </div>
                                                            <div className="mb-4">
                                                                <div className="text-sm font-semibold">Fecha</div>
                                                                <div className="text-sm font-medium text-gray-900">{date}</div>
                                                            </div>
                                                            <div className="mb-4">
                                                                <div className="text-sm font-semibold">Cantidad total</div>
                                                                <div className="text-sm font-medium text-gray-900">$ {price * quantity}</div>
                                                            </div>
                                                            <div className="mb-4">
                                                                <div className="text-sm font-semibold">Estatus de orden</div>
                                                                <div className="text-sm font-medium text-green-800 first-letter:uppercase">{status}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Detalles del producto */}
                                                <div className="flex-1">
                                                    <div className="p-8">
                                                        <ul className="-my-7 divide-y divide-gray-200">
                                                            <li className="flex flex-col justify-between space-x-5 py-7 md:flex-row">
                                                                <div className="flex flex-1 items-stretch">
                                                                    <div className="flex-shrink-0">
                                                                        <img className="h-40 w-40 rounded-lg border border-gray-200 object-contain" src={productImageURL} alt="img" />
                                                                    </div>
                                                                    <div className="ml-5 flex flex-col justify-between">
                                                                        <div className="flex-1">
                                                                            <p className="text-sm font-bold text-gray-900">{title}</p>
                                                                            <p className="mt-1.5 text-sm font-medium text-gray-500">{category}</p>
                                                                        </div>
                                                                        <p className="mt-4 text-sm font-medium text-gray-500">x {quantity}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="ml-auto flex flex-col items-end justify-between">
                                                                    <p className="text-right text-sm font-bold text-gray-900">$ {price}</p>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default UserDashboard;