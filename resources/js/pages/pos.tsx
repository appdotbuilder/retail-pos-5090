import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router } from '@inertiajs/react';
import { ShoppingCart, Search, CreditCard, Smartphone, Banknote, Plus, Minus, Trash2 } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    price: string;
    barcode: string;
    stock_quantity: number;
    category: {
        id: number;
        name: string;
        color: string;
    } | null;
    [key: string]: unknown;
}

interface Category {
    id: number;
    name: string;
    color: string;
    products_count: number;
}

interface CartItem extends Product {
    quantity: number;
    total: number;
}

interface Props {
    products: Product[];
    categories: Category[];
    [key: string]: unknown;
}

export default function Pos({ products, categories }: Props) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'qr_code'>('cash');
    const [amountPaid, setAmountPaid] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             product.barcode.includes(searchTerm);
        const matchesCategory = selectedCategory === 'all' || 
                               (product.category && product.category.id.toString() === selectedCategory);
        return matchesSearch && matchesCategory;
    });

    const addToCart = (product: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { 
                            ...item, 
                            quantity: item.quantity + 1,
                            total: (item.quantity + 1) * parseFloat(item.price)
                          }
                        : item
                );
            } else {
                return [...prevCart, {
                    ...product,
                    quantity: 1,
                    total: parseFloat(product.price)
                }];
            }
        });
    };

    const updateQuantity = (productId: number, newQuantity: number) => {
        if (newQuantity === 0) {
            removeFromCart(productId);
            return;
        }

        setCart(prevCart =>
            prevCart.map(item =>
                item.id === productId
                    ? {
                        ...item,
                        quantity: newQuantity,
                        total: newQuantity * parseFloat(item.price)
                      }
                    : item
            )
        );
    };

    const removeFromCart = (productId: number) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const clearCart = () => {
        setCart([]);
        setAmountPaid('');
        setCustomerEmail('');
    };

    const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.10; // 10% tax
    const total = subtotal + tax;
    const change = parseFloat(amountPaid) - total || 0;

    const handleCheckout = () => {
        if (cart.length === 0) return;
        if (parseFloat(amountPaid) < total) {
            alert('Insufficient payment amount');
            return;
        }

        const saleData = {
            items: cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity
            })),
            payment_method: paymentMethod,
            amount_paid: parseFloat(amountPaid),
            customer_email: customerEmail || null,
        };

        router.post('/pos', saleData, {
            preserveState: false,
            onSuccess: () => {
                clearCart();
            },
            onError: (errors) => {
                console.error('Sale failed:', errors);
            }
        });
    };

    const getPaymentIcon = (method: string) => {
        switch (method) {
            case 'cash': return <Banknote className="h-4 w-4" />;
            case 'card': return <CreditCard className="h-4 w-4" />;
            case 'qr_code': return <Smartphone className="h-4 w-4" />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">🛒 Point of Sale System</h1>
                    <p className="text-gray-600">Fast and efficient retail checkout</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Products Section */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Products</CardTitle>
                                <div className="flex gap-4">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input
                                            placeholder="Search by name or scan barcode..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                        <SelectTrigger className="w-48">
                                            <SelectValue placeholder="All Categories" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Categories</SelectItem>
                                            {categories.map(category => (
                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                    {category.name} ({category.products_count})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                                    {filteredProducts.map(product => (
                                        <Card 
                                            key={product.id} 
                                            className="cursor-pointer hover:shadow-md transition-shadow"
                                            onClick={() => addToCart(product)}
                                        >
                                            <CardContent className="p-3">
                                                <div className="flex flex-col h-full">
                                                    <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
                                                    <div className="flex justify-between items-center mt-auto">
                                                        <span className="text-lg font-bold text-blue-600">
                                                            ${parseFloat(product.price).toFixed(2)}
                                                        </span>
                                                        {product.category && (
                                                            <Badge 
                                                                style={{ backgroundColor: product.category.color }}
                                                                className="text-white text-xs"
                                                            >
                                                                {product.category.name}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                                                        <span>Stock: {product.stock_quantity}</span>
                                                        <span>{product.barcode}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Cart & Checkout Section */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="flex items-center gap-2">
                                        <ShoppingCart className="h-5 w-5" />
                                        Cart ({cart.length})
                                    </CardTitle>
                                    {cart.length > 0 && (
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={clearCart}
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Clear
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                    {cart.length === 0 ? (
                                        <p className="text-gray-500 text-center py-8">Cart is empty</p>
                                    ) : (
                                        cart.map(item => (
                                            <div key={item.id} className="flex justify-between items-center py-2 border-b">
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">{item.name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        ${parseFloat(item.price).toFixed(2)} each
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="h-6 w-6 p-0"
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="w-8 text-center">{item.quantity}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="h-6 w-6 p-0"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="w-16 text-right font-medium">
                                                        ${item.total.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {cart.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Checkout</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Subtotal:</span>
                                            <span>${subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Tax (10%):</span>
                                            <span>${tax.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                                            <span>Total:</span>
                                            <span>${total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <Label>Payment Method</Label>
                                            <Tabs value={paymentMethod} onValueChange={(value: string) => setPaymentMethod(value as 'cash' | 'card' | 'qr_code')}>
                                                <TabsList className="grid w-full grid-cols-3">
                                                    <TabsTrigger value="cash" className="flex items-center gap-1">
                                                        <Banknote className="h-4 w-4" />
                                                        Cash
                                                    </TabsTrigger>
                                                    <TabsTrigger value="card" className="flex items-center gap-1">
                                                        <CreditCard className="h-4 w-4" />
                                                        Card
                                                    </TabsTrigger>
                                                    <TabsTrigger value="qr_code" className="flex items-center gap-1">
                                                        <Smartphone className="h-4 w-4" />
                                                        QR
                                                    </TabsTrigger>
                                                </TabsList>
                                            </Tabs>
                                        </div>

                                        <div>
                                            <Label htmlFor="amountPaid">Amount Paid</Label>
                                            <Input
                                                id="amountPaid"
                                                type="number"
                                                step="0.01"
                                                value={amountPaid}
                                                onChange={(e) => setAmountPaid(e.target.value)}
                                                placeholder="0.00"
                                            />
                                            {change > 0 && (
                                                <p className="text-sm text-green-600 mt-1">
                                                    Change: ${change.toFixed(2)}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="customerEmail">Customer Email (Optional)</Label>
                                            <Input
                                                id="customerEmail"
                                                type="email"
                                                value={customerEmail}
                                                onChange={(e) => setCustomerEmail(e.target.value)}
                                                placeholder="customer@example.com"
                                            />
                                        </div>

                                        <Button 
                                            onClick={handleCheckout}
                                            className="w-full"
                                            size="lg"
                                            disabled={!amountPaid || parseFloat(amountPaid) < total}
                                        >
                                            {getPaymentIcon(paymentMethod)}
                                            Complete Sale
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}