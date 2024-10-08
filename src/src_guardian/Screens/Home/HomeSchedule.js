import { Text, View, TouchableOpacity } from "react-native";
import { useEffect, useState, useMemo } from 'react';
import { colors, textStyles } from "../../../styles/globalStyle";
import { Calendar, LocaleConfig } from "react-native-calendars";
import BackIcon from "../../../assets/icons/BackIcon.svg";
import { ScrollView } from "react-native-gesture-handler";

const HomeSchedule = ({ navigation }) => {
  const [selected, setSelected] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  
  LocaleConfig.defaultLocale = 'kr';

  // 현재 날짜 문자열을 useMemo로 한 번만 계산
  const todayString = useMemo(() => new Date().toISOString().split('T')[0], []);

  // baseMarkedDates를 useMemo로 한 번만 생성
  const baseMarkedDates = useMemo(() => {
    let dates = {};

    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    const oneYearLater = new Date();
    oneYearLater.setFullYear(today.getFullYear() + 1);

    for (
      let d = new Date(oneYearAgo);
      d <= oneYearLater;
      d.setDate(d.getDate() + 1)
    ) {
      const dateString = d.toISOString().split('T')[0]; // yyyy-MM-dd 형식
      const dayOfWeek = d.getDay(); // 0 (일요일) ~ 6 (토요일)

      // 날짜 객체 초기화
      if (!dates[dateString]) {
        dates[dateString] = { dots: [] };
      }

      // 더미 데이터로 이벤트 날짜 추가 (여러 개의 점 표시)
      if (dateString === '2024-10-10') {
        dates[dateString].dots.push({ key: 'event1', color: colors.Orange });
      } else if (dateString === '2024-10-15') {
        dates[dateString].dots.push(
          { key: 'event1', color: colors.Orange },
          { key: 'event2', color: colors.Blue }
        );
      }

      // 주말의 텍스트 색상 설정
      if (dayOfWeek === 0) {
        // 일요일
        dates[dateString].textColor = colors.Red;
      } else if (dayOfWeek === 6) {
        // 토요일
        dates[dateString].textColor = colors.Blue;
      }

      // 오늘 날짜 마킹 (선택적으로 점 추가)
      if (dateString === todayString) {
        dates[dateString].today = true;
        // 오늘 날짜에 점을 추가하려면 아래 주석을 해제하세요
        // dates[dateString].dots.push({ key: 'today', color: colors.Main_Green });
      }
    }

    return dates;
  }, [todayString]);

  // markedDates를 useMemo로 selected 상태에 따라 계산
  const markedDatesComputed = useMemo(() => {
    let updatedMarkedDates = { ...baseMarkedDates };

    if (selected) {
      updatedMarkedDates[selected] = {
        ...(updatedMarkedDates[selected] || {}),
        selected: true,
        selectedColor: colors.Main_Green,
        selectedTextColor: colors.white,
      };
    }

    return updatedMarkedDates;
  }, [baseMarkedDates, selected]);

  useEffect(() => {
    // 초기 month와 year 설정
    const today = new Date();
    setMonth(today.getMonth() + 1);
    setYear(today.getFullYear());

    // 오늘 날짜 자동 선택
    setSelected(todayString);
  }, [todayString]);

  // 커스텀 dayComponent
  const renderDay = ({ date, state }) => {
    const dateString = date.dateString;
    const dayOfWeek = new Date(dateString).getDay();

    let textColor = colors.Gray07; // 기본 텍스트 색상

    if (dayOfWeek === 0) {
      // 일요일
      textColor = colors.Red;
    } else if (dayOfWeek === 6) {
      // 토요일
      textColor = colors.Blue;
    }

    if (state === 'disabled') {
      textColor = colors.Gray04; // 비활성화된 날짜 텍스트 색상
    }

    // 오늘 날짜인지 확인
    const isToday = dateString === todayString;

    // 마킹 정보 가져오기
    const isSelected = selected === dateString;

    // 오늘 날짜의 텍스트 색상 흰색으로 설정
    const finalTextColor = isSelected || isToday ? colors.white : textColor;

    // Dots from baseMarkedDates
    const dots = baseMarkedDates[dateString]?.dots || [];

    return (
      <TouchableOpacity onPress={() => onDayPress(date)}>
        <View style={{ alignItems: 'center' }}>
          <View
            style={{
              backgroundColor: isSelected ? colors.Main_Green : 'transparent',
              borderRadius: 16,
              width: 30,
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: finalTextColor,
                fontFamily: 'Pretendard-Medium',
                fontSize: 16,
              }}
            >
              {date.day}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            {dots.map((dot, index) => (
              <View
                key={index}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 3,
                  backgroundColor: dot.color,
                  marginHorizontal: 2,
                }}
              />
            ))}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ backgroundColor: colors.White_Green, flex: 1 }}>
      {/* 커스텀 헤더 */}
      <View style={{ paddingHorizontal: 32, position:'absolute', zIndex:1, top:16 }}>
        <Text style={[textStyles.SB1, { color: colors.Black, fontSize: 20 }]}>
          {year}년 {month}월
        </Text>
        <View style={{ height: 4 }} />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 5,
              height: 5,
              borderRadius: 2.5,
              backgroundColor: colors.Orange,
            }}
          />
          <View style={{ width: 8 }} />
          <Text style={[textStyles.M5, { color: colors.Gray07 }]}>
            등교
          </Text>
          <View style={{ width: 10 }} />
          <View
            style={{
              width: 5,
              height: 5,
              borderRadius: 2.5,
              backgroundColor: colors.Blue,
            }}
          />
          <View style={{ width: 8 }} />
          <Text style={[textStyles.M5, { color: colors.Gray07 }]}>
            하교
          </Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: colors.White_Green }}>
        <View style={{ padding: 16, marginTop: 100 }}> {/* Adjust marginTop to prevent header overlap */}
          <Calendar
            style={{
              backgroundColor: colors.White_Green
            }}
            theme={{
              'stylesheet.calendar.header': {
                header: {
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  paddingBottom: 16,
                },
              },
              backgroundColor: colors.White_Green,
              calendarBackground: colors.White_Green,
              textSectionTitleColor: colors.Gray06,
              textSectionTitleDisabledColor: '#d9e1e8',
              selectedDayBackgroundColor: colors.Main_Green,
              selectedDayTextColor: colors.white,
              todayTextColor: colors.Main_Green,
              dayTextColor: colors.Gray07,
              textDisabledColor: '#d9e1e8',
              dotColor: colors.Button_Green,
              selectedDotColor: colors.white,
              arrowColor: colors.Black,
              disabledArrowColor: '#d9e1e8',
              monthTextColor: colors.Black,
              indicatorColor: colors.Black,
              textDayFontFamily: 'Pretendard-Medium',
              textMonthFontFamily: 'Pretendard-SemiBold',
              textDayHeaderFontFamily: 'Pretendard-Regular',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 16,
            }}
            renderArrow={(direction) =>
              direction === 'left' ? (
                <View>
                  <BackIcon width={20} height={20} />
                </View>
              ) : (
                <View>
                  <BackIcon
                    width={20}
                    height={20}
                    style={{ transform: [{ rotate: '180deg' }] }}
                  />
                </View>
              )
            }
            onDayPress={onDayPress}
            markedDates={markedDatesComputed}
            hideExtraDays={true}
            monthFormat={''}
            onMonthChange={(monthData) => {
              console.log(monthData);
              setMonth(monthData.month);
              setYear(monthData.year);
            }}
            dayComponent={renderDay}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeSchedule;
