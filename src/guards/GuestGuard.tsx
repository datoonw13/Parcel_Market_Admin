import { ReactNode } from "react"
import { Navigate } from "react-router"

import { useAppSelector } from "src/lib/hooks"
import { selectAuthedUser } from "src/lib/features/apis/authApi"

interface IGuestGuard {
    children: ReactNode;
    getUserLoading: boolean
}


const GuestGuard = ({ children, getUserLoading }: IGuestGuard) => {
    const isAuthed = useAppSelector(selectAuthedUser)

    if (isAuthed && !getUserLoading) {
        return <Navigate to="/" replace />
    }

    return (
        <div>{children}</div>
    )
}

export default GuestGuard