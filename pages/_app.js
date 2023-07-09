import '@styles/globals.css'
import Layout from "@components/layout"
import { SessionProvider } from "next-auth/react"
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react"

const db = dynamic(() => import('../lib/db.js'), { ssr: false })

function Auth({ children }) {
    // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
    const { status } = useSession({ required: true })

    console.log(`STATUS: ${status}`)
    if (status === "loading") {
        return <div>Loading...</div>
    }

    return children
}

export default function Application({
    Component,
    pageProps: { session, ...pageProps },
}) {
    console.log(`Component.auth: ${Component.auth}`)
    return (
        <SessionProvider session={session}>
            <Layout>
                {Component.auth ? (
                    <Auth>
                        <Component {...pageProps} />
                    </Auth>
                ) : (
                    <Component {...pageProps} />
                )}
            </Layout>
        </SessionProvider>
    )
}