import { auth } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
// Esta função aguarda até que o usuário esteja autenticado ou até que o tempo limite seja atingido, retornando o usuário autenticado ou null se o tempo limite for atingido. Ela utiliza o Firebase Authentication para monitorar o estado de autenticação do usuário.
async function waitForAuthenticatedUser(
  timeoutMs = 4000,
): Promise<User | null> {
  if (auth.currentUser) {
    return auth.currentUser;
  }

  return new Promise((resolve) => {
    let unsubscribe: () => void = () => {};

    const timeoutId = setTimeout(() => {
      unsubscribe();
      resolve(null);
    }, timeoutMs);

    unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      clearTimeout(timeoutId);
      unsubscribe();
      resolve(firebaseUser);
    });
  });
}
// Esta função obtém o token de autenticação do usuário atual, retornando o token no formato "Bearer <token>". Ela utiliza o Firebase Authentication para recuperar o token do usuário autenticado, garantindo que apenas usuários autenticados possam acessar recursos protegidos.
export async function getUserToken(): Promise<string> {
  try {
    const currentUser = auth.currentUser ?? (await waitForAuthenticatedUser());
    if (!currentUser) {
      throw new Error("User is not authenticated");
    }

    const token = await currentUser.getIdToken();
    return `Bearer ${token}`;
  } catch (error) {
    console.error("Error getting user token:", error);
    throw new Error("An error occurred while retrieving the user token");
  }
}
