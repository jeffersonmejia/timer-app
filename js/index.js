const d = document,
	$groupButtonTimer = d.getElementById('group-button-timer'),
	$startButton = d.getElementById('handle-timer-button'),
	$resetButton = d.getElementById('reset-button'),
	$timer = d.querySelector('.timer'),
	$darkButton = d.querySelector('.dark-button'),
	$timerForm = d.querySelector('.timer-form'),
	$timerTaskName = d.querySelector('.timer-task-name')

const DEFAULT_TIME = '00:05:00'
let timerInterval = null
let alarmInterval = null

function startTimer() {
	if (!$timerForm.classList.contains('hidden')) {
		$timerForm.classList.add('hidden')
		$timerForm.querySelectorAll('input').forEach((input) => {
			input.value = ''
		})
	}
	if ($startButton.textContent.includes('Detener alarma')) {
		clearInterval(alarmInterval)
		$startButton.textContent = 'Iniciar'
		$startButton.classList.remove('danger-button')
		return
	}
	const isStarted = $startButton.textContent.includes('Iniciar')
	$startButton.textContent = isStarted ? 'Pausar' : 'Iniciar'

	if (!isStarted) {
		$startButton.classList.remove('warning-button')
		clearInterval(timerInterval)
		return
	}
	if (isStarted) {
		$startButton.classList.add('warning-button')
	}

	let [hours, minutes, seconds] = $timer.textContent.split(':')

	timerInterval = setInterval(() => {
		hours = parseInt(hours)
		minutes = parseInt(minutes)
		seconds = parseInt(seconds)

		if (hours === 0 && minutes === 0 && seconds === 0) {
			let alarmTime = 30
			const alarmSound = new Audio('../assets/audio/alarm.mp3')
			$startButton.classList.remove('warning-button')
			$startButton.classList.add('danger-button')
			alarmInterval = setInterval(() => {
				alarmSound.play()
				alarmTime -= 1
				$startButton.textContent = `Detener alarma(${alarmTime}s)`
				if (alarmTime === 0) {
					alarmSound.currentTime = 0
					alarmSound.pause()
					$timer.textContent = DEFAULT_TIME
					$startButton.textContent = 'Iniciar'
					$startButton.classList.remove('danger-button')
					localStorage.setItem('time', $timer.textContent)
					$timerTaskName.textContent = 'Escribe tu nueva tarea'
					localStorage.setItem('taskName', $timerTaskName.textContent)
					$timerTaskName.focus()
					clearInterval(alarmInterval)
					return
				}
			}, 1000)
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
	if (alarmInterval) clearInterval(alarmInterval)

	setTimeout(() => {
		if (!$timerForm.classList.contains('hidden')) {
			$timerForm.elements['timer-form-hour'].value = ''
			$timerForm.elements['timer-form-minutes'].value = ''
			$timerForm.elements['timer-form-seconds'].value = ''
		}

		$timer.textContent = DEFAULT_TIME
		$resetButton.textContent = copy
		localStorage.setItem('time', $timer.textContent)
		$startButton.classList.remove('warning-button', 'danger-button')
		$startButton.textContent = 'Iniciar'
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
		if (prevTime !== '00:00:00') {
			$timer.textContent = prevTime
		} else {
			$timer.textContent = DEFAULT_TIME
		}
	}
	const theme = localStorage.getItem('theme')
	if (theme === '☀️') {
		$darkButton.textContent = '☀️'
		toggleTheme()
	}
	const taskName = localStorage.getItem('taskName')
	if (taskName?.length > 0) {
		$timerTaskName.textContent = taskName
	} else if (!taskName) {
		$timerTaskName.textContent = 'Escribe tu nueva tarea'
		$timerTaskName.focus()
	}
})

function toggleTheme() {
	const $darkEl = d.querySelectorAll('[data-dark]')
	$darkEl.forEach((el) => el.classList.toggle('dark-theme'))
}

d.addEventListener('click', (e) => {
	if (e.target.matches('#handle-timer-button')) {
		startTimer()
	}
	if (e.target.matches('#reset-button')) {
		resetTimer()
	}
	if (e.target.matches('.timer')) {
		clearInterval(timerInterval)
		$startButton.textContent = 'Iniciar'
		$startButton.classList.remove('warning-button', 'danger-button')
		$timerForm.classList.toggle('hidden')
	}
	if (e.target.matches('.dark-button')) {
		e.target.textContent = e.target.textContent === '☀️' ? '🌙' : '☀️'
		localStorage.setItem('theme', e.target.textContent)
		toggleTheme()
	}
})

d.addEventListener('keyup', (e) => {
	if (e.target.value?.length > 0) {
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
	if (e.target.matches('.timer-task-name')) {
		console.log(e.target.textContent)

		if (e.target.textContent.length > 0) {
			localStorage.setItem('taskName', e.target.textContent)
		}
		if (e.target.textContent.length === 0) {
			localStorage.setItem('taskName', '')
		}
	}
})

d.addEventListener('keydown', (e) => {
	if (e.target.matches('.timer-task-name')) {
		if (e.target.textContent.length > 16 && e.key !== 'Backspace') e.preventDefault()
		if (e.key === 'Enter') e.preventDefault()
	}
	if (e.target.matches('.timer-form input')) {
		let onlyNumbers = /^[0-9]$/
		if (
			!onlyNumbers.test(e.key) &&
			e.key !== 'Backspace' &&
			e.key !== 'Delete' &&
			e.key !== 'Tab'
		) {
			e.preventDefault()
		}
	}
})
