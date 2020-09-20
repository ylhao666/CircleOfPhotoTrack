class DateUtils {
  timeStampFormat(timeStamp) {
    let date = new Date(timeStamp)
    return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`
  }
}

module.exports = new DateUtils()