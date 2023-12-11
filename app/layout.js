import './global.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 flex flex-col h-screen">
        <div className="mx-auto max-w-7xl w-[80rem] py-12 sm:px-6 lg:px-8">
          {children}
        </div>
      </body>
    </html>
  )
}
