import '@styles/globals.css'
import Layout from "@components/layout"
import { SessionProvider } from "next-auth/react"
import dynamic from "next/dynamic";

const db = dynamic(() =>import('../lib/db.js'), {ssr: false})

export default function Application({
    Component,
    pageProps: { session, ...pageProps },
}) {
    return (
        <SessionProvider session={session}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </SessionProvider>
    )
}