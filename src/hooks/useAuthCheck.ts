import { useState, useEffect, useCallback } from "react"

import { useLazyGetUserQuery } from "src/lib/features/apis/authApi"

const useAuthCheck = () => {
    const token = localStorage.getItem('token')
    const [loading, setLoading] = useState(!!token)
    const [getUser, {isLoading: getUserLoading}] = useLazyGetUserQuery()
    
     const checkAuth = useCallback(async () => {
      if (token) {
        try {
          await getUser().unwrap()
        } catch (error) {
          localStorage.removeItem('token')
        }
        finally {
            setLoading(false)
        }
      }
    }, [getUser, token])

    useEffect(() => {
        checkAuth()
      }, [checkAuth])
    
    return {loading, getUser, getUserLoading}
}

export default useAuthCheck