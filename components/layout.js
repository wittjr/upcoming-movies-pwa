import Header from "./header"
import Footer from "./footer"
import { ReactNode } from "react"

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}