export default interface User {
  id: string;
  displayName: string;
  userName: string;
  email: string;
  cpf: string;
  role: string;
}

export const formatCPF = (cpf?: string): string | undefined => {
  if (!cpf) return undefined;
  const limpo = cpf.replace(/\D/g, "");
  return `${limpo.slice(0, 3)}.XXX.XXX-${limpo.slice(-2)}`;
};
