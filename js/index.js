const d = document,
	$groupButtonTimer = d.getElementById('group-button-timer'),
	$startButton = d.getElementById('handle-timer-button'),
	$resetButton = d.getElementById('reset-button'),
	$timer = d.querySelector('.timer'),
	$timerForm = d.querySelector('.timer-form')
const DEFAULT_TIME = '00:05:00'

function startTimer() {
	if (!$timerForm.classList.contains('hidden')) {
		$timerForm.classList.add('hidden')
	}
	const isStarted = $startButton.textContent === 'Iniciar'
	$startButton.textContent = isStarted ? 'Pausar' : 'Iniciar'

	const time = $timer.textContent.split(':'),
		hours = parseInt(time[0]),
		minutes = parseInt(time[1]),
		seconds = parseInt(time[2])

	console.log(hours, minutes, seconds)

	/*const timerInterval = setInterval(() => {

		$timer.textContent = `${hours}:${minutes}:${seconds}`
	}, 1000)*/
}
function resetTimer() {
	const copy = $resetButton.textContent
	$resetButton.textContent = '...'
	$startButton.disabled = true
	$startButton.classList.add('disabled-button')
	setTimeout(() => {
		if (!$timerForm.classList.contains('hidden')) {
			$timerForm.elements['timer-form-hour'].value = ''
			$timerForm.elements['timer-form-minutes'].value = ''
			$timerForm.elements['timer-form-seconds'].value = ''
		}

		$timer.textContent = DEFAULT_TIME
		$resetButton.textContent = copy
		$startButton.disabled = false
		$startButton.classList.remove('disabled-button')
	}, 1000)
}

d.addEventListener('click', (e) => {
	if (e.target.matches('#handle-timer-button')) {
		startTimer()
	}
	if (e.target.matches('#reset-button')) {
		resetTimer()
	}
	if (e.target.matches('.timer')) {
		$startButton.textContent = 'Iniciar'
		$timerForm.classList.remove('hidden')
	}
})

function getFormattedTime(time) {
	if (parseInt(time) > 60) return '60'
	if (time.length > 1) return time
	if (time.length === 1) return `0${time}`
}

d.addEventListener('keyup', (e) => {
	if (e.target.value.length > 0) {
		let [hours, minutes, seconds] = $timer.textContent.split(':')
		if (e.target.matches('#timer-form-hour')) {
			hours = getFormattedTime(e.target.value)
			$timer.textContent = `${hours}:${minutes}:${seconds}`
		}
		if (e.target.matches('#timer-form-minutes')) {
			minutes = getFormattedTime(e.target.value)
			$timer.textContent = `${hours}:${minutes}:${seconds}`
		}
		if (e.target.matches('#timer-form-seconds')) {
			seconds = getFormattedTime(e.target.value)
			$timer.textContent = `${hours}:${minutes}:${seconds}`
		}
	}
})
