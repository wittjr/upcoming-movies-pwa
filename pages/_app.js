import '@styles/globals.css'
import { SessionProvider } from "next-auth/react"

function Application({
    Component,
    pageProps: { session, ...pageProps },
}) {
    return (
        <SessionProvider session={session}>
            <Component {...pageProps} />
        </SessionProvider>
    )
}

export default Application
