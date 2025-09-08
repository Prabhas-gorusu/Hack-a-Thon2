
import DashboardHeader from '@/components/shared/dashboard-header';
import ThreshingSearch from '@/components/retailer/threshing-search';
import { ThreshingProduct } from '@/lib/types';

const MOCK_PRODUCTS: ThreshingProduct[] = [
  { id: '1', type: 'Paddy Husk', quantity: 25000, price: 11, farmer: 'Srinivas Farms', location: 'Guntur, AP' },
  { id: '2', type: 'Rice Straw', quantity: 20000, price: 12, farmer: 'Lakshmi Agriculture', location: 'Vijayawada, AP' },
  { id: '3', type: 'Maize Stover', quantity: 18000, price: 13, farmer: 'Reddy Agro', location: 'Visakhapatnam, AP' },
  { id: '4', type: 'Groundnut Shells', quantity: 30000, price: 9, farmer: 'Anantapur Fields', location: 'Anantapur, AP' },
  { id: '5', type: 'Cotton Stalks', quantity: 15000, price: 14, farmer: 'Kurnool Growers', location: 'Kurnool, AP' },
  { id: '6', type: 'Sugarcane Trash', quantity: 22000, price: 10, farmer: 'Tirupati Sugars', location: 'Tirupati, AP' },
  { id: '7', type: 'Paddy Husk', quantity: 12000, price: 11.5, farmer: 'Nellore Harvest', location: 'Nellore, AP' },
  { id: '8', type: 'Rice Straw', quantity: 17000, price: 12.5, farmer: 'Rajahmundry Farms', location: 'Rajahmundry, AP' },
  { id: '9', type: 'Maize Stover', quantity: 28000, price: 13.5, farmer: 'Kakinada Crops', location: 'Kakinada, AP' },
  { id: '10', type: 'Groundnut Shells', quantity: 24000, price: 9.5, farmer: 'Chittoor Agro', location: 'Chittoor, AP' },
  { id: '11', type: 'Cotton Stalks', quantity: 19000, price: 14.5, farmer: 'Guntur Cotton Co.', location: 'Guntur, AP' },
  { id: '12', type: 'Sugarcane Trash', quantity: 16000, price: 10.5, farmer: 'Godavari Sugars', location: 'Vijayawada, AP' },
  { id: '13', type: 'Paddy Husk', quantity: 35000, price: 10.8, farmer: 'Rayalaseema Farms', location: 'Anantapur, AP' },
  { id: '14', type: 'Rice Straw', quantity: 21000, price: 12.2, farmer: 'Krishna Delta Farms', location: 'Kurnool, AP' },
  { id: '15', type: 'Maize Stover', quantity: 14000, price: 13.2, farmer: 'Coastal Agro', location: 'Tirupati, AP' },
];


export default function RetailerDashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader role="Retailer" />
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold font-headline mb-6">Threshing Marketplace</h1>
          <ThreshingSearch products={MOCK_PRODUCTS} />
        </div>
      </main>
    </div>
  );
}
