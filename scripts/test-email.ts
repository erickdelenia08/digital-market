// scripts/test-email.ts
import * as dotenv from "dotenv";
dotenv.config();

import {
    sendPasswordResetEmail,
    sendWelcomeEmail,
    sendOrderSuccessEmail
} from "../lib/mail";

// Helper function untuk memberikan jeda waktu (delay)
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
    console.log("🚀 Memulai pengujian SEMUA template email React Email via Mailtrap...\n");

    const targetEmail = "erickdelenia00@gmail.com";
    const targetName = "Erick Delenia";

    try {
        // 1. Tes Send Welcome Email
        // console.log("⏳ [1/3] Mengirim Welcome Email...");
        // await sendWelcomeEmail(targetEmail, targetName);
        // console.log("✅ Welcome Email berhasil dikirim!");

        // // Jeda 1.5 detik untuk menghindari rate limit Mailtrap
        // await sleep(1500);

        // // 2. Tes Send Password Reset Email
        // console.log("⏳ [2/3] Mengirim Password Reset Email...");
        // await sendPasswordResetEmail(targetEmail, "dummy-token-abc-123-xyz");
        // console.log("✅ Password Reset Email berhasil dikirim!");

        // // Jeda 1.5 detik lagi
        // await sleep(1500);

        // 3. Tes Send Order Success Email
        console.log("⏳ [3/3] Mengirim Order Success Email...");
        await sendOrderSuccessEmail({
            email: targetEmail,
            name: targetName,
            orderId: "ORD-9988231",
            totalAmount: "Rp 150.000",
        });
        console.log("✅ Order Success Email berhasil dikirim!\n");

        console.log("🎉 SEMUA EMAIL (3/3) BERHASIL TERKIRIM KE MAILTRAP!");
        console.log("👉 Buka https://mailtrap.io/inboxes untuk melihat ketiga tampilan UI-nya!");

    } catch (error) {
        console.error("\n❌ TERJADI GAGAL SAAT MENGIRIM EMAIL:");
        console.error(error);
    }
}

main();