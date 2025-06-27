import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const formatSeconds = (seconds: number) => {
  if (seconds == 1 || seconds == 0) return `${seconds} segundo`;
  return `${seconds} segundos`;
};

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState<number>(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <p className="mt-3 text-center text-2xl font-bold text-black">
        Página não encontrada. <br></br> Você será redirecionado para a página
        inicial em {formatSeconds(seconds)}.
      </p>
    </>
  );
};

export default NotFoundPage;
