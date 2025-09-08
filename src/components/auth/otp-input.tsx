'use client';

import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type OtpInputProps = {
  length: number;
  onComplete: (otp: string) => void;
  className?: string;
};

export default function OtpInput({ length, onComplete, className }: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value !== '' && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
    
    // Check if complete
    if (newOtp.every(digit => digit !== '')) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    // Focus previous input on backspace
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className={cn('flex justify-center gap-2', className)}>
      {otp.map((data, index) => {
        return (
          <Input
            key={index}
            type="text"
            maxLength={1}
            value={data}
            onChange={(e) => handleChange(e.target as HTMLInputElement, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={(e) => e.target.select()}
            ref={(el) => (inputsRef.current[index] = el)}
            className="w-12 h-12 text-center text-lg font-semibold"
          />
        );
      })}
    </div>
  );
}
