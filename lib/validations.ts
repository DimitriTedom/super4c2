import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Veuillez saisir une adresse e-mail valide."),
  password: z.string().min(8, "Le mot de passe doit comporter au moins 8 caractères."),
});

export const signUpSchema = signInSchema.extend({
  displayName: z.string().min(2, "Le prénom ou nom doit comporter au moins 2 caractères.").max(64).optional(),
});
