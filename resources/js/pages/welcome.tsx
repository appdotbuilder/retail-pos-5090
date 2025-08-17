import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type SharedData } from '@/types';
import { 
    ShoppingCart, 
    Package, 
    BarChart3, 
    Users, 
    CreditCard, 
    Smartphone, 
    Banknote,
    TrendingUp,
    Clock,
    CheckCircle
} from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const features = [
        {
            icon: <ShoppingCart className="h-8 w-8 text-blue-600" />,
            title: "Point of Sale",
            description: "Fast and intuitive checkout process with barcode scanning"
        },
        {
            icon: <Package className="h-8 w-8 text-green-600" />,
            title: "Inventory Management",
            description: "Track stock levels and get low-stock alerts"
        },
        {
            icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
            title: "Sales Reports",
            description: "Detailed analytics and daily closure reports"
        },
        {
            icon: <Users className="h-8 w-8 text-orange-600" />,
            title: "Staff Management",
            description: "Track sales performance by individual salespeople"
        }
    ];

    const paymentMethods = [
        { icon: <Banknote className="h-6 w-6" />, name: "Cash", color: "bg-green-500" },
        { icon: <CreditCard className="h-6 w-6" />, name: "Card", color: "bg-blue-500" },
        { icon: <Smartphone className="h-6 w-6" />, name: "QR Code", color: "bg-purple-500" }
    ];

    const stats = [
        { label: "Transaction Speed", value: "< 30s", icon: <Clock className="h-5 w-5" /> },
        { label: "Payment Methods", value: "3+", icon: <CreditCard className="h-5 w-5" /> },
        { label: "Report Types", value: "5+", icon: <BarChart3 className="h-5 w-5" /> },
        { label: "Uptime", value: "99.9%", icon: <CheckCircle className="h-5 w-5" /> }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <ShoppingCart className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">RetailPOS</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <div className="mb-8">
                        <Badge className="bg-blue-100 text-blue-800 px-4 py-1 text-sm font-medium mb-4">
                            🚀 Modern Retail Solution
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            🛒 Smart Point of Sale
                            <span className="block text-blue-600">System</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Streamline your retail operations with our comprehensive POS system. 
                            Fast checkout, inventory management, and detailed reporting - all in one platform.
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        {auth.user ? (
                            <Link href={route('dashboard')}>
                                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg">
                                    <BarChart3 className="mr-2 h-5 w-5" />
                                    Go to Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href={route('register')}>
                                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg">
                                        <ShoppingCart className="mr-2 h-5 w-5" />
                                        Start Selling Now
                                    </Button>
                                </Link>
                                <Link href={route('login')}>
                                    <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                                        <Users className="mr-2 h-5 w-5" />
                                        Access Dashboard
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                        {stats.map((stat, index) => (
                            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                                <CardContent className="p-0">
                                    <div className="flex items-center justify-center mb-2 text-blue-600">
                                        {stat.icon}
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                    <div className="text-sm text-gray-600">{stat.label}</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {features.map((feature, index) => (
                        <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow border-0 bg-white/60 backdrop-blur-sm">
                            <CardContent className="p-0">
                                <div className="mb-4 flex justify-center">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Payment Methods */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">
                        💳 Accept All Payment Methods
                    </h2>
                    <div className="flex justify-center items-center space-x-8">
                        {paymentMethods.map((method, index) => (
                            <div key={index} className="flex flex-col items-center space-y-2">
                                <div className={`${method.color} p-4 rounded-full text-white`}>
                                    {method.icon}
                                </div>
                                <span className="font-medium text-gray-700">{method.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Demo Preview */}
                <Card className="mb-16 overflow-hidden">
                    <CardContent className="p-0">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white text-center">
                            <h2 className="text-2xl font-bold mb-4">📊 Live Demo Preview</h2>
                            <p className="text-blue-100 mb-6">
                                Experience the power of our POS system with real-time transaction processing
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                                <div className="bg-white/20 rounded-lg p-6 backdrop-blur-sm">
                                    <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                                    <div className="text-2xl font-bold">$12,450</div>
                                    <div className="text-sm text-blue-100">Today's Sales</div>
                                </div>
                                <div className="bg-white/20 rounded-lg p-6 backdrop-blur-sm">
                                    <ShoppingCart className="h-8 w-8 mx-auto mb-2" />
                                    <div className="text-2xl font-bold">127</div>
                                    <div className="text-sm text-blue-100">Transactions</div>
                                </div>
                                <div className="bg-white/20 rounded-lg p-6 backdrop-blur-sm">
                                    <Package className="h-8 w-8 mx-auto mb-2" />
                                    <div className="text-2xl font-bold">850</div>
                                    <div className="text-sm text-blue-100">Products</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Key Benefits */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12">
                        ✨ Why Choose RetailPOS?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="p-6 border-0 bg-gradient-to-br from-green-50 to-green-100">
                            <CardContent className="p-0 text-center">
                                <div className="text-4xl mb-4">⚡</div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                                <p className="text-gray-600">Process transactions in under 30 seconds with barcode scanning</p>
                            </CardContent>
                        </Card>
                        <Card className="p-6 border-0 bg-gradient-to-br from-blue-50 to-blue-100">
                            <CardContent className="p-0 text-center">
                                <div className="text-4xl mb-4">📧</div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Receipts</h3>
                                <p className="text-gray-600">Email receipts instantly or print to LAN printers</p>
                            </CardContent>
                        </Card>
                        <Card className="p-6 border-0 bg-gradient-to-br from-purple-50 to-purple-100">
                            <CardContent className="p-0 text-center">
                                <div className="text-4xl mb-4">📈</div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Analytics</h3>
                                <p className="text-gray-600">Detailed reports and day-end closure summaries</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="bg-gray-900 text-white py-16">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Retail Business? 🚀</h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Join thousands of retailers already using our POS system
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {auth.user ? (
                            <Link href={route('dashboard')}>
                                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg">
                                    Access Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href={route('register')}>
                                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg">
                                        Get Started Free
                                    </Button>
                                </Link>
                                <Link href={route('login')}>
                                    <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800">
                                        Login to Dashboard
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}