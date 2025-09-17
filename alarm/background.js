let alarmInterval = 0; // X분
let startTime = '09:00'; // 기본 시작 시간
let endTime = '19:00'; // 기본 끝 시간
let weekdaysOnly = true; // 기본 평일만 (true)

// 시간 문자열을 분으로 변환 (e.g., '09:30' -> 570)
function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

// 요일 확인 (0=일요일, 1=월~6=토)
function isWeekday() {
  return new Date().getDay() >= 1 && new Date().getDay() <= 5;
}

// 알람 생성 함수 (시간/요일 필터링, 끝 시간 포함)
function createHourlyAlarm() {
  if (alarmInterval === 0) return;
  
  let now = new Date();
  let nextAlarm = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), alarmInterval, 0, 0);
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  // 현재 시간이 범위 밖이면 다음 날로 이동
  if (currentMinutes < startMinutes || currentMinutes > endMinutes) {  // > 로 변경 (끝 시간 포함)
    nextAlarm.setDate(nextAlarm.getDate() + 1);
    nextAlarm.setHours(parseInt(startTime.split(':')[0]));
    nextAlarm.setMinutes(parseInt(startTime.split(':')[1]));
  } else if (now.getMinutes() >= alarmInterval) {
    nextAlarm.setHours(nextAlarm.getHours() + 1);
  }
  
  // 평일만: 주말이면 다음 평일로 스킵
  if (weekdaysOnly) {
    while (!isWeekdayForDate(nextAlarm)) {
      nextAlarm.setDate(nextAlarm.getDate() + 1);
    }
  }
  
  const delay = nextAlarm.getTime() - now.getTime();
  console.log('다음 알람 시간:', nextAlarm.toLocaleTimeString('ko-KR'), '대기:', Math.round(delay / 60000), '분');
  
  chrome.alarms.create('hourlyAlarm', { when: Date.now() + delay });
}

// 지정 날짜의 요일 확인
function isWeekdayForDate(date) {
  return date.getDay() >= 1 && date.getDay() <= 5;
}

// 알람 트리거 시 실행 (알림만, 끝 시간 포함)
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'hourlyAlarm') {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    
    // 트리거 시점에 범위 내인지 재확인 (끝 시간 포함: <=)
    if (currentMinutes >= startMinutes && currentMinutes <= endMinutes && (!weekdaysOnly || isWeekday())) {
      console.log('알람 울림! 현재 시각:', now.toLocaleTimeString('ko-KR'));
      
      chrome.notifications.create({
        type: 'basic',
        iconUrl: chrome.runtime.getURL('icon48.png'),
        title: '알람 시간!',
        message: `현재 시각: ${now.toLocaleTimeString('ko-KR')}`
      });
    } else {
      console.log('알람 스킵: 시간/요일 불일치');
    }
    
    createHourlyAlarm();
  }
});

// 저장된 설정 로드
chrome.storage.sync.get(['alarmInterval', 'startTime', 'endTime', 'weekdaysOnly'], (result) => {
  if (result.alarmInterval) {
    alarmInterval = result.alarmInterval;
    startTime = result.startTime || '09:00';
    endTime = result.endTime || '19:00';
    weekdaysOnly = result.weekdaysOnly !== undefined ? result.weekdaysOnly : true; // 기본 true (평일만)
    createHourlyAlarm();
  }
});

// 메시지 수신 (팝업에서 설정 변경 시)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'setAlarm') {
    alarmInterval = request.interval;
    startTime = request.startTime;
    endTime = request.endTime;
    weekdaysOnly = request.weekdaysOnly;
    chrome.storage.sync.set({ 
      alarmInterval, startTime, endTime, weekdaysOnly 
    });
    createHourlyAlarm();
    sendResponse({ success: true });
  } else if (request.action === 'stopAlarm') {
    chrome.alarms.clear('hourlyAlarm');
    alarmInterval = 0;
    chrome.storage.sync.set({ alarmInterval: 0 });
    sendResponse({ success: true });
  } else if (request.action === 'getStatus') {
    sendResponse({ 
      isOn: alarmInterval > 0,
      interval: alarmInterval,
      startTime,
      endTime,
      weekdaysOnly 
    });
  }
});