import { useNavigate, useParams } from "react-router";
import myContext from "../../context/myContext";
import { useContext, useEffect, useState } from "react";
import { Timestamp, doc, getDoc, setDoc } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import toast from "react-hot-toast";
import Loader from "../../components/loader/Loader";

const categoryList = [
    { name: 'Ramos Eternos' },
    { name: 'Amigurumis' }
];

const UpdateProductPage = () => {
    const context = useContext(myContext);
    const { loading, setLoading, getAllProductFunction } = context;
    const navigate = useNavigate();
    const { id } = useParams();

    const [imageFile, setImageFile] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        setPreviewURL(URL.createObjectURL(file));
    };

    const getSingleProductFunction = async () => {
        setLoading(true);
        try {
            const productTemp = await getDoc(doc(fireDB, "products", id));
            const productData = productTemp.data();
            if (productData) {
                setProduct({
                    ...productData,
                    title: productData.title || "",
                    price: productData.price || "",
                    productImageURL: productData.productImageURL || "",
                    category: productData.category || "",
                    description: productData.description || "",
                    quantity: productData.quantity || 1,
                    time: productData.time || Timestamp.now(),
                    date: productData.date || new Date().toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric"
                    })
                });
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const validateFields = () => {
        if (!product.title) {
            toast.error("El nombre del producto es obligatorio");
            return false;
        }
        if (product.price === "" || product.price < 0) {
            toast.error("El precio debe ser un número positivo");
            return false;
        }
        if (!product.category) {
            toast.error("Selecciona una categoría para el producto");
            return false;
        }
        if (product.quantity < 0) {
            toast.error("La cantidad debe ser un número positivo");
            return false;
        }
        if (!product.description) {
            toast.error("La descripción del producto es obligatoria");
            return false;
        }
        return true;
    };

    const uploadImage = async () => {
        if (!imageFile) return null;
        const storage = getStorage();
        const storageRef = ref(storage, `products/${id}/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        return await getDownloadURL(storageRef);
    };

    const updateProduct = async () => {
        if (!validateFields()) return;

        setLoading(true);
        try {
            let updatedProduct = { ...product };
            if (imageFile) {
                const imageURL = await uploadImage();
                updatedProduct.productImageURL = imageURL;
            }
            await setDoc(doc(fireDB, "products", id), updatedProduct);
            toast.success("Producto actualizado correctamente");
            getAllProductFunction();
            navigate('/admin-dashboard');
        } catch (error) {
            toast.error("Error al actualizar el producto: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getSingleProductFunction();
    }, []);

    return (
        <div>
            <div className='flex justify-center items-center h-screen'>
                {loading && <Loader />}
                <div className="login_Form bg-pink-50 px-8 py-6 border border-pink-100 rounded-xl shadow-md">
                    <div className="mb-5">
                        <h2 className='text-center text-2xl font-bold text-pink-500 '>Actualizar producto</h2>
                    </div>

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

                    <div className="mb-3">
                        <input
                            type="file"
                            id="file-upload"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <label
                            htmlFor="file-upload"
                            className='bg-pink-500 hover:bg-pink-600 w-full text-white text-center py-2 font-bold rounded-md cursor-pointer'
                        >
                            Seleccionar Imagen
                        </label>
                    </div>

                    {previewURL && (
                        <div className="mb-3">
                            <img
                                src={previewURL}
                                alt="Vista previa"
                                className="w-40 h-40 object-cover rounded-md"
                            />
                        </div>
                    )}

                    <div className="mb-3">
                        <select
                            className="w-full px-1 py-2 text-pink-300 bg-pink-50 border border-pink-200 rounded-md outline-none"
                            value={product.category}
                            onChange={(e) => setProduct({ ...product, category: e.target.value })}
                        >
                            <option disabled>Seleccionar categoría del producto</option>
                            {categoryList.map((value, index) => (
                                <option className="first-letter:uppercase" key={index} value={value.name}>{value.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <textarea
                            value={product.description}
                            onChange={(e) => setProduct({ ...product, description: e.target.value })}
                            name="description"
                            placeholder="Descripción del producto"
                            rows="5"
                            className="w-full px-2 py-1 text-pink-300 bg-pink-50 border border-pink-200 rounded-md outline-none placeholder-pink-300"
                        />
                    </div>

                    <div className="mb-3">
                        <button
                            onClick={updateProduct}
                            type='button'
                            className='bg-pink-500 hover:bg-pink-600 w-full text-white text-center py-2 font-bold rounded-md'
                        >
                            Actualizar datos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateProductPage;