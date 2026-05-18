import { Clock, BookOpen, Award, PlayCircle } from 'lucide-react';
import { WidgetCard, StatsCard, ActivityTimeline } from '@/features/dashboard/components/DashboardWidgets';

const mockActivities = [
  { title: 'Completed module "React Hooks Deep Dive"', time: '2 hours ago' },
  { title: 'Earned "Fast Learner" badge', time: '1 day ago' },
  { title: 'Started "Advanced Next.js Architecture"', time: '2 days ago' },
  { title: 'Completed Quiz: State Management', time: '3 days ago' },
];

export default function StudentDashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      
      {/* Hero Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl lg:text-4xl font-bold text-text font-display tracking-tight">
          Welcome back, Alex!
        </h1>
        <p className="text-muted font-medium text-lg">
          You're on a <span className="text-orange-500 font-bold">12-day learning streak</span>. Keep it up! 🔥
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard 
          title="Hours Learned" 
          value="42.5h" 
          icon={Clock} 
          trend="up" 
          trendValue="2.5h this week" 
        />
        <StatsCard 
          title="Courses Completed" 
          value="4" 
          icon={BookOpen} 
        />
        <StatsCard 
          title="Certificates Earned" 
          value="2" 
          icon={Award} 
          trend="up"
          trendValue="1 new"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Left Column (Wider) */}
        <div className="lg:col-span-2 space-y-6">
          <WidgetCard 
            title="Jump Back In" 
            action={<button className="text-sm font-bold text-primary hover:text-primary-hover hover:underline transition-colors">View all</button>}
          >
            <div className="group relative overflow-hidden rounded-xl border border-border bg-bg flex flex-col sm:flex-row cursor-pointer transition-colors hover:border-border-strong">
              <div className="relative h-48 w-full sm:h-auto sm:w-[40%] bg-surface overflow-hidden shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop" 
                  alt="React Architecture" 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-14 w-14 rounded-full bg-primary/90 flex items-center justify-center text-white backdrop-blur-md shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300">
                    <PlayCircle className="h-7 w-7" />
                  </div>
                </div>
              </div>
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center">
                <div className="text-[11px] font-bold uppercase tracking-widest text-primary mb-3">
                  Module 4 • Lesson 2
                </div>
                <h4 className="text-xl font-bold text-text mb-3 font-display">
                  Advanced State Management with Zustand
                </h4>
                <p className="text-sm text-muted mb-8 font-medium line-clamp-2">
                  Learn how to architect complex states using Zustand and React Query for enterprise-grade SaaS applications.
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="h-2 flex-1 rounded-full bg-border overflow-hidden">
                    <div className="h-full w-[65%] rounded-full bg-primary relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/20 shimmer-sweep" />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-muted">65%</span>
                </div>
              </div>
            </div>
          </WidgetCard>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <WidgetCard title="Recent Activity">
            <ActivityTimeline activities={mockActivities} />
          </WidgetCard>
        </div>
      </div>
    </div>
  );
}
