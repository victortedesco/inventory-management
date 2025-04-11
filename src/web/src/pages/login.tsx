import { useState } from 'react';

function LoginPage() {
  const [username, setNome] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("Form submitted");

    const payload = {
        nome: username,
        senha: password
    };

    try {
        const response = await fetch("http://localhost:5173/login", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" }
        });

        const textResponse = await response.text();

        console.log("Resposta recebida:", textResponse);


        if (!response.ok) {
            console.log("Erro ao tentar logar. Verifique suas credenciais.");
        }

        setTimeout(() => {
            window.location.href = "/initial";
        }, 1000);

    } catch (err: any) {
        console.error(err);
    }
}

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 relative">
    <button
        onClick={() => window.location.href = "/"}
        className="cursor-pointer absolute right-4 top-4 bg-green-800 text-white p-2 rounded-md hover:bg-green-700"
    >
        Voltar
    </button>

    <div className="w-full h-100 max-w-md p-8 space-y-6 bg-green-100 rounded-2xl shadow-lg shadow-black/30">
        <h2 className="text-3xl font-bold text-center text-green-800">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-2">
                <label className="text-left block text-lg font-medium text-green-700 ">Nome</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setNome(e.target.value)}
                    name="nome"
                    required
                    className="bg-white w-full p-2 mt-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/75 shadow-sm shadow-black/50"
                    placeholder="Insira seu Nome"
                />
            </div>
            <div className="p-2">
                <label className="text-left block text-lg font-medium text-green-700">Senha</label>
                <div className="relative">
                    <input
                        type={password ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        name="password"
                        required
                        className="bg-white w-full p-2 mt-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/75 shadow-sm shadow-black/50"
                        placeholder="Insira sua Senha"
                    />
                    
                </div>
            </div>
            <div className="flex flex-col items-center p-2">
                <button
                    type="submit"
                    className="cursor-pointer w-40 p-2 font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 shadow-sm shadow-black/50
                    duration-500 ease-in-out hover:w-42 hover:h-10"
                    onClick={() => handleSubmit}
                >
                    Entrar
                </button>
            </div>
        </form>
    </div>

    
  </div>
    )}

export default LoginPage;