import { auth } from "@/lib/auth"; // Sesuaikan lokasi konfigurasi NextAuth Anda

export async function getAuthUser() {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Anda harus login terlebih dahulu.");
    }
    return session.user;
}