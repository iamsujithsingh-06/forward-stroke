import 'dotenv/config';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

const JERSEY_TYPES = [
  'ODI Jersey',
  'T20 Jersey',
  'Test Jersey',
  'ODI World Cup Jersey',
  'T20 World Cup Jersey',
  'Champions Trophy Jersey',
];

const COUNTRIES = [
  'India', 'Australia', 'England', 'Pakistan', 'New Zealand',
  'South Africa', 'Sri Lanka', 'Afghanistan', 'Bangladesh', 'Ireland',
];

const IPL_TEAMS = [
  { name: 'Chennai Super Kings', slug: 'CSK' },
  { name: 'Royal Challengers Bengaluru', slug: 'RCB' },
  { name: 'Mumbai Indians', slug: 'MI' },
  { name: 'Kolkata Knight Riders', slug: 'KKR' },
  { name: 'Sunrisers Hyderabad', slug: 'SRH' },
  { name: 'Rajasthan Royals', slug: 'RR' },
  { name: 'Punjab Kings', slug: 'PBKS' },
  { name: 'Delhi Capitals', slug: 'DC' },
  { name: 'Lucknow Super Giants', slug: 'LSG' },
  { name: 'Gujarat Titans', slug: 'GT' },
];

const ACCESSORY_TYPES = [
  { name: 'Cricket Bat', category: 'bat' },
  { name: 'Batting Gloves', category: 'gloves' },
  { name: 'Wicket Keeping Gloves', category: 'keeping-gloves' },
  { name: 'Helmet', category: 'helmet' },
  { name: 'Kit Bag', category: 'kit-bag' },
  { name: 'Team Cap', category: 'cap' },
  { name: 'Wrist Band', category: 'wrist-band' },
  { name: 'Water Bottle', category: 'bottle' },
  { name: 'Cricket Towel', category: 'towel' },
  { name: 'Keychain', category: 'keychain' },
];

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const products = [];

// International jerseys: 10 countries × 6 types = 60
for (const country of COUNTRIES) {
  for (const jersey of JERSEY_TYPES) {
    const name = `${country} ${jersey}`;
    const price = rand(1499, 4999);
    products.push({
      name,
      slug: slugify(name),
      description: `Official ${country} ${jersey}. Show your national pride with this premium, high-performance cricket jersey featuring authentic team colours and design.`,
      price,
      comparePrice: price + rand(500, 1500),
      category: 'international-jersey',
      country,
      team: '',
      images: [`https://placehold.co/400x500/1e293b/38bdf8?text=${encodeURIComponent(country + '+' + jersey.replace(/\s/g, '+'))}`],
      stock: rand(10, 100),
      rating: parseFloat((4 + Math.random()).toFixed(1)),
      featured: jersey === 'ODI Jersey' || jersey === 'T20 Jersey',
      tags: [country.toLowerCase(), 'jersey', 'international', jersey.toLowerCase().replace(/\s+/g, '-')],
    });
  }
}

// IPL products: 10 teams × 2 types = 20
for (const team of IPL_TEAMS) {
  const jerseyName = `${team.name} Match Jersey`;
  products.push({
    name: jerseyName,
    slug: slugify(jerseyName),
    description: `Official ${team.name} Match Jersey. Rep your franchise in authentic IPL match-day gear with premium fabric and team branding.`,
    price: rand(1999, 3999),
    comparePrice: rand(2499, 4999),
    category: 'ipl-jersey',
    country: '',
    team: team.name,
    images: [`https://placehold.co/400x500/1e293b/f97316?text=${encodeURIComponent(team.slug + '+Jersey')}`],
    stock: rand(10, 80),
    rating: parseFloat((4 + Math.random()).toFixed(1)),
    featured: true,
    tags: [team.slug.toLowerCase(), 'ipl', 'jersey', 'match-jersey'],
  });

  const kitName = `${team.name} Training Kit`;
  products.push({
    name: kitName,
    slug: slugify(kitName),
    description: `Official ${team.name} Training Kit. Stay comfortable during practice sessions with this lightweight, breathable training gear.`,
    price: rand(2499, 4499),
    comparePrice: rand(2999, 5499),
    category: 'ipl-training-kit',
    country: '',
    team: team.name,
    images: [`https://placehold.co/400x500/1e293b/f97316?text=${encodeURIComponent(team.slug + '+Kit')}`],
    stock: rand(5, 50),
    rating: parseFloat((4 + Math.random()).toFixed(1)),
    featured: false,
    tags: [team.slug.toLowerCase(), 'ipl', 'training-kit'],
  });
}

// Accessories: ~20 products across 10 types
const accessoryBrands = [...COUNTRIES, ...IPL_TEAMS.map((t) => t.slug)];

for (let i = 0; i < 20; i++) {
  const acc = ACCESSORY_TYPES[i % ACCESSORY_TYPES.length];
  const brand = accessoryBrands[i % accessoryBrands.length];
  const name = `${brand} ${acc.name}`;
  const price = acc.category === 'bat' ? rand(2999, 8999) :
                acc.category === 'kit-bag' ? rand(1999, 4999) :
                acc.category === 'helmet' ? rand(1499, 3499) :
                rand(299, 1499);

  products.push({
    name,
    slug: slugify(name),
    description: `Premium ${brand} ${acc.name.toLowerCase()}. Designed for cricket enthusiasts who value quality and style.`,
    price,
    comparePrice: price + rand(200, 1000),
    category: 'accessories',
    country: i < 10 ? COUNTRIES[i % COUNTRIES.length] : '',
    team: i >= 10 ? IPL_TEAMS[i % IPL_TEAMS.length].name : '',
    images: [`https://placehold.co/400x500/1e293b/94a3b8?text=${encodeURIComponent(brand + '+' + acc.name.replace(/\s/g, '+'))}`],
    stock: rand(15, 120),
    rating: parseFloat((4 + Math.random()).toFixed(1)),
    featured: i < 5,
    tags: [acc.category, 'accessory', brand.toLowerCase()],
  });
}

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is required');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Cleared existing products');

    const created = await Product.insertMany(products);
    console.log(`Seeded ${created.length} products`);

    await mongoose.disconnect();
    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
