import { Link } from "react-router-dom"

export default function Team() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="max-w-7xl mx-auto">
          <Link to="/dashboard" className="text-white hover:text-gray-200">← Back to Dashboard</Link>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold">Team Page</h1>
      </div>
    </div>
  )
}