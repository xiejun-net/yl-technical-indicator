import { EMA as emaFormula } from '../../utils'

export function EMA(data, calcParams = [ 5, 10, 20]){
    let maOption = calcParams
    let preEmaVal = {} // 上一次计算的值
    return data.map((item, i) => {
        let returnVal = {}
        maOption.forEach((optionItem) => {
            if (i > 0) {
                preEmaVal[`EMA${optionItem}`] = emaFormula(item.close, preEmaVal[`EMA${optionItem}`], optionItem)
                if (i >= optionItem) {
                    returnVal[`EMA${optionItem}`] = preEmaVal[`EMA${optionItem}`]
                } else {
                    returnVal[`EMA${optionItem}`] = 0
                }
            } else {
                returnVal[`EMA${optionItem}`] = 0
                preEmaVal[`EMA${optionItem}`] = 0
            }
        })
        return returnVal
    })
}