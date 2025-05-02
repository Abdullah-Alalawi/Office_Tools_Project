const {nextui} = require('@nextui-org/theme');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/components/(checkbox|checkboxGroup|dropdown|menu|divider|popover|button|ripple|spinner|select|modal| divider|table|avatar|input).js"
  ],
  theme: {
    extend: {
      colors: {
        kfupmgreen: '#008540',
        kfupmgold: '#DAC961',
        kfupmforest: '#00573F',
        kfupmpetrol: '#003851',
        kfupmstone: '#AABA00',
        kfupmlightgray: '#D9DAE4',
        kfupmdarkgray: '#373938',

        generalstudies: '#69578B',
        petroleum: '#9B1832',
        computing: '#7A5B59',
        engineering: '#FC4D0F',
        graduate: '#008540',
        business: '#00497A',
        chemicals: '#FFB92A',
        design: '#674B38',

        backgroundcolor: '#F8F8F8FF',
        textgray: '#676767FF',
        textlightgray: '#A9A9A9FF',
        TweetBlue:'#1DA1F2',
        BackgroundWhite:'#FFFFFF'
      },
    },
  },
  plugins: [nextui()],
}
