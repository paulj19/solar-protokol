import styles from '@/app/comparison/chart/ComparisonChart.module.css'

export default function Slider({ ticks, onChangeHandler, defaultValue, label }) {
    return (
        <div>
            <input type="range" min={ticks?.[0]} max={ticks?.[ticks.length - 1]} defaultValue={defaultValue} step={0.01} list="tickmarks" id="rangeInput" onChange={(e) => onChangeHandler(Number(e.target?.value))} />
            <datalist id="tickmarks">
                {ticks.map((value, i) => <option key={i}>{value}</option>)}
            </datalist>
            <div className={styles.sliderTitle}> {label}</div>
        </div>
    )
}
