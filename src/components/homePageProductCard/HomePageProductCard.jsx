import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import myContext from "../../context/myContext";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addToCart, deleteFromCart } from "../../redux/cartSlice";

const HomePageProductCard = () => {

    const user =  JSON.parse(localStorage.getItem('users'))

    const navigate = useNavigate();

    const context = useContext(myContext);
    const { getAllProduct } = context;

    const cartItems = useSelector((state) => state.cart);
    

    const dispatch = useDispatch();

    const addCart = (item) => {

        if (!user) {
            toast.error("Debes iniciar sesión para añadir productos al carrito");
            return;
        }
        const serializableItem = {
            ...item,
            time: item.time?.toMillis() || Date.now(),
        };
        dispatch(addToCart(serializableItem));
        toast.success("Producto añadido al carrito")
    }

    const deleteCart = (item) => {
        const serializableItem = {
            ...item,
            time: item.time?.toMillis() || Date.now(),
        };
        dispatch(deleteFromCart(serializableItem));
        toast.success("Producto eliminado del carrito")
    }


    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems])


    return (
        <div className="mt-10">
            {/* Heading  */}
            <div className="">
                <h1 className=" text-center mb-5 text-2xl font-semibold">Mas vendidos</h1>
            </div>

            {/* main  */}
            <section className="text-gray-600 body-font">
                <div className="container px-5 py-5 mx-auto">
                    <div className="flex flex-wrap -m-4">
                        {getAllProduct.slice(0, 8).map((item, index) => {
                            const { id, title, price, productImageURL } = item
                            return (
                                <div key={index} className="p-4 w-full md:w-1/4">
                                    <div className="h-full border border-gray-300 rounded-xl overflow-hidden shadow-md cursor-pointer">
                                        <img
                                            onClick={() => navigate(`/productinfo/${id}`)}
                                            className="lg:h-80  h-96 w-full"
                                            src={productImageURL}
                                            alt="blog"
                                        />
                                        <div className="p-6">
                                            <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                                               Momentos Eternos
                                            </h2>
                                            <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                                                {title.substring(0, 25)}
                                            </h1>
                                            <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                                                ${price}
                                            </h1>

                                            <div className="flex justify-center ">
                                            {
                                                cartItems?.some((p) => String(p.id) === String(item.id))
                                                ?
                                                <button
                                                    onClick={() => deleteCart(item)}
                                                    className="bg-white hover:bg-pink-50 w-full text-pink-500 border border-pink-500 py-[4px] rounded-lg font-bold">
                                                        Eliminar del carrito
                                                </button>
                                                :
                                                <button
                                                    onClick={() => addCart(item)}
                                                    className="bg-pink-500 hover:bg-pink-600 w-full text-white py-[4px] rounded-lg font-bold">
                                                        Añadir al carrito
                                                </button>
                                            }
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePageProductCard;