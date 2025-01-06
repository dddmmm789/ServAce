import torch
import torch.nn as nn
import torch.optim as optim
from sklearn.preprocessing import StandardScaler
import numpy as np

class PricingModel(nn.Module):
    def __init__(self, input_size=15):
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(input_size, 128),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Linear(64, 1),
            nn.ReLU()  # Ensure positive prices
        )
        
    def forward(self, x):
        return self.network(x)

class PricingOptimizer:
    def __init__(self):
        self.model = PricingModel()
        self.scaler = StandardScaler()
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model.to(self.device)
        
    def prepare_pricing_features(self, job_data):
        """
        Extract features relevant for pricing:
        - Service type
        - Time of day
        - Location
        - Demand level
        - Competition pricing
        - Customer history
        """
        features = {
            'service_type': self._encode_service_type(job_data['service_type']),
            'time_features': self._extract_time_features(job_data['timestamp']),
            'location_features': self._extract_location_features(job_data['location']),
            'demand_features': self._extract_demand_features(job_data['demand']),
            'competition_features': self._extract_competition_features(job_data['competition'])
        }
        
        return torch.FloatTensor(self._combine_features(features)).to(self.device)
    
    def optimize_price(self, job_data):
        features = self.prepare_pricing_features(job_data)
        with torch.no_grad():
            optimal_price = self.model(features)
        return float(optimal_price.cpu().numpy()) 