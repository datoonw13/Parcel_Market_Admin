import { ReactNode } from "react"
import { Navigate } from "react-router"

import { useAppSelector } from "src/lib/hooks"
import { selectAuthedUser } from "src/lib/features/apis/authApi"

interface IAuthGuard {
    children: ReactNode;
    getUserLoading: boolean;
}


const AuthGuard = ({ children, getUserLoading }: IAuthGuard) => {
    const isAuthed = useAppSelector(selectAuthedUser)

    if (!isAuthed && !getUserLoading) {
        return <Navigate to="/auth" replace />
    }

    return (
        <div>{children}</div>
    )

}
export default AuthGuard