import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata = {
  title: "Console Direction & Réseau Établissements — Super4C2 Enterprise",
  description:
    "Tableau de bord exécutif de supervision des cohortes d'entraînement TCF Canada, TEF et IELTS, suivi des scores NCLC 7 et gestion des organisations partenaires.",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
