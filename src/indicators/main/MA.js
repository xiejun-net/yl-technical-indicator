export function MA(data, calcParams = [ 5, 10, 20, 60, 120]){
    let maOption = calcParams
    const configArr = []
    return data.map((item, i) => {
        let returnVal = {}
        maOption.forEach((optionItem, j) => {
            configArr[j] = configArr[j] || {P: 0}
            configArr[j].P += item.close
            if (i >= optionItem - 1) {
                returnVal[`MA${optionItem}`] = configArr[j].P / optionItem
                configArr[j].P -= data[i - (optionItem - 1)].close
            } else {
                returnVal[`MA${optionItem}`] = 0
            }
        })
        return returnVal
    })

}