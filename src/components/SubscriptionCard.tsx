import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { StripeProduct } from '../stripe-config';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface SubscriptionCardProps {
  product: StripeProduct;
  isActive?: boolean;
  className?: string;
}

export default function SubscriptionCard({ product, isActive = false, className = '' }: SubscriptionCardProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubscribe = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    setLoading(true);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`;
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No valid session found');
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price_id: product.priceId,
          mode: product.mode,
          success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/pricing`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error instanceof Error ? error.message : 'Failed to start checkout process');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ${isActive ? 'ring-2 ring-red-500' : ''} ${className}`}>
      {isActive && (
        <div className="bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
          Current Plan
        </div>
      )}
      
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {product.name}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {product.description}
      </p>
      
      <div className="mb-6">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">₹10.00</span>
        {product.mode === 'subscription' && (
          <span className="text-gray-600 dark:text-gray-300">/month</span>
        )}
      </div>

      <button
        onClick={handleSubscribe}
        disabled={loading || isActive}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${
          isActive
            ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            : loading
            ? 'bg-red-400 text-white cursor-not-allowed'
            : 'bg-red-600 hover:bg-red-700 text-white'
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing...</span>
          </>
        ) : isActive ? (
          <>
            <Check className="h-4 w-4" />
            <span>Active</span>
          </>
        ) : (
          <span>{product.mode === 'subscription' ? 'Subscribe' : 'Purchase'}</span>
        )}
      </button>
    </div>
  );
}