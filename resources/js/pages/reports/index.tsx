import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AppShell } from '@/components/app-shell';
import { router } from '@inertiajs/react';
import { 
    BarChart3, 
    TrendingUp, 
    DollarSign, 
    ShoppingCart,
    Calendar,
    CreditCard,
    Banknote,
    Smartphone
} from 'lucide-react';

interface DailySale {
    date: string;
    total: string;
    count: number;
}

interface PaymentMethod {
    payment_method: string;
    total: string;
    count: number;
}

interface TopProduct {
    product_name: string;
    total_sold: number;
    revenue: string;
    product?: {
        category?: {
            name: string;
        };
    };
}

interface Summary {
    totalSales: string;
    totalTransactions: number;
    averageTransactionValue: number;
}

interface Props {
    dailySales: DailySale[];
    paymentMethods: PaymentMethod[];
    topProducts: TopProduct[];
    summary: Summary;
    filters: {
        start_date: string;
        end_date: string;
    };
    [key: string]: unknown;
}

export default function ReportsIndex({ 
    dailySales, 
    paymentMethods, 
    topProducts, 
    summary,
    filters 
}: Props) {
    const handleFilterChange = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const params = {
            start_date: formData.get('start_date') as string,
            end_date: formData.get('end_date') as string,
        };
        
        router.get(route('reports.index'), params, { preserveState: true });
    };

    const getPaymentIcon = (method: string) => {
        switch (method) {
            case 'cash': return <Banknote className="h-4 w-4 text-green-600" />;
            case 'card': return <CreditCard className="h-4 w-4 text-blue-600" />;
            case 'qr_code': return <Smartphone className="h-4 w-4 text-purple-600" />;
            default: return <DollarSign className="h-4 w-4" />;
        }
    };

    const getPaymentMethodName = (method: string) => {
        switch (method) {
            case 'cash': return 'Cash';
            case 'card': return 'Card';
            case 'qr_code': return 'QR Code';
            default: return method;
        }
    };

    return (
        <AppShell>
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        📊 Sales Reports
                    </h1>
                    <p className="text-gray-600">Analyze your sales performance and trends</p>
                </div>

                {/* Date Filter */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Filter by Date Range
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleFilterChange} className="flex gap-4 items-end">
                            <div>
                                <Label htmlFor="start_date">Start Date</Label>
                                <Input
                                    id="start_date"
                                    name="start_date"
                                    type="date"
                                    defaultValue={filters.start_date}
                                />
                            </div>
                            <div>
                                <Label htmlFor="end_date">End Date</Label>
                                <Input
                                    id="end_date"
                                    name="end_date"
                                    type="date"
                                    defaultValue={filters.end_date}
                                />
                            </div>
                            <Button type="submit">Apply Filter</Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Sales</p>
                                    <p className="text-3xl font-bold text-green-600">
                                        ${parseFloat(summary.totalSales).toFixed(2)}
                                    </p>
                                </div>
                                <div className="bg-green-100 p-3 rounded-full">
                                    <DollarSign className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                                    <p className="text-3xl font-bold text-blue-600">
                                        {summary.totalTransactions}
                                    </p>
                                </div>
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Average Transaction</p>
                                    <p className="text-3xl font-bold text-purple-600">
                                        ${summary.averageTransactionValue.toFixed(2)}
                                    </p>
                                </div>
                                <div className="bg-purple-100 p-3 rounded-full">
                                    <TrendingUp className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Payment Methods Breakdown */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Payment Methods
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {paymentMethods.map((method) => {
                                    const percentage = summary.totalSales !== '0' 
                                        ? (parseFloat(method.total) / parseFloat(summary.totalSales)) * 100 
                                        : 0;
                                    
                                    return (
                                        <div key={method.payment_method} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {getPaymentIcon(method.payment_method)}
                                                <span className="font-medium">
                                                    {getPaymentMethodName(method.payment_method)}
                                                </span>
                                                <Badge variant="outline">{method.count} transactions</Badge>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold">${parseFloat(method.total).toFixed(2)}</div>
                                                <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Daily Sales Chart (Simple Table) */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Daily Sales
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {dailySales.length > 0 ? (
                                    dailySales.map((day, index) => (
                                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-sm">{new Date(day.date).toLocaleDateString()}</span>
                                            <div className="text-right">
                                                <div className="font-medium">${parseFloat(day.total).toFixed(2)}</div>
                                                <div className="text-xs text-gray-500">{day.count} sales</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-4">No sales data available</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Top Products */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Top Selling Products
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {topProducts.length > 0 ? (
                                topProducts.map((product, index) => (
                                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium">{product.product_name}</p>
                                                {product.product?.category && (
                                                    <p className="text-xs text-gray-500">
                                                        {product.product.category.name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-green-600">
                                                ${parseFloat(product.revenue).toFixed(2)}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {product.total_sold} sold
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">No product data available</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}