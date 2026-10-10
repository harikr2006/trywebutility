import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Code & Asset Generators — UUID, QR Code, CSS, Password, Favicon",
  description:
    "Free browser-based generator tools. Generate UUIDs, QR codes, passwords, CSS gradients, CSS box shadows, favicons, Lorem Ipsum, fake data, and 30+ more — instantly in your browser with no sign-up.",
  keywords: [
    "online generator tools", "uuid generator online", "qr code generator",
    "css generator online", "password generator", "favicon generator",
    "lorem ipsum generator", "fake data generator", "code generator online",
  ],
  alternates: { canonical: "https://trywebutility.com/generators/" },
  openGraph: { url: "https://trywebutility.com/generators/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
