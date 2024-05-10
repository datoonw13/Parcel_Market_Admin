export interface IPropertySearch {
        "id": number,
        "state": string,
        "county": string,
        "parcelNumber": string,
        "waterFeature": boolean,
        "waterFront": boolean,
        "langCoverType": string,
        "propertyCondition": string,
        "wetProperty": string,
        "propertyRestriction": string,
        "legalDescription": string | null,
        "apiOwnerName": string | null,
        "lotSize": string | null,
        "salePrice": string | null,
        "saleYear": string | null,
        "propertyAccess": string,
        "improvementsValue": string,
        "price": string,
        "dateCreated": Date,
        user?: {email?: string}
}

export interface IPropertyAssessment {
        county: string;
        dateCreated: Date;
        id: number;
        name_owner: string;
        parcelNumber: string;
        price: string;
        state: string;
        "lastSalesPrice": number,
        "lastSalesDate": number,
        "propertyType": string,
        acrage: number,
        frontEndCalculatesMedian: number,
        frontEndCalculatesLowerMedian: number,
        frontEndCalculatesUpperMedian: number,
        frontEndCalculatesPricePerAcre: number
        frontEndCalculatesPrice: number,
        frontEndCalculateIQR: {
                q1: number;
                q2: number;
                IQR: number;
                IQRLowerBound: number;
                IQRUpperBound: number;
                averagePrice: number;
        }
        assessments: Array<{
                "id": number,
                "owner": string,
                "parselId": string,
                "propertyType": string,
                "acrage": string,
                "price":  number,
                "isValid": boolean,
                "isMedianValid": boolean;
                "lastSalesPrice": number,
                "lastSalesDate": number,
                "property_id": number,
                "dateCreated": Date,
                frontEndCalculateIsValidMedian: boolean,
                frontEndCalculatesIsValidIQR: number,

            }>
} 