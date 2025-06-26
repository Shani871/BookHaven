import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { stripeProducts } from '../stripe-config';
import SubscriptionCard from '../components/SubscriptionCard';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface UserSubscription {
  subscription_status: string;
  price_id: string | null;
}

export default function Pricing() {
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserSubscription();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('subscription_status, price_id')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
        return;
      }

      setUserSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const isActiveSubscription = (priceId: string) => {
    return userSubscription?.price_id === priceId && 
           ['active', 'trialing'].includes(userSubscription.subscription_status);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto">
            Get access to premium educational content and enhance your learning journey
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Loading plans...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {stripeProducts.map((product) => (
                <SubscriptionCard
                  key={product.priceId}
                  product={product}
                  isActive={isActiveSubscription(product.priceId)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What's Included
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              All plans include these amazing features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              'Comprehensive Java Notes',
              'Code Examples & Exercises',
              'Regular Updates',
              'Mobile Access',
              'Offline Reading',
              'Community Support'
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
                  <Check className="h-5 w-5" />
                </div>
                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="space-y-8">
            {[
              {
                question: "Can I cancel my subscription anytime?",
                answer: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period."
              },
              {
                question: "Are there any setup fees?",
                answer: "No, there are no setup fees or hidden charges. You only pay the subscription fee."
              },
              {
                question: "Do you offer refunds?",
                answer: "We offer a 30-day money-back guarantee if you're not satisfied with our content."
              },
              {
                question: "Can I access the content offline?",
                answer: "Yes, you can download the content for offline reading on supported devices."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}