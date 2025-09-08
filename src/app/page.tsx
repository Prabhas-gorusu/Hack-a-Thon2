import Link from 'next/link';
import { Tractor, Store, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/logo';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 flex justify-between items-center">
        <Logo />
        <Link href="/login">
          <Button variant="ghost">Log In</Button>
        </Link>
      </header>
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="text-center max-w-4xl mx-auto">
          <Leaf className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-4 text-4xl font-headline font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
            Welcome to AgriLink
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            The all-in-one platform connecting farmers and retailers. Get AI-powered crop predictions, manage your sales, and grow your business.
          </p>
          <p className="mt-8 font-semibold text-lg">Choose your role to get started:</p>
          <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <RoleCard
              role="farmer"
              title="I am a Farmer"
              description="Get crop suggestions, weather insights, and sell your produce directly."
              icon={<Tractor className="h-12 w-12" />}
            />
            <RoleCard
              role="retailer"
              title="I am a Retailer"
              description="Find and purchase high-quality threshing directly from local farmers."
              icon={<Store className="h-12 w-12" />}
            />
          </div>
        </div>
      </main>
      <footer className="p-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} AgriLink. All rights reserved.
      </footer>
    </div>
  );
}

function RoleCard({ role, title, description, icon }: { role: 'farmer' | 'retailer', title: string, description: string, icon: React.ReactNode }) {
  return (
    <Link href={`/signup/${role}`} className="block">
      <Card className="text-left hover:shadow-lg hover:border-primary transition-all duration-300 h-full">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="text-primary bg-primary/10 p-3 rounded-lg">
            {icon}
          </div>
          <CardTitle className="font-headline text-2xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{description}</p>
          <Button className="mt-4">
            Sign up as a {role.charAt(0).toUpperCase() + role.slice(1)}
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
