import Navbar from "./_components/Navbar";

export default function LayoutPublic({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Home</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body suppressHydrationWarning>
        <Navbar />
        <main className="py-10 container px-4 mx-auto">{children}</main>
      </body>
    </html>
  );
}
