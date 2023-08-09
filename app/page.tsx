import Image from 'next/image'
import styles from './page.module.css'
import ComparisonChart from './comparison/ComparisonChart'
import { Home } from './Home'
export default function Page() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <Home />
      </div>
    </main>
  )
}
