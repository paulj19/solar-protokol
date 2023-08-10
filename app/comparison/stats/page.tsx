import styles from '@/app/page.module.css'
import ComparisonStats from '@/app/comparison/stats/ComparisonStats'
import { useParams } from 'next/navigation'

export default function Page({ searchParams }) {
  if (!searchParams?.clientId) {
    //todo show modal to select a client
  }
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <ComparisonStats clientId={searchParams.clientId} />
      </div>
    </main>
  )
}
