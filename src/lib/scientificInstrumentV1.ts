/** Frozen educational instrument V1 arithmetic, extracted from simModels.ts.
 * DO NOT change these formulas/constants for later scientific models: add a new
 * explicitly versioned evaluator instead. Historical journals replay with V1.
 * Parameters are validated by scientificWorkspace before reaching this module.
 * IEEE-754 arithmetic and idealized model assumptions apply; these are not
 * calibrated instruments, uncertainty estimates or real safety models.
 */
export function scientificCircuitV1(v: Record<string, number | string>) {
    const V = Number(v.voltage);
    const rs = [Number(v.r1), Number(v.r2), Number(v.r3)].filter(r => r > 0);
    const series = v.layout !== 'parallel';
    const total = series ? rs.reduce((a, b) => a + b, 0) : 1 / rs.reduce((a, b) => a + 1 / b, 0);
    const I = V / total;
    return { voltage: V, current: I, power: V * I };
}
export function scientificGasV1(v: Record<string, number | string>) {
    const temperature = Number(v.temperature);
    return { temperature, pressure: (Number(v.amount) * 8.314 * temperature) / Number(v.volume) };
}
