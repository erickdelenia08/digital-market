import { auth } from "@/lib/auth";
import { getCart } from "@/app/actions/cart";
import CartClient from "./cart-client";

export default async function CartPage() {
  const session = await auth();

  const initialCart = session?.user
    ? await getCart(session.user.id)
    : [];

  return (
    <CartClient
      session={session}
      initialCart={initialCart}
    />
  );
}