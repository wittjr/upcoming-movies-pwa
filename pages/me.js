import { useSession } from "next-auth/react"
import Layout from "../components/layout"
import { useState, useEffect } from "react"
import AccessDenied from "../components/access-denied"

export default function MePage() {
    const { data } = useSession()
    const [content, setContent] = useState()

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        console.log(content)
    }, [content])

    const fetchData = async () => {
        const res = await fetch("/api/me")
        const json = await res.json()
        if (json.content) {
            setContent(json.content)
        }
    }

    return (
        <Layout>
            {
                content &&
                    <p>{content.user.username}</p>
            }
            <iframe src="/api/me" />
        </Layout>
    )
}