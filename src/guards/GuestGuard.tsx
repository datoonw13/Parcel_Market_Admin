import { ReactNode } from "react"
import { Navigate } from "react-router"

interface IGuestGuard {
    children: ReactNode
}


const GuestGuard = ({ children }: IGuestGuard) => {
    const isAuthed = false

    if (isAuthed) {
        return <Navigate to="/dashboard" replace />
    }

    return (
        <div>{children}</div>
    )
}

export default GuestGuard