import { ISTOCK, calcHnLn } from '../../utils/index'

export function WR(dataList: ISTOCK[], options: any, plots = [
    { key: 'WR1', title: 'WR1', type: 'line' },
    { key: 'WR2', title: 'WR2', type: 'line' }
]) {
    return dataList.map((kLineData, i) => {
        // tslint:disable-next-line: no-shadowed-variable
        const wr = {
            WR1: 0,
            WR2: 0
        }
        const close = kLineData.close
        options.forEach((param: number, index: string | number) => {
            const p = param - 1
            if (i >= p) {
                const hln = calcHnLn(dataList.slice(i - p, i + 1))
                const hn = hln.hn
                const ln = hln.ln
                const hnSubLn = hn - ln
                wr[plots[index].key] = hnSubLn === 0 ? 0 : (hn - close) / hnSubLn * 100
            }
        })
        return wr
    })
}