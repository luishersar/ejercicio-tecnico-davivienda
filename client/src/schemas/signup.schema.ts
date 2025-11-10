import * as yup from "yup";


export const validationSchemaSignUp = yup.object({
  name: yup
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .required("El nombre es requerido"),
  email: yup
    .string()
    .email("Ingresa un email válido")
    .required("El email es requerido"),
  password: yup
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es requerida"),
});

export type FormDataSignUp = {
  name: string;
  email: string;
  password: string;
};