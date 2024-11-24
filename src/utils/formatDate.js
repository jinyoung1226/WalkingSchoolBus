// today 날짜 구하는 함수
export function formatDate(date = new Date()) {
    const options = { month: 'numeric', day: 'numeric', weekday: 'long' };
    const formattedDate = date.toLocaleDateString('ko-KR', options);
    
    // '일'에만 0을 붙이기 위한 함수
    const padZero = (num) => (num < 10 ? `0${num}` : num);
    const [month, day, weekday] = formattedDate
      .replace(/\./g, '') 
      .split(' '); 
    
    return `${month}월 ${padZero(day)}일 ${weekday}`;
  }

  export function formatTime(time) {
    const [hours, minutes] = time.split(':').map(Number); // "08:20" -> [8, 20]
    return `${hours}시 ${minutes}분`;
  }