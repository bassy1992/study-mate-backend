import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Smartphone, 
  CreditCard, 
  Banknote,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export type PaymentMethod = 'mobile_money' | 'card' | 'bank_transfer' | 'paypal';

interface PaymentMethodSelectorProps {
  onSelectMethod: (method: PaymentMethod) => void;
  selectedMethod?: PaymentMethod;
}

export function PaymentMethodSelector({ onSelectMethod, selectedMethod }: PaymentMethodSelectorProps) {
  const [hoveredMethod, setHoveredMethod] = useState<PaymentMethod | null>(null);

  const paymentMethods = [
    {
      id: 'mobile_money' as PaymentMethod,
      name: 'Mobile Money',
      description: 'Pay with MTN MoMo, Vodafone Cash, or AirtelTigo Money',
      icon: Smartphone,
      color: 'bg-yellow-500',
      popular: true,
      fees: 'No additional fees',
      processingTime: 'Instant'
    },
    {
      id: 'card' as PaymentMethod,
      name: 'Credit/Debit Card',
      description: 'Pay with Visa or Mastercard',
      icon: CreditCard,
      color: 'bg-green-500',
      popular: false,
      fees: '2.5% processing fee',
      processingTime: 'Instant'
    },
    {
      id: 'bank_transfer' as PaymentMethod,
      name: 'Bank Transfer',
      description: 'Direct bank transfer',
      icon: Banknote,
      color: 'bg-purple-500',
      popular: false,
      fees: 'No additional fees',
      processingTime: '1-2 business days'
    },
    {
      id: 'paypal' as PaymentMethod,
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      icon: CreditCard,
      color: 'bg-blue-600',
      popular: false,
      fees: '3.5% processing fee',
      processingTime: 'Instant'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Choose Payment Method</h2>
        <p className="text-gray-600">Select your preferred payment option to complete your purchase</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;
          const isHovered = hoveredMethod === method.id;
          
          return (
            <Card
              key={method.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected 
                  ? 'ring-2 ring-blue-500 border-blue-500' 
                  : 'hover:border-gray-300'
              } ${isHovered ? 'scale-105' : ''}`}
              onClick={() => onSelectMethod(method.id)}
              onMouseEnter={() => setHoveredMethod(method.id)}
              onMouseLeave={() => setHoveredMethod(null)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-full ${method.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{method.name}</h3>
                      {method.popular && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          Popular
                        </span>
                      )}
                      {isSelected && (
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Processing Time:</span>
                        <span className="font-medium text-gray-700">{method.processingTime}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Fees:</span>
                        <span className="font-medium text-gray-700">{method.fees}</span>
                      </div>
                    </div>
                  </div>
                  
                  <ArrowRight className={`h-5 w-5 text-gray-400 transition-transform ${
                    isHovered ? 'translate-x-1' : ''
                  }`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedMethod && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            <p className="text-blue-800 font-medium">
              {paymentMethods.find(m => m.id === selectedMethod)?.name} selected
            </p>
          </div>
          <p className="text-blue-700 text-sm mt-1">
            Click "Continue" to proceed with your payment
          </p>
        </div>
      )}
    </div>
  );
}