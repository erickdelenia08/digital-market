import { generateSecret, generateURI, verify } from "otplib";
import QRCode from "qrcode";

export const generateTwoFactorSecret = () => {
  return generateSecret();
};

export const generateTwoFactorQrCodeUri = (
  email: string,
  secret: string
) => {
  const appName = process.env.APP_NAME || "NextJS Starter";
  return generateURI({
    secret,
    label: email,
    issuer: appName,
  });
};

export const generateQrCodeDataUrl = async (uri: string) => {
  try {
    return await QRCode.toDataURL(uri);
  } catch (error) {
    console.error("Error generating QR code:", error);
    return null;
  }
};

export const verifyTwoFactorToken = async (token: string, secret: string) => {
  // otplib verify throws if token is not all digits
  if (!/^\d+$/.test(token)) {
    return false;
  }
  
  try {
    const result = await verify({
      token,
      secret,
      digits: 6,
      period: 30,
      algorithm: "sha1",
    });
    return result.valid;
  } catch (error) {
    console.error("TOTP verification error:", error);
    return false;
  }
};
