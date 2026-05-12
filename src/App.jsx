import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DemoPage from './components/Pages/DemoPage'
import ScrollToTop from './components/ScrollToTop'
import LoginPage from './components/Pages/LoginPage'
import SignupPage from './components/Pages/SignupPage'
import MentorDetailPage from './components/Pages/MentorDetailPage'
import MentorsListPage from './components/Pages/MentorsListPage'
import TrackDetailPage from './components/Pages/TrackDetailPage'
import TracksListPage from './components/Pages/TracksListPage'
import LessonPlayerPage from './components/Pages/LessonPlayerPage'
import BackToTop from './components/ui/BackToTop'

function App() {
  return (
    <Router>
      <ScrollToTop />
      <BackToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/mentors" element={<MentorsListPage />} />
        <Route path="/mentors/:slug" element={<MentorDetailPage />} />
        <Route path="/tracks" element={<TracksListPage />} />
        <Route path="/tracks/:id" element={<TrackDetailPage />} />
        <Route path="/learn/:trackId" element={<LessonPlayerPage />} />
        <Route path="/learn/:trackId/:lessonId" element={<LessonPlayerPage />} />
      </Routes>
    </Router>
  )
}

export default App
