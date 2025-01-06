# ServAce

**ServAce** is an AI-powered platform designed to help solo service professionals like plumbers, locksmiths, and installation experts efficiently manage their business. Whether it's planning routes, managing expenses, sending notifications to customers, or scheduling jobs, ServAce leverages advanced **Generative AI** to make day-to-day tasks smarter, faster, and easier.

## Key Features

### 1. **AI-Powered Virtual Assistant**

ServAce includes a sophisticated AI virtual assistant that can:
- Handle incoming customer calls and SMS messages
- Conduct initial customer consultations
- Schedule appointments automatically
- Provide real-time ETA updates
- Notify technicians about schedule changes
- Process leads from various suppliers 📱🤖

### 2. **Smart Job Management**

- Automated scheduling and dispatch
- Real-time route optimization
- Intelligent workload distribution
- Automated customer updates 📅🚗

### 3. **Customer Communication**

- AI-powered phone system
- Automated SMS notifications
- Real-time ETA tracking
- Customer feedback collection 📞✉️

### 4. **Business Analytics**

- Demand prediction
- Price optimization
- Performance analytics
- Customer insights 📊💹

## Technical Architecture

The platform consists of several microservices:

- **AI Service**: Handles AI communications, scheduling, and decision-making
- **Job Service**: Manages job assignments and tracking
- **Customer Service**: Handles customer data and interactions
- **Route Planning**: Optimizes technician routes
- **Review Service**: Manages customer feedback
- **Dashboard Service**: Provides business analytics

## Setup Instructions

1. **Prerequisites**
   - Docker and Docker Compose
   - Node.js 16+
   - Python 3.9+
   - MongoDB

2. **Environment Setup**
   ```bash
   # Clone the repository
   git clone https://github.com/dddmmm789/ServAce.git
   cd ServAce

   # Copy environment files
   cp .env.example .env
   ```

3. **Configuration**
   Set up the following environment variables:
   - `OPENAI_API_KEY`: For AI capabilities
   - `TWILIO_ACCOUNT_SID`: For SMS/Voice
   - `TWILIO_AUTH_TOKEN`: For SMS/Voice
   - `TWILIO_PHONE_NUMBER`: Your Twilio number
   - `GOOGLE_MAPS_API_KEY`: For location services

4. **Running the Platform**
   ```bash
   # Start all services
   docker-compose up -d

   # Monitor logs
   docker-compose logs -f
   ```

5. **Webhook Configuration**
   Configure your Twilio webhooks:
   - Voice: `https://your-domain.com/webhook/voice`
   - SMS: `https://your-domain.com/webhook/sms`

## API Documentation

### Communication Endpoints

```
POST /api/sms/incoming      # Handle incoming SMS
POST /api/voice/incoming    # Handle incoming calls
POST /api/voice/process     # Process voice inputs
POST /api/schedule/service  # Schedule new service
POST /api/notify/technician # Send updates to technician
```

### Business Logic Endpoints

```
POST /api/demand/predict     # Predict service demand
POST /api/pricing/optimize   # Optimize service pricing
POST /api/service/estimate   # Estimate service duration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Support

For support, please open an issue in the repository or contact the maintainers.
