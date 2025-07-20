import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Smartphone,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone
} from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@shared/api';

interface MtnMomoPaymentProps {
  amount: number;
  currency?: string;
  bundleId: number;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

export function MtnMomoPayment({
  amount,
  currency = 'GHS',
  bundleId,
  onSuccess,
  onError,
  onCancel
}: MtnMomoPaymentProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'pending' | 'success' | 'failed'>('idle');
  const [transactionId, setTransactionId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Validate MTN phone number format
  const validateMtnNumber = (number: string): boolean => {
    // MTN Ghana numbers start with 024, 025, 053, 054, 055, 059
    const mtnPrefixes = ['024', '025', '053', '054', '055', '059'];
    const cleanNumber = number.replace(/\s+/g, '').replace(/^\+233/, '0');

    if (cleanNumber.length !== 10) return false;

    const prefix = cleanNumber.substring(0, 3);
    return mtnPrefixes.includes(prefix);
  };

  const formatPhoneNumber = (number: string): string => {
    // Remove all non-digits
    const digits = number.replace(/\D/g, '');

    // Handle different input formats
    if (digits.startsWith('233')) {
      return '+' + digits;
    } else if (digits.startsWith('0')) {
      return '+233' + digits.substring(1);
    } else if (digits.length === 9) {
      return '+233' + digits;
    }

    return digits;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    setErrorMessage('');
  };

  const initiateMomoPayment = async () => {
    if (!phoneNumber.trim()) {
      setErrorMessage('Please enter your MTN Mobile Money number');
      return;
    }

    const formattedNumber = formatPhoneNumber(phoneNumber);

    if (!validateMtnNumber(formattedNumber)) {
      setErrorMessage('Please enter a valid MTN Mobile Money number (024, 025, 053, 054, 055, 059)');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      // Call real MTN MoMo API through backend
      const response = await initiateMtnMomoPayment({
        phoneNumber: formattedNumber,
        amount,
        currency,
        bundleId,
      });

      if (response.success) {
        setTransactionId(response.transactionId);
        setPaymentStatus('pending');

        // Show prompt notification
        toast.info('Payment request sent to your phone. Please check your MTN Mobile Money and approve the transaction.');

        // Poll for payment status
        pollPaymentStatus(response.transactionId);
      } else {
        throw new Error(response.message || 'Payment initiation failed');
      }
    } catch (error: any) {
      console.error('MTN MoMo payment error:', error);
      setPaymentStatus('failed');
      setErrorMessage(error.message || 'Payment failed. Please try again.');
      onError(error.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const pollPaymentStatus = async (txnId: string) => {
    let attempts = 0;
    const maxAttempts = 30; // 5 minutes with 10-second intervals

    const checkStatus = async () => {
      try {
        const statusResponse = await checkMtnMomoPaymentStatus(txnId);

        if (statusResponse.status === 'SUCCESSFUL') {
          setPaymentStatus('success');
          toast.success('Payment successful! Your course bundle has been activated.');
          onSuccess(txnId);
          return;
        } else if (statusResponse.status === 'FAILED') {
          setPaymentStatus('failed');
          setErrorMessage('Payment was declined or failed. Please try again.');
          onError('Payment failed');
          return;
        } else if (statusResponse.status === 'PENDING' && attempts < maxAttempts) {
          attempts++;
          setTimeout(checkStatus, 10000); // Check again in 10 seconds
        } else {
          // Timeout
          setPaymentStatus('failed');
          setErrorMessage('Payment timeout. Please check your MTN Mobile Money and try again if payment was not completed.');
          onError('Payment timeout');
        }
      } catch (error) {
        console.error('Status check error:', error);
        if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkStatus, 10000);
        } else {
          setPaymentStatus('failed');
          setErrorMessage('Unable to verify payment status. Please contact support.');
          onError('Status check failed');
        }
      }
    };

    checkStatus();
  };

  const initiateMtnMomoPayment = async (paymentData: any): Promise<any> => {
    try {
      const response = await apiClient.initiateMtnMomo(
        paymentData.phoneNumber,
        paymentData.amount,
        paymentData.bundleId
      );

      return {
        success: response.success,
        transactionId: response.transaction_id,
        message: response.message
      };
    } catch (error: any) {
      throw new Error(error.message || 'Payment initiation failed');
    }
  };

  const checkMtnMomoPaymentStatus = async (txnId: string): Promise<any> => {
    try {
      const response = await apiClient.checkMtnMomoStatus(txnId);

      return {
        status: response.status,
        transactionId: response.transaction_id,
        success: response.success
      };
    } catch (error: any) {
      throw new Error(error.message || 'Status check failed');
    }
  };

  if (paymentStatus === 'success') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Payment Successful!</h3>
              <p className="text-gray-600 mt-2">
                Your MTN Mobile Money payment has been processed successfully.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Transaction ID: {transactionId}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Payment Failed</h3>
              <p className="text-gray-600 mt-2">{errorMessage}</p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => {
                  setPaymentStatus('idle');
                  setErrorMessage('');
                  setTransactionId('');
                }}
                className="flex-1"
              >
                Try Again
              </Button>
              <Button onClick={onCancel} className="flex-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <Smartphone className="h-4 w-4 text-yellow-600" />
          </div>
          <span>MTN Mobile Money</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {paymentStatus === 'pending' ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Payment Pending</h3>
              <p className="text-gray-600 mt-2">
                Please check your phone and approve the MTN Mobile Money transaction.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Transaction ID: {transactionId}
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Instructions:</p>
                  <ol className="list-decimal list-inside mt-1 space-y-1">
                    <li>Check your phone for MTN MoMo prompt</li>
                    <li>Enter your MTN MoMo PIN</li>
                    <li>Confirm the payment</li>
                  </ol>
                </div>
              </div>
            </div>
            <Button onClick={onCancel} className="w-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              Cancel Payment
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-800">Payment Amount</p>
                    <p className="text-lg font-bold text-yellow-900">
                      {currency} {amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mtn-phone">MTN Mobile Money Number</Label>
                <Input
                  id="mtn-phone"
                  type="tel"
                  placeholder="024 XXX XXXX"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className={`h-12 ${errorMessage ? 'border-red-500' : ''}`}
                  disabled={isProcessing}
                />
                <p className="text-xs text-gray-500">
                  Enter your MTN Mobile Money number (024, 025, 053, 054, 055, 059)
                </p>
                {errorMessage && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errorMessage}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={initiateMomoPayment}
                disabled={isProcessing || !phoneNumber.trim()}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white h-12"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Smartphone className="mr-2 h-4 w-4" />
                    Pay with MTN MoMo
                  </>
                )}
              </Button>

              <Button onClick={onCancel} className="w-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                Cancel
              </Button>
            </div>

            <div className="text-xs text-gray-500 text-center">
              <p>
                By proceeding, you agree to MTN Mobile Money terms and conditions.
                Standard network charges may apply.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}