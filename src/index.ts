// MyTT TypeScript版本 - 移植自Python版本
// 用于技术分析指标计算

// 类型定义
export type Series = number[];
export type BoolSeries = boolean[];

// ------------------- 0级：核心工具函数 -------------------

/**
 * 四舍五入到指定小数位
 */
export function RD(n: number, decimals: number = 3): number {
    return Number(Math.round(Number(n + 'e' + decimals)) + 'e-' + decimals);
}

/**
 * 返回序列倒数第N个值
 */
export function RET(s: Series, n: number = 1): number {
    return s[s.length - n];
}

/**
 * 返回绝对值
 */
export function ABS(s: Series): Series {
    return s.map(Math.abs);
}

/**
 * 自然对数
 */
export function LN(s: Series): Series {
    return s.map(Math.log);
}

/**
 * 求幂
 */
export function POW(s: Series, n: number): Series {
    return s.map(x => Math.pow(x, n));
}

/**
 * 平方根
 */
export function SQRT(s: Series): Series {
    return s.map(Math.sqrt);
}

/**
 * 正弦
 */
export function SIN(s: Series): Series {
    return s.map(Math.sin);
}

/**
 * 余弦
 */
export function COS(s: Series): Series {
    return s.map(Math.cos);
}

/**
 * 正切
 */
export function TAN(s: Series): Series {
    return s.map(Math.tan);
}

/**
 * 序列最大值
 */
export function MAX(s1: Series, s2: Series): Series {
    return s1.map((v, i) => Math.max(v, s2[i]));
}

/**
 * 序列最小值
 */
export function MIN(s1: Series, s2: Series): Series {
    return s1.map((v, i) => Math.min(v, s2[i]));
}

/**
 * 条件判断
 */
export function IF(condition: Series, a: Series | number, b: Series | number): Series {
    const aIsNumber = typeof a === 'number';
    const bIsNumber = typeof b === 'number';
    
    return condition.map((v, i) => {
        const aValue = aIsNumber ? a as number : (a as Series)[i];
        const bValue = bIsNumber ? b as number : (b as Series)[i];
        return v ? aValue : bValue;
    });
}

/**
 * 序列位移
 */
export function REF(s: Series, n: number = 1): Series {
    const result = new Array(s.length).fill(NaN);
    for (let i = n; i < s.length; i++) {
        result[i] = s[i - n];
    }
    return result;
}

/**
 * 计算差值
 */
export function DIFF(s: Series, n: number = 1): Series {
    const result = new Array(s.length).fill(NaN);
    for (let i = n; i < s.length; i++) {
        result[i] = s[i] - s[i - n];
    }
    return result;
}

/**
 * 标准差
 */
export function STD(s: Series, n: number): Series {
    const result = new Array(s.length).fill(NaN);
    for (let i = n - 1; i < s.length; i++) {
        const slice = s.slice(i - n + 1, i + 1);
        const mean = slice.reduce((a, b) => a + b, 0) / n;
        const sum = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0);
        result[i] = Math.sqrt(sum / n);
    }
    return result;
} 

/**
 * 对序列求N天累计和
 */
export function SUM(s: Series, n: number): Series {
    const result = new Array(s.length).fill(NaN);
    if (n <= 0) {
        let sum = 0;
        return s.map(v => sum += v);
    }
    
    for (let i = 0; i < s.length; i++) {
        if (i < n - 1) continue;
        result[i] = s.slice(i - n + 1, i + 1).reduce((a, b) => a + b, 0);
    }
    return result;
}

/**
 * 返回序列最后的值组成常量序列
 */
export function CONST(s: Series): Series {
    const lastValue = s[s.length - 1];
    return new Array(s.length).fill(lastValue);
}

/**
 * 求N周期内最高值
 */
export function HHV(s: Series, n: number): Series {
    const result = new Array(s.length).fill(NaN);
    for (let i = 0; i < s.length; i++) {
        if (i < n - 1) continue;
        result[i] = Math.max(...s.slice(i - n + 1, i + 1));
    }
    return result;
}

/**
 * 求N周期内最低值
 */
export function LLV(s: Series, n: number): Series {
    const result = new Array(s.length).fill(NaN);
    for (let i = 0; i < s.length; i++) {
        if (i < n - 1) continue;
        result[i] = Math.min(...s.slice(i - n + 1, i + 1));
    }
    return result;
}

/**
 * 求N周期内最高值到当前周期数
 */
export function HHVBARS(s: Series, n: number): Series {
    const result = new Array(s.length).fill(NaN);
    for (let i = n - 1; i < s.length; i++) {
        const slice = s.slice(i - n + 1, i + 1);
        const max = Math.max(...slice);
        result[i] = slice.length - 1 - slice.lastIndexOf(max);
    }
    return result;
}

/**
 * 求N周期内最低值到当前周期数
 */
export function LLVBARS(s: Series, n: number): Series {
    const result = new Array(s.length).fill(NaN);
    for (let i = n - 1; i < s.length; i++) {
        const slice = s.slice(i - n + 1, i + 1);
        const min = Math.min(...slice);
        result[i] = slice.length - 1 - slice.lastIndexOf(min);
    }
    return result;
}

/**
 * 简单移动平均
 */
export function MA(s: Series, n: number): Series {
    const result = new Array(s.length).fill(NaN);
    for (let i = n - 1; i < s.length; i++) {
        result[i] = s.slice(i - n + 1, i + 1).reduce((a, b) => a + b, 0) / n;
    }
    return result;
}

/**
 * 指数移动平均
 */
export function EMA(s: Series, n: number): Series {
    const alpha = 2 / (n + 1);
    const result = new Array(s.length).fill(NaN);
    result[0] = s[0];
    
    for (let i = 1; i < s.length; i++) {
        result[i] = alpha * s[i] + (1 - alpha) * result[i - 1];
    }
    return result;
}

/**
 * 中国式的SMA
 */
export function SMA(s: Series, n: number, m: number = 1): Series {
    const alpha = m / n;
    const result = new Array(s.length).fill(NaN);
    result[0] = s[0];
    
    for (let i = 1; i < s.length; i++) {
        result[i] = alpha * s[i] + (1 - alpha) * result[i - 1];
    }
    return result;
}

/**
 * 加权移动平均
 */
export function WMA(s: Series, n: number): Series {
    const result = new Array(s.length).fill(NaN);
    const weights = Array.from({length: n}, (_, i) => i + 1);
    const weightSum = weights.reduce((a, b) => a + b, 0);
    
    for (let i = n - 1; i < s.length; i++) {
        let sum = 0;
        for (let j = 0; j < n; j++) {
            sum += s[i - j] * (n - j);
        }
        result[i] = sum / weightSum;
    }
    return result;
}

/**
 * 动态移动平均
 */
export function DMA(s: Series, a: number | Series): Series {
    const result = new Array(s.length).fill(NaN);
    result[0] = s[0];
    
    if (typeof a === 'number') {
        for (let i = 1; i < s.length; i++) {
            result[i] = a * s[i] + (1 - a) * result[i - 1];
        }
    } else {
        for (let i = 1; i < s.length; i++) {
            const alpha = isNaN(a[i]) ? 1.0 : a[i];
            result[i] = alpha * s[i] + (1 - alpha) * result[i - 1];
        }
    }
    return result;
}

/**
 * 平均绝对偏差
 */
export function AVEDEV(s: Series, n: number): Series {
    const result = new Array(s.length).fill(NaN);
    for (let i = n - 1; i < s.length; i++) {
        const slice = s.slice(i - n + 1, i + 1);
        const mean = slice.reduce((a, b) => a + b, 0) / n;
        result[i] = slice.reduce((a, b) => a + Math.abs(b - mean), 0) / n;
    }
    return result;
}

// --- 1级：应用层函数 ---

/**
 * 统计N日内满足条件的天数
 */
export function COUNT(s: Series, n: number): Series {
    return SUM(s.map(v => v ? 1 : 0), n);
}

/**
 * 判断N日内是否都满足条件
 */
export function EVERY(s: BoolSeries, n: number): BoolSeries {
    const result = new Array(s.length).fill(false);
    for (let i = n - 1; i < s.length; i++) {
        let allTrue = true;
        for (let j = 0; j < n; j++) {
            if (!s[i - j]) {
                allTrue = false;
                break;
            }
        }
        result[i] = allTrue;
    }
    return result;
}

/**
 * N日内是否存在满足条件的情况
 */
export function EXIST(s: BoolSeries, n: number): BoolSeries {
    const result = new Array(s.length).fill(false);
    for (let i = n - 1; i < s.length; i++) {
        let exists = false;
        for (let j = 0; j < n; j++) {
            if (s[i - j]) {
                exists = true;
                break;
            }
        }
        result[i] = exists;
    }
    return result;
}

/**
 * 条件过滤器
 */
export function FILTER(s: Series, n: number): Series {
    const result = [...s];
    for (let i = 0; i < result.length; i++) {
        if (result[i]) {
            for (let j = 1; j <= n && i + j < result.length; j++) {
                result[i + j] = 0;
            }
        }
    }
    return result;
}

/**
 * 上一次条件成立到当前的周期
 */
export function BARSLAST(s: Series): Series {
    const result = new Array(s.length).fill(0);
    let count = 0;
    
    for (let i = 0; i < s.length; i++) {
        if (s[i]) {
            count = 0;
        } else {
            count++;
        }
        result[i] = count;
    }
    return result;
}

/**
 * 统计连续满足条件的周期数
 */
export function BARSLASTCOUNT(s: Series): Series {
    const result = new Array(s.length).fill(0);
    let count = 0;
    
    for (let i = 0; i < s.length; i++) {
        if (s[i]) {
            count++;
        } else {
            count = 0;
        }
        result[i] = count;
    }
    return result;
}

/**
 * N周期内第一次条件成立到现在的周期数
 */
export function BARSSINCEN(s: Series, n: number): Series {
    const result = new Array(s.length).fill(0);
    
    for (let i = 0; i < s.length; i++) {
        if (i < n - 1) continue;
        const slice = s.slice(i - n + 1, i + 1);
        const firstTrueIndex = slice.findIndex(v => v);
        result[i] = firstTrueIndex === -1 ? 0 : n - 1 - firstTrueIndex;
    }
    return result;
}

/**
 * 判断向上金叉穿越
 */
export function CROSS(s1: Series, s2: Series): BoolSeries {
    const result = new Array(s1.length).fill(false);
    for (let i = 1; i < s1.length; i++) {
        result[i] = s1[i] > s2[i] && s1[i - 1] <= s2[i - 1];
    }
    return result;
}

/**
 * 两条线维持一定周期后交叉
 */
export function LONGCROSS(s1: Series, s2: Series, n: number): BoolSeries {
    const result = new Array(s1.length).fill(false);
    for (let i = n; i < s1.length; i++) {
        if (s1[i] <= s2[i]) continue;
        let allLess = true;
        for (let j = 1; j <= n; j++) {
            if (s1[i - j] >= s2[i - j]) {
                allLess = false;
                break;
            }
        }
        result[i] = allLess;
    }
    return result;
}

/**
 * 取条件成立时的值
 */
export function VALUEWHEN(condition: Series, value: Series): Series {
    const result = new Array(condition.length).fill(NaN);
    let lastValue = NaN;
    
    for (let i = 0; i < condition.length; i++) {
        if (condition[i]) {
            lastValue = value[i];
        }
        result[i] = lastValue;
    }
    return result;
}

/**
 * 判断值是否在两个值之间
 * 支持 A<S<B 或 A>S>B 两种情况
 */
export function BETWEEN(s: Series, a: Series, b: Series): BoolSeries {
    return s.map((v, i) => {
        const av = a[i];
        const bv = b[i];
        return (av < v && v < bv) || (av > v && v > bv);
    });
}

/**
 * 当前最高价是近多少周期内最高价的最大值
 */
export function TOPRANGE(s: Series): Series {
    const result = new Array(s.length).fill(0);
    
    for (let i = 1; i < s.length; i++) {
        let count = 0;
        for (let j = i - 1; j >= 0; j--) {
            if (s[j] >= s[i]) break;
            count++;
        }
        result[i] = count;
    }
    return result;
}

/**
 * 当前最低价是近多少周期内最低价的最小值
 */
export function LOWRANGE(s: Series): Series {
    const result = new Array(s.length).fill(0);
    
    for (let i = 1; i < s.length; i++) {
        let count = 0;
        for (let j = i - 1; j >= 0; j--) {
            if (s[j] <= s[i]) break;
            count++;
        }
        result[i] = count;
    }
    return result;
}

// --- 2级：技术指标函数 ---

/**
 * MACD指标
 */
export function MACD(close: Series, short = 12, long = 26, m = 9): [Series, Series, Series] {
    const DIF = EMA(close, short).map((v, i) => v - EMA(close, long)[i]);
    const DEA = EMA(DIF, m);
    const MACD = DIF.map((v, i) => (v - DEA[i]) * 2);
    
    return [DIF.map(v => RD(v)), DEA.map(v => RD(v)), MACD.map(v => RD(v))];
}

/**
 * KDJ指标
 */
export function KDJ(close: Series, high: Series, low: Series, n = 9, m1 = 3, m2 = 3): [Series, Series, Series] {
    const RSV = close.map((v, i) => {
        const llv = LLV(low, n)[i];
        const hhv = HHV(high, n)[i];
        return ((v - llv) / (hhv - llv)) * 100;
    });
    
    const K = SMA(RSV, m1 * 2 - 1);
    const D = SMA(K, m2 * 2 - 1);
    const J = K.map((v, i) => 3 * v - 2 * D[i]);
    
    return [K, D, J];
}

/**
 * RSI指标
 */
export function RSI(close: Series, n = 24): Series {
    const DIF = close.map((v, i) => i === 0 ? 0 : v - close[i - 1]);
    const maxDIF = DIF.map(v => Math.max(v, 0));
    const absDIF = DIF.map(Math.abs);
    
    return SMA(maxDIF, n).map((v, i) => 
        RD(v / SMA(absDIF, n)[i] * 100)
    );
}

/**
 * W&R 威廉指标
 */
export function WR(close: Series, high: Series, low: Series, n = 10, n1 = 6): [Series, Series] {
    const WR = close.map((v, i) => {
        const hhv = HHV(high, n)[i];
        const llv = LLV(low, n)[i];
        return ((hhv - v) / (hhv - llv)) * 100;
    });

    const WR1 = close.map((v, i) => {
        const hhv = HHV(high, n1)[i];
        const llv = LLV(low, n1)[i];
        return ((hhv - v) / (hhv - llv)) * 100;
    });

    return [WR.map(v => RD(v)), WR1.map(v => RD(v))];
}

/**
 * BIAS乖离率
 */
export function BIAS(close: Series, l1 = 6, l2 = 12, l3 = 24): [Series, Series, Series] {
    const MA1 = MA(close, l1);
    const MA2 = MA(close, l2);
    const MA3 = MA(close, l3);

    const BIAS1 = close.map((v, i) => ((v - MA1[i]) / MA1[i]) * 100);
    const BIAS2 = close.map((v, i) => ((v - MA2[i]) / MA2[i]) * 100);
    const BIAS3 = close.map((v, i) => ((v - MA3[i]) / MA3[i]) * 100);

    return [BIAS1.map(v => RD(v)), BIAS2.map(v => RD(v)), BIAS3.map(v => RD(v))];
}

/**
 * BOLL指标，布林带
 */
export function BOLL(close: Series, n = 20, p = 2): [Series, Series, Series] {
    const MID = MA(close, n);
    const std = STD(close, n);

    const UPPER = MID.map((v, i) => v + std[i] * p);
    const LOWER = MID.map((v, i) => v - std[i] * p);

    return [UPPER.map(v => RD(v)), MID.map(v => RD(v)), LOWER.map(v => RD(v))];
}

/**
 * PSY心理线指标
 */
export function PSY(close: Series, n = 12, m = 6): [Series, Series] {
    // 计算上涨天数
    const upDays = close.map((v, i) => 
        i === 0 ? 0 : (v > close[i - 1] ? 1 : 0)
    );
    
    // 计算N日内上涨天数的比率
    const PSY = SUM(upDays, n).map(v => (v / n) * 100);
    
    // 计算PSY的M日移动平均
    const PSYMA = MA(PSY, m);
    
    return [PSY.map(v => RD(v)), PSYMA.map(v => RD(v))];
}

/**
 * CCI顺势指标
 */
export function CCI(close: Series, high: Series, low: Series, n = 14): Series {
    const TP = close.map((v, i) => (high[i] + low[i] + v) / 3);
    const MA_TP = MA(TP, n);
    const AVEDEV_TP = AVEDEV(TP, n);

    return TP.map((v, i) => 
        (v - MA_TP[i]) / (0.015 * AVEDEV_TP[i])
    );
}

/**
 * ATR真实波动N日平均值
 */
export function ATR(close: Series, high: Series, low: Series, n = 20): Series {
    const TR = close.map((v, i) => {
        if (i === 0) return high[i] - low[i];
        return Math.max(
            Math.max(high[i] - low[i], Math.abs(close[i - 1] - high[i])),
            Math.abs(close[i - 1] - low[i])
        );
    });

    return MA(TR, n);
}

/**
 * BBI多空指标
 */
export function BBI(close: Series, m1 = 3, m2 = 6, m3 = 12, m4 = 20): Series {
    return close.map((_, i) => {
        const ma1 = MA(close, m1)[i];
        const ma2 = MA(close, m2)[i];
        const ma3 = MA(close, m3)[i];
        const ma4 = MA(close, m4)[i];
        return (ma1 + ma2 + ma3 + ma4) / 4;
    });
}

/**
 * DMI动向指标
 */
export function DMI(close: Series, high: Series, low: Series, m1 = 14, m2 = 6): [Series, Series, Series, Series] {
    const TR = close.map((v, i) => {
        if (i === 0) return high[i] - low[i];
        return Math.max(
            Math.max(high[i] - low[i], Math.abs(high[i] - close[i - 1])),
            Math.abs(low[i] - close[i - 1])
        );
    });

    const HD = high.map((v, i) => i === 0 ? 0 : v - high[i - 1]);
    const LD = low.map((v, i) => i === 0 ? 0 : low[i - 1] - v);

    const DMP = SUM(HD.map((v, i) => 
        v > 0 && v > LD[i] ? v : 0
    ), m1);

    const DMM = SUM(LD.map((v, i) => 
        v > 0 && v > HD[i] ? v : 0
    ), m1);

    const TR_SUM = SUM(TR, m1);

    const PDI = DMP.map((v, i) => (v * 100) / TR_SUM[i]);
    const MDI = DMM.map((v, i) => (v * 100) / TR_SUM[i]);

    const ADX = MA(PDI.map((v, i) => 
        Math.abs(MDI[i] - v) / (MDI[i] + v) * 100
    ), m2);

    const ADXR = ADX.map((v, i) => 
        i < m2 ? v : (v + ADX[i - m2]) / 2
    );

    return [PDI, MDI, ADX, ADXR];
}

/**
 * 唐安奇通道(海龟)交易指标
 */
export function TAQ(high: Series, low: Series, n: number): [Series, Series, Series] {
    const UP = HHV(high, n);
    const DOWN = LLV(low, n);
    const MID = UP.map((v, i) => (v + DOWN[i]) / 2);
    
    return [UP, MID, DOWN];
}

/**
 * 肯特纳交易通道
 */
export function KTN(close: Series, high: Series, low: Series, n = 20, m = 10): [Series, Series, Series] {
    const MID = EMA(high.map((v, i) => (v + low[i] + close[i]) / 3), n);
    const ATRN = ATR(close, high, low, m);
    
    const UPPER = MID.map((v, i) => v + 2 * ATRN[i]);
    const LOWER = MID.map((v, i) => v - 2 * ATRN[i]);
    
    return [UPPER, MID, LOWER];
}

/**
 * 三重指数平滑平均线
 */
export function TRIX(close: Series, m1 = 12, m2 = 20): [Series, Series] {
    const TR = EMA(EMA(EMA(close, m1), m1), m1);
    const TRIX = TR.map((v, i) => 
        i === 0 ? 0 : ((v - TR[i - 1]) / TR[i - 1]) * 100
    );
    const TRMA = MA(TRIX, m2);
    
    return [TRIX, TRMA];
}

/**
 * VR容量比率
 */
export function VR(close: Series, vol: Series, m1 = 26): Series {
    const LC = REF(close, 1);
    const UP_VOL = vol.map((v, i) => close[i] > LC[i] ? v : 0);
    const DOWN_VOL = vol.map((v, i) => close[i] <= LC[i] ? v : 0);
    
    return SUM(UP_VOL, m1).map((v, i) => 
        (v / SUM(DOWN_VOL, m1)[i]) * 100
    );
}

/**
 * CR价格动量指标
 */
export function CR(close: Series, high: Series, low: Series, n = 20): Series {
    const MID = REF(high.map((v, i) => (v + low[i] + close[i]) / 3), 1);
    const UP = high.map((v, i) => Math.max(0, v - MID[i]));
    const DOWN = low.map((v, i) => Math.max(0, MID[i] - v));
    
    return SUM(UP, n).map((v, i) => 
        (v / SUM(DOWN, n)[i]) * 100
    );
}

/**
 * 简易波指标
 */
export function EMV(high: Series, low: Series, vol: Series, n = 14, m = 9): [Series, Series] {
    const VOLUME = MA(vol, n).map((v, i) => v / vol[i]);
    const MID = high.map((v, i) => 
        100 * (v + low[i] - (i === 0 ? v + low[i] : high[i-1] + low[i-1])) / (v + low[i])
    );
    
    const EMV = MA(MID.map((v, i) => 
        v * VOLUME[i] * (high[i] - low[i]) / MA(high.map((h, j) => h - low[j]), n)[i]
    ), n);
    
    const MAEMV = MA(EMV, m);
    return [EMV, MAEMV];
}

/**
 * 区间震荡线
 */
export function DPO(close: Series, m1 = 20, m2 = 10, m3 = 6): [Series, Series] {
    const DPO = close.map((v, i) => {
        const maValue = MA(close, m1)[i];
        const refValue = i >= m2 ? MA(close, m1)[i - m2] : maValue;
        return v - refValue;
    });
    
    const MADPO = MA(DPO, m3);
    return [DPO, MADPO];
}

/**
 * BRAR-ARBR 情绪指标
 */
export function BRAR(open: Series, close: Series, high: Series, low: Series, m1 = 26): [Series, Series] {
    const AR = SUM(high.map((v, i) => v - open[i]), m1).map((v, i) => 
        (v / SUM(open.map((o, j) => o - low[j]), m1)[i]) * 100
    );
    
    const BR = SUM(high.map((v, i) => 
        Math.max(0, v - REF(close, 1)[i])
    ), m1).map((v, i) => 
        (v / SUM(REF(close, 1).map((c, j) => 
            Math.max(0, c - low[j])
        ), m1)[i]) * 100
    );
    
    return [AR, BR];
}

/**
 * 平行线差指标
 */
export function DFMA(close: Series, n1 = 10, n2 = 50, m = 10): [Series, Series] {
    const DIF = MA(close, n1).map((v, i) => v - MA(close, n2)[i]);
    const DIFMA = MA(DIF, m);
    return [DIF, DIFMA];
}

/**
 * 动量指标
 */
export function MTM(close: Series, n = 12, m = 6): [Series, Series] {
    const MTM = close.map((v, i) => 
        i < n ? 0 : v - close[i - n]
    );
    const MTMMA = MA(MTM, m);
    return [MTM, MTMMA];
}

/**
 * 梅斯线
 */
export function MASS(high: Series, low: Series, n1 = 9, n2 = 25, m = 6): [Series, Series] {
    const MASS = SUM(
        MA(high.map((v, i) => v - low[i]), n1).map((v, i) => 
            v / MA(MA(high.map((h, j) => h - low[j]), n1), n1)[i]
        ), 
        n2
    );
    const MA_MASS = MA(MASS, m);
    return [MASS, MA_MASS];
}

/**
 * 变动率指标
 */
export function ROC(close: Series, n = 12, m = 6): [Series, Series] {
    const ROC = close.map((v, i) => 
        i < n ? 0 : ((v - close[i - n]) / close[i - n]) * 100
    );
    const MAROC = MA(ROC, m);
    return [ROC, MAROC];
}

/**
 * EMA指数平均数指标
 */
export function EXPMA(close: Series, n1 = 12, n2 = 50): [Series, Series] {
    return [EMA(close, n1), EMA(close, n2)];
}

/**
 * 能量指标
 */
export function OBV(close: Series, vol: Series): Series {
    const result = new Array(close.length).fill(0);
    result[0] = vol[0];
    
    for (let i = 1; i < close.length; i++) {
        if (close[i] > close[i - 1]) {
            result[i] = result[i - 1] + vol[i];
        } else if (close[i] < close[i - 1]) {
            result[i] = result[i - 1] - vol[i];
        } else {
            result[i] = result[i - 1];
        }
    }
    
    return result.map(v => v / 10000);
}

/**
 * MFI资金流量指标
 */
export function MFI(close: Series, high: Series, low: Series, vol: Series, n = 14): Series {
    const TYP = high.map((v, i) => (v + low[i] + close[i]) / 3);
    const V1 = SUM(TYP.map((v, i) => 
        i === 0 ? 0 : v > TYP[i - 1] ? v * vol[i] : 0
    ), n).map((v, i) => 
        v / SUM(TYP.map((t, j) => 
            j === 0 ? 0 : t < TYP[j - 1] ? t * vol[j] : 0
        ), n)[i]
    );
    
    return V1.map(v => 100 - (100 / (1 + v)));
}

/**
 * 振动升降指标
 */
export function ASI(open: Series, close: Series, high: Series, low: Series, m1 = 26, m2 = 10): [Series, Series] {
    const LC = REF(close, 1);
    const AA = high.map((v, i) => Math.abs(v - LC[i]));
    const BB = low.map((v, i) => Math.abs(v - LC[i]));
    const CC = high.map((v, i) => Math.abs(v - (i === 0 ? low[i] : low[i - 1])));
    const DD = LC.map((v, i) => Math.abs(v - (i === 0 ? open[i] : open[i - 1])));
    
    const R = AA.map((v, i) => {
        if (v > BB[i] && v > CC[i]) {
            return v + BB[i] / 2 + DD[i] / 4;
        } else if (BB[i] > CC[i] && BB[i] > v) {
            return BB[i] + v / 2 + DD[i] / 4;
        } else {
            return CC[i] + DD[i] / 4;
        }
    });
    
    const X = close.map((v, i) => 
        v - LC[i] + (v - open[i]) / 2 + LC[i] - (i === 0 ? open[i] : open[i - 1])
    );
    
    const SI = X.map((v, i) => 16 * v / R[i] * Math.max(AA[i], BB[i]));
    const ASI = SUM(SI, m1);
    const ASIT = MA(ASI, m2);
    
    return [ASI, ASIT];
}

/**
 * 薛斯通道II
 */
export function XSII(close: Series, high: Series, low: Series, n = 102, m = 7): [Series, Series, Series, Series] {
    const AA = MA(high.map((v, i) => (2 * close[i] + v + low[i]) / 4), 5);
    const TD1 = AA.map(v => v * n / 100);
    const TD2 = AA.map(v => v * (200 - n) / 100);
    
    const CC = close.map((v, i) => 
        Math.abs((2 * v + high[i] + low[i]) / 4 - MA(close, 20)[i]) / MA(close, 20)[i]
    );
    
    const DD = DMA(close, CC);
    const TD3 = DD.map(v => v * (1 + m / 100));
    const TD4 = DD.map(v => v * (1 - m / 100));
    
    return [TD1, TD2, TD3, TD4];
}
