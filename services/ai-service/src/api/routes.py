from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from services.demand_prediction import DemandPredictor
from services.pricing_optimization import PricingOptimizer
from services.fraud_detection import FraudDetector
from services.time_estimator import ServiceTimeEstimator

app = FastAPI()

# Initialize services
demand_predictor = DemandPredictor()
pricing_optimizer = PricingOptimizer()
fraud_detector = FraudDetector()
time_estimator = ServiceTimeEstimator()

@app.post("/api/demand/predict")
async def predict_demand(data: Dict[str, Any]):
    try:
        predictions = demand_predictor.predict_demand(data['historical_data'])
        return {"predictions": predictions.tolist()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/pricing/optimize")
async def optimize_price(data: Dict[str, Any]):
    try:
        optimal_price = pricing_optimizer.optimize_price(data)
        return {"optimal_price": optimal_price}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/fraud/analyze")
async def analyze_transaction(data: Dict[str, Any]):
    try:
        risk_assessment = fraud_detector.analyze_transaction(data)
        return risk_assessment
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/service/estimate-time")
async def estimate_service_time(data: Dict[str, Any]):
    try:
        time_estimate = time_estimator.estimate_time(data)
        return time_estimate
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 