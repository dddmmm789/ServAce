const crypto = require('crypto');

const generateTrackingId = () => {
  // Format: LK-XXXXX-XXXXX (where X is alphanumeric)
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Removed confusing chars like 0,O,1,I
  const length = 5;
  
  // Generate cryptographically secure random bytes
  const getSecureRandomPart = () => {
    const bytes = crypto.randomBytes(length);
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[bytes[i] % chars.length];
    }
    return result;
  };

  const part1 = getSecureRandomPart();
  const part2 = getSecureRandomPart();
  
  // Add checksum digit for validation
  const combined = `${part1}${part2}`;
  const checksum = combined.split('')
    .reduce((acc, char) => acc + chars.indexOf(char), 0) % chars.length;
  
  return `LK-${part1}-${part2}${chars[checksum]}`;
};

// Validate tracking ID format and checksum
const isValidTrackingId = (trackingId) => {
  const pattern = /^LK-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{5}-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{5}[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]$/;
  
  if (!pattern.test(trackingId)) return false;
  
  const parts = trackingId.split('-');
  const combined = parts[1] + parts[2].slice(0, -1);
  const providedChecksum = chars.indexOf(parts[2].slice(-1));
  
  const calculatedChecksum = combined.split('')
    .reduce((acc, char) => acc + chars.indexOf(char), 0) % chars.length;
    
  return providedChecksum === calculatedChecksum;
};

module.exports = { generateTrackingId, isValidTrackingId }; 