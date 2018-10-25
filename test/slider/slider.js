import $ from 'jquery'

export function handleDrag (selector, childSelector, { down, move, up }) {
  $(selector).on('mousedown', childSelector, function (e) {
    const $el = $(this)
    const disX = e.clientX
    const left = Number($el.css('left').replace('px', ''))
    const parentWidth = $(this).parent().width()
    typeof down === 'function' && down(left)

    $(this).css('cursor', 'grabbing')
    $(document)
      .off('mousemove mouseup')
      .on('mousemove', function (e) {
        let newLeft = e.clientX - disX + left
        if (newLeft < 0) {
          newLeft = 0
        } else if (newLeft > parentWidth) {
          newLeft = parentWidth
        }
        $el.css('left', `${newLeft}px`)
        typeof move === 'function' && move(Number((newLeft / parentWidth).toFixed(2)))
      })
      .on('mouseup', function (e) {
        let endLeft = e.clientX - disX + left
        if (endLeft < 0) {
          endLeft = 0
        } else if (endLeft > parentWidth) {
          endLeft = parentWidth
        }
        typeof up === 'function' && up(endLeft)
        $el.css('cursor', 'grab')
        $(document).off('mousemove')
        return false
      })
  })
}




