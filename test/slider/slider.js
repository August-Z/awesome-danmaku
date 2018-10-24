import $ from 'jquery'

export function handleDrag (selector, childSelector, { down, move, up }) {
  $(selector).on('mousedown', childSelector, function (e) {
    typeof down === 'function' && down(this)
    const $el = $(this)
    const disX = e.clientX
    const left = Number($el.css('left').replace('px', ''))
    const parentWidth = $(this).parent().width()

    $(this).css('cursor', 'grabbing')
    $(document)
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
      .on('mouseup', function () {
        typeof up === 'function' && up(this)
        $el.css('cursor', 'grab')
        $(document).off('mousemove')
      })
  })
}




