import { Text, View, TouchableOpacity } from "react-native";
import { useEffect, useState } from 'react';
import { colors, textStyles } from "../../../styles/globalStyle";
import { Calendar, LocaleConfig } from "react-native-calendars";
import BackIcon from "../../../assets/icons/BackIcon.svg";
import { ScrollView } from "react-native-gesture-handler";

const HomeSchedule = ({ navigation }) => {
  const [selected, setSelected] = useState('');
  const [markedDates, setMarkedDates] = useState({});
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  
  // 한국어 로케일 설정
  LocaleConfig.locales['kr'] = {
    monthNames: [
      '1월','2월','3월','4월','5월','6월',
      '7월','8월','9월','10월','11월','12월'
    ],
    monthNamesShort: [
      '1월','2월','3월','4월','5월','6월',
      '7월','8월','9월','10월','11월','12월'
    ],
    dayNames: [
      '일요일','월요일','화요일','수요일',
      '목요일','금요일','토요일'
    ],
    dayNamesShort: ['일','월','화','수','목','금','토'],
    today: '오늘'
  };
  LocaleConfig.defaultLocale = 'kr';

  useEffect(() => {
    const generateMarkedDates = () => {
      let dates = {};

      // 현재 날짜를 기준으로 초기 month와 year 설정
      const today = new Date();
      setMonth(today.getMonth() + 1);
      setYear(today.getFullYear());

      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(today.getFullYear() - 1);
      const oneYearLater = new Date();
      oneYearLater.setFullYear(today.getFullYear() + 1);

      const todayString = today.toISOString().split('T')[0];

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

        // 오늘 날짜 마킹
        if (dateString === todayString) {
          dates[dateString].today = true;
          // 오늘 날짜에 점을 추가하려면 아래 주석을 해제하세요
          // dates[dateString].dots.push({ key: 'today', color: colors.Main_Green });
        }
      }

      setMarkedDates(dates);
    };

    generateMarkedDates();
  }, []);

  const onDayPress = (day) => {
    const dateString = day.dateString;

    // 선택된 날짜 업데이트
    setSelected(dateString);

    // markedDates 상태 업데이트
    setMarkedDates((prevDates) => {
      const updatedDates = { ...prevDates };

      // 이전 선택 제거
      Object.keys(updatedDates).forEach((key) => {
        if (updatedDates[key].selected) {
          updatedDates[key].selected = false;
          delete updatedDates[key].selectedColor;
          delete updatedDates[key].selectedTextColor;
        }
      });

      // 선택된 날짜에 선택 상태 추가
      if (!updatedDates[dateString]) {
        updatedDates[dateString] = { dots: [] };
      }

      updatedDates[dateString] = {
        ...updatedDates[dateString],
        selected: true,
        selectedColor: colors.Main_Green,
        selectedTextColor: colors.white,
      };

      return updatedDates;
    });
  };

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

    // 마킹 정보 가져오기
    const marking = markedDates[dateString] || {};
    const isSelected = marking.selected;
    const dots = marking.dots || [];
    const isToday = marking.today;

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
                color: isSelected ? colors.white : isToday ? colors.Main_Green : textColor,
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
    <View style={{ backgroundColor: colors.White_Green}}>
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
      <View style={{ padding: 16 }}>
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
          markedDates={markedDates}
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
      <ScrollView style={{ flex: 1, backgroundColor: colors.White_Green }}>
        
      </ScrollView>
    </View>
  );
};

export default HomeSchedule;
