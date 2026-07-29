import { getCart } from "@/app/actions/cart";

export type CartItem =
    Awaited<ReturnType<typeof getCart>>[number];

export type CartProduct =
    CartItem["product"];