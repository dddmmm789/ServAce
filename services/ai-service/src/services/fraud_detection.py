from transformers import AutoModelForSequenceClassification
import torch
import torch.nn.functional as F
import numpy as np

class FraudDetector:
    def __init__(self):
        self.model_name = "fraud-detection-model"
        self.model = AutoModelForSequenceClassification.from_pretrained(self.model_name)
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model.to(self.device)
        
    def extract_transaction_features(self, transaction_data):
        """
        Extract features from transaction data:
        - Transaction amount
        - Location patterns
        - Time patterns
        - Device information
        - Customer history
        """
        features = {
            'amount': self._normalize_amount(transaction_data['amount']),
            'location': self._encode_location(transaction_data['location']),
            'time_patterns': self._extract_time_patterns(transaction_data['timestamp']),
            'device_info': self._encode_device_info(transaction_data['device']),
            'customer_history': self._analyze_customer_history(transaction_data['customer_id'])
        }
        
        return self._combine_features(features)
    
    def analyze_transaction(self, transaction_data):
        features = self.extract_transaction_features(transaction_data)
        features_tensor = torch.FloatTensor(features).to(self.device)
        
        with torch.no_grad():
            outputs = self.model(features_tensor)
            risk_scores = F.softmax(outputs.logits, dim=1)
            
        risk_assessment = {
            'risk_score': float(risk_scores[0][1]),  # Probability of fraud
            'confidence': float(torch.max(risk_scores)),
            'flags': self._identify_risk_factors(transaction_data, risk_scores)
        }
        
        return risk_assessment 