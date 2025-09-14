import React, { useState } from 'react';
import { Crown, Check, X, CreditCard, Calendar, Download, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

const membershipPlans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'month',
    features: [
      'Access to basic internships',
      'Limited webinar participation',
      'Basic startup directory access',
      'Community support',
    ],
    limitations: [
      'Maximum 3 applications per month',
      'No priority support',
      'Limited project submissions',
    ],
    popular: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 29,
    period: 'month',
    features: [
      'Unlimited internship applications',
      'Access to all webinars',
      'Full startup directory access',
      'Priority support',
      'Advanced project submissions',
      'Mentorship opportunities',
      'Exclusive networking events',
    ],
    limitations: [],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    period: 'month',
    features: [
      'Everything in Premium',
      'Custom startup matching',
      'Dedicated account manager',
      'Advanced analytics',
      'Team collaboration tools',
      'Custom integrations',
      'White-label options',
    ],
    limitations: [],
    popular: false,
  },
];

const currentMembership = {
  plan: 'premium',
  status: 'active',
  startDate: '2024-01-01',
  nextBillingDate: '2024-02-01',
  amount: 29,
  paymentMethod: '**** **** **** 1234',
  autoRenew: true,
};

const recentInvoices = [
  {
    id: 'INV-001',
    date: '2024-01-01',
    amount: 29,
    status: 'paid',
    description: 'Premium Membership - January 2024',
  },
  {
    id: 'INV-002',
    date: '2023-12-01',
    amount: 29,
    status: 'paid',
    description: 'Premium Membership - December 2023',
  },
  {
    id: 'INV-003',
    date: '2023-11-01',
    amount: 29,
    status: 'paid',
    description: 'Premium Membership - November 2023',
  },
];

export default function MembershipManagement() {
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsUpgrading(false);
    // Handle success
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Membership</h1>
          <p className="text-gray-600">Manage your membership plan and billing</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download Receipts
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Current Membership Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Crown className="h-5 w-5 mr-2 text-yellow-500" />
                Current Membership
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 capitalize">
                    {currentMembership.plan} Plan
                  </h3>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getStatusColor(currentMembership.status)}>
                      {currentMembership.status}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      ${currentMembership.amount}/month
                    </span>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Started: {new Date(currentMembership.startDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Next billing: {new Date(currentMembership.nextBillingDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Payment method: {currentMembership.paymentMethod}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Button variant="outline" className="mb-2">
                    Update Payment Method
                  </Button>
                  <br />
                  <Button variant="outline" className="text-red-600 hover:text-red-700">
                    Cancel Membership
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Crown className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Applications This Month</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Webinars Attended</p>
                    <p className="text-2xl font-bold text-gray-900">8</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Crown className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Projects Submitted</p>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {membershipPlans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-center">
                    {plan.name}
                  </CardTitle>
                  <div className="text-center">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Features:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {plan.limitations.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Limitations:</h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <X className="h-4 w-4 text-red-500 mr-2" />
                            {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full" 
                    variant={plan.id === currentMembership.plan ? "outline" : "default"}
                    disabled={plan.id === currentMembership.plan}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {plan.id === currentMembership.plan ? 'Current Plan' : 'Select Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {selectedPlan !== currentMembership.plan && (
            <div className="text-center">
              <Button 
                size="lg" 
                onClick={handleUpgrade}
                disabled={isUpgrading}
              >
                {isUpgrading ? 'Processing...' : 'Upgrade Now'}
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                View and download your invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h4 className="font-medium">{invoice.description}</h4>
                        <p className="text-sm text-gray-600">
                          Invoice #{invoice.id} • {new Date(invoice.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">${invoice.amount}</p>
                        <Badge className={getInvoiceStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>
                Manage your payment information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <CreditCard className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="font-medium">{currentMembership.paymentMethod}</p>
                    <p className="text-sm text-gray-600">
                      {currentMembership.autoRenew ? 'Auto-renewal enabled' : 'Auto-renewal disabled'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    Update
                  </Button>
                  <Button variant="outline">
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
