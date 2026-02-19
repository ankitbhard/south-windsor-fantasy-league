import { useState } from "react"
import { useNavigate } from "react-router-dom"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!email || !password) {
      setError("Please enter both email and password")
      setLoading(false)
      return
    }

    try {
      const endpoint = isSignUp ? '/auth/signup' : '/auth/login'
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Authentication failed')
        setLoading(false)
        return
      }

      // Save token and user info
      localStorage.setItem('token', data.token)
      localStorage.setItem('userId', data.user.id)
      localStorage.setItem('userEmail', data.user.email)

      console.log("User logged in:", data.user.email)
      navigate("/dashboard")
    } catch (error) {
      console.error('Error:', error)
      setError('Connection error. Make sure backend server is running.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center">

      {/* Collage Background */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
        <img src="/cricket.png" alt="" className="w-full h-full object-cover" />
        <img src="/group.jpeg" alt="" className="w-full h-full object-cover" />
        <img src="/group.jpeg" alt="" className="w-full h-full object-cover scale-x-[-1]" />
        <img src="/cricket.png" alt="" className="w-full h-full object-cover scale-x-[-1]" />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Title above form */}
      <div className="relative z-10 flex flex-col items-center w-full px-4">
        <div className="mb-4 text-center">
          <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">🏏 South Windsor Fantasy Cricket</h1>
          <p className="text-orange-300 text-sm mt-1 font-semibold">T20 World Cup 2026</p>
        </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <p className="text-center text-gray-700 text-sm font-semibold mb-6">
          {isSignUp ? "Create an account" : "Login to your account"}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError("")
            }}
            placeholder="Enter your email"
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
            disabled={loading}
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError("")
            }}
            placeholder="Enter your password"
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-bold disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Loading..." : (isSignUp ? "Sign Up" : "Login")}
        </button>

        {/* Toggle Sign Up / Login */}
        <p className="text-center text-gray-600 text-sm mt-4">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 hover:text-blue-800 font-bold"
            disabled={loading}
          >
            {isSignUp ? "Login" : "Sign Up"}
          </button>
        </p>
      </form>
      </div>
    </div>
  )
}
