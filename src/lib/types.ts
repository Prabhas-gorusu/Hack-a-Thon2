export type Crop = {
  name: string;
  details: {
    growthPeriod: string;
    weatherNeeds: string;
    irrigationNeeds: string;
    fertilizerRecs: string;
    harvestPrediction: string;
  };
};

export type ThreshingProduct = {
  id: string;
  type: string;
  quantity: number;
  price: number;
  farmer: string;
  location: string;
};

export type Notification = {
    id: string;
    recipient: string; // The name of the user receiving the notification
    sender: string;
    message: string;
    timestamp: number;
    read: boolean;
    link?: string;
};
