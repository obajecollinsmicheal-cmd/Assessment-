// Elements
const targetInput = document.getElementById('target')
const setBtn = document.getElementById('setBtn')
const nowBtn = document.getElementById('nowBtn')
const daysEl = document.getElementById('days')
const hoursEl = document.getElementById('hours')
const minutesEl = document.getElementById('minutes')
const secondsEl = document.getElementById('seconds')
const statusEl = document.getElementById('status')
const progressBar = document.getElementById('progressBar')
const progressLabel = document.getElementById('progressLabel')
const subscribeForm = document.getElementById('subscribeForm')
const emailInput = document.getElementById('email')

let timerId = null
let targetDate = null
let startDate = null // used to calculate progress

function setTargetFromInput(){
  const val = targetInput.value
  if(!val){ alert('Please pick a date and time (local).'); return }
  targetDate = new Date(val)
  startDate = new Date() // progress origin
  startTimer()
}

function setTargetNowPlusOne(){
  const now = new Date()
  const plus = new Date(now.getTime() + 60000) // +1 minute for quick test
  targetDate = plus
  targetInput.value = plus.toISOString().slice(0,16)
  startDate = now
  startTimer()
}

function startTimer(){
  stopTimer()
  if(!targetDate || isNaN(targetDate.getTime())){ statusEl.textContent = 'Invalid target'; return }
  statusEl.textContent = 'Counting down...'
  updateOnce()
  timerId = setInterval(updateOnce, 1000)
}

function stopTimer(){
  if(timerId) clearInterval(timerId)
  timerId = null
}

function updateOnce(){
  const now = new Date()
  const diff = targetDate - now
  if(diff <= 0){
    // launched
    stopTimer()
    daysEl.textContent = '0'
    hoursEl.textContent = '0'
    minutesEl.textContent = '0'
    secondsEl.textContent = '0'
    statusEl.textContent = 'Launched!'
    progressBar.style.width = '100%'
    progressLabel.textContent = 'Progress: 100%'
    return
  }

  const secs = Math.floor(diff/1000)
  const d = Math.floor(secs / 86400)
  const h = Math.floor((secs % 86400) / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60

  daysEl.textContent = d
  hoursEl.textContent = String(h).padStart(2,'0')
  minutesEl.textContent = String(m).padStart(2,'0')
  secondsEl.textContent = String(s).padStart(2,'0')

  // progress: percentage of elapsed time between startDate and targetDate
  if(startDate && startDate < targetDate){
    const total = targetDate - startDate
    const elapsed = now - startDate
    const pct = Math.max(0, Math.min(100, Math.round((elapsed/total)*100)))
    progressBar.style.width = pct + '%'
    progressLabel.textContent = `Progress: ${pct}%`
  } else {
    progressBar.style.width = '0%'
    progressLabel.textContent = 'Progress: 0%'
  }
}

// Subscribe form (simulated)
subscribeForm.addEventListener('submit', (e)=>{
  e.preventDefault()
  const email = emailInput.value.trim()
  if(!email){ alert('Enter a valid email'); return }
  console.log('Subscribed email:', email)
  emailInput.value = ''
  alert('Thanks — subscription simulated (check console).')
})

setBtn.addEventListener('click', setTargetFromInput)
nowBtn.addEventListener('click', setTargetNowPlusOne)

// initialize with a default future date (7 days from now)
(function initDefault(){
  const d = new Date(Date.now() + 7*24*60*60*1000)
  targetDate = d
  startDate = new Date()
  // set input value in local datetime-local format
  const local = new Date(d.getTime() - d.getTimezoneOffset()*60000).toISOString().slice(0,16)
  targetInput.value = local
  startTimer()
})()