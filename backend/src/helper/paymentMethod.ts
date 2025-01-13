import stripe from "stripe";

import stripeSecret from "../secret";

interface IPayment {}

const stripePayment = async (number, cvc, expMonth, expYear, amount) => {
  try {
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        number: number,
        exp_month: expMonth,
        exp_year: expYear,
        cvc: cvc,
      },
    });

    const paymentIntents = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "BDT",
      payment_method: paymentMethod,
      confirm: true,
    });
  } catch (error) {}
};

export default stripePayment;
