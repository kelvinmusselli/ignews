/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';

import styles from './home.module.scss';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({ product }: HomeProps) {
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
            <span> for $ {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId}/>
        </section>
        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </h1>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const price = await stripe.prices.retrieve('price_1KvPZ8FY2CvKpvGjd5SEJI3f', {
      expand: ['product']
  });

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product
    }
  }
}
