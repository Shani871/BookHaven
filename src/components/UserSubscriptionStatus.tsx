import React, { useEffect, useState } from 'react';
import { Crown, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { getProductByPriceId } from '../stripe-config';

interface UserSubscription {
  subscription_status: string;
  price_id: string | null;
}

export default function UserSubscriptionStatus() {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSubscription();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('subscription_status, price_id')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
        return;
      }

      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading) {
    return null;
  }

  if (!subscription || !subscription.price_id) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          <span className="text-yellow-800 dark:text-yellow-200 font-medium">
            No active subscription
          </span>
        </div>
      </div>
    );
  }

  const product = getProductByPriceId(subscription.price_id);
  const isActive = ['active', 'trialing'].includes(subscription.subscription_status);

  return (
    <div className={`border rounded-lg p-4 mb-6 ${
      isActive 
        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
    }`}>
      <div className="flex items-center space-x-2">
        <Crown className={`h-5 w-5 ${
          isActive 
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400'
        }`} />
        <div>
          <span className={`font-medium ${
            isActive 
              ? 'text-green-800 dark:text-green-200'
              : 'text-red-800 dark:text-red-200'
          }`}>
            {product?.name || 'Unknown Plan'}
          </span>
          <span className={`ml-2 text-sm ${
            isActive 
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          }`}>
            ({subscription.subscription_status})
          </span>
        </div>
      </div>
    </div>
  );
}