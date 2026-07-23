import { Prisma } from "@prisma/client";

export type CheckoutOrder = Prisma.OrderGetPayload<{
    include: {
        items: {
            include: {
                product: true;
            };
        };
        payments: true;
    };
}>;