'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, Smartphone, Shield, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Array<{
    id: string;
    title: string;
    price: number;
    quantity: number;
  }>;
  onSuccess: (orderId: string) => void;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentModal({ isOpen, onClose, books, onSuccess }: PaymentModalProps) {
  const { authUser } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });
  const [loading, setLoading] = useState(false);
  const [vpnCheckLoading, setVpnCheckLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [securityWarning, setSecurityWarning] = useState<string>('');

  const totalAmount = books.reduce((sum, book) => sum + (book.price * book.quantity), 0);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      performVPNCheck();
    }
  }, [isOpen]);

  const performVPNCheck = async () => {
    setVpnCheckLoading(true);
    try {
      const response = await fetch('/api/vpn-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAgent: navigator.userAgent,
        }),
      });

      const data = await response.json();

      if (data.shouldBlock) {
        setSecurityWarning(data.message || 'VPN or proxy detected. Please disable it to continue with payment.');
      } else if (data.vpnDetected && data.risk === 'medium') {
        setSecurityWarning('VPN detected. Payment may be restricted for security reasons.');
      }
    } catch (error) {
      console.error('VPN check error:', error);
      setSecurityWarning('Security check failed. Please try again.');
    } finally {
      setVpnCheckLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }

    if (!shippingAddress.street.trim()) {
      newErrors.street = 'Street address is required';
    }

    if (!shippingAddress.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!shippingAddress.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!shippingAddress.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }

    if (securityWarning.includes('disable')) {
      toast({
        variant: 'destructive',
        title: 'Payment Blocked',
        description: 'Please disable VPN/proxy and try again.',
      });
      return;
    }

    setLoading(true);

    try {
      // Create order
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          books: books.map(book => ({
            bookId: book.id,
            quantity: book.quantity,
          })),
          paymentMethod,
          shippingAddress,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        if (orderData.securityBlock) {
          toast({
            variant: 'destructive',
            title: 'Payment Blocked',
            description: orderData.error,
          });
          return;
        }
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Initialize Razorpay payment
      const options = {
        ...orderData.paymentOptions,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: orderData.orderId,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok && verifyData.verified) {
              toast({
                title: 'Payment Successful!',
                description: 'Your order has been placed successfully.',
              });
              onSuccess(orderData.orderId);
              onClose();
            } else {
              throw new Error(verifyData.error || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast({
              variant: 'destructive',
              title: 'Payment Verification Failed',
              description: 'Please contact support with your order details.',
            });
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        variant: 'destructive',
        title: 'Payment Failed',
        description: error.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Complete Payment</span>
          </DialogTitle>
          <DialogDescription>
            Review your order and enter payment details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* VPN Security Check */}
          {vpnCheckLoading && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Performing security checks...</span>
                </div>
              </CardContent>
            </Card>
          )}

          {securityWarning && (
            <Alert variant={securityWarning.includes('disable') ? 'destructive' : 'default'}>
              <Shield className="h-4 w-4" />
              <AlertDescription>{securityWarning}</AlertDescription>
            </Alert>
          )}

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {books.map((book) => (
                  <div key={book.id} className="flex justify-between items-center">
                    <span className="text-sm">{book.title} × {book.quantity}</span>
                    <span className="font-medium">₹{(book.price * book.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between items-center font-bold">
                  <span>Total</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="paymentMethod">Select Payment Method</Label>
                  <Select onValueChange={setPaymentMethod}>
                    <SelectTrigger className={errors.paymentMethod ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Choose payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upi">
                        <div className="flex items-center space-x-2">
                          <Smartphone className="h-4 w-4" />
                          <span>UPI (Google Pay, PhonePe, Paytm)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="credit_card">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4" />
                          <span>Credit Card</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="debit_card">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4" />
                          <span>Debit Card</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.paymentMethod && (
                    <p className="text-sm text-red-500 mt-1">{errors.paymentMethod}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={shippingAddress.street}
                    onChange={(e) => handleInputChange('street', e.target.value)}
                    className={errors.street ? 'border-red-500' : ''}
                    placeholder="Enter street address"
                  />
                  {errors.street && (
                    <p className="text-sm text-red-500 mt-1">{errors.street}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={shippingAddress.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={errors.city ? 'border-red-500' : ''}
                    placeholder="Enter city"
                  />
                  {errors.city && (
                    <p className="text-sm text-red-500 mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={shippingAddress.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className={errors.state ? 'border-red-500' : ''}
                    placeholder="Enter state"
                  />
                  {errors.state && (
                    <p className="text-sm text-red-500 mt-1">{errors.state}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={shippingAddress.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className={errors.zipCode ? 'border-red-500' : ''}
                    placeholder="Enter ZIP code"
                  />
                  {errors.zipCode && (
                    <p className="text-sm text-red-500 mt-1">{errors.zipCode}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={shippingAddress.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="Enter country"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Actions */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handlePayment} 
              disabled={loading || securityWarning.includes('disable')}
              className="min-w-[120px]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ₹${totalAmount.toFixed(2)}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}