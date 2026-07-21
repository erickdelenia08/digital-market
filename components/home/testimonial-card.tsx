import { Star, Quote } from 'lucide-react';
import { Testimonial } from '@/mock-data/products'

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-100/50 transition-all duration-300 relative">
      {/* Quote Icon */}
      <div className="absolute top-6 right-6 text-slate-100">
        <Quote className="w-12 h-12" />
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${i < testimonial.rating
                ? 'text-amber-400 fill-amber-400'
                : 'text-slate-300'
              }`}
          />
        ))}
      </div>

      {/* Review */}
      <p className="text-slate-600 leading-relaxed mb-6 relative z-10">
        &quot;{testimonial.review}&quot;
      </p>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full ${testimonial.avatar} flex items-center justify-center`}>
          <span className="text-white font-semibold text-lg">
            {testimonial.name.charAt(0)}
          </span>
        </div>
        <div>
          <h4 className="font-semibold text-primary-900">{testimonial.name}</h4>
          <p className="text-sm text-slate-500">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
