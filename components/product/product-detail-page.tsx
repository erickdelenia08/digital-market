// import { useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { useShop } from '../context/ShopContext';
// import { Product } from '../data/products';
// import { useCart } from 'react-use-cart';
// import { Star, Check, Minus, Plus, ShoppingCart, ChevronRight, Heart, Share2, ArrowLeft } from 'lucide-react';
// import Footer from '../components/Footer';
// // import Navbar from '../components/navbar';




// const ProductDetailPage = () => {

//   const { id } = useParams<{ id: string }>();
//   const { getProductById, products } = useShop();
//   const { addItem } = useCart();
//   const [quantity, setQuantity] = useState(1);
//   const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews'>('overview');
//   const [selectedImage, setSelectedImage] = useState(0);

//   // Get product by ID
//   const product: Product | undefined = getProductById(Number(id));

//   // Get related products (same category, exclude current)
//   const relatedProducts = product
//     ? products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
//     : [];

//   // Generate mock additional images for gallery
//   const productImages = product
//     ? [
//       product.image,
//       `bg-gradient-to-br from-slate-400 to-slate-600`,
//       `bg-gradient-to-br from-slate-500 to-slate-700`,
//       `bg-gradient-to-br from-slate-300 to-slate-500`,
//     ]
//     : [];

//   // Handle quantity
//   const incrementQuantity = () => setQuantity((q) => q + 1);
//   const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));

//   // ========================================================
//   // TODO: STUDENT TASK - Use addItem() from react-use-cart here
//   // ========================================================
//   // Replace the current implementation with:
//   // const handleAddToCart = () => {
//   //   if (product) {
//   //     addItem(product, quantity);
//   //     alert(`Added ${quantity}x ${product.name} to cart!`);
//   //   }
//   // };
//   // ========================================================
//   const handleAddToCart = () => {
//     // TODO: STUDENT TASK - Implement this function
//     // Use addItem(product, quantity) from react-use-cart
//     //
//     // Example:
//     // addItem(product, quantity);
//     // alert(`Added ${quantity}x ${product.name} to cart!`);
//     if (!product) return;

//     console.log('Add to cart clicked');
//     console.log('Product:', product);
//     console.log('Quantity:', quantity);

//     // Temporary placeholder - remove after implementation
//     if (product) {
//       const item = { ...product, id: product.id.toString() }
//       addItem(item, quantity)
//     }
//   };

//   // If product not found
//   if (!product) {
//     return (
//       <div className="min-h-screen bg-white flex flex-col">
//         {/* <Navbar /> */}
//         <main className="flex-1 flex items-center justify-center">
//           <div className="text-center">
//             <h1 className="text-2xl font-bold text-primary-900">Product Not Found</h1>
//             <p className="mt-2 text-slate-600">The product you're looking for doesn't exist.</p>
//             <Link
//               to="/products"
//               className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-primary-900 text-white font-medium rounded-lg hover:bg-accent-indigo transition-colors"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               <span>Back to Products</span>
//             </Link>
//           </div>
//         </main>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white flex flex-col">
//       {/* <Navbar /> */}
//       <main className="flex-1">
//         {/* Breadcrumbs */}
//         <div className="bg-slate-50 border-b border-slate-200">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//             <nav className="flex items-center gap-2 text-sm">
//               <Link to="/" className="text-slate-500 hover:text-accent-indigo transition-colors">
//                 Home
//               </Link>
//               <ChevronRight className="w-4 h-4 text-slate-400" />
//               <Link to="/products" className="text-slate-500 hover:text-accent-indigo transition-colors">
//                 Products
//               </Link>
//               <ChevronRight className="w-4 h-4 text-slate-400" />
//               <span className="text-slate-500">{product.category}</span>
//               <ChevronRight className="w-4 h-4 text-slate-400" />
//               <span className="text-primary-900 font-medium line-clamp-1">{product.name}</span>
//             </nav>
//           </div>
//         </div>

//         {/* Main Product Section */}
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
//           <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
//             {/* ===================================================== */}
//             {/* LEFT SIDE - Gallery */}
//             {/* ===================================================== */}
//             <div className="space-y-4">
//               {/* Main Image */}
//               <div
//                 className={`aspect-square ${productImages[selectedImage]} rounded-2xl relative overflow-hidden`}
//               >
//                 {/* Wishlist & Share */}
//                 <div className="absolute top-4 right-4 flex flex-col gap-2">
//                   <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors">
//                     <Heart className="w-5 h-5 text-slate-600" />
//                   </button>
//                   <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors">
//                     <Share2 className="w-5 h-5 text-slate-600" />
//                   </button>
//                 </div>

//                 {/* Badges */}
//                 <div className="absolute top-4 left-4 flex flex-col gap-2">
//                   {product.isBestseller && (
//                     <span className="px-3 py-1 bg-primary-900 text-white text-sm font-semibold rounded-full">
//                       Bestseller
//                     </span>
//                   )}
//                   {product.originalPrice && (
//                     <span className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full">
//                       {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* Thumbnails */}
//               <div className="flex gap-3 overflow-x-auto pb-2">
//                 {productImages.map((img, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setSelectedImage(index)}
//                     className={`flex-shrink-0 w-20 h-20 ${img} rounded-lg relative overflow-hidden transition-all ${selectedImage === index
//                       ? 'ring-2 ring-accent-indigo ring-offset-2'
//                       : 'hover:ring-2 hover:ring-slate-300'
//                       }`}
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* ===================================================== */}
//             {/* RIGHT SIDE - Product Info */}
//             {/* ===================================================== */}
//             <div className="space-y-6">
//               {/* Brand */}
//               <span className="text-sm font-semibold text-accent-indigo uppercase tracking-wider">
//                 {product.brand}
//               </span>

//               {/* Title */}
//               <h1 className="text-3xl md:text-4xl font-bold text-primary-900">{product.name}</h1>

//               {/* Rating */}
//               <div className="flex items-center gap-3">
//                 <div className="flex items-center gap-1">
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       className={`w-5 h-5 ${i < Math.floor(product.rating)
//                         ? 'text-amber-400 fill-amber-400'
//                         : 'text-slate-300'
//                         }`}
//                     />
//                   ))}
//                 </div>
//                 <span className="text-lg font-semibold text-primary-900">{product.rating}</span>
//                 <span className="text-slate-500">({product.reviewCount} reviews)</span>
//               </div>

//               {/* Price */}
//               <div className="flex items-baseline gap-3">
//                 <span className="text-4xl font-bold text-primary-900">${product.price}</span>
//                 {product.originalPrice && (
//                   <span className="text-xl text-slate-400 line-through">${product.originalPrice}</span>
//                 )}
//                 {product.originalPrice && (
//                   <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded">
//                     Save ${product.originalPrice - product.price}
//                   </span>
//                 )}
//               </div>

//               {/* Short Description */}
//               <p className="text-slate-600 leading-relaxed">{product.shortDescription}</p>

//               {/* Stock Status */}
//               <div className="flex items-center gap-2">
//                 <span className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
//                 <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
//                   {product.inStock ? 'In Stock - Available for Download' : 'Out of Stock'}
//                 </span>
//               </div>

//               {/* Variants Mockup (Visual Only) */}
//               <div className="space-y-4 pt-4 border-t border-slate-200">
//                 {/* RAM Variant */}
//                 <div>
//                   <span className="text-sm font-medium text-slate-700">RAM Configuration:</span>
//                   <div className="flex gap-2 mt-2">
//                     <button className="px-4 py-2 border-2 border-accent-indigo bg-accent-indigo/10 text-accent-indigo text-sm font-medium rounded-lg">
//                       Standard
//                     </button>
//                     <button className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:border-slate-300 transition-colors">
//                       Pro
//                     </button>
//                     <button className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:border-slate-300 transition-colors">
//                       Enterprise
//                     </button>
//                   </div>
//                 </div>

//                 {/* Package Type */}
//                 <div>
//                   <span className="text-sm font-medium text-slate-700">Package Type:</span>
//                   <div className="flex gap-2 mt-2">
//                     <button className="px-4 py-2 border-2 border-accent-indigo bg-accent-indigo/10 text-accent-indigo text-sm font-medium rounded-lg">
//                       Single User
//                     </button>
//                     <button className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:border-slate-300 transition-colors">
//                       Team (5)
//                     </button>
//                     <button className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:border-slate-300 transition-colors">
//                       Enterprise
//                     </button>
//                   </div>
//                 </div>

//                 {/* Theme Style */}
//                 <div>
//                   <span className="text-sm font-medium text-slate-700">Theme Style:</span>
//                   <div className="flex gap-2 mt-2">
//                     <button className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 ring-2 ring-accent-indigo ring-offset-2" />
//                     <button className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 hover:ring-2 hover:ring-slate-300 hover:ring-offset-2 transition-all" />
//                     <button className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 hover:ring-2 hover:ring-slate-300 hover:ring-offset-2 transition-all" />
//                     <button className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 hover:ring-2 hover:ring-slate-300 hover:ring-offset-2 transition-all" />
//                   </div>
//                 </div>
//               </div>

//               {/* Quantity and Add to Cart */}
//               <div className="flex items-center gap-4 pt-4">
//                 {/* Quantity Counter */}
//                 <div className="flex items-center border border-slate-200 rounded-lg">
//                   <button
//                     onClick={decrementQuantity}
//                     className="p-2.5 hover:bg-slate-100 transition-colors"
//                   >
//                     <Minus className="w-4 h-4 text-slate-600" />
//                   </button>
//                   <span className="w-12 text-center font-semibold text-primary-900">{quantity}</span>
//                   <button
//                     onClick={incrementQuantity}
//                     className="p-2.5 hover:bg-slate-100 transition-colors"
//                   >
//                     <Plus className="w-4 h-4 text-slate-600" />
//                   </button>
//                 </div>

//                 {/* Add to Cart Button */}
//                 <button
//                   onClick={handleAddToCart}
//                   className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-900 hover:bg-accent-indigo text-white font-semibold rounded-xl transition-colors duration-200"
//                 >
//                   <ShoppingCart className="w-5 h-5" />
//                   <span>Add to Cart</span>
//                 </button>
//               </div>

//               {/* Educational Note */}
//               <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
//                 <p className="text-xs text-amber-800 leading-relaxed">
//                   <strong>Student Note:</strong> Implement <code className="bg-amber-100 px-1 rounded">handleAddToCart</code> using <code className="bg-amber-100 px-1 rounded">addItem(product, quantity)</code> from the <code className="bg-amber-100 px-1 rounded">useCart</code> hook (react-use-cart).
//                 </p>
//               </div>

//               {/* Feature Highlights */}
//               <div className="pt-6 border-t border-slate-200">
//                 <h3 className="text-sm font-semibold text-primary-900 mb-3">Key Features:</h3>
//                 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                   {product.features.slice(0, 4).map((feature, index) => (
//                     <li key={index} className="flex items-start gap-2">
//                       <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
//                       <span className="text-sm text-slate-600">{feature}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ===================================================== */}
//         {/* BOTTOM - Tabs & Related Products */}
//         {/* ===================================================== */}
//         <div className="bg-slate-50 border-t border-slate-200">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//             {/* Tabs */}
//             <div className="mb-8">
//               <div className="flex gap-1 bg-white rounded-xl p-1 w-fit border border-slate-200">
//                 <button
//                   onClick={() => setActiveTab('overview')}
//                   className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'overview'
//                     ? 'bg-primary-900 text-white'
//                     : 'text-slate-600 hover:text-primary-900'
//                     }`}
//                 >
//                   Overview
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('specs')}
//                   className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'specs'
//                     ? 'bg-primary-900 text-white'
//                     : 'text-slate-600 hover:text-primary-900'
//                     }`}
//                 >
//                   Specifications
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('reviews')}
//                   className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'reviews'
//                     ? 'bg-primary-900 text-white'
//                     : 'text-slate-600 hover:text-primary-900'
//                     }`}
//                 >
//                   Reviews ({product.reviewCount})
//                 </button>
//               </div>
//             </div>

//             {/* Tab Content */}
//             <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
//               {activeTab === 'overview' && (
//                 <div className="prose prose-slate max-w-none">
//                   <h3 className="text-xl font-semibold text-primary-900 mb-4">Product Overview</h3>
//                   <p className="text-slate-600 leading-relaxed">{product.description}</p>
//                   <h4 className="text-lg font-semibold text-primary-900 mt-6 mb-3">Features</h4>
//                   <ul className="space-y-2">
//                     {product.features.map((feature, index) => (
//                       <li key={index} className="flex items-start gap-3">
//                         <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
//                         <span className="text-slate-600">{feature}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//               {activeTab === 'specs' && (
//                 <div>
//                   <h3 className="text-xl font-semibold text-primary-900 mb-6">Technical Specifications</h3>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     {Object.entries(product.specs).map(([key, value]) => (
//                       <div
//                         key={key}
//                         className="flex justify-between py-3 px-4 bg-slate-50 rounded-lg"
//                       >
//                         <span className="font-medium text-slate-700">{key}</span>
//                         <span className="text-slate-600">{value}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {activeTab === 'reviews' && (
//                 <div>
//                   <div className="flex items-center justify-between mb-6">
//                     <h3 className="text-xl font-semibold text-primary-900">
//                       Customer Reviews
//                     </h3>
//                     <div className="flex items-center gap-2">
//                       <div className="flex items-center gap-1">
//                         {[...Array(5)].map((_, i) => (
//                           <Star
//                             key={i}
//                             className={`w-5 h-5 ${i < Math.floor(product.rating)
//                               ? 'text-amber-400 fill-amber-400'
//                               : 'text-slate-300'
//                               }`}
//                           />
//                         ))}
//                       </div>
//                       <span className="font-semibold text-primary-900">{product.rating}</span>
//                       <span className="text-slate-500">out of 5</span>
//                     </div>
//                   </div>
//                   <p className="text-slate-600">
//                     Based on {product.reviewCount} reviews. Review functionality coming soon!
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Related Products */}
//             {relatedProducts.length > 0 && (
//               <div className="mt-12">
//                 <h3 className="text-2xl font-bold text-primary-900 mb-6">Related Products</h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                   {relatedProducts.map((relProduct) => (
//                     <Link
//                       key={relProduct.id}
//                       to={`/product/${relProduct.id}`}
//                       className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300"
//                     >
//                       <div className={`aspect-video ${relProduct.image}`} />
//                       <div className="p-4">
//                         <span className="text-xs font-medium text-accent-indigo uppercase tracking-wider">
//                           {relProduct.brand}
//                         </span>
//                         <h4 className="mt-1 text-sm font-semibold text-primary-900 line-clamp-1">
//                           {relProduct.name}
//                         </h4>
//                         <div className="mt-2 flex items-center gap-1">
//                           <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
//                           <span className="text-xs text-slate-600">{relProduct.rating}</span>
//                         </div>
//                         <p className="mt-2 text-lg font-bold text-primary-900">${relProduct.price}</p>
//                       </div>
//                     </Link>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default ProductDetailPage;
