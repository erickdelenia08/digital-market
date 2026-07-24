import {
    streamText,
    UIMessage,
    convertToModelMessages,
    createUIMessageStreamResponse,
    toUIMessageStream,
} from 'ai';
import { google } from '@ai-sdk/google';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();

    // 1. Ambil data produk dari Prisma
    const products = await prisma.product.findMany({
        where: { isPublished: true },
        select: { name: true, price: true, slug: true },
        take: 10,
    });

    const systemPrompt = `
    Kamu adalah AI Assistant toko produk digital.
    Berikut katalog produk kami: ${JSON.stringify(products)}.
    Jawab pertanyaan user secara singkat, ramah, dan bantu rekomendasikan produk.
  `;

    // 2. Stream ke Model AI
    const result = streamText({
        model: google('gemini-3.5-flash-lite'), // Atau 'google/gemini-2.5-flash' via gateway
        system: systemPrompt,
        messages: await convertToModelMessages(messages),
    });

    // 3. Return response format Vercel AI SDK v4+
    return createUIMessageStreamResponse({
        stream: toUIMessageStream({ stream: result.stream }),
    });
}