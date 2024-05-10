import { IPropertyAssessment } from "src/@types/property";

const toFixed2 = (val: string | number) => Number(parseFloat(val.toString()).toFixed(2))

const calcPricePerAcre = (lastSalePrice: string | number, acrage: string | number) => toFixed2(toFixed2(lastSalePrice) / toFixed2(acrage))

const frontCalculateIsValidMedian = (frontCalculatesLowerMedian: number, frontCalculatesUpperMedian: number, price: number) =>  !!(price > frontCalculatesLowerMedian && price < frontCalculatesUpperMedian)


export const calculatePropertyPrice = (property: IPropertyAssessment) => {
    const data = {
        ...property, 
        frontEndCalculatesMedian: 0,
        frontEndCalculatesLowerMedian: 0,
        frontEndCalculatesUpperMedian: 0,
        frontEndCalculatesPrice: 0
    }
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
    return data
}