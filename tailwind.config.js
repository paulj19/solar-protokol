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
            backgroundImage: {
                'gray-grained': "url('/gray-grained.jpg')",
                '2': "url('/2.png')",
                '3': "url('/3.jpg')",
            },
            textColor: {
                title: 'rgb(var(--color-title), var(--alpha-title))',
                legend: 'rgb(var(--color-legend), var(--alpha-legend))',
                axis: 'rgb(var(--color-axis), var(--alpha-axis))',
            },
        },
    },
    plugins: [],
}
