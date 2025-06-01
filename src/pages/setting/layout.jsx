export const metadata = {
  title: "Stanford Settings Portal",
  description: "Settings page for Stanford University Portal",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
