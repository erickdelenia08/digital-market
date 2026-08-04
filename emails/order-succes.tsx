import {
    Body,
    Button,
    Container,
    Head,
    Html,
    Img,
    Preview,
    Section,
    Text,
    Heading,
    Hr,
    Tailwind,
} from "react-email";

interface OrderSuccessEmailProps {
    customerName: string;
    orderId: string;
    totalAmount: string;
    downloadUrl: string; // Direct link ke halaman download/library user
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ? process.env.NEXT_PUBLIC_SITE_URL : "";
const appName = process.env.NEXT_PUBLIC_APP_NAME || "CodeGraph";

export const OrderSuccessEmail = ({
    customerName,
    orderId,
    totalAmount,
    downloadUrl,
}: OrderSuccessEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Payment Confirmed! Access your digital assets for Order #{orderId}</Preview>
            <Tailwind>
                <Body className="bg-[#f6f9fc] font-sans">
                    <Container className="bg-white mx-auto py-10 px-5 mb-16 rounded-lg max-w-[480px] shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                        <Img
                            src={`${baseUrl}/logo.jpg`}
                            width="180"
                            height="33"
                            alt={appName}
                            className="mx-auto"
                        />

                        <Heading className="text-[#1a1a1a] text-[22px] font-semibold text-center my-[30px]">
                            Payment Successful! 🎉
                        </Heading>

                        <Text className="text-[#444] text-[15px] leading-[24px]">
                            Hi {customerName},
                        </Text>

                        <Text className="text-[#444] text-[15px] leading-[24px]">
                            Thank you for your purchase. We have successfully received your payment for order <strong>#{orderId}</strong> (Total: <strong>{totalAmount}</strong>).
                        </Text>

                        <Text className="text-[#444] text-[15px] leading-[24px]">
                            Your digital assets are ready! You can view and download your files directly from your library page on our website:
                        </Text>

                        {/* Button Mengarah Langsung ke Halaman Library/Downloads */}
                        <Section className="text-center my-[30px]">
                            <Button
                                className="bg-black rounded-md text-white text-[14px] font-semibold no-underline text-center inline-block px-8 py-3"
                                href={downloadUrl}
                            >
                                Go to Downloads Page
                            </Button>
                        </Section>

                        <Text className="text-[#444] text-[15px] leading-[24px]">
                            If you encounter any issues accessing your files or have questions about your assets, please feel free to reach out to our support team.
                        </Text>

                        <Text className="text-[#444] text-[15px] leading-[24px]">
                            Best regards,<br />
                            <strong>{appName} Team</strong>
                        </Text>

                        <Hr className="border-[#e6ebf1] my-10" />

                        <Text className="text-[#8898aa] text-[12px] leading-[20px] text-center mt-3">
                            © {new Date().getFullYear()} {appName}. All rights reserved.<br />
                            https://codegraph.my.id
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default OrderSuccessEmail;