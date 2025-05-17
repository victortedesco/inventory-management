import { login } from "@/services/auth.service";
import { useState } from "react";
import { useNavigate } from "react-router";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const payload = {
      identifier: identifier,
      password: password,
    };

    try {
      const token = await login(payload.identifier, payload.password);
      if (!token) {
        return;
      }
      navigate("/");
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[url(/login-background.png)] bg-cover bg-no-repeat relative">
      <div className="w-full h-100 max-w-md p-8 space-y-6 bg-green-100 rounded-2xl shadow-lg shadow-black/30">
        <h2 className="text-3xl font-bold text-center text-green-800">Autenticação</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-2">
            <label className="text-left block text-lg font-medium text-green-700 ">
              Email, CPF ou Usuário
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              name="nome"
              required
              className="bg-white w-full p-2 mt-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/75 shadow-sm shadow-black/50"
              placeholder="Insira seu identificador"
            />
          </div>
          <div className="p-2">
            <label className="text-left block text-lg font-medium text-green-700">
              Senha
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                required
                className="bg-white w-full p-2 mt-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/75 shadow-sm shadow-black/50"
                placeholder="Insira sua senha"
              />
            </div>
          </div>
          <div className="flex flex-col items-center p-2">
            <button
              type="submit"
              className="cursor-pointer w-40 p-2 font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 shadow-sm shadow-black/50
                    duration-500 ease-in-out hover:w-42 hover:h-10"
              onClick={(e) => handleSubmit(e)}
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
