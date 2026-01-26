import { useNavigate } from "react-router-dom"

export default function Invite() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">🏏</h1>
          <h2 className="text-3xl font-bold mb-2">Fantasy Cricket</h2>
          <p className="text-gray-600">T20 World Cup 2026</p>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
          <p className="text-blue-800 font-semibold">Welcome to Beta Testing!</p>
          <p className="text-sm text-gray-700 mt-2">
            Create your fantasy team, pick match winners, and compete on the leaderboard.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="font-bold mb-3 text-gray-800">How to Play:</h3>
          <ol className="text-sm text-gray-700 space-y-2">
            <li><span className="font-bold">1.</span> Login with your email</li>
            <li><span className="font-bold">2.</span> Create a draft (pick players)</li>
            <li><span className="font-bold">3.</span> Predict match winners</li>
            <li><span className="font-bold">4.</span> Check leaderboard for your score</li>
          </ol>
        </div>

        <div className="mb-6 space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>100 pts</strong> - Correct batsman</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">✓</span>
            <span><strong>50 pts</strong> - Correct bowler</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-purple-600 font-bold">✓</span>
            <span><strong>200 pts</strong> - Correct winner</span>
          </div>
        </div>

        <button
          onClick={() => navigate("/login")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition mb-4"
        >
          Start Playing Now
        </button>

        <div className="bg-gray-50 p-4 rounded text-sm text-gray-600">
          <p className="font-bold mb-2">No account?</p>
          <p>Just enter your email and password to sign up or login.</p>
        </div>
      </div>
    </div>
  )
}
