import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-crops.ts';
import '@/ai/flows/suggest-pesticides.ts';
import '@/ai/flows/diagnose-plant-health.ts';
import '@/ai/flows/get-crop-details.ts';
