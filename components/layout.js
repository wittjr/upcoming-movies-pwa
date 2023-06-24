import Header from "@components/header"
import Footer from "@components/footer"
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