from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import Dict, Any
from services.demand_prediction import DemandPredictor
from services.pricing_optimization import PricingOptimizer
from services.fraud_detection import FraudDetector
from services.time_estimator import ServiceTimeEstimator
from services.communication_manager import CommunicationManager
import os

app = FastAPI()

# Initialize services
demand_predictor = DemandPredictor()
pricing_optimizer = PricingOptimizer()
fraud_detector = FraudDetector()
time_estimator = ServiceTimeEstimator()
comm_manager = CommunicationManager({
    'OPENAI_API_KEY': os.getenv('OPENAI_API_KEY'),
    'TWILIO_ACCOUNT_SID': os.getenv('TWILIO_ACCOUNT_SID'),
    'TWILIO_AUTH_TOKEN': os.getenv('TWILIO_AUTH_TOKEN'),
    'TWILIO_PHONE_NUMBER': os.getenv('TWILIO_PHONE_NUMBER')
})

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

# New Communication Routes
@app.post("/api/sms/incoming")
async def handle_incoming_sms(request: Request):
    """Handle incoming SMS messages"""
    form_data = await request.form()
    message = form_data.get('Body', '')
    from_number = form_data.get('From', '')
    
    try:
        result = await comm_manager.handle_incoming_sms(message, from_number)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/voice/incoming")
async def handle_incoming_call(request: Request):
    """Handle incoming voice calls"""
    try:
        response = await comm_manager.handle_incoming_call()
        return response.to_xml()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/voice/process")
async def process_voice_input(request: Request):
    """Process voice input and respond"""
    form_data = await request.form()
    speech_result = form_data.get('SpeechResult', '')
    
    try:
        response = await comm_manager.process_voice_input(speech_result)
        return response.to_xml()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/schedule/service")
async def schedule_service(customer_info: Dict[str, Any]):
    """Schedule a service and notify customer"""
    try:
        result = await comm_manager.schedule_service(customer_info)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/notify/technician")
async def notify_technician(data: Dict[str, Any]):
    """Notify technician about new job or updates"""
    try:
        await comm_manager.notify_technician(data['tech_phone'], data['job_details'])
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 