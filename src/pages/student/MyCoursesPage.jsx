import { useState, useEffect } from 'react';
import { BookOpen, CheckCircle } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import { DashboardGridSkeleton } from '@/components/ui/Skeletons';

const MOCK_COURSES = [
  {
    id: 1,
    title: 'Advanced State Management with Zustand',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop',
    progress: 65,
    status: 'in-progress',
    totalLessons: 42,
    completedLessons: 27
  },
  {
    id: 2,
    title: 'Cloud Architecture Patterns',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
    progress: 100,
    status: 'completed',
    totalLessons: 50,
    completedLessons: 50
  },
  {
    id: 3,
    title: 'Enterprise React Systems',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
    progress: 12,
    status: 'in-progress',
    totalLessons: 30,
    completedLessons: 4
  }
];

export default function MyCoursesPage() {
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setCourses(MOCK_COURSES);
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const filteredCourses = courses.filter(course => 
    filter === 'all' ? true : course.status === filter
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text font-display tracking-tight">My Courses</h1>
          <p className="text-muted mt-1 font-medium">Pick up right where you left off.</p>
        </div>
        
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-surface p-1.5 rounded-xl border border-border shrink-0 overflow-x-auto shadow-sm">
          {['all', 'in-progress', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-lg text-[13px] font-bold capitalize transition-all whitespace-nowrap ${
                filter === f 
                  ? 'bg-text text-bg shadow-md' 
                  : 'text-muted hover:text-text hover:bg-bg'
              }`}
            >
              {f.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <DashboardGridSkeleton cards={4} />
      ) : filteredCourses.length === 0 ? (
        <EmptyState 
          icon={BookOpen} 
          title="No courses found" 
          description={
            filter === 'all' 
              ? "You haven't enrolled in any courses yet." 
              : `You don't have any ${filter} courses right now.`
          }
          actionLabel="Browse Courses"
          onAction={() => window.location.href = '/tracks'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCourses.map(course => (
            <div key={course.id} className="group relative overflow-hidden rounded-2xl border border-border bg-surface shadow-sm hover:shadow-card hover:border-border-strong transition-all flex flex-col sm:flex-row cursor-pointer h-full">
              <div className="relative h-48 sm:h-auto sm:w-2/5 shrink-0 overflow-hidden bg-bg">
                <img src={course.image} alt={course.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                {course.progress === 100 ? (
                  <div className="absolute top-3 left-3 bg-success text-white text-[11px] uppercase tracking-wider font-bold px-2.5 py-1 rounded flex items-center gap-1.5 shadow-md">
                    <CheckCircle className="h-3.5 w-3.5" /> Completed
                  </div>
                ) : null}
              </div>
              <div className="p-6 flex-1 flex flex-col justify-center">
                <h3 className="text-lg font-bold text-text mb-2 line-clamp-2 leading-snug">{course.title}</h3>
                <p className="text-sm text-muted mb-6 font-medium">
                  {course.completedLessons} of {course.totalLessons} lessons completed
                </p>
                <div className="mt-auto space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-text mb-1">
                    <span className="uppercase tracking-wider">{course.progress === 100 ? 'Completed' : 'Progress'}</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-bg overflow-hidden border border-border">
                    <div 
                      className={`h-full rounded-full relative overflow-hidden ${course.progress === 100 ? 'bg-success' : 'bg-primary'}`} 
                      style={{ width: `${course.progress}%` }} 
                    >
                      <div className="absolute inset-0 bg-white/20 shimmer-sweep" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
