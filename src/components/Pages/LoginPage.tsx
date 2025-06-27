import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Loader2, Sparkles } from "lucide-react"
import { DarkModeToggle } from "@/components/DarkModeToggle";

export default function GoogleLoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState<{ name: string; email: string; picture?: string } | null>(null)
  const BACKEND_URL = import.meta.env.BACKEND_URL
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      // Try to get user data from protected endpoint
      const response = await fetch(`${BACKEND_URL}/protected`, {
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
        setUserData(user)
        setIsLoggedIn(true)
        localStorage.setItem('user', JSON.stringify(user))
      } else {
        localStorage.removeItem('user')
        setIsLoggedIn(false)
        setUserData(null)
      }
    } catch (err) {
      // Check localStorage as fallback
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUserData(JSON.parse(storedUser))
        setIsLoggedIn(true)
      }
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(`${BACKEND_URL}/auth/google/url`)
      const data = await res.json()
      if (data?.url) {
        console.log("Redirecting to Google login URL:", data.url)
        window.location.href = data.url 
      } else {
        throw new Error("Failed to get Google login URL")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      // Call logout endpoint if you have one
      await fetch(`${BACKEND_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (err) {
      console.log("Logout endpoint not available")
    }
    
    // Clear local storage and state
    localStorage.removeItem('user')
    setUserData(null)
    setIsLoggedIn(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="flex items-center justify-between p-6 border-b bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-200">AI Assistant</h1>
        </div>
        {isLoggedIn && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleLogout}
            className="text-slate-600 hover:text-slate-800"
          >
            Sign Out
          </Button>
        )}
        <DarkModeToggle />
      </header>

      <main className="container mx-auto px-6 py-12 flex items-center justify-center min-h-[calc(100vh-88px)]">
        <Card className="w-full max-w-md shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              {isLoggedIn ? 'Welcome back!' : 'Sign in to continue'}
            </CardTitle>
            <p className="text-slate-600 dark:text-slate-400">
              {isLoggedIn ? 'You are successfully signed in' : 'Access your AI assistant with Google'}
            </p>
          </CardHeader>
          <CardContent className="grid gap-6">
            {isLoggedIn ? (
              <div className="flex flex-col items-center justify-center space-y-6">
                {userData?.picture ? (
                  <img
                    src={userData.picture}
                    alt="Profile"
                    className="rounded-full w-20 h-20 object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-full w-20 h-20 flex items-center justify-center">
                    <User className="h-10 w-10 text-slate-500" />
                  </div>
                )}
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold text-slate-800">{userData?.name || 'User'}</h3>
                  <p className="text-sm text-slate-600">{userData?.email}</p>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md"
                  onClick={() => window.location.href = '/'}
                >
                  Continue to AI Assistant
                </Button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-slate-500 font-medium">
                      Continue with
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full h-12 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 text-slate-700"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                      </svg>
                      <span className="font-medium">Continue with Google</span>
                    </div>
                  )}
                </Button>

                {error && (
                  <div className="text-red-600 text-sm text-center p-3 bg-red-50 rounded-lg border border-red-200">
                    {error}
                  </div>
                )}

                <div className="text-xs text-slate-500 text-center mt-2">
                  By continuing, you agree to our <a href="#" className="underline hover:text-slate-700 transition-colors">Terms of Service</a> and <a href="#" className="underline hover:text-slate-700 transition-colors">Privacy Policy</a>.
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
