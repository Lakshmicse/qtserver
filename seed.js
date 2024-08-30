const mongoose = require('mongoose');
const { ProductCategory, Brand, ProductColor, IdealFor, Product, Image, ProductInfo, ProductSpec, Cart } = require('./src/models/index');

const mongoURI = 'mongodb+srv://chetansorabad98:S07V7Tj9nmFIcAU8@cluster0.qe5nusy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const seedDatabase = async () => {
  try {
    // Clear existing data
    await ProductCategory.deleteMany({});
    await Brand.deleteMany({});
    await ProductColor.deleteMany({});
    await IdealFor.deleteMany({});
    await Product.deleteMany({});
    await Image.deleteMany({});
    await ProductInfo.deleteMany({});
    await ProductSpec.deleteMany({});

    // Create sample categories
    const categories = await ProductCategory.insertMany([
      { name: 'Electronics' },
      { name: 'Clothing' },
      { name: 'Books' },
      { name: 'Home Appliances' }
    ]);

   

    // Create sample brands
    const brands = await Brand.insertMany([
      { name: 'Samsung' },
      { name: 'Apple' },
      { name: 'Nike' },
      { name: 'Adidas' }
    ]);

    // Create sample colors
    const colors = await ProductColor.insertMany([
      { colorName: 'Red', hexCode: '#FF0000' },
      { colorName: 'Green', hexCode: '#00FF00' },
      { colorName: 'Blue', hexCode: '#0000FF' },
      { colorName: 'Black', hexCode: '#000000' }
    ]);

    // Create sample idealFor
    const idealFors = await IdealFor.insertMany([
      { name: 'Men' },
      { name: 'Women' },
      { name: 'Kids' }
    ]);

    // Create sample images
    const images = await Image.insertMany([
      { src: 'image1.jpg' },
      { src: 'image2.jpg' }
    ]);

    // Create sample product info
    const productInfos = await ProductInfo.insertMany([
      { title: 'Info Title 1', desc: 'Info Description 1' },
      { title: 'Info Title 2', desc: 'Info Description 2' }
    ]);

    // Create sample product specifications
    const productSpecs = await ProductSpec.insertMany([
      { title: 'Spec Title 1', desc: 'Spec Description 1' },
      { title: 'Spec Title 2', desc: 'Spec Description 2' }
    ]);

    // Create sample products
    await Product.create({
      createdAt: new Date(),
      inStock: true,
      category: categories[0]._id,
      title: 'Samsung Galaxy S21',
      description: 'Latest Samsung smartphone with advanced features.',
      mrp: 799.99,
      brand: brands[0]._id,
      ideaFor: idealFors[0]._id,
      discount: '10%',
      rating: 4.5,
      reviews: 123,
      color: colors[0]._id,
      image: images.map(img => img._id),
      SKU: 'SGS21',
      productInfo: productInfos.map(info => info._id),
      productSpec: productSpecs.map(spec => spec._id)
    });

    console.log('Database seeded successfully.');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
};


const seedCart = async () => {
  const seedData = [
    {
      title: 'Product 1',
      mrp: 100,
      discount: '10%',
      brand: 'Brand A',
      image: 'image1_url',
      count: 2,
    },
    {
      title: 'Product 2',
      mrp: 200,
      discount: '15%',
      brand: 'Brand B',
      image: 'image2_url',
      count: 1,
    },
    {
      title: 'Product 3',
      mrp: 150,
      discount: '5%',
      brand: 'Brand C',
      image: 'image3_url',
      count: 3,
    },
    // Add more items as needed
  ];
  
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

    // Clear existing data
    await Cart.deleteMany({});

    // Insert seed data
    await Cart.insertMany(seedData);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
  }
};


seedCart();
// seedDatabase();
