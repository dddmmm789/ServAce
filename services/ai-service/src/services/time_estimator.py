import torch
import torch.nn as nn
from torch.nn import TransformerEncoder, TransformerEncoderLayer

class ServiceTimeEstimator(nn.Module):
    def __init__(self, d_model=512, nhead=8, num_encoder_layers=6):
        super().__init__()
        encoder_layers = TransformerEncoderLayer(d_model, nhead)
        self.transformer = TransformerEncoder(encoder_layers, num_encoder_layers)
        self.time_head = nn.Linear(d_model, 1)
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.to(self.device)
        
    def prepare_job_features(self, job_data):
        """
        Extract features relevant for time estimation:
        - Service type
        - Lock type
        - Location details
        - Time of day
        - Traffic conditions
        - Historical service times
        """
        features = {
            'service_type': self._encode_service_type(job_data['service_type']),
            'lock_type': self._encode_lock_type(job_data['lock_type']),
            'location': self._encode_location(job_data['location']),
            'time_of_day': self._encode_time(job_data['scheduled_time']),
            'traffic': self._get_traffic_conditions(job_data['location'], job_data['scheduled_time']),
            'historical': self._get_historical_times(job_data['service_type'], job_data['lock_type'])
        }
        
        return torch.FloatTensor(self._combine_features(features)).to(self.device)
    
    def estimate_time(self, job_data):
        features = self.prepare_job_features(job_data)
        with torch.no_grad():
            encoded = self.transformer(features.unsqueeze(0))
            estimated_time = self.time_head(encoded[-1])
        
        return {
            'estimated_minutes': float(estimated_time.cpu().numpy()),
            'confidence_interval': self._calculate_confidence_interval(estimated_time)
        } 