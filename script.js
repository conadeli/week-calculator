document.addEventListener('DOMContentLoaded', function() {
    // 날짜 입력 요소의 최대값 설정 (오늘 날짜)
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('lastPeriod').max = today;
    document.getElementById('conceptionDate').max = today;
    
    // 계산 방법 버튼
    const lmpBtn = document.getElementById('lmpBtn');
    const conceptionBtn = document.getElementById('conceptionBtn');
    const dueDateBtn = document.getElementById('dueDateBtn');
    
    // 입력 섹션
    const lmpInput = document.getElementById('lmpInput');
    const conceptionInput = document.getElementById('conceptionInput');
    const dueDateInput = document.getElementById('dueDateInput');
    
    // 결과 요소
    const resultSection = document.getElementById('result');
    const weeksElement = document.getElementById('weeks');
    const trimesterElement = document.getElementById('trimester');
    const dateLabel = document.getElementById('dateLabel');
    const calculatedDateElement = document.getElementById('calculatedDate');
    const developmentInfoElement = document.getElementById('developmentInfo');
    const progressBar = document.getElementById('progressBar');
    
    // 현재 선택된 계산 방법
    let currentMethod = 'lmp';
    
    // 계산 방법 변경 이벤트
    lmpBtn.addEventListener('click', function() {
        setActiveMethod('lmp');
    });
    
    conceptionBtn.addEventListener('click', function() {
        setActiveMethod('conception');
    });
    
    dueDateBtn.addEventListener('click', function() {
        setActiveMethod('dueDate');
    });
    
    // 계산 버튼 이벤트
    document.getElementById('calculateBtn').addEventListener('click', calculate);
    
    // 계산 방법 설정 함수
    function setActiveMethod(method) {
        currentMethod = method;
        
        // 모든 버튼에서 active 클래스 제거
        lmpBtn.classList.remove('active');
        conceptionBtn.classList.remove('active');
        dueDateBtn.classList.remove('active');
        
        // 모든 입력 숨기기
        lmpInput.classList.add('hidden');
        conceptionInput.classList.add('hidden');
        dueDateInput.classList.add('hidden');
        
        // 선택된 방법에 따라 활성화
        if (method === 'lmp') {
            lmpBtn.classList.add('active');
            lmpInput.classList.remove('hidden');
            dateLabel.textContent = '출산 예정일';
        } else if (method === 'conception') {
            conceptionBtn.classList.add('active');
            conceptionInput.classList.remove('hidden');
            dateLabel.textContent = '출산 예정일';
        } else if (method === 'dueDate') {
            dueDateBtn.classList.add('active');
            dueDateInput.classList.remove('hidden');
            dateLabel.textContent = '추정 마지막 생리일';
        }
    }
    
    // 날짜 간격 계산 함수 (일 단위)
    function dateDiffInDays(a, b) {
        const _MS_PER_DAY = 1000 * 60 * 60 * 24;
        const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
        return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }
    
    // 날짜에 일수 추가 함수
    function addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
    
    // 날짜 포맷 함수 (YYYY-MM-DD)
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // 삼분기 계산 함수
    function getTrimester(weeks) {
        if (weeks < 13) return '1';
        if (weeks < 27) return '2';
        return '3';
    }
    
    // 임신 주차별 발달 정보
    function getPregnancyInfo(weeks) {
        if (weeks < 0) {
            return "아직 임신 전입니다.";
        }
        if (weeks > 42) {
            return "출산 예정일이 지났습니다.";
        }

        const info = {
            0: "수정 직후입니다. 세포 분열이 시작되었습니다.",
            1: "배아가 자궁벽에 착상되기 시작합니다.",
            2: "배아가 자궁벽에 완전히 착상되었습니다.",
            3: "태아의 심장이 뛰기 시작합니다.",
            4: "태아의 뇌와 척수가 발달하기 시작합니다.",
            5: "태아의 눈, 귀, 코가 형성되기 시작합니다.",
            6: "태아의 손가락과 발가락이 생기기 시작합니다.",
            7: "태아가 자라면서 팔다리가 더 발달합니다.",
            8: "모든 주요 기관이 형성되었습니다.",
            9: "태아가 작은 움직임을 시작합니다.",
            10: "태아의 성별을 확인할 수 있는 초음파 검사가 가능합니다.",
            11: "태아의 얼굴 특징이 더 뚜렷해집니다.",
            12: "첫 번째 삼분기가 거의 끝났습니다.",
            13: "두 번째 삼분기가 시작되었습니다. 오심이 줄어들 수 있습니다.",
            14: "태아의 움직임을 느낄 수 있게 됩니다.",
            15: "태아가 빛에 반응하기 시작합니다.",
            16: "태아의 뼈가 더 단단해지기 시작합니다.",
            17: "태아의 지방층이 형성되기 시작합니다.",
            18: "태아의 움직임을 더 강하게 느낄 수 있습니다.",
            19: "태아가 규칙적인 수면 패턴을 가지기 시작합니다.",
            20: "태아의 청력이 발달하기 시작합니다.",
            21: "태아가 외부 소리에 반응하기 시작합니다.",
            22: "태아의 눈썹과 속눈썹이 자라기 시작합니다.",
            23: "태아의 폐가 발달하기 시작합니다.",
            24: "태아의 피부가 덜 투명해집니다.",
            25: "태아가 더 많은 지방을 축적합니다.",
            26: "두 번째 삼분기가 거의 끝났습니다.",
            27: "세 번째 삼분기가 시작되었습니다.",
            28: "태아의 뇌가 급속도로 발달합니다.",
            29: "태아가 더 많은 지방을 축적하여 몸이 더 둥글어집니다.",
            30: "태아의 뇌가 계속해서 발달합니다.",
            31: "태아의 면역 체계가 발달하기 시작합니다.",
            32: "태아의 뼈가 완전히 발달하지만 아직 부드럽습니다.",
            33: "태아의 폐가 계속해서 발달합니다.",
            34: "태아의 중추 신경계가 더 발달합니다.",
            35: "태아의 신장이 완전히 발달합니다.",
            36: "태아가 자궁 안에서 머리를 아래로 향하기 시작할 수 있습니다.",
            37: "태아가 만삭에 도달했습니다.",
            38: "출산 준비가 완료되었습니다.",
            39: "출산이 임박했습니다.",
            40: "예정일입니다! 언제든지 출산할 수 있습니다.",
            41: "예정일을 지났습니다. 곧 출산할 것입니다.",
            42: "의사와 상담이 필요합니다."
        };
        
        return info[weeks] || "발달 정보가 없습니다.";
    }
    
    // 계산 기능
    function calculate() {
        let inputDate, result;
        
        // 현재 선택된 방법에 따라 입력값 가져오기
        if (currentMethod === 'lmp') {
            inputDate = document.getElementById('lastPeriod').value;
            if (!inputDate) {
                alert('마지막 생리일을 입력해주세요.');
                return;
            }
            result = calculateFromLMP(new Date(inputDate));
        } else if (currentMethod === 'conception') {
            inputDate = document.getElementById('conceptionDate').value;
            if (!inputDate) {
                alert('수정일을 입력해주세요.');
                return;
            }
            result = calculateFromConception(new Date(inputDate));
        } else if (currentMethod === 'dueDate') {
            inputDate = document.getElementById('dueDate').value;
            if (!inputDate) {
                alert('출산 예정일을 입력해주세요.');
                return;
            }
            result = calculateFromDueDate(new Date(inputDate));
        }
        
        // 결과 표시
        if (result) {
            weeksElement.textContent = `${result.weeks}주 ${result.days}일`;
            trimesterElement.textContent = `${getTrimester(result.weeks)}분기`;
            calculatedDateElement.textContent = result.date;
            developmentInfoElement.textContent = getPregnancyInfo(result.weeks);
            
            // 진행 상황 표시
            const progressPercentage = Math.min(result.weeks / 42 * 100, 100);
            progressBar.style.width = `${progressPercentage}%`;
            
            // 결과 섹션 표시
            resultSection.classList.remove('hidden');
        }
    }
    
    // 마지막 생리일 기준 계산
    function calculateFromLMP(lmpDate) {
        // 출산 예정일 (LMP + 280일)
        const dueDate = addDays(lmpDate, 280);
        
        // 현재 날짜
        const today = new Date();
        
        // 마지막 생리일부터 오늘까지의 일수
        const daysSinceLMP = dateDiffInDays(lmpDate, today);
        
        // 주와 일 계산
        const weeks = Math.floor(daysSinceLMP / 7);
        const days = daysSinceLMP % 7;
        
        return {
            weeks: weeks,
            days: days,
            date: formatDate(dueDate)
        };
    }
    
    // 수정일 기준 계산
    function calculateFromConception(conceptionDate) {
        // 출산 예정일 (수정일 + 266일)
        const dueDate = addDays(conceptionDate, 266);
        
        // 추정 마지막 생리일 (수정일 - 14일)
        const estimatedLMP = addDays(conceptionDate, -14);
        
        // 현재 날짜
        const today = new Date();
        
        // 추정 마지막 생리일부터 오늘까지의 일수
        const daysSinceLMP = dateDiffInDays(estimatedLMP, today);
        
        // 주와 일 계산
        const weeks = Math.floor(daysSinceLMP / 7);
        const days = daysSinceLMP % 7;
        
        return {
            weeks: weeks,
            days: days,
            date: formatDate(dueDate)
        };
    }
    
    // 출산 예정일 기준 계산
    function calculateFromDueDate(dueDate) {
        // 추정 마지막 생리일 (출산 예정일 - 280일)
        const estimatedLMP = addDays(dueDate, -280);
        
        // 현재 날짜
        const today = new Date();
        
        // 추정 마지막 생리일부터 오늘까지의 일수
        const daysSinceLMP = dateDiffInDays(estimatedLMP, today);
        
        // 주와 일 계산
        const weeks = Math.floor(daysSinceLMP / 7);
        const days = daysSinceLMP % 7;
        
        return {
            weeks: weeks,
            days: days,
            date: formatDate(estimatedLMP)
        };
    }
    
    // 초기 방법 설정
    setActiveMethod('lmp');
});