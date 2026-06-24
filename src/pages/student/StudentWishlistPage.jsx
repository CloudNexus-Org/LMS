import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import CatalogCourseCard from '@/components/courses/CatalogCourseCard';
import { getCourseById } from '@/data/courses';
import useWishlistStore from '@/store/useWishlistStore';

export default function StudentWishlistPage() {
  const navigate = useNavigate();
  const wishlist = useWishlistStore((s) => s.items);

  const courses = wishlist
    .map((item) => getCourseById(item.id))
    .filter(Boolean);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div>
        <h1 className="text-[42px] font-bold text-text font-display tracking-tight">Wishlist</h1>
        <p className="text-[20px] mt-1 font-medium">Courses you&apos;ve saved for later.</p>
      </div>

      {courses.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="You haven't saved any courses yet. Browse our catalog to find courses that interest you."
          actionLabel="Browse Courses"
          onAction={() => navigate('/student/catalog')}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.map((course) => (
            <CatalogCourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
