export interface IUser {
    id: number,
    name: string,
    email: string,
    role: 'admin' | 'user',
    county: string,
    state: string,
    mailingAddress: string
    image: string | null
}