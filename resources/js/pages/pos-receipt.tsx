import React from 'react';
import { Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Printer, Mail, Home, CreditCard, Smartphone, Banknote } from 'lucide-react';

interface SaleItem {
    id: number;
    product_name: string;
    unit_price: string;
    quantity: number;
    total_price: string;
    product: {
        barcode: string;
    };
}

interface Sale {
    id: number;
    receipt_number: string;
    subtotal: string;
    tax_amount: string;
    total_amount: string;
    payment_method: string;
    amount_paid: string;
    change_amount: string;
    customer_email: string | null;
    created_at: string;
    user: {
        name: string;
    };
    saleItems: SaleItem[];
}

interface Props {
    sale: Sale;
    success?: string;
    [key: string]: unknown;
}

export default function PosReceipt({ sale, success }: Props) {
    const getPaymentIcon = (method: string) => {
        switch (method) {
            case 'cash': return <Banknote className="h-4 w-4" />;
            case 'card': return <CreditCard className="h-4 w-4" />;
            case 'qr_code': return <Smartphone className="h-4 w-4" />;
            default: return null;
        }
    };

    const getPaymentMethodText = (method: string) => {
        switch (method) {
            case 'cash': return 'Cash';
            case 'card': return 'Card';
            case 'qr_code': return 'QR Code';
            default: return method;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const printReceipt = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-2xl mx-auto">
                {/* Success Message */}
                {success && (
                    <Card className="mb-6 border-green-200 bg-green-50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 text-green-800">
                                <CheckCircle className="h-5 w-5" />
                                <span className="font-medium">{success}</span>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Receipt */}
                <Card className="mb-6 print:shadow-none print:border-none">
                    <CardHeader className="text-center pb-4">
                        <div className="mb-4">
                            <div className="bg-blue-600 p-3 rounded-lg inline-block mb-2">
                                <CheckCircle className="h-8 w-8 text-white" />
                            </div>
                            <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                            <p className="font-bold text-lg text-gray-900">RetailPOS Store</p>
                            <p>Receipt #{sale.receipt_number}</p>
                            <p>{formatDate(sale.created_at)}</p>
                            <p>Served by: {sale.user.name}</p>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-4">
                            {/* Items */}
                            <div>
                                <h3 className="font-semibold mb-3 text-gray-900">Items Purchased</h3>
                                <div className="space-y-2">
                                    {sale.saleItems.map((item) => (
                                        <div key={item.id} className="flex justify-between items-start py-2 border-b border-gray-100">
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">{item.product_name}</p>
                                                <p className="text-xs text-gray-500">
                                                    ${parseFloat(item.unit_price).toFixed(2)} × {item.quantity}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    Barcode: {item.product.barcode}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">
                                                    ${parseFloat(item.total_price).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            {/* Totals */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal:</span>
                                    <span>${parseFloat(sale.subtotal).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Tax (10%):</span>
                                    <span>${parseFloat(sale.tax_amount).toFixed(2)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total:</span>
                                    <span>${parseFloat(sale.total_amount).toFixed(2)}</span>
                                </div>
                            </div>

                            <Separator />

                            {/* Payment Details */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Payment Method:</span>
                                    <Badge variant="outline" className="flex items-center gap-1">
                                        {getPaymentIcon(sale.payment_method)}
                                        {getPaymentMethodText(sale.payment_method)}
                                    </Badge>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Amount Paid:</span>
                                    <span>${parseFloat(sale.amount_paid).toFixed(2)}</span>
                                </div>
                                {parseFloat(sale.change_amount) > 0 && (
                                    <div className="flex justify-between text-sm font-medium text-green-600">
                                        <span>Change:</span>
                                        <span>${parseFloat(sale.change_amount).toFixed(2)}</span>
                                    </div>
                                )}
                                {sale.customer_email && (
                                    <div className="flex justify-between text-sm">
                                        <span>Receipt emailed to:</span>
                                        <span className="text-blue-600">{sale.customer_email}</span>
                                    </div>
                                )}
                            </div>

                            <Separator />

                            {/* Footer */}
                            <div className="text-center text-sm text-gray-600 space-y-1">
                                <p>Thank you for your business!</p>
                                <p className="text-xs">This receipt serves as proof of purchase</p>
                                <p className="text-xs">Please retain for your records</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 print:hidden">
                    <Button onClick={printReceipt} className="flex-1" variant="outline">
                        <Printer className="mr-2 h-4 w-4" />
                        Print Receipt
                    </Button>
                    {sale.customer_email && (
                        <Button className="flex-1" variant="outline">
                            <Mail className="mr-2 h-4 w-4" />
                            Email Sent
                        </Button>
                    )}
                    <Link href="/" className="flex-1">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            <Home className="mr-2 h-4 w-4" />
                            New Sale
                        </Button>
                    </Link>
                </div>

                {/* Print Styles */}
                <style>{`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        .print\\:shadow-none, .print\\:shadow-none * {
                            visibility: visible;
                        }
                        .print\\:shadow-none {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                        }
                        .print\\:hidden {
                            display: none !important;
                        }
                    }
                `}</style>
            </div>
        </div>
    );
}