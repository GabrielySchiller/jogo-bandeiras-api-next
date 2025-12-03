
import "./globals.css";

export const metadata = {
  title: "Game das Bandeiras",
  description: "Jogo das bandeiras criado com next app e tailwind, acerte o país pela bandeira.",
   icons: {
    icon: "/icons8-bandeira-100.png",
  },

  openGraph:{
    title:'Game das Bandeiras',
    images:['/icons8-bandeira-100.png'],
    description:"Jogo das bandeiras criado com next app e tailwind, acerte o país pela bandeira.",
 }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 p-6">
        {children}
      </body>
    </html>
  );
}
