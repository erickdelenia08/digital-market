import { notFound } from "next/navigation";
import { getCheckoutOrder } from "@/app/actions/orders"
import CheckoutPage from "./checkout-page";

interface Props {
    params: Promise<{
        orderId: string;
    }>;
}

export default async function Page({ params }: Props) {
    const { orderId } = await params;

    const result = await getCheckoutOrder(orderId);
    console.log(orderId);
    // console.log('ini cekk result di page', result);

    if (result.error || !result.order) {
        notFound();
    }

    return (
        <CheckoutPage
            order={result.order}
        />
    );
}