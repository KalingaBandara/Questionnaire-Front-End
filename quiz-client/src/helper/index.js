//to format the time in mm:ss format
export const getFormatedTime = sec => {
    return Math.floor(sec / 60).toString().padStart(2, '0') + ':' + Math.floor(sec % 60).toString().padStart(2, '0')
}