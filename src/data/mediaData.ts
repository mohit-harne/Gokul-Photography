import story1 from '../assets/stories/stories (1).jpg';
import story2 from '../assets/stories/stories (2).jpg';
import story3 from '../assets/stories/stories (3).jpg';
import Wedding1 from '../assets/wedding/Wedding (1).jpg';
import Wedding5 from '../assets/wedding/Wedding (5).jpg';
import Prewedding8 from '../assets/pre_wedding/Pre-wedding (7).jpg';

// Portfolio highlights
export const portfolioCategories = [
  {
    index: "01",
    title: "Weddings",
    subtitle: "Ceremonies & Sacred Rites",
    description: "Honest portraits and timeless memories captured in soft documentary light.",
    image: Wedding5,
    link: "/portfolio/wedding",
  },
  {
    index: "02",
    title: "Pre-Weddings",
    subtitle: "Intimate Engagements",
    description: "Quiet chemistry, scenic landscapes, and unscripted preludes to your vows.",
    image: Prewedding8,
    link: "/portfolio/pre-wedding",
  }
];

// Latest Stories
export const latestStories = [
  {
    couple: "Divya & Kashyap",
    location: "Nagpur",
    category: "Wedding",
    image: story1,
    link: "/stories/divya-kashyap",
  },
  {
    couple: "Vrushali & Pruthviraj",
    location: "Pune",
    category: "Royal Wedding",
    image: story2,
    link: "/stories/vrushali-pruthviraj",
  },
  {
    couple: "Tushar & Srishti",
    location: "Mumbai",
    category: "Destination Wedding",
    image: story3,
    link: "/stories/tushar-srishti",
  }
];

// Featured Films
export const featuredFilms = [
  {
    tag: "Lovebirds",
    couple: "Pratik & Shrusti",
    event: "Wedding Film",
    description: "A love marriage is a beautiful union where two individuals choose each other based on mutual affection, deep friendship, and understanding.",
    thumbnail: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1200&q=80",
    videoId: "1t32XVVVCFw",
  },
  {
    tag: "Soulmates",
    couple: "Ankit & Aporva",
    event: "Wedding Film",
    description: "Love is the expansion of two natures in such fashion that each includes the other, and each is enriched by the other.",
    thumbnail: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
    videoId: "qU92sQZbnpk",
  }
];

export const stories = [
  {
    slug: "ananya-and-kabir",
    couple: "Ananya & Kabir",
    location: "Alila Fort Bishangarh, Jaipur",
    category: "Royal Heritage Wedding",
    coverImage: story1, 
    excerpt: "A two-day celebration within the 230-year-old warrior fortress, blending Rajput grandeur with quiet personal vows at dusk."
  },
  {
    slug: "ria-and-dev",
    couple: "Ria & Dev",
    location: "Morjim Beach, North Goa",
    category: "Intimate Coastal Elopement",
    coverImage: story2,
    excerpt: "Barefoot on the Arabian sea shore with just 30 of their closest friends and endless live jazz under string lights."
  },
  {
    slug: "meera-and-aditya",
    couple: "Meera & Aditya",
    location: "Taj Falaknuma Palace, Hyderabad",
    category: "Nawabi Grandeur",
    coverImage: story3,
    excerpt: "An opulent palace celebration framed by classical qawwalis, hand-embroidered velvet, and candlelit courtyard dinners."
  }
];

// Exporting individual assets for direct access anywhere
export const assets = {
  lateststories: { story1, story2, story3 },
  wedding: { Wedding1, Wedding5 },
  preWedding: { Prewedding8 }
};