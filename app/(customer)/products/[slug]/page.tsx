import { getProductBySlug } from "@/lib/product";
import { getUserProductStatus } from "@/app/actions/review-actions";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import ProductDetailPage from "./product-session";
import { getCart } from "@/app/actions/cart";

const DetailProductpage = async ({ params }: { params: Promise<{ slug: string }> }) => {
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