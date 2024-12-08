import { useNavigate, useParams } from "react-router";
import { useContext, useState, useEffect } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { fireDB } from "../../firebase/FirebaseConfig";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import Loader from "../../components/loader/Loader";
import myContext from "../../context/myContext";

const UpdateProfilePage = () => {
    const context = useContext(myContext);
    const { loading, setLoading, getAllUserFunction } = context;
    const navigate = useNavigate();
    const { id } = useParams();

    const [imageFile, setImageFile] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);

    const [user, setUser] = useState({
        name: "",
        email: "",
        role: "user",
        imageURL: "",
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

    const getSingleUserFunction = async () => {
        setLoading(true);
        try {
            const userDoc = await getDoc(doc(fireDB, "user", id));
            const userData = userDoc.data();
            if (userData) {
                setUser({
                    ...userData,
                    name: userData.name || "",
                    email: userData.email || "",
                    imageURL: userData.imageURL || "",
                    role: userData.role || "user",
                    time: userData.time || Timestamp.now(),
                    date: userData.date || new Date().toLocaleString("en-US", {
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
        if (!/\S+@\S+\.\S+/.test(user.email)) {
            toast.error("El correo electrónico es obligatorio y debe ser válido");
            return false;
        }
        return true;
    };

    const uploadImage = async () => {
        if (!imageFile) return null;
        const storage = getStorage();
        const storageRef = ref(storage, `users/${id}/profileImage/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        return await getDownloadURL(storageRef);
    };

    const updateUserProfile = async () => {
        if (!validateFields()) return;

        setLoading(true);
        try {
            let updatedUser = { ...user };
            if (imageFile) {
                const imageURL = await uploadImage();
                updatedUser.imageURL = imageURL;
            }
            await setDoc(doc(fireDB, "user", id), updatedUser, { merge: true });
            toast.success("Perfil actualizado correctamente");
            navigate("/user-dashboard");
        } catch (error) {
            toast.error("Error al actualizar el perfil: " + error.message);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getSingleUserFunction();
    }, []);

    return (
        <div className="flex justify-center items-center h-screen">
            {loading && <Loader />}
            <div className="login_Form bg-pink-50 px-8 py-6 border border-pink-100 rounded-xl shadow-md">
                <h2 className="text-center text-2xl font-bold text-pink-500">Actualizar perfil</h2>

                {/* Name */}
                <div className="mb-3">
                    <input
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        placeholder="Nombre"
                        className="bg-pink-50 text-pink-300 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-300"
                    />
                </div>

                {/* Email */}
                <div className="mb-3">
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        placeholder="Correo electrónico"
                        className="bg-pink-50 text-pink-300 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-300"
                    />
                </div>

                {/* Profile Image */}
                <div className="mb-3">
                    <input
                        type="file"
                        id="file-upload"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                    <label
                        htmlFor="file-upload"
                        className="bg-pink-500 hover:bg-pink-600 w-full text-white text-center py-2 font-bold rounded-md cursor-pointer"
                    >
                        Seleccionar Imagen
                    </label>
                </div>

                {/* Preview of the profile image */}
                {previewURL && (
                    <div className="mb-3">
                        <img
                            src={previewURL}
                            alt="Vista previa"
                            className="w-40 h-40 object-cover rounded-md"
                        />
                    </div>
                )}

                {/* Update Profile Button */}
                <div className="mb-3">
                    <button
                        onClick={updateUserProfile}
                        className="bg-pink-500 hover:bg-pink-600 w-full text-white text-center py-2 font-bold rounded-md"
                    >
                        Actualizar perfil
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateProfilePage;