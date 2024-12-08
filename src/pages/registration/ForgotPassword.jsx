import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/FirebaseConfig";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Loader from "../../components/loader/Loader";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (email === "") {
      toast.error("Por favor, ingresa tu correo electrónico");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Se ha enviado un enlace para restablecer la contraseña a tu correo");
      setEmail("");
    } catch (error) {
      console.error(error);
      toast.error("Hubo un error al enviar el enlace de recuperación. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      {loading && <Loader/>}

      <div className="login_Form bg-pink-50 px-1 lg:px-8 py-6 border border-pink-100 rounded-xl shadow-md">
        <div className="mb-5">
          <h2 className="text-center text-2xl font-bold text-pink-500">
            Recuperar Contraseña
          </h2>
        </div>

        <div className="mb-3">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-pink-50 border border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-200"
          />
        </div>

        <div className="mb-5">
          <button
            type="button"
            onClick={handlePasswordReset}
            className="bg-pink-500 hover:bg-pink-600 w-full text-white text-center py-2 font-bold rounded-md"
          >
            Enviar enlace de recuperación
          </button>
        </div>

        <div>
          <h2 className="text-black">
            ¿Ya tienes una cuenta?{" "}
            <Link className="text-pink-500 font-bold" to="/login">
              Iniciar sesión
            </Link>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
