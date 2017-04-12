export const createInstructions = function() {

    let next = document.getElementById('next');
    let prev = document.getElementById('prev');
    const $instructionsOne = $('#one')
    const $instructionsTwo = $('#two')
    const $instructionsThree = $('#three')
    const $instructionsFour = $('#four')
    const $instructionsFive = $('#five')
    const $instructionsSix = $('#six')
    const $instructions = [$instructionsOne, $instructionsTwo, $instructionsThree, $instructionsFour, $instructionsFive, $instructionsSix]
    let currentWindow = 0;

    //handles render of instructions
    next.addEventListener('click', () => {
      $($instructions[currentWindow]).attr("hidden", true)
      $($instructions[currentWindow + 1]).attr("hidden", false)
      currentWindow++
      if (currentWindow > $instructions.length - 1) {
        $(next).attr("hidden", true)
        $(prev).attr("hidden", true)
        $('#close').hide();
        $('#tutorial-header').hide();
        $('#instructions').attr("hidden", true)
        $('#instructions').css('background', 'transparent');
        $('#instructions').css('border', 'none');
        $('#instructions').css('z-index', '-1');
        $('#transparent').css('background', 'transparent');
      }
    })

    prev.addEventListener('click', () => {
      if (currentWindow === 0) {
        return;
      }
      $($instructions[currentWindow]).attr("hidden", true)
      $($instructions[currentWindow - 1]).attr("hidden", false)
        currentWindow--
    })

    let close = $('.fa-times')
    close[0].addEventListener('click', () => {
      currentWindow = 0;
      $(next).attr("hidden", true)
      $(prev).attr("hidden", true)
      $('#instructions').hide()
      $('#instructions').css('background', 'transparent');
      $('#instructions').css('border', 'none');
      $('#instructions').css('z-index', '-1');
      $('.tutorial-text').attr('hidden', true);
      $('#close').hide();
      $('#tutorial-header').hide();
      $('#transparent').css('background', 'transparent');
      $('#tutorial-header').attr('hidden', true);
    })
}
