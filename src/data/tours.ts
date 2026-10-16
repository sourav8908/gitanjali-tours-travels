import type { TourPackage } from '../types';

/**
 * =========================================================================
 * ODISHA & OUTSTATION TOUR PACKAGES CONFIGURATION
 * =========================================================================
 * NOTE: The itineraries below are popular Odisha travel circuits set up as
 * editable demo templates. The business owner can adjust package names,
 * pricing, durations, and sightseeing checklists here.
 */

export const toursData: TourPackage[] = [
  {
    id: 'tour-golden-triangle',
    title: 'Odisha Golden Triangle Circuit',
    route: 'Bhubaneswar → Dhauli → Konark → Puri',
    region: 'Odisha',
    category: 'Odisha Golden Triangle',
    duration: '2 Days / 1 Night',
    startingPrice: '₹5,800',
    priceNote: 'Starting tariff per vehicle (Sedan / MPV / Van options)',
    description: 'Experience Odisha’s iconic heritage circuit: Lingaraj & Khandagiri in Bhubaneswar, the Dhauli Peace Pagoda, the UNESCO World Heritage Konark Sun Temple, and Puri Jagannath Temple & Golden Beach.',
    image: '/images/odisha/konark-sun-temple.webp',
    isDemoData: true,
    inclusions: [
      'Dedicated AC vehicle with driver for complete 2-day itinerary',
      'Doorstep pickup from Bhubaneswar Airport / Railway Station / Hotel',
      'Coverage: Lingaraj, Dhauli, Konark Sun Temple, Chandrabhaga Beach & Puri',
      'Fuel charges, all highway toll gates & driver allowance included'
    ],
    highlights: [
      'Bhubaneswar ancient temple architecture & Khandagiri caves',
      'Dhauli Giri Buddhist Shanti Stupa overlooking Daya River',
      'Konark Sun Temple stone chariot carvings & Chandrabhaga coastal drive',
      'Puri Jagannath Dham darshan coordination & Golden Beach sunset'
    ]
  },
  {
    id: 'tour-chilika-dolphin',
    title: 'Chilika Lake Lagoon & Dolphin Excursion',
    route: 'Bhubaneswar → Satapada / Barkul → Sea Mouth',
    region: 'Odisha',
    category: 'Coastal & Nature',
    duration: 'Full Day (8 – 10 Hours)',
    startingPrice: '₹3,400',
    priceNote: 'Starting tariff per vehicle (Includes fuel & tolls)',
    description: 'Travel to Asia’s largest brackish water lagoon. Take a boat cruise at Satapada to spot Irrawaddy dolphins, visit the island temple of Kalijai or Rajhans, and enjoy fresh seafood by the waters.',
    image: '/images/odisha/chilika-lake.webp',
    isDemoData: true,
    inclusions: [
      'Clean sanitized AC car with courteous driver for full day',
      'Direct pickup from your Bhubaneswar residence / hotel',
      'Comfortable highway drive on NH-16 / NH-316 with refreshment stops',
      'Safe waiting at Satapada / Barkul boat jetty'
    ],
    highlights: [
      'Scenic drive through rural Odisha countryside and coconut groves',
      'Satapada Irrawaddy dolphin viewpoint & Sea Mouth island',
      'Local authentic Chilika crab and prawn culinary recommendations',
      'Flexible return departure timing'
    ]
  },
  {
    id: 'tour-puri-marine-drive',
    title: 'Puri Beach & Raghurajpur Craft Tour',
    route: 'Bhubaneswar → Raghurajpur → Puri Beach → Marine Drive',
    region: 'Odisha',
    category: 'Coastal & Nature',
    duration: '1 Day or Weekend Break',
    startingPrice: '₹2,600',
    priceNote: 'Fixed rate for full-day private car',
    description: 'A relaxed coastal getaway combining the traditional Pattachitra artisan village of Raghurajpur, holy darshan at Puri Jagannath Temple, and evening relaxation on the Puri-Konark Marine Drive.',
    image: '/images/odisha/puri-beach-sunrise.webp',
    isDemoData: true,
    inclusions: [
      'Private air-conditioned car with experienced local driver',
      'Stopover at Raghurajpur Heritage Craft Village',
      'Drop-off near Puri Grand Road & Swargadwar Beach',
      'Puri-Konark Marine Drive scenic coastal route'
    ],
    highlights: [
      'Meet master Pattachitra palm-leaf scroll painters in Raghurajpur',
      'Puri Sea Beach evening stroll & famous Khaja sweet shopping',
      'Pristine Marine Drive coastal stretch with ocean breeze',
      'Hassle-free parking management by driver'
    ]
  },
  {
    id: 'tour-buddhist-circuit',
    title: 'Diamond Triangle Buddhist Heritage',
    route: 'Bhubaneswar → Ratnagiri → Udayagiri → Lalitgiri',
    region: 'Odisha',
    category: 'Heritage & Temples',
    duration: 'Full Day Excursion',
    startingPrice: '₹3,800',
    priceNote: 'Covers ~220 km round trip',
    description: 'Explore the fascinating ancient Buddhist monastic complexes of Ratnagiri, Udayagiri, and Lalitgiri in Jajpur district, featuring magnificent carved stupas, stone monasteries, and archaeological museum relics.',
    image: '/images/odisha/ratnagiri.webp',
    isDemoData: true,
    inclusions: [
      'Comfortable AC sedan or SUV for highway travel',
      'Complete round-trip coverage of Ratnagiri, Udayagiri & Lalitgiri',
      'Toll plaza fees and driver allowance included',
      'Door-to-door morning pickup and evening return'
    ],
    highlights: [
      'Magnificent carved monastic doorway and stupas at Ratnagiri',
      'Ancient stepped well and rock-cut sculptures at Udayagiri',
      'Archaeological museum & relic casket heritage at Lalitgiri',
      'Peaceful rural highway road trip'
    ]
  },
  {
    id: 'tour-outstation-interstate',
    title: 'Interstate Outstation Road Journey',
    route: 'Bhubaneswar ⇄ Kolkata / Visakhapatnam / Ranchi',
    region: 'Outstation',
    category: 'Outstation Travel',
    duration: 'Multi-Day (Custom Days)',
    startingPrice: '₹14 / km',
    priceNote: 'Measured by exact distance & days (Min. 250 km/day)',
    description: 'Smooth interstate highway travel for family weddings, business meetings, medical visits, or leisure holidays connecting Bhubaneswar to Kolkata, Vizag, Ranchi, or Jamshedpur with dedicated drivers.',
    image: '/images/vehicles/force-tempo-traveller.webp',
    isDemoData: true,
    inclusions: [
      'Choice of Innova Crysta, Maruti Dzire, Scorpio-N or Tempo Traveller',
      'Experienced commercial highway driver familiar with interstate routes',
      'Scheduled meal and refreshment stops at clean highway plazas',
      'Transparent odometer reading with customer'
    ],
    highlights: [
      'NH-16 direct golden quadrilateral highway cruising',
      'Comfortable door-to-door interstate transit without train/flight hassles',
      'Luggage safety and flexible travel schedule',
      '24/7 journey coordination support'
    ]
  }
];
