
import Head from 'next/head';

import styles from './home.module.scss';

export default function Home() {
  return (
    <h1>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContaier}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> World.</h1>
          <p>
            Get access to all publications <br />
            <span> for $9.90 month</span>
          </p>
        </section>
        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </h1>
  )
}
