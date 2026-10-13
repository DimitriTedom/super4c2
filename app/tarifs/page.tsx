import { redirect } from "next/navigation";

export const metadata = {
  title: "Accès Lancement Gratuit — Super4C2",
};

export default function TarifsPage() {
  redirect("/dashboard");
}
