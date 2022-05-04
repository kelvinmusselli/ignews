/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from 'next';
import { Query as q } from 'faunadb';
import { getSession } from 'next-auth/react'; // pega do front o user autenticado
import { fauna } from '../../services/fauna';
import { stripe } from '../../services/stripe';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method === 'POST') {

    const session =  await getSession({ req });

    const stripeCustomer = await stripe.customers.create({
      email: session.user.email,
    });

    await fauna.query(
      q.Update()
    )

    const checkoutSession =  await stripe.checkout.sessions.create({
      customer: stripeCustomer.id,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        { price: 'price_1KvPZ8FY2CvKpvGjd5SEJI3f', quantity: 1 },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL
    });

    return res.status(200).json({ sessionId: checkoutSession.id });

  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
