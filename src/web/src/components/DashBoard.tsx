// https://excalidraw.com/#room=3f52702c69d6308f23cf,B0sp2eC9mYKVsjn3khGK7A
import User from "@/models/user.model";
import { decodeToken, logout } from "@/services/auth.service";
import { getById } from "@/services/user.service";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const DashBoard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const decodedToken = decodeToken(localStorage.getItem("token"));
      if (!decodedToken) {
        logout();
        return;
      }
      const data = await getById(decodedToken.sub);
      if (!data) {
        logout();
        return;
      }
      setUser(data as User);
    }

    fetchUser();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-row items-center justify-center mt-6 mr-20">
        <img
          className="size-16"
          src="/user-icon.png"
          alt="Ícone do Usuário"
        ></img>
        <div className="flex flex-col items-start justify-center ml-4">
          <h1>{user ? user.displayName : "Carregando..."}</h1>
          <h2>{user ? user.CPF : "Carregando..."}</h2>
          <h3>{user ? user.role : "Carregando..."}</h3>
        </div>
      </div>

      <div className="flex flex-col space-y-4 mt-30 font-bold">
        <button
          onClick={() => navigate("/move")}
          className="text-xl w-60 h-16 bg-[#68b957] rounded-md border-1 border-black"
        >
          Movimentação
        </button>
        <button 
         onClick={() => navigate("/products")}
         className="text-xl w-60 h-16 bg-[#68b957] rounded-md border-1 border-black">
          Produtos
        </button>
        <button 
         onClick={() => navigate("/categories")}
        className="text-xl w-60 h-16 bg-[#68b957] rounded-md border-1 border-black">
          Categorias
        </button>
        <button 
         onClick={() => navigate("/users")}
        className="text-xl w-60 h-16 bg-[#68b957] rounded-md border-1 border-black">
          Usuários
        </button>
        <button 
         onClick={() => navigate("/history")}
        className="text-xl w-60 h-16 bg-[#68b957] rounded-md border-1 border-black">
          Histórico
        </button>
      </div>

      <button
        onClick={() => logout()}
        className="text-xl mt-50 bg-red-400 w-40 h-10 rounded-md border-1 border-black font-bold "
      >
        Sair
      </button>
    </div>
  );
};
