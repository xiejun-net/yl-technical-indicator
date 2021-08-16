/**
 * 计算MAVOL指标
 *
 * <p>
 * MAVOL指标计算方式
 * MAVOL1:=MA(VOL,5);
 * MAVOL2:=MA(VOL,13);
 * MAVOL3:=MA(VOL,55),COLORRED;
 *
 * MAVOL1赋值:成交量(手)的5日简单移动平均
 * MAVOL2赋值:成交量(手)的13日简单移动平均
 * MAVOL3赋值:成交量(手)的55日简单移动平
 *
 * 若收盘价高过开盘价，成交量画红色空心实体；否则画绿色实心。
 * @param dataList
 * @param calcParams
 * @returns {[]}
 */
 export function MAVOL(dataList, calcParams = [1, 5, 10, 20]) {
    const result = []
    dataList.forEach((kLineData, i) => {
        const mavol = {}
        calcParams.forEach((param) => {
            let sum = 0
            if (i >= param - 1) {
                for (let j = param; j > 0; j--) {
                    sum += dataList[i - j + 1].volume
                }
            }
            mavol['VOL' + param] = sum / (param * 10000)
        })
        result.push({
            ...mavol
        })
    })
    return result
}
