import { IPropertyAssessment } from "src/@types/property";

const toFixed2 = (val: string | number) => Number(parseFloat(val.toString()).toFixed(2))

export const calcPricePerAcre = (lastSalePrice: string | number, acrage: string | number) =>  {
    const pricePerAcre = Number(acrage) < 1 ? Number(lastSalePrice) * Number(acrage) : Number(lastSalePrice) / Number(acrage) 
    return toFixed2(pricePerAcre)
}



function arrayMedian(numbers: number[]) {
    const sorted = Array.from(numbers).sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
}

const IQRCalculation = (arr: number[]) => {
    const array = [...arr]
    console.log(array);
    
    const q1 = arrayMedian(array.slice(0, array.length / 2))
    const q2 = arrayMedian(array.length % 2 === 0 ?  array.slice(array.length / 2) : array.slice((array.length / 2) + 1))
    const IQR = q2 - q1
    const IQRLowerBound = q1 - 1 * IQR
    const IQRUpperBound = q2 + 1.5 * IQR
    const filteredArray =  array.filter(el => (el > IQRLowerBound && el < IQRUpperBound))
    return {
        q1: toFixed2(q1),
        q2: toFixed2(q2),
        IQR: toFixed2(IQR),
        IQRLowerBound: toFixed2(IQRLowerBound),
        IQRUpperBound: toFixed2(IQRUpperBound),
        averagePrice: toFixed2(filteredArray.reduce((acc,cur) => acc + cur, 0) / filteredArray.length)
    }
}

const isValidIQR = (assesment: IPropertyAssessment['assessments'][0], frontEndCalculatedIQR: IPropertyAssessment['frontEndCalculatedIQR']) => !!(assesment.isValid && (calcPricePerAcre(assesment.lastSalesPrice, assesment.acrage) > frontEndCalculatedIQR.IQRLowerBound && calcPricePerAcre(assesment.lastSalesPrice, assesment.acrage) < frontEndCalculatedIQR.IQRUpperBound))

const medianCalculation = (arr: number[]) => {
    const array = [...arr]
    const median = toFixed2(array[Math.floor(array.length / 2)])
    const lowerMedian = toFixed2(median / 2)
    const upperMedian = toFixed2(median  * 5)
    const filteredArray = array.filter(el => el > lowerMedian && el < upperMedian)
    return {
        median,
        lowerMedian,
        upperMedian,
        averagePrice: toFixed2(filteredArray.reduce((acc,cur) => acc + cur, 0) / filteredArray.length)
    }

}

const isValidMedian = (assesment: IPropertyAssessment['assessments'][0], frontEndCalculatedMedian: IPropertyAssessment['frontEndCalculatedMedian']) => !!(assesment.isValid && (calcPricePerAcre(assesment.lastSalesPrice, assesment.acrage) > frontEndCalculatedMedian.lowerMedian && calcPricePerAcre(assesment.lastSalesPrice, assesment.acrage) < frontEndCalculatedMedian.upperMedian))


export const calculatePropertyPrice = (property: IPropertyAssessment) => {
    const data = {
        ...property, 
    }
    const validPrices =  property.assessments.filter(el => el.isValid).map(el => calcPricePerAcre(el.lastSalesPrice, el.acrage)).sort((a,b) => a - b)
    const IQR =IQRCalculation(validPrices)
    const median =medianCalculation(validPrices)
    data.frontEndCalculatedIQR =  IQR
    data.frontEndCalculatedMedian =  median
    data.assessments = data.assessments.map(el => ({...el, 
        frontEndCalculatedIsValidIQR: isValidIQR(el, data.frontEndCalculatedIQR),
        frontEndCalculateIsValidMedian: isValidMedian(el, data.frontEndCalculatedMedian)
    }
    )).sort((a,b) => calcPricePerAcre(a.lastSalesPrice, a.acrage) - calcPricePerAcre(b.lastSalesPrice, b.acrage))
    return data
}