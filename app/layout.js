import './globals.css';

export const metadata = {
  title: 'IP Phone',
  description: 'Web-based dialer powered by Twilio',
  themeColor: '#0f0f0f',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-bg-primary text-white font-sans h-full">
        {children}
      </body>
    </html>
  );
}
