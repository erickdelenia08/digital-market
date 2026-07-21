import { testimonials } from '@/mock-data/products';
import TestimonialCard from './testimonial-card';

const Testimonials = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="text-sm font-semibold text-accent-indigo uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-900 tracking-tight">
            Loved by Creators
          </h2>
          <p className="mt-4 text-slate-600 text-lg">
            See what our customers have to say about CodeGraph
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 pt-12 border-t border-slate-200">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-200" />
              <span className="text-slate-600 font-medium">TechCrunch</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-200" />
              <span className="text-slate-600 font-medium">Forbes</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-200" />
              <span className="text-slate-600 font-medium">Wired</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-200" />
              <span className="text-slate-600 font-medium">Product Hunt</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
