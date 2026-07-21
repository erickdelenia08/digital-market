import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import * as bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL!.replace("mysql://", "mariadb://");
const adapter = new PrismaMariaDb(connectionString);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting Database Seeding...");

  // 1. Seed / Upsert Test User
  const email = "erick@gmail.com";
  const hashedPassword = await bcrypt.hash("password", 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      name: "Erick",
      role: "ADMIN",
    },
    create: {
      email,
      name: "Erick",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin / Test User created:", user.email);

  // 2. Seed Categories
  const categoryDesign = await prisma.category.upsert({
    where: { slug: "templates-design" },
    update: {},
    create: {
      name: "Templates Canva & Design",
      slug: "templates-design",
    },
  });

  const categoryDev = await prisma.category.upsert({
    where: { slug: "source-code-scripts" },
    update: {},
    create: {
      name: "Source Code & Scripts",
      slug: "source-code-scripts",
    },
  });

  const categoryEbook = await prisma.category.upsert({
    where: { slug: "ebooks-guides" },
    update: {},
    create: {
      name: "E-Book & Digital Guides",
      slug: "ebooks-guides",
    },
  });

  console.log("✅ Categories seeded successfully.");

  // 3. Seed Products
  const dummyProducts = [
    {
      name: "Bundle Template Canva Social Media Kit (100+ Feeds & Stories)",
      slug: "canva-social-media-kit",
      description: "Koleksi 100+ template Canva profesional dan estetis untuk Instagram Feed, Stories, dan TikTok content.",
      price: 25000,
      categoryId: categoryDesign.id,
      coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
      assetName: "Link Canva Master Template",
      linkUrl: "https://canva.com/design/example-template",
    },
    {
      name: "Preset Lightroom Aesthetic Cinematic Tone (30+ Mobile & Desktop)",
      slug: "preset-lightroom-cinematic",
      description: "Preset Lightroom eksklusif dengan tone warna cinematic, warm aesthetic, dan mood fotografi profesional.",
      price: 15000,
      categoryId: categoryDesign.id,
      coverImage: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=800&q=80",
      assetName: "DNG & XMP Preset Zip File",
      linkUrl: "https://drive.google.com/file/d/example-preset/view",
    },
    {
      name: "Next.js 16 Digital Market Starter Kit (Prisma & Xendit)",
      slug: "nextjs-digital-market-starter",
      description: "Source code lengkap platform marketplace produk digital dengan integrasi Xendit Payment Request V2 API.",
      price: 50000,
      categoryId: categoryDev.id,
      coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
      assetName: "GitHub Repository Access / Zip",
      linkUrl: "https://github.com/example/digital-market-starter",
    },
    {
      name: "Panduan Mastering Digital Marketing & Ads Automation 2026",
      slug: "panduan-digital-marketing-2026",
      description: "E-Book komprehensif langkah demi langkah membangun bisnis produk digital dan iklan otomatis beromzet puluhan juta.",
      price: 35000,
      categoryId: categoryEbook.id,
      coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
      assetName: "Master E-Book PDF Guide",
      linkUrl: "https://drive.google.com/file/d/example-ebook/view",
    },
  ];

  const createdProducts = [];

  for (const prodData of dummyProducts) {
    const product = await prisma.product.upsert({
      where: { slug: prodData.slug },
      update: {
        name: prodData.name,
        price: prodData.price,
        description: prodData.description,
        coverImage: prodData.coverImage,
        isPublished: true,
      },
      create: {
        name: prodData.name,
        slug: prodData.slug,
        description: prodData.description,
        price: prodData.price,
        coverImage: prodData.coverImage,
        categoryId: prodData.categoryId,
        isPublished: true,
        media: {
          create: [
            {
              url: prodData.coverImage,
              type: "IMAGE",
              sortOrder: 1,
            },
          ],
        },
        digitalAssets: {
          create: [
            {
              name: prodData.assetName,
              type: "LINK",
              linkUrl: prodData.linkUrl,
            },
          ],
        },
      },
    });

    createdProducts.push(product);
  }

  console.log(`✅ ${createdProducts.length} Products & Digital Assets seeded.`);

  // 4. Seed Cart for User (Erick)
  const cart = await prisma.cart.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
    },
  });

  // Kosongkan cart lalu isi dengan 2 produk pertama
  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  await prisma.cartItem.createMany({
    data: [
      {
        cartId: cart.id,
        productId: createdProducts[0].id,
        selected: true,
      },
      {
        cartId: cart.id,
        productId: createdProducts[2].id,
        selected: true,
      },
    ],
  });

  console.log("✅ Cart populated with sample products for testing checkout!");
  console.log("🎉 Seeding completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed Error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
