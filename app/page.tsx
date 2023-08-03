import Image from 'next/image'
import styles from './page.module.css'
import ComparisonChart from './comparison/ComparisonChart'
export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <ComparisonChart />
      </div>
    </main>
  )
}
