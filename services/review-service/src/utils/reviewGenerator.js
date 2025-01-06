const firstNames = [
  'John', 'Emma', 'Michael', 'Sarah', 'David', 'Lisa', 'James', 'Emily', 
  'Robert', 'Jessica', 'William', 'Ashley', 'Daniel', 'Rachel', 'Joseph',
  'Michelle', 'Thomas', 'Jennifer', 'Christopher', 'Elizabeth'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 
  'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'
];

const reviewTemplates = [
  "Great service! Very professional and quick.",
  "Arrived on time and solved the problem efficiently.",
  "Excellent work, fair price. Would recommend!",
  "Very knowledgeable and professional locksmith.",
  "Quick response time and quality service.",
  "Helped me when I was locked out, life saver!",
  "Professional, courteous, and efficient.",
  "Fair pricing and excellent workmanship.",
  "Trustworthy and reliable service.",
  "Got the job done quickly and professionally."
];

const generateRandomReview = () => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const fullName = `${firstName} ${lastName}`;
  
  // Generate rating between 4 and 5 to maintain high average
  const rating = Math.random() < 0.7 ? 5 : 4;
  
  // 30% chance of having no content (star-only review)
  const hasContent = Math.random() > 0.3;
  const content = hasContent ? 
    reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)] : 
    null;

  return {
    reviewerName: fullName,
    rating,
    content,
    isAdminGenerated: true,
    isVerifiedCustomer: true,
    status: 'approved'
  };
};

const generateMultipleReviews = (count, locksmithId) => {
  const reviews = [];
  for (let i = 0; i < count; i++) {
    const review = generateRandomReview();
    reviews.push({
      ...review,
      locksmithId,
      // Using dummy IDs for customer and job since these are admin-generated
      customerId: '000000000000000000000000',
      jobId: '000000000000000000000000',
      createdAt: new Date(Date.now() - Math.random() * 7776000000) // Random date within last 90 days
    });
  }
  return reviews;
};

module.exports = {
  generateMultipleReviews
};
