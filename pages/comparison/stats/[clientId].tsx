import styles from '@/src/page.module.css'
import ComparisonStats from '@/src/comparison/stats/ComparisonStats'
import {useParams} from 'next/navigation'
import {useRouter} from "next/router";

export default function ComparisonStatsPage() {
    const router = useRouter();
    const {clientId} = router.query;
    if (!clientId) {
        //redirect to home
        //todo show modal to select a client
    }
    return (
        <ComparisonStats clientId={clientId}/>
    )
}
