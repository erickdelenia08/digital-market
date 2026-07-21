// Types
export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  image: string;
  thumbnail: string;
  isFeatured: boolean;
  isBestseller: boolean;
  inStock: boolean;
  description: string;
  shortDescription: string;
  features: string[];
  specs: Record<string, string>;
  variants?: {
    ram?: string[];
    storage?: string[];
    colors?: { name: string; value: string }[];
  };
}

export interface Blog {
  id: number;
  title: string;
  category: string;
  author: string;
  date: string;
  image: string;
  excerpt: string;
  content: string;
  tags: string[];
  authorImage?: string;
  readTime?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  review: string;
  rating: number;
  avatar: string;
}

// Brands
export const brands: string[] = [
  "Microsoft",
  "Adobe",
  "Motion Array",
  "Envato",
  "CodeGraph Originals",
  "Creative Market"
];

// Products Data
export const products: Product[] = [
  {
    id: 1,
    name: "Financial Dashboard Pro",
    price: 49,
    originalPrice: 79,
    category: "Excel Templates",
    brand: "CodeGraph Originals",
    rating: 4.9,
    reviewCount: 284,
    image: "bg-gradient-to-br from-indigo-500 to-purple-600",
    thumbnail: "bg-gradient-to-br from-indigo-400 to-purple-500",
    isFeatured: true,
    isBestseller: true,
    inStock: true,
    description: "A comprehensive Excel template for financial tracking, budgeting, and reporting with dynamic charts and automated calculations. Perfect for businesses of all sizes.",
    shortDescription: "Professional financial tracking template with automated calculations.",
    features: [
      "Dynamic Dashboard with Real-time Updates",
      "Automated P&L Statements",
      "Cash Flow Projections",
      "Budget vs Actual Tracking",
      "Multi-currency Support",
      "Print-ready Reports"
    ],
    specs: {
      "Format": "Microsoft Excel (.xlsx)",
      "Compatibility": "Excel 2016+, Google Sheets",
      "Size": "2.4 MB",
      "Sheets": "12 interconnected sheets",
      "License": "Single user commercial"
    }
  },
  {
    id: 2,
    name: "Dynamic Slideshow Maker",
    price: 39,
    category: "After Effects",
    brand: "Motion Array",
    rating: 4.8,
    reviewCount: 156,
    image: "bg-gradient-to-br from-cyan-500 to-blue-600",
    thumbnail: "bg-gradient-to-br from-cyan-400 to-blue-500",
    isFeatured: true,
    isBestseller: false,
    inStock: true,
    description: "Professional After Effects project file for creating stunning dynamic slideshows with smooth transitions and customizable animations.",
    shortDescription: "Create stunning slideshows with smooth transitions.",
    features: [
      "50+ Animation Presets",
      "Modular Structure",
      "Color Control Panel",
      "No Plugins Required",
      "4K Resolution Support",
      "Video Tutorial Included"
    ],
    specs: {
      "Format": "After Effects Project (.aep)",
      "Version": "CC 2019+",
      "Resolution": "4K (3840x2160)",
      "Duration": "Unlimited",
      "Plugins": "None required"
    }
  },
  {
    id: 3,
    name: "Video Transition Pack",
    price: 29,
    originalPrice: 49,
    category: "Video Assets",
    brand: "Envato",
    rating: 4.7,
    reviewCount: 412,
    image: "bg-gradient-to-br from-orange-500 to-red-600",
    thumbnail: "bg-gradient-to-br from-orange-400 to-red-500",
    isFeatured: true,
    isBestseller: true,
    inStock: true,
    description: "50+ premium video transitions including wipes, zooms, glows, and creative effects compatible with all major editing software.",
    shortDescription: "50+ premium transitions for video editors.",
    features: [
      "50+ Unique Transitions",
      "Drag & Drop Usage",
      "Premiere Pro Compatible",
      "Final Cut Pro Compatible",
      "DaVinci Resolve Compatible",
      "Sound Effects Included"
    ],
    specs: {
      "Format": "MOV (ProRes 4444)",
      "Resolution": "4K",
      "Frame Rate": "24/25/30/60 fps",
      "Duration": "Each 0.5-2 seconds",
      "Size": "890 MB"
    }
  },
  {
    id: 4,
    name: "Creator's Essential Toolkit",
    price: 79,
    originalPrice: 129,
    category: "Creator Toolkits",
    brand: "Creative Market",
    rating: 5.0,
    reviewCount: 89,
    image: "bg-gradient-to-br from-emerald-500 to-teal-600",
    thumbnail: "bg-gradient-to-br from-emerald-400 to-teal-500",
    isFeatured: true,
    isBestseller: true,
    inStock: true,
    description: "Everything a content creator needs: templates, overlays, sound effects, motion graphics, and social media kits in one comprehensive package.",
    shortDescription: "Complete bundle for content creators.",
    features: [
      "100+ Motion Graphics",
      "50+ Social Templates",
      "200+ Sound Effects",
      "Thumbnail Templates",
      "Lower Thirds Pack",
      "Video Overlays"
    ],
    specs: {
      "Files": "500+ assets",
      "Formats": "AE, PR, PSD, AI, MP3",
      "Size": "4.2 GB",
      "Updates": "Free lifetime updates",
      "Support": "Email + Discord"
    }
  },
  {
    id: 5,
    name: "Project Management Tracker",
    price: 35,
    category: "Excel Templates",
    brand: "Microsoft",
    rating: 4.6,
    reviewCount: 178,
    image: "bg-gradient-to-br from-pink-500 to-rose-600",
    thumbnail: "bg-gradient-to-br from-pink-400 to-rose-500",
    isFeatured: false,
    isBestseller: false,
    inStock: true,
    description: "Track projects, tasks, deadlines, and team performance with this intuitive Excel-based project management solution.",
    shortDescription: "Track projects and team performance easily.",
    features: [
      "Gantt Chart View",
      "Team Workload Analysis",
      "Milestone Tracking",
      "Budget Monitoring",
      "Risk Register",
      "Automated Reports"
    ],
    specs: {
      "Format": "Microsoft Excel (.xlsx)",
      "Compatibility": "Excel 2016+, Google Sheets",
      "Size": "1.8 MB",
      "Sheets": "8 interconnected sheets"
    }
  },
  {
    id: 6,
    name: "Cinematic Title Sequence",
    price: 45,
    category: "After Effects",
    brand: "Motion Array",
    rating: 4.9,
    reviewCount: 234,
    image: "bg-gradient-to-br from-violet-500 to-indigo-600",
    thumbnail: "bg-gradient-to-br from-violet-400 to-indigo-500",
    isFeatured: false,
    isBestseller: true,
    inStock: true,
    description: "Hollywood-style cinematic title sequence template with dramatic camera movements, particle effects, and epic text animations.",
    shortDescription: "Epic cinema-quality title animations.",
    features: [
      "Cinematic Camera Moves",
      "Particle System",
      "10 Title Presets",
      "Easy Text Editing",
      "Logo Placeholder",
      "Video Tutorial"
    ],
    specs: {
      "Format": "After Effects Project (.aep)",
      "Version": "CC 2020+",
      "Resolution": "4K",
      "Plugin": "Element 3D (optional)",
      "Duration": "15-30 seconds"
    }
  },
  {
    id: 7,
    name: "Social Media Lower Thirds",
    price: 19,
    category: "Video Assets",
    brand: "Envato",
    rating: 4.5,
    reviewCount: 567,
    image: "bg-gradient-to-br from-amber-500 to-orange-600",
    thumbnail: "bg-gradient-to-br from-amber-400 to-orange-500",
    isFeatured: false,
    isBestseller: false,
    inStock: true,
    description: "Modern lower third templates optimized for YouTube, Instagram, and TikTok with clean typography and smooth animations.",
    shortDescription: "Clean lower thirds for social media.",
    features: [
      "30+ Lower Third Styles",
      "Social Media Icons",
      "Animated Subscribers Count",
      "Name & Title Layouts",
      "Easy Color Customization",
      "Premiere Pro Essential"
    ],
    specs: {
      "Format": "Motion Graphics Template (.mogrt)",
      "Software": "Premiere Pro CC 2019+",
      "Resolution": "4K",
      "Duration": "5-10 seconds each"
    }
  },
  {
    id: 8,
    name: "Invoice & Billing System",
    price: 25,
    originalPrice: 39,
    category: "Excel Templates",
    brand: "CodeGraph Originals",
    rating: 4.7,
    reviewCount: 342,
    image: "bg-gradient-to-br from-slate-500 to-gray-700",
    thumbnail: "bg-gradient-to-br from-slate-400 to-gray-600",
    isFeatured: false,
    isBestseller: false,
    inStock: true,
    description: "Professional invoicing system with automatic calculations, payment tracking, client database, and financial reporting features.",
    shortDescription: "Complete invoicing and billing solution.",
    features: [
      "Auto Invoice Numbering",
      "Client Database",
      "Payment Tracking",
      "Tax Calculations",
      "Email-Ready PDFs",
      "Monthly Reports"
    ],
    specs: {
      "Format": "Microsoft Excel (.xlsx)",
      "Compatibility": "Excel 2016+, Google Sheets",
      "Size": "1.2 MB",
      "Sheets": "6 interconnected sheets"
    }
  },
  {
    id: 9,
    name: "Motion Graphics Bundle",
    price: 89,
    originalPrice: 149,
    category: "Creator Toolkits",
    brand: "Motion Array",
    rating: 4.8,
    reviewCount: 211,
    image: "bg-gradient-to-br from-teal-500 to-cyan-600",
    thumbnail: "bg-gradient-to-br from-teal-400 to-cyan-500",
    isFeatured: true,
    isBestseller: false,
    inStock: true,
    description: "200+ motion graphic elements including titles, icons, backgrounds, and animated shapes for professional video production.",
    shortDescription: "200+ animated elements for videos.",
    features: [
      "200+ Motion Elements",
      "Animated Icons",
      "Background Loops",
      "Title Animations",
      "Shape Transitions",
      "After Effects Native"
    ],
    specs: {
      "Files": "200+ compositions",
      "Format": "After Effects Project (.aep)",
      "Resolution": "4K",
      "Size": "2.1 GB",
      "Color": "Color Control Layers"
    }
  },
  {
    id: 10,
    name: "E-commerce Analytics Dashboard",
    price: 59,
    category: "Excel Templates",
    brand: "Microsoft",
    rating: 4.9,
    reviewCount: 156,
    image: "bg-gradient-to-br from-blue-500 to-indigo-600",
    thumbnail: "bg-gradient-to-br from-blue-400 to-indigo-500",
    isFeatured: false,
    isBestseller: true,
    inStock: true,
    description: "Track sales, inventory, customer behavior, and revenue metrics with this powerful Excel-based e-commerce analytics solution.",
    shortDescription: "E-commerce analytics and tracking.",
    features: [
      "Sales Dashboard",
      "Inventory Tracking",
      "Customer Analysis",
      "Revenue Forecasting",
      "Multi-channel Support",
      "Automated Reports"
    ],
    specs: {
      "Format": "Microsoft Excel (.xlsx)",
      "Compatibility": "Excel 2016+",
      "Size": "3.2 MB",
      "Features": "Power Query, Power Pivot"
    }
  },
  {
    id: 11,
    name: "YouTube Thumbnail Pack",
    price: 15,
    category: "Creator Toolkits",
    brand: "Creative Market",
    rating: 4.4,
    reviewCount: 892,
    image: "bg-gradient-to-br from-red-500 to-rose-600",
    thumbnail: "bg-gradient-to-br from-red-400 to-rose-500",
    isFeatured: false,
    isBestseller: false,
    inStock: true,
    description: "50 eye-catching YouTube thumbnail templates designed to boost click-through rates with bold typography and vibrant layouts.",
    shortDescription: "50 YouTube thumbnail templates.",
    features: [
      "50 Thumbnail Templates",
      "Smart Object Layers",
      "Fully Customizable",
      "Bright Color Schemes",
      "Free Fonts Used",
      "Organized Layers"
    ],
    specs: {
      "Format": "Photoshop (.psd)",
      "Resolution": "1280x720",
      "Size": "180 MB",
      "Software": "Photoshop CC+"
    }
  },
  {
    id: 12,
    name: "Documentary Pack",
    price: 69,
    category: "After Effects",
    brand: "Motion Array",
    rating: 4.8,
    reviewCount: 98,
    image: "bg-gradient-to-br from-neutral-500 to-slate-700",
    thumbnail: "bg-gradient-to-br from-neutral-400 to-slate-600",
    isFeatured: false,
    isBestseller: false,
    inStock: true,
    description: "Complete documentary production toolkit with titles, lower thirds, maps, timelines, and professional transitions.",
    shortDescription: "Documentary production toolkit.",
    features: [
      "Documentary Titles",
      "Location Maps",
      "Timeline Graphics",
      "Callout Elements",
      "Interview Bumpers",
      "Chapter Markers"
    ],
    specs: {
      "Format": "After Effects Project (.aep)",
      "Version": "CC 2019+",
      "Resolution": "4K",
      "Elements": "80+ scenes",
      "Size": "1.8 GB"
    }
  }
];

// Categories Data
export const categories: string[] = [
  "Excel Templates",
  "After Effects",
  "Video Assets",
  "Creator Toolkits"
];

export const categoryDescriptions: Record<string, string> = {
  "Excel Templates": "Professional spreadsheet solutions for data analysis, project management, and financial tracking.",
  "After Effects": "Cinematic project files for video production, motion graphics, and visual effects.",
  "Video Assets": "Transitions, overlays, lower thirds, and essential elements for video editing.",
  "Creator Toolkits": "Complete bundles with everything content creators need to produce stunning content."
};

// Blog Categories
export const blogCategories: string[] = ["Tips", "News", "Review", "Tutorial"];

// Popular Tags
export const popularTags: string[] = [
  "Excel",
  "After Effects",
  "Video Editing",
  "Templates",
  "Motion Graphics",
  "AI",
  "Productivity",
  "Tutorials",
  "Color Grading",
  "Updates"
];

// Blogs Data
export const blogs: Blog[] = [
  {
    id: 1,
    title: "10 Excel Templates That Will Transform Your Workflow in 2024",
    category: "Tips",
    author: "Sarah Chen",
    date: "Oct 12, 2023",
    image: "bg-gradient-to-br from-blue-400 to-indigo-600",
    excerpt: "Discover the most powerful Excel templates that can save you hours of work and help you make better data-driven decisions.",
    content: "Excel templates have become indispensable tools for professionals across all industries. In this comprehensive guide, we explore the top 10 templates that are revolutionizing how businesses handle data. From financial dashboards to project management trackers, these templates offer pre-built solutions that eliminate the need to start from scratch.\n\nFinancial tracking templates provide real-time insights into cash flow, expenses, and revenue trends. Project management templates help teams stay organized with Gantt charts, task assignments, and progress tracking. Inventory management templates streamline stock control with automated alerts and reorder points.\n\nThe key to maximizing these templates lies in customization. While they provide a solid foundation, adapting them to your specific workflow ensures optimal efficiency. Many professionals spend hours creating spreadsheets from scratch when they could be leveraging these proven templates.\n\nWhether you're a freelancer, small business owner, or enterprise manager, there's a template designed for your needs. The investment in quality templates pays dividends through saved time and improved accuracy in your daily operations.",
    tags: ["Excel", "Templates", "Productivity"],
    authorImage: "bg-gradient-to-br from-blue-400 to-indigo-600",
    readTime: "8 min read"
  },
  {
    id: 2,
    title: "The Rise of AI in Video Editing: What Creators Need to Know",
    category: "News",
    author: "Marcus Rodriguez",
    date: "Sep 28, 2023",
    image: "bg-gradient-to-br from-purple-400 to-pink-600",
    excerpt: "Artificial intelligence is reshaping the video editing landscape. Here's what every content creator should understand about AI tools.",
    content: "The video editing industry is undergoing a transformation driven by artificial intelligence. From automated color grading to intelligent scene detection, AI-powered tools are changing how creators produce content.\n\nTraditional editing workflows required hours of manual work for tasks like cutting footage, applying transitions, and matching color profiles. AI now handles many of these tasks in seconds. Auto-reframing technology automatically adjusts aspect ratios for different platforms. AI-powered noise removal cleans audio tracks without compromising quality. Smart transcription generates captions with remarkable accuracy.\n\nHowever, these tools don't replace creativity – they enhance it. Professional editors who embrace AI find themselves with more time to focus on storytelling and artistic decisions. The learning curve is minimal for most AI tools, making them accessible to beginners while powerful enough for professionals.\n\nAs AI continues to evolve, we can expect even more sophisticated features like automated montage creation, style transfer, and real-time collaboration tools. The future of video editing is a partnership between human creativity and AI efficiency.",
    tags: ["AI", "Video Editing", "Motion Graphics"],
    authorImage: "bg-gradient-to-br from-purple-400 to-pink-600",
    readTime: "6 min read"
  },
  {
    id: 3,
    title: "Mastering After Effects: A Beginner's Guide to Motion Graphics",
    category: "Tutorial",
    author: "Alex Thompson",
    date: "Sep 15, 2023",
    image: "bg-gradient-to-br from-cyan-400 to-teal-600",
    excerpt: "Start your journey into motion graphics with this comprehensive beginner's guide to Adobe After Effects basics and techniques.",
    content: "After Effects remains the industry standard for motion graphics and visual effects. For beginners, the interface can seem overwhelming, but breaking it down into manageable concepts makes learning accessible.\n\nStart with understanding the workspace: the composition panel, timeline, and project panel form the core working environment. Keyframes are the fundamental building blocks – they define the start and end points of any animation. The graph editor provides precise control over timing and easing, transforming mechanical movements into fluid animations.\n\nExpressions offer a powerful way to automate animations without manual keyframing. A simple wiggle expression adds organic randomization to any property. Pre-composing groups layers together, keeping your timeline organized and enabling complex nested animations.\n\nMasks and shape layers create crisp graphics directly within After Effects. Text animators bring typography to life with professional kinetic designs. The essential practice for beginners is recreating existing animations to understand technique.\n\nStarting with simple projects builds confidence before tackling complex motion graphics. Online resources, templates, and communities provide invaluable support for continuous learning.",
    tags: ["After Effects", "Motion Graphics", "Tutorials"],
    authorImage: "bg-gradient-to-br from-cyan-400 to-teal-600",
    readTime: "12 min read"
  },
  {
    id: 4,
    title: "CodeGraph Platform Update: New Features and Improved Performance",
    category: "News",
    author: "The CodeGraph Team",
    date: "Aug 30, 2023",
    image: "bg-gradient-to-br from-emerald-400 to-green-600",
    excerpt: "We're excited to announce major platform improvements including faster downloads, enhanced search, and new product categories.",
    content: "We are thrilled to share the latest updates to the CodeGraph platform. Our team has been working tirelessly to improve your experience based on valuable community feedback.\n\nFirst, we've completely overhauled our download infrastructure. Download speeds have increased by 300%, with files now delivered through a global CDN for lightning-fast access anywhere in the world.\n\nSecond, our search functionality has received a major upgrade. The new search algorithm understands natural language queries, making it easier to find exactly what you're looking for. Filter by category, price range, rating, and file type to narrow down results instantly.\n\nThird, we've introduced detailed product previews with interactive demos where applicable. See exactly what you're getting before making a purchase.\n\nFourth, we've added a new 'Creator Toolkit' category, bundling our most popular assets into comprehensive packages for video editors, data analysts, and content creators.\n\nFinally, we've improved our licensing model with clearer terms and extended usage rights. Thank you to our amazing community for your continued support. Your feedback drives our innovation.",
    tags: ["Updates", "Productivity", "Excel"],
    authorImage: "bg-gradient-to-br from-emerald-400 to-green-600",
    readTime: "5 min read"
  },
  {
    id: 5,
    title: "Color Grading Secrets: Making Your Videos Look Cinematic",
    category: "Tips",
    author: "Jordan Lee",
    date: "Aug 18, 2023",
    image: "bg-gradient-to-br from-amber-400 to-orange-600",
    excerpt: "Learn professional color grading techniques that transform ordinary footage into cinematic masterpieces with these expert tips.",
    content: "Color grading is the secret sauce that separates amateur videos from professional productions. The difference between flat, ungraded footage and a cinematic look comes down to understanding color science and applying the right techniques.\n\nStart with proper exposure and white balance during shooting. Good in-camera techniques give you a solid foundation for grading. Primary correction adjusts the overall image: exposure, contrast, and white balance. This step normalizes your footage before creative grading.\n\nSecondary correction targets specific areas or colors – skin tones, skies, highlights, and shadows. Tools like qualifiers and masks isolate these elements for precise control. Color wheels and curves are your primary grading tools. Lift, gamma, and gain controls adjust shadows, midtones, and highlights independently.\n\nLUTs (Look Up Tables) provide starting points for your grade, but true professionals customize beyond presets. The film look often comes from lifting shadows slightly (no true black), desaturating highlights, and adding subtle color contrast. Teal in shadows and orange in highlights creates the popular blockbuster look.\n\nRemember, subtle grades often have more impact than heavy, obvious treatments. The best color grading enhances emotion without drawing attention to itself.",
    tags: ["Color Grading", "Video Editing", "Tutorials"],
    authorImage: "bg-gradient-to-br from-amber-400 to-orange-600",
    readTime: "10 min read"
  }
];

// Testimonials Data
export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Jennifer Martinez",
    role: "Freelance Video Editor",
    review: "CodeGraph has transformed my workflow completely. The After Effects templates are incredibly professional and save me hours on every project.",
    rating: 5,
    avatar: "bg-gradient-to-br from-pink-400 to-rose-600"
  },
  {
    id: 2,
    name: "David Chen",
    role: "Data Analyst at TechCorp",
    review: "Finally, Excel templates that actually work for real business needs. The financial dashboard template paid for itself within the first week.",
    rating: 5,
    avatar: "bg-gradient-to-br from-blue-400 to-indigo-600"
  },
  {
    id: 3,
    name: "Sophie Williams",
    role: "YouTube Content Creator",
    review: "The Creator's Toolkit bundle changed everything for my channel. Professional graphics that make my videos look like they came from a studio.",
    rating: 5,
    avatar: "bg-gradient-to-br from-emerald-400 to-teal-600"
  }
];

// Value Propositions
export interface ValueProposition {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export const valuePropositions: ValueProposition[] = [
  {
    id: 1,
    title: "Instant Download",
    description: "Get your files immediately after purchase. No waiting, no hassle.",
    icon: "Zap"
  },
  {
    id: 2,
    title: "Premium Quality",
    description: "Every asset is professionally crafted and thoroughly tested.",
    icon: "Award"
  },
  {
    id: 3,
    title: "Secure Payment",
    description: "Your transactions are protected with bank-level encryption.",
    icon: "Shield"
  },
  {
    id: 4,
    title: "Lifetime Updates",
    description: "Purchase once, benefit forever with free updates.",
    icon: "RefreshCw"
  }
];
