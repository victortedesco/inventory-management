import { useState } from "react";

function LoginPage() {
    const [nome, setNome] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState<'success' | 'error'>('success');
    const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade da senha

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log("Form submitted");

        try {

            setModalMessage("Login realizado com sucesso!");
            setModalType("success");
            setShowModal(true);

            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        } catch (err: any) {
            console.error(err);

            setModalMessage(err.message);
            setModalType("error");
            setShowModal(true);
        }
    };


    const closeModal = () => setShowModal(false);

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-50 relative">
            <div className="w-full h-100 max-w-md p-8 space-y-6 bg-blue-100 rounded-2xl shadow-lg shadow-black/30">
                <h2 className="text-3xl font-bold text-center">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="p-2">
                        <label className="block text-lg font-medium text-gray-700">Nome</label>
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            name="nome"
                            required
                            className="bg-gray-100 w-full p-2 mt-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/75 shadow-sm shadow-black/50"
                            placeholder="Insira seu Nome"
                        />
                    </div>
                    <div className="p-2">
                        <label className="block text-lg font-medium text-gray-700">Senha</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                name="password"
                                required
                                className="bg-gray-100 w-full p-2 mt-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/75 shadow-sm shadow-black/50"
                                placeholder="Insira sua Senha"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-2 text-gray-600"
                            >

                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col items-center p-2">
                        <button
                            type="submit"
                            className="cursor-pointer w-40 p-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 shadow-sm shadow-black/50"
                        >
                            Entrar
                        </button>
                    </div>
                </form>
            </div>

            {showModal && (
                <div className="absolute inset-0 flex justify-center h-35 z-50">
                    <div className={`bg-white p-6 rounded-lg shadow-lg w-full max-w-sm ${modalType === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                        <p className="text-center text-xl font-semibold">{modalMessage}</p>
                        {modalType === 'error' && (
                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={closeModal}
                                    className="bg-red-500 px-4 py-2 text-white rounded-lg hover:bg-red-600 transition"
                                >
                                    Fechar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoginPage;