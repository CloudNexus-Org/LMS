import { useState, useEffect } from 'react';
import { ShoppingCart, HeartOff, Star, Heart } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import { DashboardGridSkeleton } from '@/components/ui/Skeletons';

const MOCK_WISHLIST = [
  {
    id: 'w1',
    title: 'Fullstack Rust Web Development',
    instructor: 'Jane Doe',
    rating: 4.8,
    reviews: 1240,
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bfce8?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'w2',
    title: 'Advanced Framer Motion Animations',
    instructor: 'John Smith',
    rating: 4.9,
    reviews: 3200,
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop'
  }
];

export default function StudentWishlistPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setWishlist([]); // Set to empty to demonstrate the new EmptyState component
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-text font-display tracking-tight">Wishlist</h1>
        <p className="text-muted mt-1 font-medium">Courses you've saved for later.</p>
      </div>

      {isLoading ? (
        <DashboardGridSkeleton cards={4} />
      ) : wishlist.length === 0 ? (
        <EmptyState 
          icon={Heart} 
          title="Your wishlist is empty" 
          description="You haven't saved any courses yet. Browse our catalog to find courses that interest you."
          actionLabel="Browse Courses"
          onAction={() => window.location.href = '/tracks'}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((course) => (
            <div key={course.id} className="group flex flex-col rounded-[5px] border border-border bg-surface overflow-hidden hover:shadow-card hover:border-border-strong transition-all cursor-pointer">
              <div className="relative aspect-video overflow-hidden bg-bg">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                <button className="absolute top-3 right-3 h-9 w-9 rounded-full bg-surface/80 backdrop-blur-md flex items-center justify-center text-danger hover:bg-danger hover:text-white transition-colors shadow-sm">
                  <HeartOff className="h-4 w-4" />
                </button>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-bold text-text text-lg leading-snug mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-sm text-muted mb-3 font-medium">{course.instructor}</p>
                
                <div className="flex items-center gap-1 text-sm font-bold text-warning mb-6">
                  <span className="text-text">{course.rating}</span>
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  <span className="text-muted font-medium ml-1">({course.reviews})</span>
                </div>                
                <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                  <span className="font-display font-bold text-2xl text-text">${course.price}</span>
                  <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-[5px] text-[13px] font-bold hover:bg-primary-hover shadow-sm transition-colors">
                    <ShoppingCart className="h-4 w-4" /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
