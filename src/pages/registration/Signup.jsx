import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import myContext from "../../context/myContext";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { auth, fireDB} from "../../firebase/FirebaseConfig"
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import toast from "react-hot-toast";
import Loader from "../../components/loader/Loader";

const Signup = () => {

    const context = useContext(myContext)
    const {loading, setLoading} = context

    const navigate = useNavigate()

    const [userSignup, setUserSignup] = useState({
        name: "",
        email: "",
        password: "",
        role: "user"
    })

    const userSignupFunction = async () => {
        // Expresión regular para validar el formato de un correo electrónico
        const emailRegex = /^[^\s@]+@(gmail\.com|hotmail\.com|yahoo\.com|saltillo\.tecnm\.mx|outlook\.com)$/;

        const nameRegex = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/;
    
        if (userSignup.name === "" || userSignup.email === "" || userSignup.password === "") {
            toast.error("Se requiere llenar todos los campos");
            return;
        }

        if (!nameRegex.test(userSignup.name)) {
        toast.error("El nombre solo debe contener letras y espacios");
        return;
    }
    
        if (!emailRegex.test(userSignup.email)) {
            toast.error("Por favor, introduce un correo electrónico válido");
            return;
        }
    
        if (userSignup.password.length < 6) {
            toast.error("La contraseña debe tener más de 6 caracteres");
            return;
        }

        setLoading(true);
    
        try {
            const users = await createUserWithEmailAndPassword(auth, userSignup.email, userSignup.password);
            sendEmailVerification(auth.currentUser).then((
                () => {
                    toast.success("Link de verificacion enviada al correo")
                }
            ))
            const user = {
                name: userSignup.name,
                email: users.user.email,
                uid: users.user.uid,
                role: userSignup.role,
                imageURL: "",
                time: Timestamp.now(),
                date: new Date().toLocaleDateString(
                    "en-US",
                    {
                        month: "short",
                        day: "2-digit",
                        year: "numeric"
                    }
                )
            };
    
            const userReference = collection(fireDB, "user");
            await addDoc(userReference, user);
    
            setUserSignup({
                name: "",
                email: "",
                password: ""
            });
    
            toast.success("Registrado correctamente");
            navigate('/login');
    
        } catch (error) {
            const errorCode = error.code;

            if (errorCode === 'auth/email-already-in-use') {
                toast.error('El correo ya está en uso');
            }
        } finally {
            setLoading(false);
        }
    }
    
    

    return (
        <div className='flex justify-center items-center h-screen'>
            { loading && <Loader/>}
            {/* Login Form  */}
            <div className="login_Form bg-pink-50 px-1 lg:px-8 py-6 border border-pink-100 rounded-xl shadow-md">

                {/* Top Heading  */}
                <div className="mb-5">
                    <h2 className='text-center text-2xl font-bold text-pink-500 '>
                        Formulario de registro
                    </h2>
                </div>

                {/* Input One  */}
                <div className="mb-3">
                    <input
                        type="text"
                        value={userSignup.name}
                        onChange={(e) => {
                            setUserSignup({
                                ...userSignup,
                                name: e.target.value
                            })
                        }}
                        placeholder='Nombre completo'
                        className='bg-pink-50 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-200'
                    />
                </div>

                {/* Input Two  */}
                <div className="mb-3">
                    <input
                        type="email"
                        value={userSignup.email}
                        onChange={(e) => {
                            setUserSignup({
                                ...userSignup,
                                email: e.target.value
                            })
                        }}
                        placeholder='Correo electronico'
                        className='bg-pink-50 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-200'
                    />
                </div>

                {/* Input Three  */}
                <div className="mb-5">
                    <input
                        type="password"
                        value={userSignup.password}
                        onChange={(e) => {
                            setUserSignup({
                                ...userSignup,
                                password: e.target.value
                            })
                        }}
                        placeholder='Contraseña'
                        className='bg-pink-50 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-200'
                    />
                </div>

                {/* Signup Button  */}
                <div className="mb-5">
                    <button
                    onClick={userSignupFunction}
                        type='button'
                        className='bg-pink-500 hover:bg-pink-600 w-full text-white text-center py-2 font-bold rounded-md '
                    >
                        Registarse
                    </button>
                </div>

                <div>
                    <h2 className='text-black'>Tienes cuenta? <Link className=' text-pink-500 font-bold' to={'/login'}>Iniciar Sesion</Link></h2>
                </div>

            </div>
        </div>
    );
}

export default Signup;
