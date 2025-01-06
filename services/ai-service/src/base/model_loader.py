import torch
from transformers import AutoModel, AutoTokenizer
import os

class ModelLoader:
    def __init__(self):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.cache_dir = os.getenv('MODEL_CACHE_DIR', './models')
        
    def load_model(self, model_name, model_type="auto"):
        try:
            model = AutoModel.from_pretrained(model_name, cache_dir=self.cache_dir)
            tokenizer = AutoTokenizer.from_pretrained(model_name, cache_dir=self.cache_dir)
            model.to(self.device)
            return model, tokenizer
        except Exception as e:
            print(f"Error loading model {model_name}: {str(e)}")
            raise 