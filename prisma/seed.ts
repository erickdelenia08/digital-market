import "dotenv/config";
import { PrismaClient, AssetType, MediaType, Role } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import * as bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL!.replace("mysql://", "mariadb://");
const adapter = new PrismaMariaDb(connectionString);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting Database Seeding...");

  // 1. Seed / Upsert Test Admin User
  const adminEmail = "erick@gmail.com";
  const hashedPassword = await bcrypt.hash("password", 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      name: "Erick",
      role: Role.ADMIN,
    },
    create: {
      email: adminEmail,
      name: "Erick",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log("✅ Admin user ready:", admin.email);

  // 2. Seed Categories
  const categoriesData = [
    { name: "Source Code & Templates", slug: "source-code-templates" },
    { name: "UI/UX Kits", slug: "ui-ux-kits" },
    { name: "E-Books & Guides", slug: "ebooks-guides" },
  ];

  const categoriesMap = new Map<string, string>();

  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: { name: cat.name, slug: cat.slug },
    });
    categoriesMap.set(cat.slug, category.id);
  }

  console.log("✅ Categories seeded");

  // 3. Seed Products with Media & Digital Assets
  const productsData = [
    {
      name: "Next.js E-Commerce SaaS Starter Kit",
      slug: "nextjs-ecommerce-saas-starter-kit",
      description: "A complete production-ready Next.js 14 template integrated with Prisma, Tailwind CSS, and Xendit payment gateway.",
      price: 250000,
      isPublished: true,
      isFeatured: true,
      coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
      categorySlug: "source-code-templates",
      media: [
        { url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c", type: MediaType.IMAGE, sortOrder: 0 },
        { url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97", type: MediaType.IMAGE, sortOrder: 1 },
      ],
      assets: [
        {
          name: "Source Code (.zip)",
          description: "Full Next.js project repository bundle.",
          type: AssetType.FILE,
          fileUrl: "https://storage.example.com/files/nextjs-starter-v1.zip",
          extension: "zip",
          fileSize: 15728640, // ~15 MB
          mimeType: "application/zip",
          version: "v1.0.0",
          sortOrder: 0,
        },
        {
          name: "GitHub Private Repository Access",
          description: "Link to access latest updates directly from GitHub.",
          type: AssetType.LINK,
          linkUrl: "https://github.com/example/nextjs-starter-private",
          version: "v1.0.0",
          sortOrder: 1,
        },
      ],
    },
    {
      name: "Fintech Mobile App UI Kit (Figma)",
      slug: "fintech-mobile-app-ui-kit-figma",
      description: "Modern, scalable Fintech & Banking UI Kit containing 80+ clean screens with dark and light mode variants.",
      price: 150000,
      isPublished: true,
      isFeatured: true,
      coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8",
      categorySlug: "ui-ux-kits",
      media: [
        { url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8", type: MediaType.IMAGE, sortOrder: 0 },
      ],
      assets: [
        {
          name: "Figma File (.fig)",
          description: "Original Figma design file with design system components.",
          type: AssetType.FILE,
          fileUrl: "https://storage.example.com/files/fintech-ui-kit.fig",
          extension: "fig",
          fileSize: 45000000, // ~45 MB
          mimeType: "application/octet-stream",
          version: "v2.1.0",
          sortOrder: 0,
        },
      ],
    },
    {
      name: "Mastering Prisma & MariaDB Architecture Guide",
      slug: "mastering-prisma-mariadb-guide",
      description: "Comprehensive PDF guide covering database optimization, connection pooling with MariaDB, and advanced Prisma ORM pattern.",
      price: 75000,
      isPublished: true,
      isFeatured: false,
      coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765",
      categorySlug: "ebooks-guides",
      media: [
        { url: "https://images.unsplash.com/photo-1532012197267-da84d127e765", type: MediaType.IMAGE, sortOrder: 0 },
      ],
      assets: [
        {
          name: "Mastering Prisma Book (PDF)",
          description: "High-resolution PDF version of the complete book.",
          type: AssetType.FILE,
          fileUrl: "https://storage.example.com/files/prisma-mariadb-guide.pdf",
          extension: "pdf",
          fileSize: 8400000, // ~8.4 MB
          mimeType: "application/pdf",
          version: "2026-edition",
          sortOrder: 0,
        },
      ],
    },
  ];

  for (const item of productsData) {
    const categoryId = categoriesMap.get(item.categorySlug);

    if (!categoryId) {
      console.warn(`⚠️ Category ${item.categorySlug} not found, skipping product ${item.name}`);
      continue;
    }

    // Upsert Product
    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        description: item.description,
        price: item.price,
        isPublished: item.isPublished,
        isFeatured: item.isFeatured,
        coverImage: item.coverImage,
        categoryId: categoryId,
      },
      create: {
        name: item.name,
        slug: item.slug,
        description: item.description,
        price: item.price,
        isPublished: item.isPublished,
        isFeatured: item.isFeatured,
        coverImage: item.coverImage,
        categoryId: categoryId,
      },
    });

    // Reset & Re-create ProductMedia (agar tidak terjadi duplikasi saat re-seed)
    await prisma.productMedia.deleteMany({ where: { productId: product.id } });
    await prisma.productMedia.createMany({
      data: item.media.map((m) => ({
        productId: product.id,
        url: m.url,
        type: m.type,
        sortOrder: m.sortOrder,
      })),
    });

    // Reset & Re-create DigitalAssets
    await prisma.digitalAsset.deleteMany({ where: { productId: product.id } });
    await prisma.digitalAsset.createMany({
      data: item.assets.map((a) => ({
        productId: product.id,
        name: a.name,
        description: a.description,
        type: a.type,
        fileUrl: a.fileUrl || null,
        linkUrl: a.linkUrl || null,
        extension: a.extension || null,
        fileSize: a.fileSize || null,
        mimeType: a.mimeType || null,
        version: a.version || null,
        sortOrder: a.sortOrder,
      })),
    });

    console.log(`✅ Product seeded: ${product.name}`);
  }

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