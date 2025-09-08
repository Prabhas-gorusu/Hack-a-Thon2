
'use client';

import { Bell, UserCircle, Sun, Moon, LogOut, Lock, User, ShoppingBag } from 'lucide-react';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation';
import type { Notification } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';


type UserData = {
    name: string;
    role: 'Farmer' | 'Retailer';
}

export default function DashboardHeader({ role }: { role: 'Farmer' | 'Retailer' }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const router = useRouter();
  
  const unreadCount = notifications.filter(n => !n.read).length;


  useEffect(() => {
    // Theme logic
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    // User logic
    const storedUser = localStorage.getItem('user');
    let currentUser: UserData | null = null;
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        setUser(currentUser);
    }

    // Notification Logic
    const fetchNotifications = () => {
        if(currentUser) {
            const allNotifications: Notification[] = JSON.parse(localStorage.getItem('notifications') || '[]');
            const userNotifications = allNotifications
                .filter(n => n.recipient === currentUser?.name)
                .sort((a,b) => b.timestamp - a.timestamp); // Sort by newest first
            setNotifications(userNotifications);
        }
    }

    fetchNotifications();
    
    const notificationInterval = setInterval(fetchNotifications, 5000); // Poll for new notifications

    return () => {
        observer.disconnect();
        clearInterval(notificationInterval);
    };
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    setIsDarkMode(isDark);
    if(isDark) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };
  
  const markNotificationsAsRead = () => {
      if (user) {
          const allNotifications: Notification[] = JSON.parse(localStorage.getItem('notifications') || '[]');
          const updatedNotifications = allNotifications.map(n => 
              n.recipient === user.name ? { ...n, read: true } : n
          );
          localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
          setNotifications(notifications.map(n => ({...n, read: true})));
      }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <Logo />
      <div className="flex-1">
        <span className="text-sm font-medium bg-primary/10 text-primary py-1 px-3 rounded-full">{role} Dashboard</span>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
        
        <DropdownMenu onOpenChange={(open) => { if (!open) markNotificationsAsRead(); }}>
            <DropdownMenuTrigger asChild>
                 <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 justify-center p-0">{unreadCount}</Badge>
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length > 0 ? (
                    notifications.map(n => (
                        <DropdownMenuItem key={n.id} className="flex items-start gap-2">
                            <div className="flex-shrink-0 pt-1">
                                <ShoppingBag className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-grow">
                                <p className="text-sm font-medium">{n.message}</p>
                                <p className="text-xs text-muted-foreground">from {n.sender} &middot; {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}</p>
                            </div>
                            {!n.read && <div className="h-2 w-2 rounded-full bg-primary mt-1 flex-shrink-0"></div>}
                        </DropdownMenuItem>
                    ))
                ) : (
                    <p className="p-4 text-center text-sm text-muted-foreground">No new notifications</p>
                )}
            </DropdownMenuContent>
        </DropdownMenu>

        
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="flex items-center gap-2 p-1 h-auto rounded-full">
                    <UserCircle className="h-8 w-8 text-muted-foreground" />
                     <div className="hidden md:flex flex-col text-sm items-start">
                        <span className="font-semibold">{user?.name || 'User'}</span>
                        <span className="text-xs text-muted-foreground">{user?.role || 'Account'} Account</span>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/change-password')}>
                    <Lock className="mr-2 h-4 w-4" />
                    <span>Change Password</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
}
