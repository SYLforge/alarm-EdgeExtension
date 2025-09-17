# 매시각 X분 알람 (알림만)

매시각 X분(예: 12분)에 브라우저 알림을 띄우는 Microsoft Edge 확장 프로그램입니다. (소리 없는 Lite 버전) 시간 범위(예: 9시~19시)와 요일(평일만/매일) 설정 가능. 무료 오픈소스!

## 기능
- **알람 설정**: 매시각 X분(1~59)에 알림.
- **시간 범위**: 시작~끝 시간 내에서만 동작 (끝 시간 포함).
- **요일 필터**: 평일만(월~금) 또는 매일.
- **on/off 토글**: 팝업에서 쉽게 시작/중지.
- **지속성**: 브라우저 재시작해도 설정 유지 (storage 사용).

**주의**: 브라우저가 알람 시간에 켜져 있어야 동작합니다. (Edge 백그라운드 제한으로 꺼지면 스킵될 수 있음.)

## 설치 방법
1. **파일 다운로드**: [ZIP 다운로드]([https://github.com/SYLforge/alarm-EdgeExtension/releases/latest](https://github.com/SYLforge/alarm-EdgeExtension/archive/refs/tags/extensions.zip)) 클릭 > ZIP 압축 해제.
2. **Edge에 로드**:
   - Edge 브라우저 열기 > `edge://extensions/` 입력.
   - 오른쪽 위 "개발자 모드" 토글 ON.
   - "압축 해제된 확장 프로그램을 로드합니다" 클릭 > 압축 해제된 폴더 선택.
3. **권한 허용**: Edge 설정 > 쿠키 및 사이트 권한 > 알림 > "허용"으로 변경. (확장 이름 검색.)

## 사용법
1. **팝업 열기**: Edge 도구 모음에서 확장 아이콘 클릭.
2. **설정**:
   - **X분**: 1~59 입력 (기본: 30).
   - **시작/끝 시간**: HH:MM 형식 (기본: 09:00 ~ 19:00, 끝 시간 포함).
   - **요일**: "평일만 (월~금)" 또는 "매일" 선택 (기본: 평일만).
   - **시작 (ON)** 클릭 > 알림이 설정됩니다.
3. **중지**: "중지 (OFF)" 클릭.
4. **상태 확인**: 팝업 상단에 "상태: ON/OFF" 표시.

**예시**: X=12, 9~19시, 평일만 → 월~금요일 9:12, 10:12, ..., 19:12에 알림.

## 문제 해결 (FAQ)
- **알림 안 뜸?**
  - Edge 설정 > `edge://settings/content/notifications` > 확장 허용.
  - Windows 설정 > 시스템 > 알림 및 작업 > Edge 알림 ON.
- **상태가 OFF로 보임?** (새 탭 후 가끔 발생)
  - 팝업 재클릭하거나 Edge 재시작. (MV3 지연 이슈 – 코드에서 폴링으로 대응함.)
- **알람 스킵됨?**
  - 콘솔 확인: `edge://extensions/` > 세부정보 > "배경 페이지 검사" > Console > "알람 스킵" 로그 봐요.
  - 브라우저가 시간에 꺼져 있으면 스킵될 수 있음.
- **다른 오류?** [이슈 열기](https://github.com/SYLforge/alarm-EdgeExtension/issues/new)에서 버그 보고해주세요! (Edge 버전, 설정 값 포함.)

## 개발/기여
- **소스 코드**: 이 리포지토리 클론 > 파일 수정 > Pull Request.
- **빌드**: 파일 복사만으로 OK (Manifest V3).
- **라이선스**: MIT License (자유 사용/수정/배포).

## 업데이트
- 최신 버전: [릴리스 페이지](https://github.com/SYLforge/alarm-EdgeExtension/releases).
- 변경 로그: [Commits](https://github.com/SYLforge/alarm-EdgeExtension/commits/main).

감사합니다! 피드백 환영해요. ☕

---
