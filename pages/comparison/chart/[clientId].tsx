import styles from "@/src/page.module.css";
import {Home} from "@/src/Home";
import ComparisonChart from "@/src/comparison/chart/ComparisonChart";
import {useRouter} from "next/router";

export default function ComparisonChartPage() {
    const router = useRouter();
    const {clientId} = router.query;
    if (!clientId) {
        //redirect to home
        //todo show modal to select a client
    }

    return (
        <ComparisonChart clientId={clientId}/>
    )
}
