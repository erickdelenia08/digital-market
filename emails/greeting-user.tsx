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

interface WelcomeEmailProps {
    userFirstName: string;
    loginUrl: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ? process.env.NEXT_PUBLIC_APP_URL : "";
const appName = process.env.NEXT_PUBLIC_APP_NAME || "Acme Inc";

export const WelcomeEmail = ({
    userFirstName,
    loginUrl,
}: WelcomeEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Selamat datang di {appName}! Kami senang Anda bergabung.</Preview>
            <Tailwind>
                <Body className="bg-[#f6f9fc] font-sans">
                    <Container className="bg-white mx-auto py-10 px-5 mb-16 rounded-lg max-w-[480px] shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                        <Img
                            src={`${baseUrl}/logo.png`}
                            width="180"
                            height="33"
                            alt={appName}
                            className="mx-auto"
                        />
                        <Heading className="text-[#1a1a1a] text-[24px] font-semibold text-center my-[30px]">
                            Selamat Datang di {appName}, {userFirstName}!
                        </Heading>
                        <Text className="text-[#444] text-[15px] leading-[24px]">
                            Terima kasih telah bergabung. Kami sangat antusias untuk membantu Anda memulai perjalanan Anda bersama kami.
                        </Text>
                        <Text className="text-[#444] text-[15px] leading-[24px]">
                            Klik tombol di bawah ini untuk masuk ke akun Anda dan mulai menjelajahi fitur-fitur kami:
                        </Text>
                        <Section className="text-center my-[30px]">
                            <Button
                                className="bg-black rounded-md text-white text-[14px] font-semibold no-underline text-center inline-block px-8 py-3"
                                href={loginUrl}
                            >
                                Mulai Sekarang
                            </Button>
                        </Section>
                        <Text className="text-[#444] text-[15px] leading-[24px]">
                            Jika Anda memiliki pertanyaan, jangan ragu untuk membalas email ini. Tim kami siap membantu Anda.
                        </Text>
                        <Text className="text-[#444] text-[15px] leading-[24px]">
                            Salam hangat,<br />
                            Tim {appName}
                        </Text>
                        <Hr className="border-[#e6ebf1] my-10" />
                        <Text className="text-[#8898aa] text-[12px] leading-[20px] text-center mt-3">
                            {appName}, 123 Tech Lane, San Francisco, CA 94105
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default WelcomeEmail;