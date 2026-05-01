import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Hero */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 to-primary-700 bg-clip-text text-transparent mb-6 leading-tight">
              Campus Gigs
              <br />
              <span className="text-4xl md:text-5xl">Made Simple</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg leading-relaxed">
              Connect with local businesses for part-time gigs, internships, 
              and freelance opportunities near your campus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="btn-primary text-lg px-8 py-4">
                Get Started Free
              </Link>
              <Link to="/search" className="px-8 py-4 border-2 border-primary-600 text-primary-600 font-semibold rounded-xl hover:bg-primary-600 hover:text-white transition-all shadow-lg">
                Browse Gigs
              </Link>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Students working"
              className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
            />
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          <div className="card p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🎓</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">For Students</h3>
            <p className="text-gray-600">Find flexible work near campus. Build your portfolio and earn.</p>
          </div>
          <div className="card p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🏢</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">For Businesses</h3>
            <p className="text-gray-600">Hire campus talent fast. Verified students ready to work.</p>
          </div>
          <div className="card p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-menus justify-center mx-auto mb-6">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Instant Match</h3>
            <p className="text-gray-600">Skills-based matching. Apply and get hired in hours.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-20 glass p-12 rounded-3xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Start?
          </h2>
          <Link to="/register" className="btn-primary text-xl px-12 py-5 inline-block">
            Join SkillBloom Today
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home

