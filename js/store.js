/**
 * PakServicesHub - Data Store v3.1 (Enhanced)
 * 5-Level Location Hierarchy: City → Tehsil → UC → Village
 */

// ── DEFAULT SEED DATA ────────────────────────────────────────────
const LOCATION_DATA_DEFAULT = {
    cities: [
        {
            id: 'pasrur', name: 'Pasrur', district: 'Sialkot',
            tehsils: [{
                id: 'pasrur-tehsil', name: 'Pasrur Tehsil',
                unionCouncils: [
                    { id: 'uc-pasrur-city', name: 'Pasrur City', road: 'Main Bazar Road',
                      villages: [{ name: 'Pasrur City Centre', road: 'Main Bazar Road' }, { name: 'Pasrur Mandi', road: 'G.T. Road' }, { name: 'Rang Mahal', road: 'Main Bazar Road' }] },
                    { id: 'uc-chawinda', name: 'Chawinda', road: 'Chawinda Road',
                      villages: [{ name: 'Chawinda Town', road: 'Chawinda Road' }, { name: 'Haibat Pur', road: 'Chawinda Road' }, { name: 'Dhamoke', road: 'Chawinda Road' }, { name: 'Roras', road: 'Chawinda Road' }, { name: 'Charwa', road: 'Charwa Road' }, { name: 'Bhagwal', road: 'Chawinda Road' }] },
                    { id: 'uc-badyana', name: 'Badyana', road: 'Badyana Road',
                      villages: [{ name: 'Badyana', road: 'Badyana Road' }, { name: 'Garala', road: 'Badyana Road' }, { name: 'Nabipur', road: 'Badyana Road' }, { name: 'Mangat', road: 'Badyana Road' }] },
                    { id: 'uc-kalaswala', name: 'Kalaswala', road: 'Kalaswala Road',
                      villages: [{ name: 'Kalaswala', road: 'Kalaswala Road' }, { name: 'Phuklian Kalan', road: 'Kalaswala Road' }, { name: 'Phuklian Khurd', road: 'Kalaswala Road' }, { name: 'Mangowal', road: 'Kalaswala Road' }] },
                    { id: 'uc-kingra', name: 'Kingra', road: 'Kingra Road',
                      villages: [{ name: 'Kingra', road: 'Kingra Road' }, { name: 'Mananwala', road: 'Kingra Road' }, { name: 'Manji', road: 'Kingra Road' }, { name: 'Begowala', road: 'Kingra Road' }] },
                    { id: 'uc-chahor', name: 'Chahor', road: 'Chahor Road',
                      villages: [{ name: 'Chahor', road: 'Chahor Road' }, { name: 'Sohal', road: 'Chahor Road' }, { name: 'Bhinder', road: 'Chahor Road' }, { name: 'Kot Kalan', road: 'Chahor Road' }] },
                    { id: 'uc-bajra-gari', name: 'Bajra Gari', road: 'Bajra Gari Road',
                      villages: [{ name: 'Bajra Gari', road: 'Bajra Gari Road' }, { name: 'Kotli Loharan', road: 'Bajra Gari Road' }, { name: 'Talwara', road: 'Bajra Gari Road' }, { name: 'Rasoolan', road: 'Bajra Gari Road' }] },
                    { id: 'uc-saukan-wind', name: 'Saukan Wind', road: 'Saukan Wind Road',
                      villages: [{ name: 'Saukan Wind', road: 'Saukan Wind Road' }, { name: 'Virkan', road: 'Saukan Wind Road' }, { name: 'Sahowali', road: 'Saukan Wind Road' }, { name: 'Rangpur', road: 'Saukan Wind Road' }] },
                    { id: 'uc-dhulam', name: 'Dhulam Kahlwan', road: 'Dhulam Road',
                      villages: [{ name: 'Dhulam Kahlwan', road: 'Dhulam Road' }, { name: 'Bagowal', road: 'Dhulam Road' }, { name: 'Jandiali', road: 'Dhulam Road' }, { name: 'Chak Amru', road: 'Dhulam Road' }] },
                    { id: 'uc-ban-bajwa', name: 'Ban Bajwa', road: 'Ban Bajwa Road',
                      villages: [{ name: 'Ban Bajwa', road: 'Ban Bajwa Road' }, { name: 'Iqbalpur', road: 'Ban Bajwa Road' }, { name: 'Kot Iqbal', road: 'Ban Bajwa Road' }, { name: 'Badla', road: 'Ban Bajwa Road' }] },
                    { id: 'uc-qila', name: 'Qila Kalar Wala', road: 'Qila Road',
                      villages: [{ name: 'Qila Kalar Wala', road: 'Qila Road' }, { name: 'Muradpur', road: 'Qila Road' }, { name: 'Kamalpur', road: 'Qila Road' }, { name: 'Phir Diala', road: 'Qila Road' }] }
                ]
            }]
        },
        {
            id: 'sialkot', name: 'Sialkot', district: 'Sialkot',
            tehsils: [
                { id: 'sialkot-city-tehsil', name: 'Sialkot City',
                  unionCouncils: [
                    { id: 'uc-sialkot-sadar', name: 'Sialkot Sadar', road: 'G.T. Road',
                      villages: [{ name: 'Sialkot Sadar', road: 'G.T. Road' }, { name: 'Civil Lines', road: 'Civil Lines Road' }, { name: 'Cantt Area', road: 'Jammu Road' }, { name: 'Paris Road Area', road: 'Paris Road' }, { name: 'Airport Road Area', road: 'Airport Road' }] },
                    { id: 'uc-sialkot-model-town', name: 'Model Town', road: 'Model Town Road',
                      villages: [{ name: 'Model Town', road: 'Model Town Road' }, { name: 'Allama Iqbal Town', road: 'Model Town Road' }, { name: 'Gulshan Colony', road: 'Model Town Road' }] }
                  ] },
                { id: 'sambrial-tehsil', name: 'Sambrial',
                  unionCouncils: [
                    { id: 'uc-sambrial', name: 'Sambrial', road: 'Sambrial Road',
                      villages: [{ name: 'Sambrial Town', road: 'Sambrial Road' }, { name: 'Ugoki', road: 'Ugoki Road' }, { name: 'Khadim Ali Road Area', road: 'Khadim Ali Road' }] }
                  ] },
                { id: 'daska-tehsil', name: 'Daska',
                  unionCouncils: [
                    { id: 'uc-daska', name: 'Daska', road: 'Daska Road',
                      villages: [{ name: 'Daska City', road: 'Daska Road' }, { name: 'Badiana', road: 'Badiana Road' }, { name: 'Ghakhar Mandi', road: 'G.T. Road' }] }
                  ] }
            ]
        },
        {
            id: 'narowal', name: 'Narowal', district: 'Narowal',
            tehsils: [
                { id: 'narowal-tehsil', name: 'Narowal',
                  unionCouncils: [
                    { id: 'uc-narowal-city', name: 'Narowal City', road: 'Main Road',
                      villages: [{ name: 'Narowal City', road: 'Main Road' }, { name: 'Narowal Sadar', road: 'G.T. Road' }, { name: 'Kot Rajgan', road: 'Main Road' }] }
                  ] },
                { id: 'shakargarh-tehsil', name: 'Shakargarh',
                  unionCouncils: [
                    { id: 'uc-shakargarh', name: 'Shakargarh', road: 'Shakargarh Road',
                      villages: [{ name: 'Shakargarh Town', road: 'Shakargarh Road' }, { name: 'Jassar', road: 'Jassar Road' }, { name: 'Dera Baba Nanak', road: 'Border Road' }] }
                  ] },
                { id: 'zafarwal-tehsil', name: 'Zafarwal',
                  unionCouncils: [
                    { id: 'uc-zafarwal', name: 'Zafarwal', road: 'Zafarwal Road',
                      villages: [{ name: 'Zafarwal Town', road: 'Zafarwal Road' }, { name: 'Dhunni', road: 'Zafarwal Road' }, { name: 'Bindi Badar', road: 'Zafarwal Road' }] }
                  ] }
            ]
        }
    ]
};

const INITIAL_SERVICES = [
    { id: 1,  title: 'Plumber',       icon: '🔧', color: '#3b82f6', desc: 'Find trusted plumbers'      },
    { id: 2,  title: 'Electrician',   icon: '⚡',  color: '#f59e0b', desc: 'Find trusted electricians'  },
    { id: 3,  title: 'AC Repair',     icon: '❄️',  color: '#06b6d4', desc: 'Find trusted AC repair'     },
    { id: 4,  title: 'Home Tuition',  icon: '📚', color: '#8b5cf6', desc: 'Find trusted home tuition'  },
    { id: 5,  title: 'Car Mechanic',  icon: '🚗', color: '#ef4444', desc: 'Find trusted car mechanic'  },
    { id: 6,  title: 'Beauty Parlor', icon: '💅', color: '#ec4899', desc: 'Find trusted beauty parlor' },
    { id: 7,  title: 'Restaurants',   icon: '🍴', color: '#f97316', desc: 'Find trusted restaurants'   },
    { id: 8,  title: 'Carpenters',    icon: '🔨', color: '#b45309', desc: 'Find trusted carpenters'    },
    { id: 9,  title: 'Dentists',      icon: '🦷', color: '#10b981', desc: 'Find trusted dentists'      },
    { id: 10, title: 'Gyms',          icon: '🏋️', color: '#ef4444', desc: 'Find trusted gyms'          },
    { id: 11, title: 'Travel Agency', icon: '✈️',  color: '#3b82f6', desc: 'Find trusted travel agency' },
    { id: 12, title: 'Tailors',       icon: '👕', color: '#6366f1', desc: 'Find trusted tailors'       }
];

// ── FULL SERVICE CATALOG (grouped by header category) ────────────
const INITIAL_CATALOG = [
    {
        id: 'home', label: '🏠 Home & Garden', color: '#3b82f6',
        items: [
            { id: 'h1',  name: 'Plumbers',           icon: '🔧', imageUrl: '../sources/plumber.jpg',      price: 'Rs. 800'  },
            { id: 'h2',  name: 'Electricians',        icon: '⚡',  imageUrl: '../sources/electrician.jpg', price: 'Rs. 700'  },
            { id: 'h3',  name: 'AC Repair',           icon: '❄️',  imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80', price: 'Rs. 1500' },
            { id: 'h4',  name: 'Painters',            icon: '🖌️', imageUrl: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&q=80',    price: 'Rs. 1200' },
            { id: 'h5',  name: 'Pest Control',        icon: '🦟', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',    price: 'Rs. 2000' },
            { id: 'h6',  name: 'Waterproofing',       icon: '💧', imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80',  price: 'Rs. 1800' },
            { id: 'h7',  name: 'Furniture Repair',    icon: '🛋️', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',    price: 'Rs. 1000' },
            { id: 'h8',  name: 'Geyser Repair',       icon: '🔥', imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80',  price: 'Rs. 900'  },
            { id: 'h9',  name: 'Generator Services',  icon: '🔌', imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=80',  price: 'Rs. 1500' },
            { id: 'h10', name: 'Carpenters',          icon: '🔨', imageUrl: '../sources/carpenter.jpg',   price: 'Rs. 1000' },
            { id: 'h11', name: 'Home Cleaning',       icon: '🧹', imageUrl: '../sources/cleaner.jpg',     price: 'Rs. 500'  },
            { id: 'h12', name: 'Gardening',           icon: '🌱', imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80',  price: 'Rs. 800'  },
            { id: 'h13', name: 'Solar Panel',         icon: '☀️',  imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80',  price: 'Rs. 2000' },
            { id: 'h14', name: 'Locksmith',           icon: '🔑', imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80',    price: 'Rs. 600'  },
            { id: 'h15', name: 'UPS Repair',          icon: '🔋', imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',  price: 'Rs. 1200' },
            { id: 'h16', name: 'Water Tank Cleaning', icon: '🧪', imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80',  price: 'Rs. 1500' }
        ]
    },
    {
        id: 'domestic', label: '👥 Domestic Workers', color: '#8b5cf6',
        items: [
            { id: 'd1',  name: 'Maid / Housemaid', icon: '🧹', imageUrl: '../sources/maid.png',  price: 'Rs. 1500/day' },
            { id: 'd2',  name: 'Driver',           icon: '🚗', imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&q=80', price: 'Rs. 2000/day' },
            { id: 'd3',  name: 'Mali / Gardener',  icon: '🌱', imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80',  price: 'Rs. 1200/day' },
            { id: 'd4',  name: 'Dhobi',            icon: '🧺', imageUrl: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&q=80',  price: 'Rs. 800/day'  },
            { id: 'd5',  name: 'House Boy',        icon: '👦', imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80',  price: 'Rs. 1000/day' },
            { id: 'd6',  name: 'Pet Sitter',       icon: '🦮', imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80',  price: 'Rs. 1500/day' },
            { id: 'd7',  name: 'Cook',             icon: '🍳', imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',    price: 'Rs. 2500/day' },
            { id: 'd8',  name: 'Chowkidar',        icon: '👮', imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&q=80',  price: 'Rs. 2000/day' },
            { id: 'd9',  name: 'Nanny / Ayah',     icon: '👶', imageUrl: 'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=400&q=80',    price: 'Rs. 3000/day' },
            { id: 'd10', name: 'Sweeper',          icon: '🧼', imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80',  price: 'Rs. 800/day'  },
            { id: 'd11', name: 'Elderly Care',     icon: '👵', imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=400&q=80',  price: 'Rs. 2500/day' },
            { id: 'd12', name: 'Car Washer',       icon: '🚿', imageUrl: '../sources/carwash.png', price: 'Rs. 500'     }
        ]
    },
    {
        id: 'edu', label: '🎓 Education & Training', color: '#10b981',
        items: [
            { id: 'e1',  name: 'Home Tuition',        icon: '📚', imageUrl: '../sources/tutor.jpg', price: 'Rs. 4000/month' },
            { id: 'e2',  name: 'Female Teachers',     icon: '👩‍🏫', imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80', price: 'Rs. 5000/month' },
            { id: 'e3',  name: 'Hifz-e-Quran',        icon: '📖', imageUrl: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=400&q=80',  price: 'Rs. 3000/month' },
            { id: 'e4',  name: 'English Speaking',    icon: '🗣️', imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&q=80',    price: 'Rs. 4000/month' },
            { id: 'e5',  name: 'Computer Courses',    icon: '💻', imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80',  price: 'Rs. 5000/month' },
            { id: 'e6',  name: 'Matric/FSc Coaching', icon: '📝', imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80',  price: 'Rs. 6000/month' },
            { id: 'e7',  name: 'Driving Schools',     icon: '🚗', imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&q=80',  price: 'Rs. 8000/month' },
            { id: 'e8',  name: 'Online Tuition',      icon: '🌐', imageUrl: 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=400&q=80',  price: 'Rs. 3000/month' },
            { id: 'e9',  name: 'Quran Teacher',       icon: '☪️',  imageUrl: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=400&q=80',  price: 'Rs. 3000/month' },
            { id: 'e10', name: 'IELTS Prep',          icon: '🎓', imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80',  price: 'Rs. 7000/month' },
            { id: 'e11', name: 'Academies',           icon: '🏫', imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80',  price: 'Rs. 4000/month' },
            { id: 'e12', name: 'Entry Test Prep',     icon: '📋', imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80',  price: 'Rs. 6000/month' },
            { id: 'e13', name: 'Arabic Teacher',      icon: '🇦🇪', imageUrl: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=400&q=80',  price: 'Rs. 3500/month' },
            { id: 'e14', name: 'Montessori Schools',  icon: '🧸', imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80',  price: 'Rs. 5000/month' }
        ]
    },
    {
        id: 'auto', label: '🚗 Auto Services', color: '#ef4444',
        items: [
            { id: 'a1',  name: 'Car Mechanic',       icon: '👨‍🔧', imageUrl: '../sources/mechanic.jpg', price: 'Rs. 1500' },
            { id: 'a2',  name: 'Denting & Painting', icon: '🎨', imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80', price: 'Rs. 5000' },
            { id: 'a3',  name: 'Car Wash',           icon: '🚿', imageUrl: '../sources/carwash.png',   price: 'Rs. 500'  },
            { id: 'a4',  name: 'CNG Installation',   icon: '⛽', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',   price: 'Rs. 3000' },
            { id: 'a5',  name: 'Bike Mechanic',      icon: '🏍️', imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80',   price: 'Rs. 800'  },
            { id: 'a6',  name: 'Oil Change',         icon: '🛢️', imageUrl: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&q=80', price: 'Rs. 1200' },
            { id: 'a7',  name: 'Car Dealers',        icon: '🏎️', imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=80', price: 'Rs. 500'  },
            { id: 'a8',  name: 'Car Electrician',    icon: '⚡',  imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',   price: 'Rs. 1500' },
            { id: 'a9',  name: 'Car AC Service',     icon: '❄️',  imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80', price: 'Rs. 2000' },
            { id: 'a10', name: 'Tyre Shop',          icon: '🛞', imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80',   price: 'Rs. 1000' },
            { id: 'a11', name: 'Spare Parts',        icon: '⚙️', imageUrl: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&q=80', price: 'Rs. 500'  },
            { id: 'a12', name: 'Windscreen Repair',  icon: '🪟', imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80', price: 'Rs. 3000' },
            { id: 'a13', name: 'Vehicle Inspection', icon: '🔍', imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=80', price: 'Rs. 1000' },
            { id: 'a14', name: 'Tracker Install',    icon: '📡', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',   price: 'Rs. 2500' },
            { id: 'a15', name: 'Auto Insurance',     icon: '🛡️', imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=80', price: 'Rs. 5000' }
        ]
    },
    {
        id: 'health', label: '✨ Health & Beauty', color: '#ec4899',
        items: [
            { id: 'hb1',  name: 'General Physician', icon: '👨‍⚕️', imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80', price: 'Rs. 1000' },
            { id: 'hb2',  name: 'Dentists',          icon: '🦷', imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&q=80', price: 'Rs. 1500' },
            { id: 'hb3',  name: 'Physiotherapy',     icon: '🧘', imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80', price: 'Rs. 2000' },
            { id: 'hb4',  name: 'Pharmacy',          icon: '💊', imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80', price: 'Rs. 500'  },
            { id: 'hb5',  name: "Men's Salon",       icon: '💈', imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80', price: 'Rs. 500'  },
            { id: 'hb6',  name: 'Mehndi Artist',     icon: '🎨', imageUrl: '../sources/makeup.png',  price: 'Rs. 1500' },
            { id: 'hb7',  name: 'Nutritionist',      icon: '🍎', imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80', price: 'Rs. 2000' },
            { id: 'hb8',  name: 'Eye Specialist',    icon: '👁️', imageUrl: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&q=80',   price: 'Rs. 1500' },
            { id: 'hb9',  name: 'Beauty Parlor',     icon: '💅', imageUrl: '../sources/makeup.png',  price: 'Rs. 1000' },
            { id: 'hb10', name: 'Ladies Salon',      icon: '🧖', imageUrl: 'https://images.unsplash.com/photo-1560066984-138daaa0ad8a?w=400&q=80',   price: 'Rs. 1200' },
            { id: 'hb11', name: 'Skin Specialist',   icon: '🔬', imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80', price: 'Rs. 2500' },
            { id: 'hb12', name: 'Diagnostic Labs',   icon: '🧪', imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&q=80', price: 'Rs. 1000' },
            { id: 'hb13', name: 'Orthodontist',       icon: '🦷', imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&q=80', price: 'Rs. 3000' },
            { id: 'hb14', name: 'Specialist Doctors', icon: '🩺', imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80', price: 'Rs. 2000' },
            { id: 'hb15', name: 'Massage & Spa',      icon: '💆', imageUrl: 'https://images.unsplash.com/photo-1560066984-138daaa0ad8a?w=400&q=80',  price: 'Rs. 2500' }
        ]
    },
    {
        id: 'travel', label: '✈️ Travel & Transportation', color: '#0ea5e9',
        items: [
            { id: 't1', name: 'Travel Agency',    icon: '🎫', imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80', price: 'Rs. 5000'  },
            { id: 't2', name: 'Umrah/Hajj',       icon: '🕋', imageUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400&q=80', price: 'Rs. 50000' },
            { id: 't3', name: 'Car Rentals',      icon: '🚗', imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&q=80', price: 'Rs. 3000'  },
            { id: 't4', name: 'School Van',       icon: '🚌', imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80',   price: 'Rs. 2000'  },
            { id: 't5', name: 'Rickshaw/Taxi',    icon: '🛺', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',   price: 'Rs. 1000'  },
            { id: 't6', name: 'Packers & Movers', icon: '📦', imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80',   price: 'Rs. 5000'  },
            { id: 't7', name: 'Visa Consultant',  icon: '🛂', imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80', price: 'Rs. 3000'  },
            { id: 't8', name: 'Tour Packages',    icon: '🗺️', imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80', price: 'Rs. 10000' },
            { id: 't9',  name: 'Courier Service',    icon: '🚚', imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80',   price: 'Rs. 500'   },
            { id: 't10', name: 'Inter-City Bus',     icon: '🚍', imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80',   price: 'Rs. 800'   },
            { id: 't11', name: 'Car with Driver',    icon: '👤', imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&q=80', price: 'Rs. 4000'  },
            { id: 't12', name: 'Office Pick & Drop', icon: '🏢', imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&q=80', price: 'Rs. 3000'  },
            { id: 't13', name: 'Cargo Service',      icon: '🚢', imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80',   price: 'Rs. 10000' },
            { id: 't14', name: 'Train Booking',      icon: '🚆', imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80',   price: 'Rs. 1500'  }
        ]
    },
    {
        id: 'food', label: '🍴 Food & Restaurants', color: '#f97316',
        items: [
            { id: 'f1', name: 'Restaurants', icon: '🍽️', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80', price: 'Rs. 500'  },
            { id: 'f2', name: 'BBQ & Grill', icon: '🍗', imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', price: 'Rs. 800'  },
            { id: 'f3', name: 'Chinese Food', icon: '🥡', imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80', price: 'Rs. 600'  },
            { id: 'f4', name: 'Biryani',      icon: '🍚', imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80', price: 'Rs. 400'  },
            { id: 'f5', name: 'Fast Food',    icon: '🍔', imageUrl: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&q=80', price: 'Rs. 300'  },
            { id: 'f6', name: 'Pizza Places', icon: '🍕', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', price: 'Rs. 700'  },
            { id: 'f7', name: 'Bakery',       icon: '🥐', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80', price: 'Rs. 200'  },
            { id: 'f8', name: 'Chai Dhaba',   icon: '☕', imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80', price: 'Rs. 50'   },
            { id: 'f9',  name: 'Mithai Shops', icon: '🍬', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', price: 'Rs. 500'  },
            { id: 'f10', name: 'Seafood',      icon: '🦐', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', price: 'Rs. 1200' },
            { id: 'f11', name: 'Desi Food',    icon: '🍲', imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80', price: 'Rs. 400'  },
            { id: 'f12', name: 'Karahi & Handi',icon: '🥘', imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80', price: 'Rs. 600'  },
            { id: 'f13', name: 'Breakfast',    icon: '🍳', imageUrl: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&q=80', price: 'Rs. 250'  },
            { id: 'f14', name: 'Cafes',        icon: '🍰', imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80', price: 'Rs. 300'  }
        ]
    },
    {
        id: 'shop', label: '🛍️ Shopping & Retail', color: '#6366f1',
        items: [
            { id: 's1',  name: 'Grocery Store',  icon: '🛒', imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80', price: 'Rs. 500'  },
            { id: 's2',  name: 'Fruits & Veg',   icon: '🍎', imageUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&q=80', price: 'Rs. 200'  },
            { id: 's3',  name: 'Meat Shop',      icon: '🥩', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',   price: 'Rs. 800'  },
            { id: 's4',  name: 'Milk Shop',      icon: '🥛', imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80',   price: 'Rs. 150'  },
            { id: 's5',  name: 'Mobile Shops',   icon: '📱', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80', price: 'Rs. 5000' },
            { id: 's6',  name: 'Laptop/PC',      icon: '💻', imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80', price: 'Rs. 30000'},
            { id: 's7',  name: "Men's Fashion",  icon: '👔', imageUrl: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=400&q=80', price: 'Rs. 1500' },
            { id: 's8',  name: "Ladies Fashion", icon: '👗', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',   price: 'Rs. 2000' },
            { id: 's9',  name: 'Jewelry',        icon: '💍', imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80', price: 'Rs. 3000' },
            { id: 's10', name: 'Shoes',          icon: '👟', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',   price: 'Rs. 2000' },
            { id: 's11', name: 'Kids Wear',      icon: '👶', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',   price: 'Rs. 1000' },
            { id: 's12', name: 'Watches',        icon: '⌚', imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80', price: 'Rs. 2500' }
        ]
    },
    {
        id: 'workers', label: '👷 Workers & Helpers', color: '#b45309',
        items: [
            { id: 'w1', name: 'Mason / Mistri',  icon: '🧱', imageUrl: '../sources/mason.jpg', price: 'Rs. 1500/day' },
            { id: 'w2', name: 'Labor',           icon: '🏗️', imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80', price: 'Rs. 1000/day' },
            { id: 'w3', name: 'Loader',          icon: '📦', imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80',   price: 'Rs. 1200/day' },
            { id: 'w4', name: 'Security Guard',  icon: '👮', imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&q=80', price: 'Rs. 2000/day' },
            { id: 'w5', name: 'Office Boy',      icon: '👔', imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&q=80', price: 'Rs. 1000/day' },
            { id: 'w6', name: 'Delivery Boy',    icon: '🚲', imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80',   price: 'Rs. 1200/day' },
            { id: 'w7', name: 'Rider',           icon: '🏍️', imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80',   price: 'Rs. 1500/day' },
            { id: 'w8', name: 'Gardener',        icon: '🌱', imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80', price: 'Rs. 1000/day' },
            { id: 'w9',  name: 'Sweeper',         icon: '🧹', imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80', price: 'Rs. 800/day'  },
            { id: 'w10', name: 'Bodyguard',       icon: '🧤', imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&q=80', price: 'Rs. 3000/day' },
            { id: 'w11', name: 'CCTV Operator',   icon: '📹', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',   price: 'Rs. 2000/day' },
            { id: 'w12', name: 'Waiter',          icon: '🍽️', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80', price: 'Rs. 1200/day' }
        ]
    },
    {
        id: 'industrial', label: '🏭 Industrial Workers', color: '#475569',
        items: [
            { id: 'i1', name: 'Welder',                icon: '🔥', imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80', price: 'Rs. 2500/day' },
            { id: 'i2', name: 'Fabricator',            icon: '🛠️', imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80', price: 'Rs. 3000/day' },
            { id: 'i3', name: 'Turner',                icon: '⚙️', imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80', price: 'Rs. 2500/day' },
            { id: 'i4', name: 'Machinist',             icon: '🔧', imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80', price: 'Rs. 2500/day' },
            { id: 'i5', name: 'Fitter',                icon: '🔩', imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80', price: 'Rs. 2000/day' },
            { id: 'i6', name: 'Industrial Electrician',icon: '⚡',  imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',   price: 'Rs. 3000/day' },
            { id: 'i7', name: 'Industrial AC',         icon: '❄️',  imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80', price: 'Rs. 3500/day' },
            { id: 'i8', name: 'Boiler Operator',       icon: '🔥', imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80', price: 'Rs. 4000/day' },
            { id: 'i9',  name: 'Solar Tech',            icon: '☀️',  imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80', price: 'Rs. 5000/day' },
            { id: 'i10', name: 'Lift Tech',             icon: '🛗', imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80', price: 'Rs. 4000/day' },
            { id: 'i11', name: 'Network Tech',          icon: '📡', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',   price: 'Rs. 3000/day' }
        ]
    }
];

const INITIAL_BUSINESSES = [
    { id: 1, name: 'Crystal Aluminium',   loc: 'Gujranwala',  cityId: null,      ucId: null,         status: 'OPEN', verified: true, rating: 4, category: 'Other Service',  image: '../sources/logo.png'         },
    { id: 2, name: 'Bike Mechanic',       loc: 'G.T. Road',   cityId: null,      ucId: null,         status: 'OPEN', verified: true, rating: 4, category: 'Auto Services',   image: '../sources/logo.png'         },
    { id: 3, name: 'Malik Cement Agency', loc: 'Pasrur City', cityId: 'pasrur', ucId: 'uc-pasrur-city', status: 'OPEN', verified: true, rating: 5, category: 'Real Estate',    image: '../sources/mason.jpg'        },
    { id: 4, name: 'DJ Jazi Sound',       loc: 'Haibat Pur',  cityId: 'pasrur', ucId: 'uc-chawinda',   status: 'OPEN', verified: true, rating: 5, category: 'Entertainment', image: '../sources/electrician.jpg' }
];

const INITIAL_TESTIMONIALS = [
    { id: 1, name: 'Ijaz Khan',     biz: 'DJ Jazi Sound',       text: 'PakServicesHub has been a game changer for our village!',  video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumb: '../sources/logo.png' },
    { id: 2, name: 'Tayyab Sajid', biz: 'Malik Cement Agency', text: 'Easy to use and brings genuine clients from nearby areas.', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumb: '../sources/logo.png' },
    { id: 3, name: 'Mohsin Munir', biz: 'Pasrur',              text: 'Highly recommended for quality local services.',            video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumb: '../sources/logo.png' }
];

// ── STORE OBJECT ───────────────────────────────────────────────────
const store = {

    // ── Private Internal helpers ────────────────────────────────────────
    _save(key, data) { localStorage.setItem(key, JSON.stringify(data)); },
    _load(key, fallback) {
        try {
            const val = localStorage.getItem(key);
            return val ? JSON.parse(val) : fallback;
        } catch(e) { return fallback; }
    },
    _findCity(data, cityId) { return data.cities.find(c => c.id === cityId); },
    _findTehsil(city, tehsilId) { return (city?.tehsils || []).find(t => t.id === tehsilId); },
    _findUC(tehsil, ucId) { return (tehsil?.unionCouncils || []).find(u => u.id === ucId); },
    _vName(v) { return typeof v === 'string' ? v : v.name; },
    _vRoad(v) { return typeof v === 'string' ? '' : (v.road || ''); },
    _slug(str) { return str.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''); },

    // ── LOCATION LOGIC ──────────────────────────────────────────
    getLocationData() { return this._load('psh_location_v3', LOCATION_DATA_DEFAULT); },

    getAllVillagesForCity(cityId) {
        const city = this._findCity(this.getLocationData(), cityId);
        if (!city) return [];
        const result = [];
        (city.tehsils || []).forEach(t => {
            (t.unionCouncils || []).forEach(uc => {
                (uc.villages || []).forEach(v => {
                    result.push({
                        name:       this._vName(v),
                        road:       this._vRoad(v) || uc.road, // fallback to UC road
                        ucName:     uc.name,
                        ucId:       uc.id,
                        tehsilName: t.name,
                        tehsilId:   t.id
                    });
                });
            });
        });
        // Sort: road-wise first, then alphabetical
        return result.sort((a, b) => {
            if (a.road && b.road && a.road !== b.road) return a.road.localeCompare(b.road);
            return a.name.localeCompare(b.name);
        });
    },

    countVillages(cityId, tehsilId = null, ucId = null) {
        const data = this.getLocationData();
        const city = this._findCity(data, cityId);
        if (!city) return 0;
        let count = 0;
        (city.tehsils || []).forEach(t => {
            if (tehsilId && t.id !== tehsilId) return;
            (t.unionCouncils || []).forEach(uc => {
                if (ucId && uc.id !== ucId) return;
                count += (uc.villages || []).length;
            });
        });
        return count;
    },

    // ── CITY CRUD ───────────────────────────────────────────────
    addCity(name, district = '') {
        const data = this.getLocationData();
        const id = 'city-' + this._slug(name);
        if (data.cities.find(c => c.id === id)) return false;
        data.cities.push({ id, name, district, tehsils: [] });
        this._save('psh_location_v3', data); 
        return true;
    },
    removeCity(cityId) {
        const data = this.getLocationData();
        data.cities = data.cities.filter(c => c.id !== cityId);
        this._save('psh_location_v3', data);
    },

    // ── TEHSIL CRUD ─────────────────────────────────────────────
    addTehsil(cityId, name) {
        const data = this.getLocationData();
        const city = this._findCity(data, cityId);
        if (!city) return false;
        const id = cityId + '-' + this._slug(name);
        if ((city.tehsils || []).find(t => t.id === id)) return false;
        if (!city.tehsils) city.tehsils = [];
        city.tehsils.push({ id, name, unionCouncils: [] });
        this._save('psh_location_v3', data); 
        return true;
    },

    // ── UNION COUNCIL CRUD ──────────────────────────────────────
    addUC(cityId, tehsilId, name, road = '') {
        const data = this.getLocationData();
        const city = this._findCity(data, cityId);
        const tehsil = this._findTehsil(city, tehsilId);
        if (!tehsil) return false;
        const id = tehsilId + '-' + this._slug(name);
        if ((tehsil.unionCouncils || []).find(u => u.id === id)) return false;
        if (!tehsil.unionCouncils) tehsil.unionCouncils = [];
        tehsil.unionCouncils.push({ id, name, road, villages: [] });
        this._save('psh_location_v3', data); 
        return true;
    },

    // ── VILLAGE CRUD ────────────────────────────────────────────
    addVillage(cityId, tehsilId, ucId, name, road = '') {
        const data = this.getLocationData();
        const city = this._findCity(data, cityId);
        const tehsil = this._findTehsil(city, tehsilId);
        const uc = this._findUC(tehsil, ucId);
        if (!uc) return false;
        if (!uc.villages) uc.villages = [];
        const vName = name.trim();
        if (uc.villages.find(v => this._vName(v).toLowerCase() === vName.toLowerCase())) return false;
        uc.villages.push({ name: vName, road: road.trim() });
        this._save('psh_location_v3', data); 
        return true;
    },

    // ── SERVICE CATALOG (grouped categories) ──────────────────────
    // v3 = all mega menu items added
    getCatalog() {
        // Force refresh if old version cached
        const ver = localStorage.getItem('psh_catalog_ver');
        if (ver !== '3') {
            localStorage.removeItem('psh_catalog_v1');
            localStorage.setItem('psh_catalog_ver', '3');
        }
        return this._load('psh_catalog_v1', INITIAL_CATALOG);
    },

    saveCatalog(data) { this._save('psh_catalog_v1', data); },

    updateCatalogItem(catId, itemId, fields) {
        const catalog = this.getCatalog();
        const cat = catalog.find(c => c.id === catId);
        if (!cat) return false;
        const item = cat.items.find(i => i.id === itemId);
        if (!item) return false;
        Object.assign(item, fields);
        this.saveCatalog(catalog);
        return true;
    },

    deleteCatalogItem(catId, itemId) {
        const catalog = this.getCatalog();
        const cat = catalog.find(c => c.id === catId);
        if (!cat) return false;
        cat.items = cat.items.filter(i => i.id !== itemId);
        this.saveCatalog(catalog);
        return true;
    },

    addCatalogItem(catId, name, icon, imageUrl, price) {
        const catalog = this.getCatalog();
        const cat = catalog.find(c => c.id === catId);
        if (!cat) return false;
        const id = catId + '-' + Date.now();
        cat.items.push({ id, name, icon: icon || '🔧', imageUrl: imageUrl || '', price: price || '' });
        this.saveCatalog(catalog);
        return true;
    },

    // ── SERVICES & BUSINESSES ─────────────────────────────────────
    getServices() { return this._load('psh_services', INITIAL_SERVICES); },

    getBusinesses(filter = {}) { 
        let list = this._load('psh_businesses', INITIAL_BUSINESSES); 
        if (filter.cityId) list = list.filter(b => b.cityId === filter.cityId);
        if (filter.category) list = list.filter(b => b.category === filter.category);
        return list;
    },

    addBusiness(biz) {
        const list = this.getBusinesses(); 
        biz.id = Date.now(); 
        biz.verified = biz.verified || false;
        biz.rating = biz.rating || 0;
        list.push(biz);
        this._save('psh_businesses', list);
    },

    deleteBusiness(id) {
        const filtered = this.getBusinesses().filter(b => b.id !== id);
        this._save('psh_businesses', filtered);
    },

    // ── TESTIMONIALS ────────────────────────────────────────────
    getTestimonials() { return this._load('psh_testimonials', INITIAL_TESTIMONIALS); },
    addTestimonial(t) {
        const list = this.getTestimonials(); 
        t.id = Date.now(); 
        list.push(t);
        this._save('psh_testimonials', list);
    },
    deleteTestimonial(id) {
        const list = this.getTestimonials().filter(t => t.id !== id);
        this._save('psh_testimonials', list);
    },

    // ── AUTHENTICATION ──────────────────────────────────────────
    isAdmin() { 
        const u = this._load('currentUser', null); 
        return u && u.role === 'admin'; 
    },

    setCurrentUser(user) { this._save('currentUser', user); },

    logout() { localStorage.removeItem('currentUser'); window.location.href = 'index.html'; },

    async hashStr(str) {
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    },

    async initAdminHash() {
        if (!localStorage.getItem('psh_admin_hash')) {
            localStorage.setItem('psh_admin_hash', await this.hashStr('psh@admin2024'));
            localStorage.setItem('psh_admin_user', 'admin');
        }
    },

    async verifyAdmin(username, password) {
        const h = localStorage.getItem('psh_admin_hash');
        const u = localStorage.getItem('psh_admin_user') || 'admin';
        if (!h || username !== u) return false;
        const inputHash = await this.hashStr(password);
        return inputHash === h;
    }
};

// Initialize Admin on load
store.initAdminHash();