import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AppShell } from '@/components/app-shell';
import { router } from '@inertiajs/react';
import { Users, TrendingUp, DollarSign, Calendar } from 'lucide-react';

interface SalesByUser {
    user_id: number;
    transaction_count: number;
    total_sales: string;
    avg_transaction: string;
    user: {
        name: string;
        email: string;
    };
}

interface Props {
    salesByUser: SalesByUser[];
    filters: {
        start_date: string;
        end_date: string;
    };
    [key: string]: unknown;
}

export default function SalespersonReport({ salesByUser, filters }: Props) {
    const handleFilterChange = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const params = {
            start_date: formData.get('start_date') as string,
            end_date: formData.get('end_date') as string,
        };
        
        router.get(route('salesperson-reports.index'), params, { preserveState: true });
    };

    const totalSales = salesByUser.reduce((sum, user) => sum + parseFloat(user.total_sales), 0);
    const totalTransactions = salesByUser.reduce((sum, user) => sum + user.transaction_count, 0);

    return (
        <AppShell>
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        👥 Sales by Salesperson
                    </h1>
                    <p className="text-gray-600">Track individual sales performance</p>
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
                                    <p className="text-sm font-medium text-gray-600">Total Team Sales</p>
                                    <p className="text-3xl font-bold text-green-600">
                                        ${totalSales.toFixed(2)}
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
                                        {totalTransactions}
                                    </p>
                                </div>
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <TrendingUp className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Active Staff</p>
                                    <p className="text-3xl font-bold text-purple-600">
                                        {salesByUser.length}
                                    </p>
                                </div>
                                <div className="bg-purple-100 p-3 rounded-full">
                                    <Users className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Salesperson Performance */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Individual Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {salesByUser.length > 0 ? (
                                salesByUser.map((user, index) => {
                                    const salesPercentage = totalSales > 0 
                                        ? (parseFloat(user.total_sales) / totalSales) * 100 
                                        : 0;
                                    
                                    return (
                                        <div key={user.user_id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold">
                                                    #{index + 1}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-lg">{user.user.name}</p>
                                                    <p className="text-sm text-gray-500">{user.user.email}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-3 gap-8 text-center">
                                                <div>
                                                    <p className="text-2xl font-bold text-green-600">
                                                        ${parseFloat(user.total_sales).toFixed(2)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">Total Sales</p>
                                                    <Badge variant="outline" className="mt-1">
                                                        {salesPercentage.toFixed(1)}% of total
                                                    </Badge>
                                                </div>
                                                
                                                <div>
                                                    <p className="text-2xl font-bold text-blue-600">
                                                        {user.transaction_count}
                                                    </p>
                                                    <p className="text-xs text-gray-500">Transactions</p>
                                                </div>
                                                
                                                <div>
                                                    <p className="text-2xl font-bold text-purple-600">
                                                        ${parseFloat(user.avg_transaction).toFixed(2)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">Avg per Sale</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-8">
                                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">No sales data available for this period</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}