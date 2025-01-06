const config = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3004,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://review-db:27017/reviews',
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key'
};

module.exports = config; 