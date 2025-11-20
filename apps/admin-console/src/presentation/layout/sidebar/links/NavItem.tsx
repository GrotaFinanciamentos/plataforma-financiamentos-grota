import { NavItem } from "@/application/core/@types/Sidebar/NavItem";
import { Car, ChartBar, Users } from "lucide-react";

export const navItems: NavItem[] = [
  {
    icon: <ChartBar />,
    name: "Painel Administrativo",
    subItems: [{ name: "Visao Geral", path: "/visao-geral", pro: false },],
  },
  {
    name: "Logistas",
    icon: <Users />,
    subItems: [{ name: "Gestão de Logistas", path: "/logistas", pro: false },],
  },
  {
    name: "Gestão de Propostas",
    icon: <Users />,
    subItems: [{ name: "Esteira de Propostas",path: "/esteira-de-propostas", }],
  },
  {
    name: "Vendedores",
    icon: <Users />,
    subItems: [{ name: "Cadastrar Vendedor", path: "/vendedores", pro: false }],
  },
];