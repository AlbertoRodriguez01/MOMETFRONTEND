import { Timestamp, addDoc, collection } from "firebase/firestore";
import { useContext, useState } from "react";
import myContext from "../../context/myContext";
import toast from "react-hot-toast";
import { fireDB, storage } from "../../firebase/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import shortid from "shortid";

const categoryList = [
    { name: 'Ramos Eternos' },
    { name: 'Amigurumis' }
];

const AddProductPage = () => {
    const context = useContext(myContext);
    const { loading, setLoading } = context;
    const navigate = useNavigate();

    const [imageFile, setImageFile] = useState(null)
    const [previewURL, setPreviewURL] = useState(null)

    const [product, setProduct] = useState({
        title: "",
        price: "",
        productImageURL: "",
        category: "",
        description: "",
        quantity: 1,
        time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric"
        })
    });

    // Función para seleccionar y subir imagen
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        setImageFile(file);
        setPreviewURL(URL.createObjectURL(file));
    }

    // Función para subir imagen a Firebase Storage
    const uploadImage = async () => {
        if (!imageFile) return null

        const imageRef = ref(storage, `products/${shortid.generate()}-${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        return await getDownloadURL(imageRef);
    }

    const addProductFunction = async () => {
        if (product.title === "" || product.price === "" || product.category === "" || product.description === "") {
            return toast.error("Por favor llene todos los campos");
        }

        const priceValue = parseFloat(product.price);
        if (isNaN(priceValue) || priceValue <= 0) {
            return toast.error("Ingrese un precio valido");
        }

        setLoading(true);
        try {
            const imageURL = await uploadImage()
            const productData = { ...product, price: priceValue, productImageURL: imageURL };
            const productRef = collection(fireDB, 'products');
            await addDoc(productRef, productData);
            toast.success("Se ha añadido el producto correctamente");
            navigate('/admin-dashboard');
            setLoading(false);
        } catch (error) {
            toast.error("Fallo al agregar el producto" + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className='flex justify-center items-center h-screen'>
                {loading && <Loader />}
                {/* Formulario para añadir producto */}
                <div className="login_Form bg-pink-50 px-8 py-6 border border-pink-100 rounded-xl shadow-md">
                    <div className="mb-5">
                        <h2 className='text-center text-2xl font-bold text-pink-500 '>Añadir un producto</h2>
                    </div>

                    {/* Input Título */}
                    <div className="mb-3">
                        <input
                            type="text"
                            name="title"
                            value={product.title}
                            onChange={(e) => setProduct({ ...product, title: e.target.value })}
                            placeholder='Nombre del producto'
                            className='bg-pink-50 text-pink-300 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-300'
                        />
                    </div>

                    {/* Input Precio */}
                    <div className="mb-3">
                        <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={(e) => setProduct({ ...product, price: e.target.value })}
                            placeholder='Precio'
                            className='bg-pink-50 text-pink-300 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-300'
                        />
                    </div>

                    {/* Botón para seleccionar imagen estilizado */}
                    <div className="mb-3">
                        <input
                            type="file"
                            id="file-upload"
                            onChange={handleImageChange}
                            className="hidden" // Ocultamos el input real
                        />
                        <label
                            htmlFor="file-upload"
                            className='bg-pink-500 hover:bg-pink-600 w-full text-white text-center py-2 font-bold rounded-md cursor-pointer'
                        >
                            Seleccionar Imagen
                        </label>
                    </div>

                    {/* Vista previa de la imagen */}
                    {previewURL && (
                        <div className="mb-3">
                            <img
                                src={previewURL}
                                alt="Vista previa"
                                className="w-40 h-40 object-cover rounded-md"
                            />
                        </div>
                    )}

                    {/* Input Categoría */}
                    <div className="mb-3">
                        <select
                            className="w-full px-1 py-2 text-pink-300 bg-pink-50 border border-pink-200 rounded-md outline-none"
                            value={product.category}
                            onChange={(e) => setProduct({ ...product, category: e.target.value })}
                        >
                            <option disabled>Seleccionar categoria del producto</option>
                            {categoryList.map((value, index) => (
                                <option className="first-letter:uppercase" key={index} value={value.name}>{value.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Input Descripción */}
                    <div className="mb-3">
                        <textarea
                            value={product.description}
                            onChange={(e) => setProduct({ ...product, description: e.target.value })}
                            name="description"
                            placeholder="Descripción del producto"
                            rows="5"
                            className="w-full px-2 py-1 text-pink-300 bg-pink-50 border border-pink-200 rounded-md outline-none placeholder-pink-300"
                        >
                        </textarea>
                    </div>

                    {/* Botón para añadir producto */}
                    <div className="mb-3">
                        <button
                            onClick={addProductFunction}
                            type='button'
                            className='bg-pink-500 hover:bg-pink-600 w-full text-white text-center py-2 font-bold rounded-md'
                        >
                            Agregar Producto
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProductPage;