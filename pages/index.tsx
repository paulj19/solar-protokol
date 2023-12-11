import {authOptions} from "@/pages/api/[...nextauth]";
import {unstable_getServerSession} from "next-auth";

function HomePageProxy() {
    return <></>
}

export async function getServerSideProps(context: any) {
    const session = await unstable_getServerSession(
        context.req, context.res, authOptions)

    if (session) {
        return {
            props: {session}
        }
    }
    return {
        redirect: { destination: "/", permanent: false }
    }
}
export default HomePageProxy
