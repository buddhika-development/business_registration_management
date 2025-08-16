export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#FFFFFF', fontFamily: 'Inter, Arial, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
