
'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getPesticideSuggestions, getPesticideSuggestionsFromImage } from '@/lib/actions';
import type { FormState } from '@/lib/types';
import { Bug, Bot, Loader2, ImageUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

const initialFormState: FormState = {
  status: 'idle',
  message: '',
};

function SubmitButton({ formId }: { formId: 'text' | 'image' }) {
  const { pending, action } = useFormStatus();
  
  let isPendingForThisForm = false;
  if(pending) {
    const targetAction = formId === 'text' ? getPesticideSuggestions : getPesticideSuggestionsFromImage;
    if (action === targetAction) {
      isPendingForThisForm = true;
    }
  }

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {isPendingForThisForm ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
      Get Suggestions
    </Button>
  );
}

export default function PesticideSuggestion() {
  const [textState, textFormAction] = useActionState(getPesticideSuggestions, initialFormState);
  const [imageState, imageFormAction] = useActionState(getPesticideSuggestionsFromImage, initialFormState);
  
  const { toast } = useToast();
  const textFormRef = useRef<HTMLFormElement>(null);
  const imageFormRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [showTextResults, setShowTextResults] = useState(false);
  const [showImageResults, setShowImageResults] = useState(false);


  useEffect(() => {
    if (textState.status === 'success') {
      toast({
        title: "Suggestions Ready!",
        description: textState.message,
      });
      setShowTextResults(true);
      setShowImageResults(false); 
      textFormRef.current?.reset();
      imageFormRef.current?.reset();
      setImagePreview(null);
    } else if (textState.status === 'error') {
      toast({
        title: "Error",
        description: textState.message,
        variant: "destructive",
      });
      setShowTextResults(false);
    }
  }, [textState, toast]);

  useEffect(() => {
      if (imageState.status === 'success') {
        toast({
            title: "Suggestions Ready!",
            description: imageState.message,
        });
        setShowImageResults(true);
        setShowTextResults(false);
        imageFormRef.current?.reset();
        textFormRef.current?.reset();
        setImagePreview(null);
    } else if (imageState.status === 'error') {
        toast({
            title: "Error",
            description: imageState.message,
            variant: "destructive",
        });
        setShowImageResults(false);
    }
  }, [imageState, toast]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const currentResults = showImageResults ? imageState : (showTextResults ? textState : null);
  const resultSource = showImageResults ? 'Image' : (showTextResults ? 'Text' : '');

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Bug className="text-primary" />
          AI Pesticide Suggestions
        </CardTitle>
        <CardDescription>Describe your pest problem or upload an image for AI-powered solutions.</CardDescription>
      </CardHeader>
      
      <div className="px-6 space-y-4 flex-grow overflow-y-auto pb-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Option 1: Use Image
            </span>
          </div>
        </div>

        <form action={imageFormAction} ref={imageFormRef}>
          <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="image">Upload Plant/Pest Image</Label>
                <div 
                    className="mt-2 flex justify-center rounded-lg border border-dashed border-input px-6 py-10 cursor-pointer hover:border-primary"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="text-center">
                        {imagePreview ? (
                            <Image src={imagePreview} alt="Selected plant" width={200} height={200} className="mx-auto h-24 w-auto rounded-md"/>
                        ) : (
                            <ImageUp className="mx-auto h-12 w-12 text-muted-foreground" />
                        )}
                        <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                            <p className="pl-1">{imagePreview ? 'Click to change image' : 'Click to upload an image'}</p>
                        </div>
                        <p className="text-xs leading-5 text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                    </div>
                </div>
                <Input ref={fileInputRef} id="photo" name="photo" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" required/>
            </div>
             <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input id="description" name="description" placeholder="e.g., Leaves are yellowing" />
            </div>
            <SubmitButton formId="image" />
          </div>
        </form>

        <div className="relative pt-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Option 2: Use Text
            </span>
          </div>
        </div>

        <form ref={textFormRef} action={textFormAction}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="crop">Crop Name</Label>
              <Input id="crop" name="crop" placeholder="e.g., Wheat" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pests">Prevalent Pests</Label>
              <Input id="pests" name="pests" placeholder="e.g., Aphids, Rust fungus" required />
            </div>
             <div className="pt-4">
                <SubmitButton formId="text" />
            </div>
          </div>
        </form>

         {currentResults && currentResults.status === 'success' && currentResults.data?.pesticideSuggestions && (
            <div className="space-y-4 pt-4">
                <div>
                  <h3 className="font-semibold mb-2">Suggestions from {resultSource}:</h3>
                  <ul className="space-y-1 list-disc list-inside text-sm">
                      {currentResults.data.pesticideSuggestions.map((suggestion: string, index: number) => (
                      <li key={`${resultSource}-${index}`}>{suggestion}</li>
                      ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Reasoning:</h3>
                  <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">{currentResults.data.reasoning}</p>
                </div>
            </div>
        )}
      </div>

    </Card>
  );
}
