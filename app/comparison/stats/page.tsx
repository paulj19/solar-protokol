import styles from '@/app/page.module.css'
import Stats from '@/app/comparison/stats/Stats'
import { useParams } from 'next/navigation'

export default function Page({ searchParams }) {
  if (!searchParams?.clientId) {
    //todo show modal to select a client
  }
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <Stats clientId={searchParams.clientId} />
      </div>
    </main>
  )
}
