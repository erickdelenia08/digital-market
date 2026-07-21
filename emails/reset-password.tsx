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
  Link,
  Tailwind,
} from "react-email";

interface ResetPasswordEmailProps {
  resetLink: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ? process.env.NEXT_PUBLIC_APP_URL : "";
const appName = process.env.NEXT_PUBLIC_APP_NAME || "Acme Inc";

export const ResetPasswordEmail = ({
  resetLink,
}: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
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
              Reset your password
            </Heading>
            <Text className="text-[#444] text-[15px] leading-[24px] text-left">
              You requested a password reset for your account. Click the button below to set a new password:
            </Text>
            <Section className="text-center my-[30px]">
              <Button
                className="bg-black rounded-md text-white text-[14px] font-semibold no-underline text-center inline-block px-8 py-3"
                href={resetLink}
              >
                Reset Password
              </Button>
            </Section>
            <Text className="text-[#444] text-[15px] leading-[24px] text-left">
              Alternatively, you can copy and paste the following link into your browser:
            </Text>
            <Link href={resetLink} className="text-[#0070f3] text-[13px] break-all">
              {resetLink}
            </Link>
            <Hr className="border-[#e6ebf1] my-10" />
            <Text className="text-[#8898aa] text-[12px] leading-[20px] text-center mt-3">
              If you didn&apos;t request this, you can safely ignore this email. This link will expire in 1 hour.
            </Text>
            <Text className="text-[#8898aa] text-[12px] leading-[20px] text-center mt-3">
              {appName}, 123 Tech Lane, San Francisco, CA 94105
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ResetPasswordEmail;
