import { Text, View, TouchableOpacity, Image } from "react-native";
import { useEffect, useState } from 'react';
import { colors, textStyles } from "../../../styles/globalStyle";
import { Calendar, LocaleConfig } from "react-native-calendars";
import BackIcon from "../../../assets/icons/BackIcon.svg";
import { ScrollView } from "react-native-gesture-handler";
import { getDailySchedule } from "../../../api/scheduleApi";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "../../../api/api";
import { formatDate, formatTime } from "../../../utils/formatDate";
import useGroupInfo from "../../hooks/queries/useGroupInfo";
import SchoolTimeComponent from "../../../components/SchoolTimeComponent";
import CalendarIcon from "../../../assets/icons/CalendarIcon.svg";

const HomeSchedule = ({ navigation }) => {
  const [selected, setSelected] = useState('');
  const [markedDates, setMarkedDates] = useState({});
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [daySchedule, setDaySchedule] = useState([]);
  const {data: groupInfo, isPending: groupInfoIsPending, isSuccess: groupInfoIsSuccess} = useGroupInfo();
  const todayString = new Date().toISOString().split('T')[0];
  // 달력 언어 설정
  // const {data} = useQuery({
  //   queryKey: ['dailySchedule'], 
  //   queryFn: () => getDailySchedule(todayString)
  // });

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
  

  const addScheduleMark = async ({ year, month }) => {
    try {
      const response = await authApi.get(`schedules/month?year=${year}&month=${month}`);
      let dates = {};
      response.data.forEach((schedule) => {
        const dateString = schedule.day; // 일정 날짜
        if (!dates[dateString]) {
          dates[dateString] = { dots: [] }; // 날짜 초기화
        }
        if (schedule.scheduleType === '등교') {
          dates[dateString].dots.push({ key: 'event1', color: colors.Orange });
        }
        if (schedule.scheduleType === '하교') {
          dates[dateString].dots.push({ key: 'event2', color: colors.Blue });
        }
      });
  
      // markedDates 상태 업데이트
      setMarkedDates((prevDates) => ({
        ...prevDates,
        ...dates, // 기존 날짜와 새 날짜 병합
      }));
    } catch (error) {
      console.error('Error fetching schedule marks:', error);
    }
  };



  useEffect(() => {
    const generateMarkedDates = async() => {
      let dates = {};
      
      const today = new Date();
      setMonth(today.getMonth() + 1);
      setYear(today.getFullYear());

      const response = await authApi.get(`schedules/month?year=${today.getFullYear()}&month=${today.getMonth() + 1}`);
      console.log(response.data);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(today.getFullYear() - 1);
      const oneYearLater = new Date();
      oneYearLater.setFullYear(today.getFullYear() + 1);

      const todayString = today.toISOString().split('T')[0];
      // 현재 날짜를 기준으로 초기 month와 year 설정

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

        response.data.forEach((schedule) => {
          if (dateString === schedule.day) {
            if (schedule.scheduleType === '등교') {
              dates[dateString].dots.push({ key: 'event1', color: colors.Orange });
            }
            if (schedule.scheduleType === '하교') {
              dates[dateString].dots.push({ key: 'event2', color: colors.Blue });
            }
          }
        });

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
        }
      }

      setMarkedDates(dates);
      onDayPress({ dateString: new Date().toISOString().split('T')[0] });
    };  
    generateMarkedDates();
    
  }, []);

  const onDayPress = async (day) => {
    const dateString = day.dateString;
    console.log(dateString);
    try {
      const response = await authApi.get(`schedules/day?date=${dateString}`);
      console.log(response.data);
      setDaySchedule(response.data);
    } catch (error) {
      console.error('Error fetching schedule marks:', error);
    }
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
        selectedTextColor: colors.White,
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
                color: isSelected ? colors.White : isToday ? colors.Main_Green : textColor,
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
    <View style={{ backgroundColor: colors.White_Green, flex:1}}>
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
            todayTextColor: colors.Main_Green,
            dayTextColor: colors.Gray07,
            textDisabledColor: '#d9e1e8',
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
          onMonthChange={async (monthData) => {
            console.log(monthData);
            setMonth(monthData.month);
            setYear(monthData.year);
            await addScheduleMark({year: monthData.year, month: monthData.month});
          }}
          dayComponent={renderDay}
        />
      </View>
      <ScrollView style={{backgroundColor: colors.White_Green}}>
        <View style={{ paddingHorizontal: 32, paddingVertical: 24, margin:16, elevation:3, backgroundColor:colors.White_Green, borderRadius:15 }}>
          {selected &&
          <Text style={[textStyles.M2, { color: colors.Black }]}>
            {formatDate(new Date(selected))}
          </Text>}
          <View style={{ height: 8 }} />
          {daySchedule.length == 0 ?
          <View style={{alignItems:'center', paddingVertical:32}}>
            <CalendarIcon />
            <View style={{ height: 16 }} />
            <Text style={[textStyles.R1, { color: colors.Gray06 }]}>
              운행 스케줄이 없어요!
            </Text>
          </View>
          :
          <View>
            {groupInfoIsSuccess  &&
            <Text style={[textStyles.R3, { color: colors.Black }]}>
            {groupInfo.schoolName} {groupInfo.groupName}
            </Text>}
            <View style={{ height: 24 }} />
            {daySchedule.map((schedule, index) => (
              <View key={index} style={{gap:16}}>
                <View style={{ flexDirection: 'row', alignItems:'center', gap:16}}>
                  <SchoolTimeComponent type={schedule.scheduleType === '등교' ? 'before' : 'after'} isSelected={true} title={schedule.scheduleType}/>
                  <Text style={[textStyles.M3, { color: colors.Gray07 }]}>
                    {schedule.scheduleType === '등교' ? '오전' : '오후'} {formatTime(schedule.time)}
                  </Text>
                </View>
                <View style={{flexDirection:'row', alignItems:'center', gap:24}}>
                  {schedule.guardians.map((guardian, index) => (
                    <View key={index} style={{alignItems:'center', gap: 8}}>
                      <View style={{ width:50, height: 50, borderRadius:25, overflow:'hidden' }}>
                        <Image src={guardian.imagePath} style={{flex:1}}/>
                      </View>
                      <Text style={[textStyles.R2, {color:colors.Black}]}>
                        {guardian.name} 지도사
                      </Text>
                    </View>
                  ))}
                </View>   
              </View>
            ))}
          </View>}
        </View>  
      </ScrollView>
    </View>
  );
};

export default HomeSchedule;