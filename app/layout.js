import './globals.css';

export const metadata = {
  title: 'ILMA LINK',
  description: 'Web-based IP phone dialer powered by Twilio',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0f0f0f',
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-bg-primary text-white font-sans max-h-screen">
        {children}
      </body>
    </html>
  );
}
