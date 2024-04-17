import { ReactNode } from "react"
import { Navigate } from "react-router"

interface IAuthGuard {
    children: ReactNode
}


const AuthGuard = ({ children }: IAuthGuard) => {
    const isAuthed = true

    if (!isAuthed) {
        return <Navigate to="/auth" replace />
    }

    return (
        <div>{children}</div>
    )

}
export default AuthGuard