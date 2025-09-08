
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ShoppingCart, Wheat, MapPin, IndianRupee, Trash2 } from 'lucide-react';
import type { ThreshingProduct, Notification } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

type CartItem = ThreshingProduct & { purchaseQuantity: number };

export default function ThreshingSearch({ products }: { products: ThreshingProduct[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<{name: string} | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const filteredProducts = products.filter(p =>
    p.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: ThreshingProduct, quantity: number) => {
    if (quantity <= 0 || quantity > product.quantity) {
      toast({ title: 'Invalid Quantity', description: 'Please enter a valid quantity.', variant: 'destructive' });
      return;
    }
    
    if (currentUser) {
        const existingNotifications: Notification[] = JSON.parse(localStorage.getItem('notifications') || '[]');
        const newNotification: Notification = {
            id: `notif-${Date.now()}-${Math.random()}`,
            recipient: product.farmer,
            sender: currentUser.name,
            message: `${currentUser.name} added ${quantity} KG of your ${product.type} to their cart.`,
            timestamp: Date.now(),
            read: false,
        };
        localStorage.setItem('notifications', JSON.stringify([...existingNotifications, newNotification]));
    }


    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        const newPurchaseQuantity = existingItem.purchaseQuantity + quantity;
        if (newPurchaseQuantity > product.quantity) {
             toast({ title: 'Quantity Limit Exceeded', description: `You cannot add more than the available ${product.quantity} KG.`, variant: 'destructive' });
             return prevCart;
        }
        return prevCart.map(item =>
          item.id === product.id ? { ...item, purchaseQuantity: newPurchaseQuantity } : item
        );
      }
      return [...prevCart, { ...product, purchaseQuantity: quantity }];
    });

    toast({ title: 'Added to Cart', description: `${quantity} KG of ${product.type} added.` });
  };
  
  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };
  
  const sendRequest = () => {
    if (cart.length === 0 || !currentUser) return;
  
    const requestsByFarmer: Record<string, CartItem[]> = cart.reduce((acc, item) => {
      if (!acc[item.farmer]) {
        acc[item.farmer] = [];
      }
      acc[item.farmer].push(item);
      return acc;
    }, {} as Record<string, CartItem[]>);
  
    const existingNotifications: Notification[] = JSON.parse(localStorage.getItem('notifications') || '[]');
  
    const newNotifications: Notification[] = Object.entries(requestsByFarmer).map(([farmerName, items]) => {
      const totalQuantity = items.reduce((sum, item) => sum + item.purchaseQuantity, 0);
      const totalPrice = items.reduce((sum, item) => sum + (item.price * item.purchaseQuantity), 0);
      const itemDetails = items.map(item => `${item.purchaseQuantity} KG of ${item.type}`).join(', ');
      
      return {
        id: `notif-${Date.now()}-${Math.random()}`,
        recipient: farmerName,
        sender: currentUser.name,
        message: `New purchase request for ${totalQuantity} KG of threshing worth ₹${totalPrice.toFixed(2)}. Items: ${itemDetails}.`,
        timestamp: Date.now(),
        read: false,
      };
    });
  
    localStorage.setItem('notifications', JSON.stringify([...existingNotifications, ...newNotifications]));
  
    toast({ title: 'Request Sent!', description: 'Farmers have been notified of your interest.' });
    setCart([]);
  };

  const cartItemCount = cart.reduce((acc, item) => acc + item.purchaseQuantity, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for threshing (e.g., wheat, rice...)"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProducts.length > 0 ? filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} cart={cart}/>
          )) : (
            <p className="text-muted-foreground md:col-span-2 text-center py-8">No products found matching your search.</p>
          )}
        </div>
      </div>
      <div>
        <CartSheet cart={cart} onRemove={removeFromCart} onSendRequest={sendRequest} />
      </div>
    </div>
  );
}

function ProductCard({ product, onAddToCart, cart }: { product: ThreshingProduct, onAddToCart: (product: ThreshingProduct, quantity: number) => void, cart: CartItem[] }) {
  const [quantity, setQuantity] = useState(1);
  const itemInCart = cart.find(item => item.id === product.id);
  const availableQuantity = itemInCart ? product.quantity - itemInCart.purchaseQuantity : product.quantity;


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline"><Wheat />{product.type}</CardTitle>
        <CardDescription>From {product.farmer}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> {product.location}</div>
        <div className="flex items-center gap-2"><IndianRupee className="h-4 w-4 text-muted-foreground" /> ₹{product.price}/KG</div>
        <p>Available: {availableQuantity} KG</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} min="1" max={availableQuantity} className="w-20" disabled={availableQuantity === 0}/>
        <Button onClick={() => onAddToCart(product, quantity)} className="flex-1" disabled={availableQuantity === 0}>
          <ShoppingCart className="mr-2 h-4 w-4" /> {availableQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}


function CartSheet({ cart, onRemove, onSendRequest }: { cart: CartItem[], onRemove: (id: string) => void, onSendRequest: () => void }) {
  const total = cart.reduce((acc, item) => acc + item.price * item.purchaseQuantity, 0).toFixed(2);
  const cartItemCount = cart.reduce((acc, item) => acc + item.purchaseQuantity, 0);
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="w-full">
          <ShoppingCart className="mr-2 h-4 w-4" /> View Cart ({cartItemCount})
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription>
            Review your items and send a request to the farmers.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-4 flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <p className="text-muted-foreground text-center">Your cart is empty.</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{item.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.purchaseQuantity} KG @ ₹{item.price}/KG
                  </p>
                </div>
                <div className="flex items-center gap-2">
                   <p className="font-semibold">₹{(item.price * item.purchaseQuantity).toFixed(2)}</p>
                   <Button variant="ghost" size="icon" onClick={() => onRemove(item.id)}>
                       <Trash2 className="h-4 w-4 text-destructive"/>
                   </Button>
                </div>
              </div>
            ))
          )}
        </div>
        <SheetFooter>
            <div className="w-full space-y-4">
                <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>₹{total}</span>
                </div>
                <SheetClose asChild>
                    <Button onClick={onSendRequest} disabled={cart.length === 0} className="w-full">
                        Send Purchase Request
                    </Button>
                </SheetClose>
            </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
