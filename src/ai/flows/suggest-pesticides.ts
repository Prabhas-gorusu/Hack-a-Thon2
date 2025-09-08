'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting pesticides based on the crop being grown and the prevalent pests in the locality.
 *
 * - suggestPesticides - A function that handles the pesticide suggestion process.
 * - SuggestPesticidesInput - The input type for the suggestPesticides function.
 * - SuggestPesticidesOutput - The return type for the suggestPesticides function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPesticidesInputSchema = z.object({
  crop: z.string().describe('The crop being grown.'),
  pests: z.string().describe('The prevalent pests in the locality.'),
});
export type SuggestPesticidesInput = z.infer<typeof SuggestPesticidesInputSchema>;

const SuggestPesticidesOutputSchema = z.object({
  pesticideSuggestions: z.array(z.string()).describe('A list of pesticide suggestions.'),
  reasoning: z.string().describe('The reasoning behind the pesticide suggestions.'),
});
export type SuggestPesticidesOutput = z.infer<typeof SuggestPesticidesOutputSchema>;

export async function suggestPesticides(input: SuggestPesticidesInput): Promise<SuggestPesticidesOutput> {
  return suggestPesticidesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPesticidesPrompt',
  input: {schema: SuggestPesticidesInputSchema},
  output: {schema: SuggestPesticidesOutputSchema},
  prompt: `You are an expert agricultural advisor. Your task is to act like a search engine. A farmer is growing {{crop}} and is experiencing issues with the following pests: {{pests}}. Based on this information, provide a list of pesticide suggestions and the reasoning behind each suggestion.\n\nPesticide Suggestions:`,
});

const suggestPesticidesFlow = ai.defineFlow(
  {
    name: 'suggestPesticidesFlow',
    inputSchema: SuggestPesticidesInputSchema,
    outputSchema: SuggestPesticidesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
