import torch
import torch.nn as nn
from datetime import datetime, timedelta
import pandas as pd
import numpy as np

class DemandPredictionModel(nn.Module):
    def __init__(self, input_size=10, hidden_size=64, num_layers=2, output_size=24):
        super().__init__()
        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
            dropout=0.2
        )
        self.fc = nn.Linear(hidden_size, output_size)
        
    def forward(self, x):
        lstm_out, _ = self.lstm(x)
        predictions = self.fc(lstm_out[:, -1, :])
        return predictions

class DemandPredictor:
    def __init__(self):
        self.model = DemandPredictionModel()
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model.to(self.device)
        
    def prepare_features(self, historical_data):
        """
        Prepare features from historical data including:
        - Time of day
        - Day of week
        - Weather
        - Historical demand
        - Special events
        """
        features = []
        for data in historical_data:
            time_features = self._extract_time_features(data['timestamp'])
            weather_features = self._extract_weather_features(data['weather'])
            demand_features = self._extract_demand_features(data['demand'])
            
            combined_features = np.concatenate([
                time_features,
                weather_features,
                demand_features
            ])
            features.append(combined_features)
            
        return torch.FloatTensor(features).to(self.device)
    
    def predict_demand(self, historical_data):
        features = self.prepare_features(historical_data)
        with torch.no_grad():
            predictions = self.model(features.unsqueeze(0))
        return predictions.cpu().numpy() 