//產生星星HTML
function getStartsHtml(yellowNum, decimalNum, grayNum) {
  const startInfosMap = [
    { color: 'yellow', num: yellowNum },
    { color: null, num: decimalNum },
    { color: 'gray', num: grayNum }
  ]

  const startsHtml = startInfosMap
    .map(item => {
      const { color, num } = item
      if (!color && num > 0) {
        return `
          <span class="star star-percentage">
            <i class="fa fa-star fa-star-gray"></i>
            <i class="fa fa-star fa-star-yellow percent-star" style="width: ${num * 100}%;"></i>
          </span>`
      } else {
        return `<span class="star"><i class="fa fa-star fa-star-${color}"></i></span>`.repeat(num)
      }
    })
    .join('')

  return startsHtml
}

module.exports = getStartsHtml
