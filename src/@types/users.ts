export interface IUser {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    role: 'admin' | 'user',
    county: string,
    state: string,
    mailingAddress: string
    image: string | null,
    dateCreated: Date,
    subscriptionType: string;
    registrationReasons: string[];
    source: string;
    searchesCount: number;
    lastSearchDate: Date;
    isGoogleUser?: boolean
}