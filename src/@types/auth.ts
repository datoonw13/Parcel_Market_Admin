export interface ISignIn {
    email: string;
    password: string;
}

export interface IUser {
    "id": number,
    "sub": number,
    "name": string,
    "email": string,
    "role": "admin"
}