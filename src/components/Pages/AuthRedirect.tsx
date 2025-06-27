import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function AuthRedirect() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    authenticateUser()
  }, [])

  const authenticateUser = async () => {
    try {
      const response = await fetch("http://localhost:8000/protected", {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const data = await response.json()
        const user = {
          name: data.user.name,
          email: data.user.email,
          picture: data.user.picture
        }
        localStorage.setItem("user", JSON.stringify(user))
        navigate("/") // Redirect to main app
        return
      }

      // If protected endpoint fails, redirect to login
      console.error("Authentication failed:", response.status)
      navigate("/login")

    } catch (err) {
      console.error("Authentication error:", err)
      setError("Authentication failed")
      setTimeout(() => navigate("/login"), 2000)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-2">{error}</p>
          <p className="text-slate-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600 text-lg">Signing you in...</p>
      </div>
    </div>
  )
}
