export const kConverter = (num) =>{
    if(num >= 100 ){
        return (num/100).toFixed(1)+'k'
    }else{
        return num
    }
}