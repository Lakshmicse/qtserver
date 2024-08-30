const mongoose = require('mongoose');

const {User , Address } = require('./src/models/index');


// Connect to MongoDB
mongoose.connect('mongodb+srv://chetansorabad98:S07V7Tj9nmFIcAU8@cluster0.qe5nusy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Seed function
const seedAddresses = async () => {
  try {
    // Find the user
    const user = await User.findOne({ email: 'admin@demo.com' });
    if (!user) {
      console.error('User not found');
      return;
    }

    // Create the Shipping address
    const shippingAddress = new Address({
      userId: user._id,
      addressType: 'Shipping',
      addressLine1: '123 Main St',
      addressLine2: 'Apt 4B',
      city: 'Anytown',
      state: 'Anystate',
      postalCode: '12345',
      country: 'USA',
      phoneNumber: '123-456-7890',
    });

    // Create the Billing address
    const billingAddress = new Address({
      userId: user._id,
      addressType: 'Billing',
      addressLine1: '456 Secondary St',
      addressLine2: '',
      city: 'Othertown',
      state: 'Otherstate',
      postalCode: '67890',
      country: 'USA',
      phoneNumber: '987-654-3210',
    });

    // Save both addresses
    await shippingAddress.save();
    await billingAddress.save();
    console.log('Shipping and Billing addresses seeded successfully');
  } catch (error) {
    console.error('Error seeding addresses:', error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

// Run the seed function
seedAddresses();
