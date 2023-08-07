import styles from '@/app/page.module.css'
import ComparisonStats from '@/app/comparison/ComparisonStats'

export default function Page() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <ComparisonStats />
      </div>
    </main>
  )
}
