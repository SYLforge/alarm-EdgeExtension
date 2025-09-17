document.addEventListener('DOMContentLoaded', () => {
    const intervalInput = document.getElementById('interval');
    const startTimeInput = document.getElementById('startTime');
    const endTimeInput = document.getElementById('endTime');
    const dayModeRadios = document.querySelectorAll('input[name="dayMode"]');
    const startBtn = document.getElementById('start');
    const stopBtn = document.getElementById('stop');
    const statusDiv = document.getElementById('status');

    // storage 직접 쿼리해서 상태 업데이트 (백그라운드 의존 최소화)
    function updateStatus(retryCount = 0) {
        chrome.storage.sync.get(['alarmInterval', 'startTime', 'endTime', 'weekdaysOnly'], (result) => {
            const isOn = result.alarmInterval > 0;
            statusDiv.textContent = `상태: ${isOn ? 'ON' : 'OFF'}`;
            statusDiv.className = isOn ? '' : 'off';
            intervalInput.value = result.alarmInterval || 30;
            startTimeInput.value = result.startTime || '09:00';
            endTimeInput.value = result.endTime || '19:00';
            const selectedMode = (result.weekdaysOnly !== undefined && result.weekdaysOnly) ? 'weekdays' : 'daily';
            document.querySelector(`input[name="dayMode"][value="${selectedMode}"]`).checked = true;

            startBtn.disabled = isOn;
            stopBtn.disabled = !isOn;

            // 백그라운드와 동기화 위해 getStatus도 호출 (fallback)
            chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
                if (response && response.isOn !== undefined && response.isOn !== isOn) {
                    // 불일치 시 재시도
                    if (retryCount < 3) {
                        console.log('상태 불일치 – 재시도...');
                        setTimeout(() => updateStatus(retryCount + 1), 500);
                    }
                }
            });
        });
    }

    updateStatus(); // 초기 로드

    startBtn.addEventListener('click', () => {
        const interval = parseInt(intervalInput.value);
        if (interval < 1 || interval > 59) {
            alert('1~59 사이의 값을 입력하세요.');
            return;
        }
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;
        if (timeToMinutes(startTime) > timeToMinutes(endTime)) {
            alert('끝 시간이 시작 시간보다 늦어야 합니다.');
            return;
        }
        const selectedDayMode = document.querySelector('input[name="dayMode"]:checked').value;
        const weekdaysOnly = selectedDayMode === 'weekdays';
        chrome.runtime.sendMessage({
            action: 'setAlarm',
            interval,
            startTime,
            endTime,
            weekdaysOnly
        }, (response) => {
            if (response && response.success) {
                alert('알람이 설정되었습니다!');
                updateStatus();  // 즉시 재확인
            } else {
                // 메시지 실패 시 storage 직접 set (fallback)
                chrome.storage.sync.set({ alarmInterval: interval, startTime, endTime, weekdaysOnly });
                updateStatus();
            }
        });
    });

    stopBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'stopAlarm' }, (response) => {
            if (response && response.success) {
                alert('알람이 중지되었습니다.');
                updateStatus();
            } else {
                // fallback: storage 직접 set
                chrome.storage.sync.set({ alarmInterval: 0 });
                updateStatus();
            }
        });
    });

    // 시간 비교 헬퍼
    function timeToMinutes(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }
});