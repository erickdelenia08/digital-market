import { getProductBySlug } from "@/lib/product";
import { getUserProductStatus } from "@/app/actions/review-actions";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import ProductDetailPage from "./product-session";
import { getCart } from "@/app/actions/cart";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  // Mengambil gambar produk pertama (jika ada media/image) atau fallback ke default
  const productImage = product.media?.[0]?.url || product.coverImage || "/og-image.png";

  // Membersihkan deskripsi dari HTML tags jika ada (opsional)
  const cleanDescription = product.description
    ? product.description.replace(/<[^>]*>?/gm, "").slice(0, 160)
    : `Get ${product.name} template on Codegraph. Instant digital download.`;

  return {
    title: product.name, // Otomatis jadi: "[Nama Produk] | Codegraph" via template layout
    description: cleanDescription,
    keywords: [
      product.name,
      product.category?.name || "Digital Asset",
      "Canva Template",
      "Excel Template",
      "Codegraph",
    ].filter(Boolean),
    openGraph: {
      title: `${product.name} | Codegraph`,
      description: cleanDescription,
      url: `/products/${slug}`,
      images: [
        {
          url: productImage,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Codegraph`,
      description: cleanDescription,
      images: [productImage],
    },
  };
}


const DetailProductpage = async ({ params }: Props) => {
  const { slug } = await params;

  const [session, product] = await Promise.all([
    auth(),
    getProductBySlug(slug)
  ]);

  if (!product) {
    notFound()
  }

  const [userStatus, cart] = session?.user
    ? await Promise.all([
      getUserProductStatus(product.id),
      getCart(session.user.id)
    ])
    : [
      {
        hasPurchased: false,
        userReview: null
      },
      []
    ];

  return (
    <ProductDetailPage
      product={product}
      session={session}
      hasPurchased={userStatus.hasPurchased}
      userReview={userStatus.userReview}
      initialCart={cart}
    />
  )
}

export default DetailProductpage