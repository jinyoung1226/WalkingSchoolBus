import { Text, View, TouchableOpacity } from "react-native";
import { useEffect, useState } from 'react';
import { colors } from "../../../styles/globalStyle";
import { Calendar } from "react-native-calendars";
import BackIcon from "../../../assets/icons/BackIcon.svg";

const HomeSchedule = ({ navigation }) => {
  const [selected, setSelected] = useState('');
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    const generateMarkedDates = () => {
      let dates = {};

      // 주말 날짜 스타일 적용 및 이벤트 날짜 추가
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
        }
      });

      // 선택된 날짜에 선택 상태 추가
      if (!updatedDates[dateString]) {
        updatedDates[dateString] = { dots: [] };
      }

      updatedDates[dateString].selected = true;
      updatedDates[dateString].selectedColor = colors.Main_Green;

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
                color: isSelected ? colors.white : textColor,
                fontFamily: 'Pretendard-Medium',
                fontSize: 16,
              }}
            >
              {date.day}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 4 }}>
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
    <View>
      <Calendar
        style={{
          backgroundColor: colors.White_Green
        }}
        theme={{
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
            <View style={{ paddingHorizontal: 32 }}>
              <BackIcon width={20} height={20} />
            </View>
          ) : (
            <View style={{ paddingHorizontal: 32 }}>
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
        monthFormat={'yyyy년 M월'}
        onMonthChange={(month) => {
          console.log(month);
        }}
        dayComponent={renderDay}
      />
      <Text>HomeSchedule</Text>
    </View>
  );
};

export default HomeSchedule;
