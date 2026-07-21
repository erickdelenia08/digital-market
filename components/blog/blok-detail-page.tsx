// import { useParams, Link } from 'react-router-dom';
// import { ChevronRight, Clock, User, Calendar, Tag, ArrowLeft, Facebook, Twitter, Linkedin, Link2, Heart, Bookmark } from 'lucide-react';
// import { useBlog } from '../context/BlogContext';
// import Navbar from '../components/navbar';
// import Footer from '../components/Footer';

// const BlogDetailPage = () => {
//   const { id } = useParams<{ id: string }>();
//   const { getBlogById, getRelatedBlogs } = useBlog();

//   // Get blog by ID
//   const blog = getBlogById(Number(id));

//   // Get related blogs
//   const relatedBlogs = blog ? getRelatedBlogs(blog.id, 3) : [];

//   // If blog not found
//   if (!blog) {
//     return (
//       <div className="min-h-screen bg-white flex flex-col">
//         {/* <Navbar /> */}
//         <main className="flex-1 flex items-center justify-center">
//           <div className="text-center">
//             <h1 className="text-2xl font-bold text-primary-900">Article Not Found</h1>
//             <p className="mt-2 text-slate-600">The article you're looking for doesn't exist.</p>
//             <Link
//               to="/blog"
//               className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-primary-900 text-white font-medium rounded-lg hover:bg-accent-indigo transition-colors"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               Back to Blog
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
//           <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//             <nav className="flex items-center gap-2 text-sm overflow-x-auto">
//               <Link to="/" className="text-slate-500 hover:text-accent-indigo transition-colors whitespace-nowrap">
//                 Home
//               </Link>
//               <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
//               <Link to="/blog" className="text-slate-500 hover:text-accent-indigo transition-colors whitespace-nowrap">
//                 Blog
//               </Link>
//               <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
//               <span className="text-slate-700 whitespace-nowrap">{blog.category}</span>
//               <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
//               <span className="text-primary-900 font-medium truncate max-w-[200px]">{blog.title}</span>
//             </nav>
//           </div>
//         </div>

//         {/* Article Content */}
//         <article className="py-8 md:py-12">
//           <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
//             {/* Header */}
//             <header className="mb-8">
//               {/* Category Pill */}
//               <span className="inline-block px-3 py-1 bg-accent-indigo/10 text-accent-indigo text-sm font-semibold rounded-full mb-4">
//                 {blog.category}
//               </span>

//               {/* Title */}
//               <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-900 leading-tight">
//                 {blog.title}
//               </h1>

//               {/* Meta */}
//               <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500">
//                 {/* Author */}
//                 <div className="flex items-center gap-2">
//                   <div className={`w-10 h-10 rounded-full ${blog.authorImage || 'bg-slate-200'} flex items-center justify-center text-white font-semibold text-sm`}>
//                     {blog.author.charAt(0)}
//                   </div>
//                   <div>
//                     <p className="font-medium text-primary-900">{blog.author}</p>
//                   </div>
//                 </div>

//                 <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block" />

//                 {/* Date */}
//                 <div className="flex items-center gap-1.5">
//                   <Calendar className="w-4 h-4" />
//                   <span>{blog.date}</span>
//                 </div>

//                 <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block" />

//                 {/* Read Time */}
//                 {blog.readTime && (
//                   <div className="flex items-center gap-1.5">
//                     <Clock className="w-4 h-4" />
//                     <span>{blog.readTime}</span>
//                   </div>
//                 )}
//               </div>
//             </header>

//             {/* Featured Image */}
//             <div className={`aspect-video ${blog.image} rounded-2xl mb-8 relative overflow-hidden`}>
//               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
//             </div>

//             {/* Article Body */}
//             <div className="prose prose-slate max-w-none prose-headings:text-primary-900 prose-a:text-accent-indigo prose-a:no-underline hover:prose-a:underline">
//               {blog.content.split('\n\n').map((paragraph:any, index:number) => (
//                 <p key={index} className="text-slate-600 leading-relaxed mb-4">
//                   {paragraph}
//                 </p>
//               ))}
//             </div>

//             {/* Tags */}
//             {blog.tags && blog.tags.length > 0 && (
//               <div className="mt-8 pt-8 border-t border-slate-200">
//                 <div className="flex items-center gap-2 mb-4">
//                   <Tag className="w-5 h-5 text-slate-500" />
//                   <span className="font-semibold text-primary-900">Tags</span>
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   {blog.tags.map((tag:string) => (
//                     <Link
//                       key={tag}
//                       to={`/blog?tag=${encodeURIComponent(tag)}`}
//                       className="px-3 py-1.5 bg-slate-100 hover:bg-accent-indigo hover:text-white text-slate-600 text-sm rounded-lg transition-colors"
//                     >
//                       #{tag}
//                     </Link>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Share Buttons */}
//             <div className="mt-8 pt-8 border-t border-slate-200">
//               <div className="flex items-center justify-between flex-wrap gap-4">
//                 <div className="flex items-center gap-2">
//                   <span className="font-semibold text-primary-900">Share:</span>
//                   <div className="flex items-center gap-2">
//                     <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors">
//                       <Facebook className="w-5 h-5" />
//                     </button>
//                     <button className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition-colors">
//                       <Twitter className="w-5 h-5" />
//                     </button>
//                     <button className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition-colors">
//                       <Linkedin className="w-5 h-5" />
//                     </button>
//                     <button className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-300 transition-colors">
//                       <Link2 className="w-5 h-5" />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
//                     <Heart className="w-4 h-4" />
//                     <span>Like</span>
//                   </button>
//                   <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
//                     <Bookmark className="w-4 h-4" />
//                     <span>Save</span>
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Author Bio */}
//             <div className="mt-8 p-6 bg-slate-50 rounded-2xl flex items-start gap-4">
//               <div className={`w-16 h-16 rounded-full ${blog.authorImage || 'bg-slate-200'} flex items-center justify-center text-white font-bold text-xl flex-shrink-0`}>
//                 {blog.author.charAt(0)}
//               </div>
//               <div>
//                 <h3 className="font-semibold text-primary-900">{blog.author}</h3>
//                 <p className="text-sm text-slate-500 mt-1">Author</p>
//                 <p className="text-slate-600 text-sm mt-2 leading-relaxed">
//                   A passionate writer and expert in digital content creation, sharing insights and tips to help creators succeed.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </article>

//         {/* Related Posts */}
//         {relatedBlogs.length > 0 && (
//           <div className="bg-slate-50 py-12">
//             <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
//               <h2 className="text-2xl font-bold text-primary-900 mb-6">Related Articles</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//                 {relatedBlogs.map((relatedBlog) => (
//                   <Link
//                     key={relatedBlog.id}
//                     to={`/blog/${relatedBlog.id}`}
//                     className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300 group"
//                   >
//                     <div className={`aspect-video ${relatedBlog.image}`} />
//                     <div className="p-4">
//                       <span className="text-xs text-accent-indigo font-semibold">{relatedBlog.category}</span>
//                       <h3 className="mt-1 text-sm font-semibold text-primary-900 line-clamp-2 group-hover:text-accent-indigo transition-colors">
//                         {relatedBlog.title}
//                       </h3>
//                       <p className="mt-2 text-xs text-slate-500">{relatedBlog.date}</p>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default BlogDetailPage;
