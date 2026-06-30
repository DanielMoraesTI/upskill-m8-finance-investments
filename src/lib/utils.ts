import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
// O arquivo utils.ts contém funções utilitárias que são usadas em todo o projeto para manipulação de classes CSS. A função cn é uma função auxiliar que combina classes CSS usando clsx e twMerge, permitindo que você passe várias classes como argumentos e obtenha uma string de classes resultante. Isso é útil para aplicar estilos condicionalmente e evitar conflitos de classes em componentes React.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
