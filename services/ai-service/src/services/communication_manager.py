from typing import Dict, Any
import openai
from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse, Gather
from datetime import datetime, timedelta

class CommunicationManager:
    def __init__(self, config: Dict[str, str]):
        self.openai = openai
        self.openai.api_key = config['OPENAI_API_KEY']
        self.twilio_client = Client(
            config['TWILIO_ACCOUNT_SID'],
            config['TWILIO_AUTH_TOKEN']
        )
        self.twilio_phone = config['TWILIO_PHONE_NUMBER']
        
    async def handle_incoming_sms(self, message: str, from_number: str) -> Dict[str, Any]:
        """Handle incoming SMS from lead suppliers or customers"""
        # Generate AI response using context
        response = await self._generate_ai_response({
            "role": "system",
            "content": "You are a professional locksmith service assistant. Be concise and helpful."
        }, message)
        
        # Send SMS response
        self._send_sms(from_number, response)
        
        return {"status": "success", "response": response}
    
    async def handle_incoming_call(self) -> VoiceResponse:
        """Handle incoming voice calls with AI conversation"""
        response = VoiceResponse()
        gather = Gather(
            input='speech',
            action='/api/voice/process',
            language='en-US',
            speechTimeout='auto'
        )
        
        gather.say(
            'Hello, thank you for calling our locksmith service. '
            'Please describe how we can help you today.'
        )
        
        response.append(gather)
        return response
    
    async def process_voice_input(self, speech_result: str) -> VoiceResponse:
        """Process voice input and generate AI response"""
        response = VoiceResponse()
        
        ai_response = await self._generate_ai_response({
            "role": "system",
            "content": "You are a professional locksmith service assistant. Keep responses under 30 seconds when spoken."
        }, speech_result)
        
        response.say(ai_response)
        return response
    
    async def schedule_service(self, customer_info: Dict[str, Any]) -> Dict[str, Any]:
        """Schedule service and notify customer"""
        # TODO: Integrate with job scheduling service
        estimated_arrival = datetime.now() + timedelta(minutes=30)
        
        # Send confirmation to customer
        message = (
            f"Your locksmith service has been scheduled. "
            f"Estimated arrival: {estimated_arrival.strftime('%I:%M %p')}. "
            "We'll send you updates on the technician's arrival."
        )
        self._send_sms(customer_info['phone'], message)
        
        return {
            "status": "scheduled",
            "estimated_arrival": estimated_arrival.isoformat()
        }
    
    async def notify_technician(self, tech_phone: str, job_details: Dict[str, Any]) -> None:
        """Notify technician about new job or updates"""
        message = (
            f"New job assigned:\n"
            f"Location: {job_details['location']}\n"
            f"Service: {job_details['service_type']}\n"
            f"Customer: {job_details['customer_name']}\n"
            f"ETA: {job_details['eta']}"
        )
        self._send_sms(tech_phone, message)
    
    def _send_sms(self, to_number: str, message: str) -> None:
        """Send SMS using Twilio"""
        self.twilio_client.messages.create(
            body=message,
            from_=self.twilio_phone,
            to=to_number
        )
    
    async def _generate_ai_response(self, system_prompt: Dict[str, str], user_message: str) -> str:
        """Generate AI response using OpenAI"""
        response = await openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                system_prompt,
                {"role": "user", "content": user_message}
            ],
            max_tokens=150,
            temperature=0.7
        )
        return response.choices[0].message.content 