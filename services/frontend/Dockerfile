FROM node:18-alpine

# Install network tools
RUN apk add --no-cache iputils

# Install curl for testing
RUN apk add --no-cache curl

WORKDIR /app

# Add environment variable for build time
ARG REACT_APP_GOOGLE_MAPS_API_KEY
ENV REACT_APP_GOOGLE_MAPS_API_KEY=$REACT_APP_GOOGLE_MAPS_API_KEY

COPY package*.json ./
RUN npm install
RUN npm install react-places-autocomplete@7.3.0

COPY . .

EXPOSE 3000

CMD ["npm", "start"]