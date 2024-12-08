import {
    Button,
    Dialog,
    DialogBody,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import axios from "axios";
import { useSelector } from "react-redux";

const BuyNowModal = ({ addressInfo, setAddressInfo, buyNowFunction }) => {
    const [preferenceId, setPreferenceId] = useState(null);
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(!open);

    const cartItems = useSelector((state) => state.cart);

    initMercadoPago('APP_USR-26e4d070-50ed-46ae-82bf-efab896454fa');

    useEffect(() => {
        setPreferenceId(null);
    }, []);

    const createPreference = async () => {
        try {
            console.log("Datos del carrito ", cartItems);
    
            const preferenceData = {
                items: cartItems.map((item) => ({
                    title: item.title,
                    quantity: item.quantity,
                    unit_price: item.price,
                })),
            };
    
            console.log("Datos enviados al servidor ", preferenceData);
    
            const response = await axios.post("https://mometback.vercel.app/create_preference", preferenceData);
            
            console.log("Respuesta del servidor: ", response.data);
            
            const preferenceId = response.data.id;
            console.log("ID de preferencia: ", preferenceId);
    
            setPreferenceId(preferenceId);
            buyNowFunction()
        } catch (error) {
            console.error("Error en el servidor:", error);
            console.error("Detalles del error: ", error.response?.data || error.message);
        }
    };    

    const handleBuy = async () => {
        await createPreference();
    };

    return (
        <>
            <Button
                type="button"
                onClick={handleOpen}
                className="w-full px-4 py-3 text-center text-gray-100 bg-pink-600 border border-transparent dark:border-gray-700 hover:border-pink-500 hover:text-pink-700 hover:bg-pink-100 rounded-xl"
            >
                Comprar ahora
            </Button>
            <Dialog open={open} handler={handleOpen} className=" bg-pink-50">
                <DialogBody className="">
                    <div className="mb-3">
                        <input
                            type="text"
                            name="name"
                            value={addressInfo.name}
                            onChange={(e) => {
                                setAddressInfo({
                                    ...addressInfo,
                                    name: e.target.value,
                                });
                            }}
                            placeholder="Ingresa tu nombre"
                            className="bg-pink-50 border border-pink-200 px-2 py-2 w-full rounded-md outline-none text-pink-600 placeholder-pink-300"
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            name="address"
                            value={addressInfo.address}
                            onChange={(e) => {
                                setAddressInfo({
                                    ...addressInfo,
                                    address: e.target.value,
                                });
                            }}
                            placeholder="Ingresa tu direccion"
                            className="bg-pink-50 border border-pink-200 px-2 py-2 w-full rounded-md outline-none text-pink-600 placeholder-pink-300"
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="text"
                            name="mobileNumber"
                            value={addressInfo.mobileNumber}
                            onChange={(e) => {
                                setAddressInfo({
                                    ...addressInfo,
                                    mobileNumber: e.target.value,
                                });
                            }}
                            placeholder="Ingresa tu numero de telefono"
                            className="bg-pink-50 border border-pink-200 px-2 py-2 w-full rounded-md outline-none text-pink-600 placeholder-pink-300"
                        />
                    </div>

                    <div className="">
                        {!preferenceId ? (
                            <Button
                                type="button"
                                onClick={async () => {
                                    await handleBuy();
                                }}
                                className="w-full px-4 py-3 text-center text-gray-100 bg-pink-600 border border-transparent dark:border-gray-700 rounded-lg"
                            >
                                Continuar al pago
                            </Button>
                        ) : (
                            <Wallet
                                initialization={{ preferenceId }}
                                customization={{ texts: { valueProp: "smart_option" } }}
                            />
                        )}
                    </div>
                </DialogBody>
            </Dialog>
        </>
    );
};

export default BuyNowModal;