import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {getServerSession, unstable_getServerSession} from "next-auth";

function HomePageProxy() {
    return <></>
}

export async function getServerSideProps(context: any) {
    const session = await getServerSession(context.req, context.res, authOptions)
    if (session) {
        return {
            props: {session}
        }
    }
    return {
        redirect: { destination: "/api/auth/signin/okta", permanent: false }
    }
    // return {
    //     redirect: { destination: "https://dev-lzh2ps2gz10j4lt2.us.auth0.com/authorize?client_id=LNs3zNwzqncqxjq9LdUOeLuYH7eUZ61A&scope=openid email profile&response_type=code&redirect_uri=http://localhost:3000/", permanent: false }
    // }
}
export default HomePageProxy
