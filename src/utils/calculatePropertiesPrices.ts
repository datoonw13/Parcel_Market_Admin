import { IPropertyAssessment } from "src/@types/property";

const toFixed2 = (val: string | number) => Number(parseFloat(val.toString()).toFixed(2))

const calcPricePerAcre = (lastSalePrice: string | number, acrage: string | number) => toFixed2(toFixed2(lastSalePrice) / toFixed2(acrage))

const frontCalculateIsValidMedian = (frontCalculatesLowerMedian: number, frontCalculatesUpperMedian: number, price: number) =>  !!(price > frontCalculatesLowerMedian && price < frontCalculatesUpperMedian)


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
    const q1 = arrayMedian(array.slice(0, array.length / 2))
    const q2 = arrayMedian(array.length % 2 === 0 ?  array.slice(array.length / 2) : array.slice((array.length / 2) + 1))
    const IQR = q2 - q1
    const IQRLowerBound = q1 - 1.5 * IQR
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


export const calculatePropertyPrice = (property: IPropertyAssessment) => {
    const data = {
        ...property, 
        frontEndCalculatesMedian: 0,
        frontEndCalculatesLowerMedian: 0,
        frontEndCalculatesUpperMedian: 0,
        frontEndCalculatesPrice: 0
    }
    // Calculate with mediana
    const assessmentsPricePerAcre = property.assessments.filter(el => el.isValid).map(el => calcPricePerAcre(el.lastSalesPrice, el.acrage)).sort((a,b) => a - b)
    const frontCalculatesMedian = toFixed2(assessmentsPricePerAcre[Math.floor(assessmentsPricePerAcre.length / 2)])
    const frontCalculatesLowerMedian = toFixed2(frontCalculatesMedian / 2)
    const frontCalculatesUpperMedian = toFixed2(frontCalculatesMedian  * 5)
    data.frontEndCalculatesMedian = frontCalculatesMedian
    data.frontEndCalculatesLowerMedian = frontCalculatesLowerMedian
    data.frontEndCalculatesUpperMedian = frontCalculatesUpperMedian
    data.assessments = data.assessments.map(el => ({...el, frontEndCalculateIsValidMedian: frontCalculateIsValidMedian(frontCalculatesLowerMedian, frontCalculatesUpperMedian, calcPricePerAcre(el.lastSalesPrice, el.acrage)) }))
    .sort((a,b) => calcPricePerAcre(a.lastSalesPrice, a.acrage) - calcPricePerAcre(b.lastSalesPrice, b.acrage))
    const validPricesForParcelPriceCalculation =  data.assessments.filter(el => el.frontEndCalculateIsValidMedian && el.isValid).map(el => calcPricePerAcre(el.lastSalesPrice, el.acrage)).sort((a, b) => a - b) 
    data.frontEndCalculatesPricePerAcre = toFixed2(validPricesForParcelPriceCalculation.reduce((acc,cur) => acc + cur, 0) / validPricesForParcelPriceCalculation.length)
    data.frontEndCalculatesPrice = toFixed2(data.frontEndCalculatesPricePerAcre * data.acrage)

    // IQR Calculation
    // get all assesment pricePerAcre which is -isValid-
    const validPrices =  property.assessments.filter(el => el.isValid).map(el => calcPricePerAcre(el.lastSalesPrice, el.acrage)).sort((a,b) => a - b)
    data.frontEndCalculateIQR = IQRCalculation(validPrices)
    // @ts-ignore
    data.assessments = data.assessments.map(el => ({...el, frontEndCalculatesIsValidIQR: calcPricePerAcre(el.lastSalesPrice, el.acrage) > data.frontEndCalculateIQR.IQRLowerBound && calcPricePerAcre(el.lastSalesPrice, el.acrage) < data.frontEndCalculateIQR.IQRUpperBound}))
    // data.assessments.map(el => console.log(calcPricePerAcre(el.lastSalesPrice, el.acrage), data.frontEndCalculateIQR.IQRLowerBound , data.frontEndCalculateIQR.IQRUpperBound))
    return data
}