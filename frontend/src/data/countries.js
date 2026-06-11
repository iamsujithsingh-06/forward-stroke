export const JERSEY_CATEGORIES = [
  { id: 'test', label: 'Test Jersey', icon: '🛡️' },
  { id: 'odi-world-cup', label: 'ODI World Cup Jersey', icon: '🏆' },
  { id: 't20-world-cup', label: 'T20 World Cup Jersey', icon: '🌍' },
  { id: 'champions-trophy', label: 'Champions Trophy Jersey', icon: '👑' },
  { id: 'accessories', label: 'Accessories', icon: '🎒' },
];

export const JERSEY_YEARS = {
  test: ['2010', '2015', '2020', '2024', '2025'],
  'odi-world-cup': ['2011', '2015', '2019', '2023', '2025'],
  't20-world-cup': ['2007', '2012', '2014', '2022', '2024'],
  'champions-trophy': ['2013', '2017', '2025'],
};

export const CATEGORY_TYPE_MAP = {
  test: 'Test Jersey',
  'odi-world-cup': 'ODI World Cup Jersey',
  't20-world-cup': 'T20 World Cup Jersey',
  'champions-trophy': 'Champions Trophy Jersey',
};

export const INTERNATIONAL_ACCESSORY_PRODUCTS = [
  { name: 'Cricket Cap', price: 19.99, image: 'https://placehold.co/400x500/1e293b/475569?text=Caps', type: 'caps' },
  { name: 'Team Cap', price: 14.99, image: 'https://placehold.co/400x500/1e293b/475569?text=Caps', type: 'caps' },
  { name: 'Cricket Hat', price: 24.99, image: 'https://placehold.co/400x500/1e293b/475569?text=Caps', type: 'caps' },
  { name: 'Batting Gloves', price: 34.99, image: 'https://placehold.co/400x500/1e293b/475569?text=Gloves', type: 'gloves' },
  { name: 'Wicketkeeping Gloves', price: 39.99, image: 'https://placehold.co/400x500/1e293b/475569?text=Gloves', type: 'gloves' },
  { name: 'Training Gloves', price: 29.99, image: 'https://placehold.co/400x500/1e293b/475569?text=Gloves', type: 'gloves' },
  { name: 'Cricket Kit Bag', price: 59.99, image: 'https://placehold.co/400x500/1e293b/475569?text=Bags', type: 'bags' },
  { name: 'Team Backpack', price: 39.99, image: 'https://placehold.co/400x500/1e293b/475569?text=Bags', type: 'bags' },
  { name: 'Travel Kit Bag', price: 49.99, image: 'https://placehold.co/400x500/1e293b/475569?text=Bags', type: 'bags' },
  { name: 'Wrist Bands Pack', price: 9.99, image: 'https://placehold.co/400x500/1e293b/475569?text=Bands', type: 'wrist-bands' },
  { name: 'Sweatband Set', price: 12.99, image: 'https://placehold.co/400x500/1e293b/475569?text=Bands', type: 'wrist-bands' },
  { name: 'Captain Armband', price: 14.99, image: 'https://placehold.co/400x500/1e293b/475569?text=Bands', type: 'wrist-bands' },
];

export const ACCESSORY_TYPES = [
  { id: 'caps', label: 'Caps', icon: '🧢' },
  { id: 'gloves', label: 'Gloves', icon: '🧤' },
  { id: 'bags', label: 'Bags', icon: '🎒' },
  { id: 'wrist-bands', label: 'Wrist Bands', icon: '📿' },
];

export const COUNTRIES = [
  {
    id: 'india',
    name: 'India',
    code: 'IN',
    flagUrl: 'https://flagcdn.com/w320/in.png',
    flag: '🇮🇳',
    color: '#FF9933',
  },
  {
    id: 'australia',
    name: 'Australia',
    code: 'AU',
    flagUrl: 'https://flagcdn.com/w320/au.png',
    color: '#FFD700',
  },
  {
    id: 'england',
    name: 'England',
    code: 'GB',
    flagUrl: 'https://flagcdn.com/w320/gb.png',
    color: '#CE1124',
  },
  {
    id: 'pakistan',
    name: 'Pakistan',
    code: 'PK',
    flagUrl: 'https://flagcdn.com/w320/pk.png',
    color: '#01411C',
  },
  {
    id: 'new-zealand',
    name: 'New Zealand',
    code: 'NZ',
    flagUrl: 'https://flagcdn.com/w320/nz.png',
    color: '#000000',
  },
  {
    id: 'south-africa',
    name: 'South Africa',
    code: 'ZA',
    flagUrl: 'https://flagcdn.com/w320/za.png',
    color: '#007A4D',
  },
  {
    id: 'sri-lanka',
    name: 'Sri Lanka',
    code: 'LK',
    flagUrl: 'https://flagcdn.com/w320/lk.png',
    color: '#8D153A',
  },
  {
    id: 'afghanistan',
    name: 'Afghanistan',
    code: 'AF',
    flagUrl: 'https://flagcdn.com/w320/af.png',
    color: '#D32027',
  },
  {
    id: 'bangladesh',
    name: 'Bangladesh',
    code: 'BD',
    flagUrl: 'https://flagcdn.com/w320/bd.png',
    color: '#006A4E',
  },
  {
    id: 'west-indies',
    name: 'West Indies',
    code: 'WI',
    flagUrl: 'https://flagcdn.com/w320/bb.png',
    color: '#8B0000',
  },
];
