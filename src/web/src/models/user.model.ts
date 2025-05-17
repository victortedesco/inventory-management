export default interface User {
  id: string;
  displayName: string;
  userName: string;
  email: string;
  cpf: string;
  role: string;
}

export const maskCPF = (cpf?: string): string | undefined => {
  if (!cpf) return undefined;
  const limpo = cpf.replace(/\D/g, "");
  return `${limpo.slice(0, 3)}.***.***-${limpo.slice(-2)}`;
};

export const formatCPF = (value: string) => {
  value = value.replace(/\D/g, "");

  if (value.length <= 11) {
    value = value
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  return value;
};
