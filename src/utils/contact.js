export const WA_NUMBER = '262692421519'
export const WA_URL = `https://wa.me/${WA_NUMBER}`
export const PHONE_TEL = '0692421519'
export const PHONE_DISPLAY = '06 92 42 15 19'
export const waMsg = text => `${WA_URL}?text=${encodeURIComponent(text)}`

export const FB_ID = '100094291159849'
export const FB_URL = `https://m.me/${FB_ID}`
export const fbMsg = text => `${FB_URL}?ref=${encodeURIComponent(text)}`
