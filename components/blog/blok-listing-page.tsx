// import Link from 'next/link';
// import { Search, X, Clock, User, ArrowRight, Tag } from 'lucide-react';
// import { useBlog } from '../context/BlogContext';

// const BlogListingPage = () => {
//   const {
//     categories,
//     tags,
//     searchQuery,
//     setSearchQuery,
//     selectedCategory,
//     setSelectedCategory,
//     selectedTag,
//     setSelectedTag,
//     filteredBlogs,
//     clearFilters,
//   } = useBlog();

//   // Count active filters
//   const activeFilterCount =
//     (selectedCategory ? 1 : 0) +
//     (selectedTag ? 1 : 0) +
//     (searchQuery ? 1 : 0);

//   // Get unique categories from blogs with counts
//   const categoryCounts = categories.map((cat) => ({
//     name: cat,
//     count: filteredBlogs.filter((blog) => blog.category === cat).length,
//   }));

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* Header */}
//       <div className="bg-white border-b border-slate-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
//           <div className="text-center max-w-2xl mx-auto">
//             <span className="text-sm font-semibold text-accent-indigo uppercase tracking-wider">
//               CodeGraph Blog
//             </span>
//             <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-primary-900">
//               Our Blog
//             </h1>
//             <p className="mt-4 text-slate-600 text-lg">
//               Latest news, tips, and insights from the digital assets world
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* ===================================================== */}
//           {/* SIDEBAR - Left Side (25%) - Filter Widgets           */}
//           {/* ===================================================== */}
//           <aside className="w-full lg:w-1/4 flex-shrink-0 order-2 lg:order-1">
//             <div className="space-y-6">
//               {/* Search Widget */}
//               <div className="bg-white rounded-2xl border border-slate-200 p-6">
//                 <h3 className="text-lg font-semibold text-primary-900 mb-4 flex items-center gap-2">
//                   <Search className="w-5 h-5" />
//                   Search
//                 </h3>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder="Search articles..."
//                     className="w-full px-4 py-2.5 pr-10 border border-slate-200 rounded-lg text-sm focus:border-accent-indigo focus:ring-2 focus:ring-accent-indigo/20 outline-none"
//                   />
//                   <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//                 </div>
//                 {/* HINT: This updates searchQuery in BlogContext */}
//               </div>

//               {/* Categories Widget */}
//               <div className="bg-white rounded-2xl border border-slate-200 p-6">
//                 <h3 className="text-lg font-semibold text-primary-900 mb-4">
//                   Categories
//                 </h3>
//                 <div className="space-y-2">
//                   <button
//                     onClick={() => setSelectedCategory(null)}
//                     className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
//                       selectedCategory === null
//                         ? 'bg-accent-indigo text-white'
//                         : 'text-slate-600 hover:bg-slate-100'
//                     }`}
//                   >
//                     <span>All Categories</span>
//                     <span className="text-xs opacity-70">({filteredBlogs.length})</span>
//                   </button>
//                   {categoryCounts.map((cat) => (
//                     <button
//                       key={cat.name}
//                       onClick={() => setSelectedCategory(cat.name)}
//                       className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
//                         selectedCategory === cat.name
//                           ? 'bg-accent-indigo text-white'
//                           : 'text-slate-600 hover:bg-slate-100'
//                       }`}
//                     >
//                       <span>{cat.name}</span>
//                       <span className="text-xs opacity-70">({cat.count})</span>
//                     </button>
//                   ))}
//                 </div>
//                 {/* HINT: This updates selectedCategory in BlogContext */}
//               </div>

//               {/* Tags Cloud Widget */}
//               <div className="bg-white rounded-2xl border border-slate-200 p-6">
//                 <h3 className="text-lg font-semibold text-primary-900 mb-4 flex items-center gap-2">
//                   <Tag className="w-5 h-5" />
//                   Popular Tags
//                 </h3>
//                 <div className="flex flex-wrap gap-2">
//                   {tags.map((tag) => (
//                     <button
//                       key={tag}
//                       onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
//                       className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
//                         selectedTag === tag
//                           ? 'bg-accent-indigo text-white'
//                           : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
//                       }`}
//                     >
//                       #{tag}
//                     </button>
//                   ))}
//                 </div>
//                 {/* HINT: This updates selectedTag in BlogContext */}
//               </div>

//               {/* Clear Filters */}
//               {activeFilterCount > 0 && (
//                 <button
//                   onClick={clearFilters}
//                   className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
//                 >
//                   <X className="w-4 h-4" />
//                   Clear Filters ({activeFilterCount})
//                 </button>
//               )}

//               {/* Educational Note */}
//               <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
//                 <p className="text-xs text-amber-800 leading-relaxed">
//                   <strong>Student Note:</strong> Changing these filters updates the Context state, but the blog grid won't change until you implement the filter logic in BlogContext.tsx
//                 </p>
//               </div>
//             </div>
//           </aside>

//           {/* ===================================================== */}
//           {/* MAIN CONTENT - Right Side (75%) - Blog Grid          */}
//           {/* ===================================================== */}
//           <main className="w-full lg:w-3/4 order-1 lg:order-2">
//             {/* Results Count */}
//             <div className="flex items-center justify-between mb-6">
//               <p className="text-slate-600">
//                 Showing <span className="font-semibold text-primary-900">{filteredBlogs.length}</span> articles
//               </p>
//             </div>

//             {/* Blog Grid - 2 columns on desktop, 1 on mobile */}
//             {filteredBlogs.length === 0 ? (
//               <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
//                 <p className="text-slate-500">No articles found matching your criteria.</p>
//                 <button
//                   onClick={clearFilters}
//                   className="mt-4 text-accent-indigo hover:underline"
//                 >
//                   Clear all filters
//                 </button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
//                 {filteredBlogs.map((blog) => (
//                   <article
//                     key={blog.id}
//                     className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300 group"
//                   >
//                     {/* Featured Image */}
//                     <Link to={`/blog/${blog.id}`} className="block">
//                       <div className={`aspect-video ${blog.image} relative overflow-hidden`}>
//                         {/* Category Badge */}
//                         <div className="absolute top-4 left-4">
//                           <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary-900 text-xs font-semibold rounded-full">
//                             {blog.category}
//                           </span>
//                         </div>
//                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
//                       </div>
//                     </Link>

//                     {/* Content */}
//                     <div className="p-6">
//                       {/* Meta */}
//                       <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
//                         <div className="flex items-center gap-1.5">
//                           <Clock className="w-4 h-4" />
//                           <span>{blog.date}</span>
//                         </div>
//                         <div className="flex items-center gap-1.5">
//                           <User className="w-4 h-4" />
//                           <span>{blog.author}</span>
//                         </div>
//                       </div>

//                       {/* Title */}
//                       <Link to={`/blog/${blog.id}`}>
//                         <h2 className="text-xl font-bold text-primary-900 group-hover:text-accent-indigo transition-colors duration-200 line-clamp-2 mb-3">
//                           {blog.title}
//                         </h2>
//                       </Link>

//                       {/* Excerpt */}
//                       <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-4">
//                         {blog.excerpt}
//                       </p>

//                       {/* Tags */}
//                       {blog.tags && blog.tags.length > 0 && (
//                         <div className="flex flex-wrap gap-2 mb-4">
//                           {blog.tags.slice(0, 3).map((tag:string) => (
//                             <span
//                               key={tag}
//                               className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded"
//                             >
//                               #{tag}
//                             </span>
//                           ))}
//                         </div>
//                       )}

//                       {/* Read More Link */}
//                       <Link
//                         to={`/blog/${blog.id}`}
//                         className="inline-flex items-center gap-2 text-sm font-semibold text-accent-indigo hover:text-accent-cyan transition-colors duration-200"
//                       >
//                         <span>Read More</span>
//                         <ArrowRight className="w-4 h-4" />
//                       </Link>
//                     </div>
//                   </article>
//                 ))}
//               </div>
//             )}

//             {/* Educational Note at bottom */}
//             <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//               <p className="text-sm text-blue-800">
//                 <strong>Current Behavior:</strong> The grid shows all {filteredBlogs.length} blog posts regardless of filter selections.
//                 <br />
//                 <strong>Student Task:</strong> Implement the filter logic in <code className="bg-blue-100 px-1 rounded">BlogContext.tsx</code> to make filters work.
//               </p>
//             </div>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlogListingPage;
