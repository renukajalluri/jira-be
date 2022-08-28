const extractId = (str)=>{
    var newStr = str.substring(1,str.length-1)
    // console.log("1",newStr)
    newStr = newStr.replaceAll("'","")
    // console.log("2",newStr)
    newStr = newStr.replaceAll(" ","")
    // console.log("3",newStr)
    // newStr = newStr.replaceAll(",","")
    var arr = newStr.split(',')
    // console.log("4",arr)
    return arr
}
module.exports ={extractId}