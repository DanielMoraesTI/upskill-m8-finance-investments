import { auth } from "@/lib/firebase";

export async function getUserToken(): Promise<string> {
    try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error("User is not authenticated");
        }

        const token = await currentUser.getIdToken();
        return `Bearer ${token}`;

    } catch {
        throw new Error("An error occurred while retrieving the user token");
    };
}
