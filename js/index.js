const d = document,
	$groupButtonTimer = d.getElementById('group-button-timer'),
	$startButton = d.getElementById('handle-timer-button'),
	$resetButton = d.getElementById('reset-button'),
	$timer = d.querySelector('.timer'),
	$timerForm = d.querySelector('.timer-form')
const DEFAULT_TIME = '00:05:00'
let timerInterval = null

function startTimer() {
	if (!$timerForm.classList.contains('hidden')) {
		$timerForm.classList.add('hidden')
	}
	const isStarted = $startButton.textContent === 'Iniciar'
	$startButton.textContent = isStarted ? 'Pausar' : 'Iniciar'

	let [hours, minutes, seconds] = $timer.textContent.split(':')

	timerInterval = setInterval(() => {
		hours = parseInt(hours)
		minutes = parseInt(minutes)
		seconds = parseInt(seconds)
		if ($startButton.textContent === 'Iniciar') {
			clearInterval(timerInterval)
			return
		}
		if (hours === 0 && minutes === 0 && seconds === 0) {
			$timer.textContent = DEFAULT_TIME
			console.log($timer.textContent)
			$startButton.textContent = 'Iniciar'
			clearInterval(timerInterval)
			return
		}
		if (seconds === 0) {
			if (minutes === 0) {
				hours -= 1
				minutes = 59
			} else {
				minutes -= 1
			}
			seconds = 59
		} else {
			seconds -= 1
		}
		hours = getFormattedTime(`${hours}`)
		minutes = getFormattedTime(`${minutes}`)
		seconds = getFormattedTime(`${seconds}`)
		$timer.textContent = `${hours}:${minutes}:${seconds}`
		localStorage.setItem('time', $timer.textContent)
	}, 1000)
}
function resetTimer() {
	clearInterval(timerInterval)
	const copy = $resetButton.textContent
	$resetButton.textContent = '...'
	$startButton.disabled = true
	$resetButton.disabled = true
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
		$resetButton.disabled = false
		$startButton.classList.remove('disabled-button')
	}, 1000)
}
function getFormattedTime(time) {
	if (parseInt(time) > 60) return '60'
	if (time.length > 1) return time
	if (time.length === 1) return `0${time}`
}

d.addEventListener('DOMContentLoaded', (e) => {
	const prevTime = localStorage.getItem('time')
	if (prevTime.length > 0 && prevTime !== DEFAULT_TIME) {
		$timer.textContent = prevTime
	}
})

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
