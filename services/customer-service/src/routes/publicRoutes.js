router.get('/api/track/:trackingId', async (req, res) => {
  try {
    const { trackingId } = req.params;
    
    const customer = await Customer.findOne({ trackingId });
    if (!customer) {
      return res.status(404).json({ message: 'Tracking ID not found' });
    }
    
    // Get associated job details
    const job = await Job.findOne({ 
      customerId: customer._id,
      status: { $in: ['pending', 'in_progress', 'completed'] }
    }).populate('locksmithId', 'name phone rating');
    
    return res.status(200).json({
      job: {
        status: job.status,
        eta: job.eta,
        locksmith: {
          name: job.locksmithId.name,
          phone: job.locksmithId.phone,
          rating: job.locksmithId.rating
        },
        location: job.location
      }
    });
    
  } catch (error) {
    logger.error('Error fetching tracking info:', error);
    return res.status(500).json({ message: 'Error fetching tracking information' });
  }
}); 