import User from '../models/User.js';
import Product from '../models/Product.js';
import Post from '../models/Post.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';

const USERS = [
  { name: 'Admin', email: 'admin@forwardstroke.com', password: 'password123', role: 'admin' },
  { name: 'Rahul Sharma', email: 'rahul.sharma@example.com', password: 'password123' },
  { name: 'Priya Singh', email: 'priya.singh@example.com', password: 'password123' },
  { name: 'James Wilson', email: 'james.wilson@example.com', password: 'password123' },
  { name: 'Aisha Khan', email: 'aisha.khan@example.com', password: 'password123' },
  { name: 'Mike Johnson', email: 'mike.johnson@example.com', password: 'password123' },
  { name: 'Sara Ali', email: 'sara.ali@example.com', password: 'password123' },
  { name: 'Raj Patel', email: 'raj.patel@example.com', password: 'password123' },
  { name: 'Emma Thompson', email: 'emma.thompson@example.com', password: 'password123' },
  { name: 'Vikram Joshi', email: 'vikram.joshi@example.com', password: 'password123' },
];

const COUNTRIES = ['India', 'Australia', 'England', 'Pakistan', 'South Africa', 'West Indies', 'New Zealand', 'Sri Lanka', 'Bangladesh', 'Afghanistan'];

const JERSEY_TYPES = ['Test Jersey', 'ODI World Cup Jersey', 'T20 World Cup Jersey', 'Champions Trophy Jersey'];

const JERSEY_YEARS = {
  'Test Jersey': ['2010', '2015', '2020', '2024', '2025'],
  'ODI World Cup Jersey': ['2011', '2015', '2019', '2023', '2025'],
  'T20 World Cup Jersey': ['2007', '2012', '2014', '2022', '2024'],
  'Champions Trophy Jersey': ['2013', '2017', '2025'],
};

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

function slugify(text) {
  return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min, max, decimals = 1) {
  return parseFloat((min + Math.random() * (max - min)).toFixed(decimals));
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const COUNTRY_IMAGE_MAP = {
  'India': 'https://placehold.co/400x500/FF9933/ffffff?text=India',
  'Australia': 'https://placehold.co/400x500/FFD700/000000?text=Australia',
  'England': 'https://placehold.co/400x500/CE1124/ffffff?text=England',
  'Pakistan': 'https://placehold.co/400x500/01411C/ffffff?text=Pakistan',
  'South Africa': 'https://placehold.co/400x500/007A4D/ffffff?text=South+Africa',
  'West Indies': 'https://placehold.co/400x500/8B0000/ffffff?text=West+Indies',
  'New Zealand': 'https://placehold.co/400x500/000000/ffffff?text=New+Zealand',
  'Sri Lanka': 'https://placehold.co/400x500/8D153A/ffffff?text=Sri+Lanka',
  'Bangladesh': 'https://placehold.co/400x500/006A4E/ffffff?text=Bangladesh',
  'Afghanistan': 'https://placehold.co/400x500/D32027/ffffff?text=Afghanistan',
};

const IPL_TEAM_IMAGE_MAP = {
  'Chennai Super Kings': 'https://placehold.co/400x500/FFCB00/000000?text=CSK',
  'Royal Challengers Bengaluru': 'https://placehold.co/400x500/EC1C24/ffffff?text=RCB',
  'Mumbai Indians': 'https://placehold.co/400x500/004C8C/ffffff?text=MI',
  'Kolkata Knight Riders': 'https://placehold.co/400x500/3A225D/ffffff?text=KKR',
  'Sunrisers Hyderabad': 'https://placehold.co/400x500/FF6D00/000000?text=SRH',
  'Rajasthan Royals': 'https://placehold.co/400x500/D92B9D/ffffff?text=RR',
  'Punjab Kings': 'https://placehold.co/400x500/A50E2F/ffffff?text=PBKS',
  'Delhi Capitals': 'https://placehold.co/400x500/17479E/ffffff?text=DC',
  'Lucknow Super Giants': 'https://placehold.co/400x500/A8D5E2/000000?text=LSG',
  'Gujarat Titans': 'https://placehold.co/400x500/1B2D4D/ffffff?text=GT',
};

const CATEGORY_IMAGES = {
  'international-jersey': 'https://placehold.co/400x500/1e293b/475569?text=International',
  'ipl-jersey': 'https://placehold.co/400x500/1e293b/475569?text=IPL',
  'cricket-bat': 'https://placehold.co/400x500/1e293b/475569?text=Bat',
  'cricket-kit': 'https://placehold.co/400x500/1e293b/475569?text=Kit',
  'cricket-accessories': 'https://placehold.co/400x500/1e293b/475569?text=Accessory',
  'fan-merchandise': 'https://placehold.co/400x500/1e293b/475569?text=Merch',
};

function cricketImageUrl(category, country, team) {
  if (country && COUNTRY_IMAGE_MAP[country]) return COUNTRY_IMAGE_MAP[country];
  if (team && IPL_TEAM_IMAGE_MAP[team]) return IPL_TEAM_IMAGE_MAP[team];
  return CATEGORY_IMAGES[category] || CATEGORY_IMAGES['fan-merchandise'];
}

function buildInternationalJerseys() {
  const products = [];
  for (const country of COUNTRIES) {
    for (const jersey of JERSEY_TYPES) {
      const years = JERSEY_YEARS[jersey];
      for (const year of years) {
        const name = `${country} ${jersey} ${year}`;
        const price = randFloat(25, 80, 2);
        products.push({
          name,
          slug: slugify(name),
          description: `Official ${country} ${jersey} from ${year}. Crafted from premium moisture-wicking fabric with authentic team colours, embroidered crest, and a comfortable athletic fit. Perfect for match days or casual wear.`,
          price,
          comparePrice: price + randFloat(5, 20, 2),
          category: 'international-jersey',
          country,
          team: '',
          images: [cricketImageUrl('international-jersey', country, '')],
          stock: rand(10, 100),
          rating: randFloat(3.5, 5.0, 1),
          featured: jersey === 'ODI World Cup Jersey' && ['2011', '2019'].includes(year),
          tags: [country.toLowerCase(), 'jersey', 'international', jersey.toLowerCase().replace(/\s+/g, '-'), year],
        });
      }
    }
  }
  return products;
}

function buildIPLJerseys() {
  const products = [];
  for (const team of IPL_TEAMS) {
    const types = [
      { name: `${team.name} Match Jersey`, type: 'match-jersey' },
      { name: `${team.name} Training Jersey`, type: 'training-jersey' },
    ];
    for (const t of types) {
      const price = randFloat(30, 70, 2);
      products.push({
        name: t.name,
        slug: slugify(t.name),
        description: `Official ${team.name} ${t.type.includes('Training') ? 'Training Jersey' : 'Match Jersey'}. Show your franchise pride with this premium IPL jersey featuring team logos, sponsor detailing, and breathable fabric designed for performance.`,
        price,
        comparePrice: price + randFloat(5, 15, 2),
        category: 'ipl-jersey',
        country: 'India',
        team: team.name,
        images: [cricketImageUrl('ipl-jersey', '', team.name)],
        stock: rand(15, 80),
        rating: randFloat(3.5, 5.0, 1),
        featured: !t.type.includes('Training'),
        tags: [team.slug.toLowerCase(), 'ipl', t.type],
      });
    }
  }
  return products;
}

function buildAccessories() {
  const items = [
    { name: 'Compression Arm Sleeves', desc: 'Professional-grade compression arm sleeves with UV protection and moisture-wicking technology. Available in multiple team colours for match-day comfort.' },
    { name: 'Premium Bat Grips', desc: 'High-tack premium bat grips engineered for superior feel and shock absorption. Includes two grips per pack with adhesive tape.' },
    { name: 'Classic Cricket Cap', desc: 'Traditional six-panel cricket cap in classic team colours. Pre-curved brim with breathable mesh panels for all-day comfort.' },
    { name: 'Performance Wrist Bands', desc: 'Sweat-absorbing microfiber wrist bands with team embroidery. Keeps your hands dry during intense match situations.' },
    { name: 'Cricket Kit Bag - 120L', desc: 'Spacious 120-litre cricket kit bag with multiple compartments. Padded shoulder strap and reinforced base for durability on the go.' },
    { name: 'Insulated Water Bottle - 750ml', desc: 'Double-walled insulated stainless steel water bottle. Keeps drinks cool for 24 hours with a leak-proof sports cap.' },
    { name: 'Ventilated Helmet Liner', desc: 'Moisture-wicking helmet liner with cooling technology. Reduces sweat buildup and improves comfort during long innings.' },
    { name: 'Professional Batting Gloves', desc: 'Premium English willow batting gloves with fibrepocket protection. Sheepskin palm provides superior grip and comfort.' },
    { name: 'Elastic Shoe Covers', desc: 'Durable elastic shoe covers for cricket spikes. Protects footwear during travel and keeps equipment bag clean.' },
    { name: 'Cricket Towel - Large', desc: 'Extra-large microfiber cricket towel (60x120cm). Ultra-absorbent quick-dry fabric with team colour accents.' },
    { name: 'Batting Thigh Guard', desc: 'Lightweight high-impact foam thigh guard with adjustable straps. Conforms to body shape for maximum protection and mobility.' },
    { name: 'Cricket Abdominal Guard', desc: 'Premium abdominal guard with comfort-fit contour design. Hard shell protection with padded edges for all-day wear.' },
    { name: 'Fielding Gloves', desc: 'Professional fielding gloves with reinforced palm padding. Flexible design allows natural hand movement while catching.' },
    { name: 'Cap visor', desc: 'Cricket sun visor with adjustable strap. Lightweight design keeps sun out of your eyes while batting or fielding.' },
    { name: 'Ankle Support Sleeve', desc: 'Compression ankle sleeve for cricket players. Provides support during quick runs and reduces fatigue during long matches.' },
  ];
  return items.map((item) => {
    const price = randFloat(5, 30, 2);
    return {
      name: item.name,
      slug: slugify(item.name),
      description: item.desc + ' Designed for cricket enthusiasts who demand the best.',
      price,
      comparePrice: price + randFloat(2, 8, 2),
      category: 'cricket-accessories',
      country: pick(COUNTRIES),
      team: '',
      images: [cricketImageUrl('cricket-accessories', '', '')],
      stock: rand(20, 100),
      rating: randFloat(3.5, 5.0, 1),
      featured: false,
      tags: ['accessories', slugify(item.name.split(' ').slice(-2).join('-'))],
    };
  });
}

function buildMerchandise() {
  const items = [
    { name: 'Cricket Legend Poster - Set of 3', desc: 'High-quality A3 gloss posters featuring cricket legends in action. Set includes iconic match moments with premium print finish.' },
    { name: 'Team Logo Keychain Set', desc: 'Set of 4 metal keychains featuring embossed team logos. Durable zinc alloy construction with enamel fill.' },
    { name: 'Ceramic Cricket Mug - 350ml', desc: 'Premium ceramic mug with full-colour team design. Microwave and dishwasher safe with vibrant print that never fades.' },
    { name: 'Cricket Nation Flag - Large 5x3ft', desc: 'Large 5x3 foot polyester flag featuring national cricket colours. Double-stitched edges with brass grommets for outdoor display.' },
    { name: 'Silicone Phone Cover', desc: 'Impact-absorbing silicone phone case with cricket team design. Precise cutouts for all ports with raised bezel screen protection.' },
    { name: 'Mini Cricket Bat Replica', desc: 'Authentically detailed 12-inch mini cricket bat replica. Signed edition with hand-painted finish and display stand.' },
    { name: 'Fan Edition Graphic T-Shirt', desc: 'Soft-touch cotton graphic tee featuring your favourite cricket team. Pre-shrunk fabric with bold front print and sleeve logo.' },
    { name: 'Cricket Sticker Pack - 20pc', desc: 'Collection of 20 high-quality vinyl stickers featuring teams and players. Weather-resistant for laptop, water bottle, or gear.' },
    { name: 'Canvas Wall Art - 16x24in', desc: 'Stretched canvas wall art featuring iconic cricket stadium panorama. Gallery-wrapped edges with ready-to-hang hardware.' },
    { name: 'Cricket Trading Card Pack', desc: 'Pack of 10 premium trading cards featuring cricket superstars. Foil holographic finish with career stats on reverse.' },
    { name: 'Team Logo Baseball Cap', desc: 'Official team logo baseball cap with structured fit. Embroidered front logo with adjustable snapback closure.' },
    { name: 'Cricket Jersey Magnet Set', desc: 'Set of 6 fridge magnets featuring miniature replica jerseys. Vibrant enamel colours with magnetic backing.' },
    { name: 'Pillow Case - Team Design', desc: 'Soft microfiber pillow case (18x18in) with all-over team print. Hidden zipper closure with fade-resistant fabric.' },
    { name: 'Key Ring Bottle Opener', desc: 'Dual-function key ring with integrated bottle opener. Brushed metal finish with engraved team crest.' },
    { name: 'Cricket Scarf - Knitted', desc: 'Extra-long knitted acrylic scarf in team colours. 180cm length with fringe ends and woven team label.' },
    { name: 'Phone Grip Stand', desc: 'Collapsible phone grip stand with team logo. Secure adhesive mount with 360-degree rotation for hands-free viewing.' },
    { name: 'Cricket Journal - Hardbound', desc: 'Hardbound A5 journal with cricket-themed cover design. 200 lined pages with bookmark ribbon and elastic closure.' },
    { name: 'Team Flag Car Banner', desc: 'Waterproof car window banner flag. Easy-fit design with vibrant team colours that won\'t fade in sunlight.' },
    { name: 'Cricket Colouring Book', desc: 'A4 colouring book featuring cricket scenes and players. 30 single-sided pages suitable for all ages.' },
    { name: 'Team Logo Socks', desc: 'Crew-length cotton blend socks with team logo embroidery. Reinforced heel and toe with cushioned sole.' },
  ];
  return items.map((item) => {
    const price = randFloat(3, 25, 2);
    return {
      name: item.name,
      slug: slugify(item.name),
      description: item.desc,
      price,
      comparePrice: price + randFloat(1, 6, 2),
      category: 'fan-merchandise',
      country: pick(COUNTRIES),
      team: '',
      images: [cricketImageUrl('fan-merchandise', '', '')],
      stock: rand(30, 150),
      rating: randFloat(3.0, 5.0, 1),
      featured: false,
      tags: ['merchandise', 'fan', slugify(item.name.split(' ').slice(0, 2).join('-'))],
    };
  });
}

function buildBats() {
  const brands = ['GM', 'SS', 'Kookaburra', 'Gray-Nicolls', 'MRF', 'SG', 'Slazenger', 'Monty'];
  const items = [];
  const types = [
    { grade: 'English Willow', prices: [80, 250] },
    { grade: 'Kashmir Willow', prices: [40, 100] },
    { grade: 'Composite', prices: [60, 180] },
  ];
  for (let i = 0; i < 15; i++) {
    const type = types[i % 3];
    const brand = pick(brands);
    const name = `${brand} ${type.grade} Cricket Bat - Series ${String.fromCharCode(65 + (i % 5))}`;
    const price = randFloat(type.prices[0], type.prices[1], 2);
    items.push({
      name,
      slug: slugify(name),
      description: `Premium ${type.grade.toLowerCase()} cricket bat by ${brand}. Features a balanced pickup, large sweet spot, and premium grade ${type.grade} willow with anti-scuff protection. Ideal for professional and club-level players.`,
      price,
      comparePrice: price + randFloat(10, 50, 2),
      category: 'cricket-bat',
      country: pick(COUNTRIES),
      team: '',
      images: [cricketImageUrl('cricket-bat', '', '')],
      stock: rand(5, 40),
      rating: randFloat(3.5, 5.0, 1),
      featured: type.grade === 'English Willow' && i < 3,
      tags: ['cricket-bat', type.grade.toLowerCase().replace(/\s/g, '-'), brand.toLowerCase()],
    });
  }
  return items;
}

function buildKits() {
  const items = [
    { name: 'Complete Batting Kit - Pro Edition', desc: 'Professional-grade complete batting kit including bat, gloves, pads, thigh guard, abdominal guard, and helmet. Premium gear for serious cricketers.', priceRange: [150, 300] },
    { name: 'Junior Cricket Kit - Ages 8-12', desc: 'Complete junior cricket kit designed for ages 8-12. Includes lightweight bat, soft-ball gloves, padded trousers, helmet, and carry bag.', priceRange: [60, 120] },
    { name: 'Professional Cricket Kit - Elite', desc: 'Elite-level complete cricket kit featuring top-of-the-range equipment used by professionals. Batting, bowling, and fielding essentials included.', priceRange: [200, 300] },
    { name: 'Training Cricket Kit - Essentials', desc: 'Essential training kit for club cricketers. Includes practice bat, training gloves, pads, and helmet with carry bag.', priceRange: [80, 150] },
    { name: 'Advanced Batting Kit - Tournament', desc: 'Tournament-ready batting kit with competition-grade equipment. Features lightweight pads, ergonomic gloves, and premium helmet.', priceRange: [120, 250] },
    { name: 'All-Rounder Cricket Kit', desc: 'Complete all-rounder kit with batting and fielding gear. Includes dual-purpose gloves, wicket-keeping options, and multi-use pads.', priceRange: [100, 200] },
    { name: 'Youth Cricket Set - Starter', desc: 'Starter cricket set for young enthusiasts aged 5-8. Includes plastic bat, soft ball, stumps, and basic protective gear in a backpack.', priceRange: [40, 80] },
    { name: 'County Cricket Kit - Standard', desc: 'Standard county-level cricket kit with reliable protective gear. Endorsed by county coaches for club and school cricket.', priceRange: [90, 180] },
    { name: 'Premier Cricket Kit - Limited Edition', desc: 'Limited edition premier kit with signature series equipment. Numbered edition with premium carry case and accessories.', priceRange: [250, 300] },
    { name: 'Wicket-Keeper Complete Kit', desc: 'Specialised wicket-keeping kit with keeper gloves, leg pads, inner gloves, and abdominal guard. Designed for keeping comfort.', priceRange: [100, 200] },
    { name: 'School Cricket Kit - Standard', desc: 'Affordable school cricket kit with essential protective gear. Approved by school sports associations for inter-school matches.', priceRange: [50, 90] },
    { name: 'Fast Bowling Kit - Specialist', desc: 'Specialist fast bowling kit with reinforced protection. Includes bowling boots, core support belt, and padded bowling gloves.', priceRange: [120, 220] },
    { name: 'Cricket Coaching Kit - Club', desc: 'Club coaching kit with training aids, cones, practice balls, and coaching manual. Ideal for club coaches and academy trainers.', priceRange: [80, 150] },
    { name: 'Weekend Cricketer Kit', desc: 'Value-packed weekend cricket kit for casual players. All essential protective gear at an affordable price point.', priceRange: [60, 100] },
    { name: 'International Touring Kit', desc: 'Complete touring kit for traveling cricketers. Compact, lightweight design with TSA-approved carry dimensions and durable casing.', priceRange: [180, 300] },
  ];
  return items.map((item) => {
    const price = randFloat(item.priceRange[0], item.priceRange[1], 2);
    return {
      name: item.name,
      slug: slugify(item.name),
      description: item.desc,
      price,
      comparePrice: price + randFloat(15, 50, 2),
      category: 'cricket-kit',
      country: pick(COUNTRIES),
      team: '',
      images: [cricketImageUrl('cricket-kit', '', '')],
      stock: rand(5, 30),
      rating: randFloat(3.5, 5.0, 1),
      featured: item.name.includes('Pro') || item.name.includes('Premier') || item.name.includes('Elite'),
      tags: ['cricket-kit', 'kit', slugify(item.name.split(' ').slice(0, 2).join('-'))],
    };
  });
}

function buildPosts(users) {
  const authors = users.filter((u) => u.role !== 'admin');
  const postData = [
    { category: 'match-discussions', content: 'What a match between India and Australia today! The chase was absolutely incredible. I cannot believe Kohli pulled that off in the final over. The atmosphere at the stadium was electric and this will go down as one of the greatest ODIs ever played. What did everyone else think of the final over?' },
    { category: 'match-discussions', content: 'Just finished watching the Ashes Test at Lord\'s. That final session was absolutely gripping! England showed tremendous fight to save the Test after following on. Ben Stokes is simply a genius under pressure. This is why Test cricket remains the ultimate format of the game.' },
    { category: 'match-discussions', content: 'The T20 World Cup final was absolutely bonkers! Who else stayed up all night to watch it? Every single ball had me on the edge of my seat. The way the lower order batted under pressure shows how deep modern batting lineups have become.' },
    { category: 'match-discussions', content: 'Can we talk about the pitch in the recent Test match? It was a rank turner from day one. Spinners were getting turn and bounce while batsmen struggled to survive. Is this good for Test cricket or are we losing the balance between bat and ball?' },
    { category: 'ipl-debates', content: 'IPL 2024 auction strategy discussion - which team had the best auction this year? I think CSK once again showed why they are the smartest franchise in the league. Their ability to identify and nurture talent while maintaining a balanced squad is unmatched. What do you think?' },
    { category: 'ipl-debates', content: 'Who is the best IPL captain of all time? MS Dhoni\'s tactical genius and calm demeanor under pressure make him the obvious choice for me. Five titles and countless playoff appearances speak for themselves. But Rohit Sharma with MI also has an incredible record.' },
    { category: 'ipl-debates', content: 'Unpopular opinion: RCB will finally win the IPL this season. Their bowling lineup looks stronger than ever and batting has always been world-class. The addition of quality all-rounders has given them the balance they were missing in previous seasons. #EeSalaCupNamel' },
    { category: 'ipl-debates', content: 'Let\'s talk about the impact player rule in IPL. Is it making the game more exciting or destroying the balance? I feel it has added a new tactical dimension but also devalued the role of genuine all-rounders. Teams now stack their batting and bowl with one less specialist.' },
    { category: 'international-cricket', content: 'Pakistan cricket is going through such an interesting phase. Their pace bowling factory keeps producing world-class talent but batting consistency remains a concern. The upcoming series against England will be a real test of where they stand in world cricket right now.' },
    { category: 'international-cricket', content: 'The WTC championship cycle is heating up! Australia and India are looking like the strongest contenders again but don\'t count out England\'s aggressive approach under Bazball. Test cricket has never been more competitive across all nations.' },
    { category: 'international-cricket', content: "Really impressed with how Afghanistan cricket has progressed. Their spinners are world-class and now the batting is catching up too. They are no longer just giant-killers but a genuine threat in international tournaments. Rashid Khan's leadership has been transformative." },
    { category: 'player-comparisons', content: 'Virat Kohli vs Steve Smith - the greatest modern debate. Both have astronomical numbers but approach batting completely differently. Kohli\'s aggressive intensity and chase mastery versus Smith\'s unorthodox genius and Test dominance. Who is the better batsman across all formats?' },
    { category: 'player-comparisons', content: 'Sachin Tendulkar vs Brian Lara - who had the bigger impact on world cricket? Both were geniuses but Sachin carried the hopes of a billion people for 24 years while Lara played some of the most breathtaking innings ever seen. Their 2004 series was absolutely legendary.' },
    { category: 'player-comparisons', content: 'Wasim Akram vs Waqar Younis - the ultimate pace duo comparison. Wasim was the master of swing and could move the ball both ways at pace while Waqar was the king of reverse swing with devastating yorkers. Together they formed the most lethal bowling attack of the 1990s.' },
    { category: 'fan-opinions', content: 'I think cricket needs a global T20 league calendar with a proper window like football has. Players should be allowed to participate in leagues worldwide without conflicting with international duties. This would grow the game enormously in non-traditional markets.' },
    { category: 'fan-opinions', content: 'My hot take: ODI cricket is more exciting than T20 in 2024. The middle overs strategy, building partnerships, and managing the innings requires more skill than just going hard from ball one. A well-paced 50-over innings is a thing of beauty.' },
    { category: 'fan-opinions', content: 'The standard of fielding in modern cricket is absolutely incredible. Players are now athletes first and cricketers second. The dives, direct hits, and boundary saves we see in every match would have been unthinkable 20 years ago. It raises the entertainment value so much.' },
    { category: 'polls', content: 'POLL: Which format of cricket do you enjoy watching the most? Test matches with their ebb and flow, ODIs with the perfect balance between bat and ball, or T20s with non-stop entertainment? Vote and explain your choice below!' },
    { category: 'polls', content: 'POLL: Who is the greatest cricketer of the 21st century? Sachin Tendulkar, Shane Warne, Muttiah Muralitharan, Jacques Kallis, or Virat Kohli? Consider their impact across all formats and what they meant to the game during their careers.' },
    { category: 'polls', content: 'POLL: Which upcoming series are you most excited about? The Ashes in England, India vs Australia Border-Gavaskar Trophy, Pakistan vs England, or the T20 World Cup? The next 12 months of international cricket look absolutely stacked!' },
  ];

  return postData.map((p, idx) => {
    const author = pick(authors);
    const likeCount = rand(0, 500);
    const commentCount = rand(0, 50);
    const commentUsers = [];
    const usedAuthors = new Set();
    usedAuthors.add(author._id.toString());
    for (let i = 0; i < commentCount; i++) {
      let commentAuthor;
      let attempts = 0;
      do {
        commentAuthor = pick(authors);
        attempts++;
      } while (usedAuthors.has(commentAuthor._id.toString()) && attempts < 10);
      usedAuthors.add(commentAuthor._id.toString());
      const texts = [
        'Great point! Totally agree with this.',
        'Interesting perspective, hadn\'t thought of it that way.',
        'I disagree respectfully. There\'s another side to this.',
        'This is exactly what I\'ve been saying for years!',
        'Can you elaborate on your point? I\'m curious.',
        'Absolutely spot on analysis! Well said.',
        'Not sure I agree but respect your opinion.',
        'Thanks for sharing this! Love the discussion.',
        'This is the kind of quality discussion we need more of.',
        'Haha true! Cricket fans will understand this.',
      ];
      commentUsers.push({
        user: commentAuthor._id,
        text: pick(texts),
      });
    }
    const likedBy = [];
    for (let i = 0; i < likeCount; i++) {
      likedBy.push(pick(authors)._id);
    }
    const daysAgo = rand(0, 30);
    const createdAt = new Date(Date.now() - daysAgo * 86400000 - rand(0, 86400) * 1000);
    return {
      author: author._id,
      content: p.content,
      likes: [...new Set(likedBy)],
      comments: commentUsers,
      createdAt,
    };
  });
}

export const seedDatabase = async (req, res, next) => {
  try {
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Post.deleteMany({}),
      Cart.deleteMany({}),
      Wishlist.deleteMany({}),
    ]);

    const users = await User.create(USERS);
    console.log(`Seeded ${users.length} users`);

    const intlJerseys = buildInternationalJerseys();
    const iplJerseys = buildIPLJerseys();
    const accessories = buildAccessories();
    const merchandise = buildMerchandise();
    const bats = buildBats();
    const kits = buildKits();
    const allProducts = [...intlJerseys, ...iplJerseys, ...accessories, ...merchandise, ...bats, ...kits];

    await Product.insertMany(allProducts);
    console.log(`Seeded ${allProducts.length} products`);

    const postDocs = buildPosts(users);
    await Post.insertMany(postDocs);
    console.log(`Seeded ${postDocs.length} posts`);

    res.json({
      success: true,
      message: 'Database seeded successfully',
      counts: {
        users: users.length,
        products: allProducts.length,
        posts: postDocs.length,
        breakdown: {
          'international-jersey': intlJerseys.length,
          'ipl-jersey': iplJerseys.length,
          'cricket-accessories': accessories.length,
          'fan-merchandise': merchandise.length,
          'cricket-bat': bats.length,
          'cricket-kit': kits.length,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
