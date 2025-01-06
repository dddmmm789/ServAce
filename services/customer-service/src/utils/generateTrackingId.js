function generateTrackingId() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `CUS-${timestamp}-${randomStr}`.toUpperCase();
}

module.exports = generateTrackingId; 