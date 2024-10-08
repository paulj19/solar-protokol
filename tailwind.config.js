/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            fontFamily: {
                poppins: ["Poppins", "sans-serif"],
                public_sans: ["Public Sans", "sans-serif"]
            },
            backgroundImage: {
                'gray-grained': "url('/gray-grained.jpg')",
                '2': "url('/2.png')",
                '3': "url('/3.jpg')",
            },
            textColor: {
                rechnungDetailsElec: 'rgb(var(--rechnung-details-elec))',
                rechnungDetailsSolar: 'rgb(var(--rechnung-details-solar))',
                legend: 'rgb(var(--color-legend), var(--alpha-legend))',
                axis: 'rgb(var(--color-axis), var(--alpha-axis))',
                h1: 'rgb(var(--title-h1))',
                elecBar:'rgb(var(--elec-bar))',
                transportBar:'rgb(var(--transport-bar))',
                heatingBar:'rgb(var(--heating-bar))',
                totalCost:'rgb(var(--total-cost))',
                solarLine:'rgb(var(--solar-line))',
                sliderMarks:'rgb(var(--slider-marks))',
                statsBarLabel: 'rgb(var(--stats-bar-label))',
                cumLabelCost: 'rgb(var(--cumStatsBar-label-cost))',
                costSavings: 'rgb(var(--cost-savings))',
                genConSwitch: 'rgb(var(--genCon-switch))',
                genConBar: 'rgb(var(--genCon-bar))',
                enpalIconDot: 'rgb(var(--enpal-icon-dot))',
            },
            backgroundColor: {
                tooltip:'rgb(var(--tooltip-bg))',
                solarElecSettings: 'rgb(var(--solarElec-settings))',
                logoBanner: 'rgb(var(--logo-banner))',
            }
        },
    },
    plugins: [],
}
