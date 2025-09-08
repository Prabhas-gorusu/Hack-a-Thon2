import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/logo';
import SignupForm from '@/components/auth/signup-form';
import { Button } from '@/components/ui/button';

export default function SignupPage({ params }: { params: { role: string } }) {
  const { role } = params;
  const isFarmer = role === 'farmer';
  const roleTitle = isFarmer ? 'Farmer' : 'Retailer';

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4">
       <div className="absolute top-4 left-4">
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
             <div className="mx-auto mb-4">
              <Logo />
            </div>
            <CardTitle className="text-2xl font-headline">Create a {roleTitle} Account</CardTitle>
            <CardDescription>
              {isFarmer
                ? 'Join our network to get AI insights and sell your produce.'
                : 'Sign up to source high-quality produce directly from farms.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm role={role as 'farmer' | 'retailer'} />
          </CardContent>
        </Card>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
