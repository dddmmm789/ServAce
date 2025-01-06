class LocationTracker {
    constructor(jobId, token) {
        this.jobId = jobId;
        this.token = token;
        this.tracking = false;
        this.updateInterval = null;
    }

    start() {
        if (!this.tracking && "geolocation" in navigator) {
            this.tracking = true;
            
            // Update immediately
            this.updateLocation();
            
            // Then update every 30 seconds
            this.updateInterval = setInterval(() => {
                this.updateLocation();
            }, 30000);
            
            return true;
        }
        return false;
    }

    stop() {
        this.tracking = false;
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    async updateLocation() {
        if (!this.tracking) return;

        try {
            const position = await this.getCurrentPosition();
            const response = await fetch('/api/tracking/location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({
                    jobId: this.jobId,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update location');
            }

            const data = await response.json();
            console.log('Location updated:', data);
            
            // Dispatch event for UI updates
            const event = new CustomEvent('locationUpdated', { 
                detail: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    timestamp: new Date()
                }
            });
            window.dispatchEvent(event);

        } catch (error) {
            console.error('Location update failed:', error);
            // Dispatch error event
            const event = new CustomEvent('locationError', { 
                detail: { error: error.message }
            });
            window.dispatchEvent(event);
        }
    }

    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        });
    }
}

// Usage example:
/*
const tracker = new LocationTracker('job123', 'your-auth-token');

// Start tracking
tracker.start();

// Listen for updates
window.addEventListener('locationUpdated', (event) => {
    console.log('New location:', event.detail);
});

// Listen for errors
window.addEventListener('locationError', (event) => {
    console.error('Location error:', event.detail.error);
});

// Stop tracking when done
// tracker.stop();
*/ 