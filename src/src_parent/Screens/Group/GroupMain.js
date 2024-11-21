import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {Text, View, Button, ImageBackground, Image, Linking, TouchableOpacity, Pressable} from 'react-native';
import useTabBarStore from '../../../store/tabBarStore';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, textStyles } from '../../../styles/globalStyle';
import CustomHeader from '../../../components/CustomHeader';
import LinearGradient from 'react-native-linear-gradient';
import HeartIcon from '../../../assets/icons/HeartIcon.svg';
import BabyIcon from '../../../assets/icons/BabyIcon.svg';
import BalloonIcon from '../../../assets/icons/BalloonIcon.svg';
import MessageIcon from '../../../assets/icons/MessageIcon.svg';
import PhoneIcon from '../../../assets/icons/PhoneIcon.svg';
import XIcon from '../../../assets/icons/XIcon.svg';
import BackIcon from '../../../assets/icons/BackIcon.svg';
import SchoolTimeComponent from '../../../components/SchoolTimeComponent';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import CustomButton from '../../../components/CustomButton';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import ConfirmModal from '../../../components/ConfirmModal';
import useApplyPreabsent from '../../hooks/mutations/useApplyPreabsent';
import MessageModal from '../../../components/MessageModal';
import useSendMessage from '../../hooks/mutations/useSendMessage';
const GroupMain = ({navigation, route}) => {
  const {groupInfo, waypoints, students} = route.params;
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [selected, setSelected] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [isMessage, setIsMessage] = useState(false);
  const [message, setMessage] = useState('');
  const bottomSheetModalRef = useRef(null);
  
  const mutateApplyPreabsent = useApplyPreabsent();
  const mutateSendMessage = useSendMessage();
  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
    if (index === -1) {
      setStep(0);
      setSelected(null);
      setMarkedDates({});
      setIsMessage(false);
    }
  }, []);

  const renderBackdrop = useCallback(
		(props) => (
			<BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
				appearsOnIndex={0}
      />
		),
		[]
	);

  useEffect(() => {
      const today = new Date();
      setMonth(today.getMonth() + 1);
      setYear(today.getFullYear());
  }, []);

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

  const onDayPress = (day) => {
    const dateString = day.dateString;

    // 선택된 날짜 업데이트
    setSelected(dateString);
    console.log(`selected day: ${dateString}`);
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

  const renderDay = ({ date, state }) => {
    const dateString = date.dateString;
    const dayOfWeek = new Date(dateString).getDay();
    const today = new Date();
    const dateObj = new Date(dateString);
  
    let textColor = colors.Gray07; // 기본 텍스트 색상
  
    if (dateObj < today && state !== 'disabled') {
      // 이미 지난 날짜
      textColor = colors.Gray04;
    } else if (dayOfWeek === 0) {
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
    const isToday = dateObj.toDateString() === today.toDateString();
  
    return (
      <TouchableOpacity onPress={() => onDayPress(date)} disabled={dateObj < today && !isToday}>
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
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.White_Green, paddingBottom: insets.bottom }}>
      <MessageModal
        modalVisible={messageModalVisible}
        setModalVisible={setMessageModalVisible}
        confirmTitle={'확인'}
        onConfirm={() => {
          mutateSendMessage.mutate({
            studentId: selectedStudent.studentId,
            content: message
          },
          {
            onSuccess: () => {
              bottomSheetModalRef.current?.close();
              setMessageModalVisible(false);
            }
          }
        );
        }}          
        value={message}
        setMessage={setMessage}
        onChangeText={(text) => setMessage(text)}
      />
      <ConfirmModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        icon={<MessageIcon />}
        title={'결석 신청하기'}
        subtitle={
          <Text 
          style={[
            textStyles.R1,
            {color: colors.Gray05, textAlign: 'center'},
          ]}>
            {'정말 결석을 신청하시겠어요?\n버튼을 누르면 지킴이에게 알림이 전송됩니다'}
          </Text>
        }
        confirmTitle={'신청하기'}
        onConfirm={() => {
          console.log(selectedStudent.studentId, selected);
          setModalVisible(false);
          mutateApplyPreabsent.mutate({
            studentId: selectedStudent.studentId,
            date: selected
          },
          {
            onSuccess: () => {
              bottomSheetModalRef.current?.close();
            }
          }
        );
        }}
        cancelTitle={'취소'}
        onCancel={() => {
          setModalVisible(false);
        }}

        isBackgroundclosable={true}
      />
      <BottomSheetModalProvider>
        
        <ScrollView>
          <ImageBackground src={groupInfo.groupImage} style={{width: '100%', aspectRatio:0.9}}>
            <LinearGradient  
              style={{flex:1}}
              colors={[
                'rgba(0, 0, 0, 0)',
                'rgba(0, 0, 0, 0.5)'
              ]}>
                <View style={{paddingHorizontal:16, paddingVertical:24, justifyContent:'flex-end', flex:1}}>
                  <Text style={[textStyles.SB3, {color:colors.White}]}>
                    {groupInfo.regionName} {groupInfo.districtName}
                  </Text>
                  <Text style={[textStyles.B1, {color:colors.White}]}>
                    {groupInfo.schoolName} {groupInfo.groupName}
                  </Text>
                  <View style={{height:16}}/>
                  <View style={{flexDirection:'row', alignItems:'center'}}>
                    <HeartIcon/>
                    <View style={{width:4}}/>
                    <Text style={[textStyles.M5, {color:colors.White}]}>인솔자 {groupInfo.guardians.length}명</Text>
                    <View style={{width:8}}/>
                    <BabyIcon/>
                    <View style={{width:4}}/>
                    <Text style={[textStyles.M5, {color:colors.White}]}>학생 {groupInfo.studentCount}명</Text>
                  </View>
                </View>
            </LinearGradient>
          </ImageBackground>
          <View style={{paddingVertical:32, gap:32}}>
            <View style={{paddingHorizontal:32}}>
              <Text style={[textStyles.SB2, {color:colors.Black}]}>
                우리 그룹 인솔자
              </Text>
              <View style={{height:8}}/>
              <View style={{gap:8}}>
              {groupInfo.guardians.map((guardian, index) => (
                <View style={{flexDirection:'row', gap:16, alignItems:'center'}} key={index}>
                  <View style={{width:50, height:50, borderRadius:25, backgroundColor:colors.Gray03, overflow:'hidden'}}>
                    <ImageBackground src={guardian.imagePath} style={{flex:1}}>
                      <View style={{backgroundColor:"rgba(0, 0, 0, 0.1)", flex:1}}/>
                    </ImageBackground>
                  </View>
                  <View style={{gap:4}}>
                    <Text style={[textStyles.M4, {color:colors.Black}]}>{guardian.name} 인솔자</Text>
                    <Text style={[textStyles.R3, {color:colors.Gray06}]}>{guardian.phone}</Text>
                  </View>
                  <View style={{flex:1}}/>
                  <TouchableOpacity 
                    style={{width:40, height:40, borderRadius:20, backgroundColor:colors.BG_Green, justifyContent:'center', alignItems:'center'}}
                    onPress={() => {Linking.openURL(`tel:${guardian.phone}`)}}
                    > 
                    <PhoneIcon width={20} height={20}/>
                  </TouchableOpacity>
                </View>
              ))}
              </View>
            </View>
            <View style={{paddingHorizontal:32}}>
              <Text style={[textStyles.SB2, {color:colors.Black}]}>
                등교 노선
              </Text>
              <View style={{height:8}}/>
              <View style={{gap:8, flexDirection:'row', alignItems:'center'}}>
                <SchoolTimeComponent type={'before'} isSelected={true} title={'등교'}/>
                <View style={{flex:1, flexDirection:'row', flexWrap:'wrap'}}>
                  {waypoints.map((waypoint, index) => (
                    <Text key={index} style={[textStyles.R3, {color:colors.Black}]}>{waypoint.waypointName}{index < waypoints.length - 1 && ' - '}</Text>
                  ))}
                </View>
              </View>
            </View>
            <View style={{height:10, backgroundColor:colors.Gray01}}/>
            <View style={{paddingHorizontal:32}}>
              <View style={{flexDirection:'row', alignItems:'center', gap:4}}>
                <BalloonIcon width={18} height={18} />
                <Text style={[textStyles.SB2, {color:colors.Black}]}>
                  메세지 보내기
                </Text>
              </View>
              <View style={{height:24}}/>
              <View style={{paddingHorizontal:32, paddingVertical:24, backgroundColor:'#F2FEFA', borderRadius:14}}>
                <Text style={[textStyles.R3, {color:colors.Gray07, lineHeight:20}]}>
                {"잠깐! 인솔자에게는 꼭 필요한 상황에만 연락해주세요 :) 아이들의 안전을 위해 항상 바쁘게 활동하고 계십니다. 연락 시 예의를 갖추어 정중하게 말씀해 주시고 활동 시간 외에는 연락을 삼가해주세요."}
                </Text>
              </View>
              <View style={{height:24}}/>
              <TouchableOpacity 
                onPress={()=>{handlePresentModalPress(); setIsMessage(true)}}
                style={{padding:32, backgroundColor:colors.Gray01, borderRadius:10, borderWidth:1, borderColor:colors.Gray03, flexDirection:'row', alignItems:'center'}}>
                <Text style={[textStyles.SB3, {color:colors.Gray07}]}>
                {"인솔자에게 메세지 보내기"}
                </Text>
                <View style={{flex:1}}/>
                <MessageIcon width={50} height={50} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <View style={{position:'absolute',  paddingTop: insets.top-10}}>
          <CustomHeader title=""/>
        </View>
        <View style={{padding:16, elevation:10}}>
          {/* 출근하기 이후 마지막 경유지 출석 완료시 퇴근하기 버튼 활성화, 완료 전까지는 운행중이라는 비활성화 버튼 제공 */}
          <CustomButton 
          title={'결석 신청하기'} 
          onPress={()=>{handlePresentModalPress()}}
          />
        </View>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          onChange={handleSheetChanges}
  
          backdropComponent={renderBackdrop}
          backgroundStyle={{borderRadius: 40}}
          handleComponent={() => 
          <View style={{height:69, alignItems:'center', justifyContent:'center'}}>
            <View style={{height:5, width:50, backgroundColor:colors.Gray03, borderRadius:5}}/>
          </View>
          }
        >
          <BottomSheetView style={{paddingBottom:insets.bottom}}>
            {step === 0 && <View style={{gap:24, paddingHorizontal:16}}>
              <View style={{flexDirection:'row', alignItems:'center'}}>
                <View style={{flex:1}}/>
                <Text style={[textStyles.SB1, {color:colors.Black}]}>아이 선택하기</Text>
                <View style={{flex:1, flexDirection:'row'}}>
                  <View style={{flex:1}}/>
                  <TouchableOpacity onPress={() => bottomSheetModalRef.current?.close()}>
                    <XIcon width={21} height={21} color={colors.Black}/>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{height:1, backgroundColor:colors.Gray02}}/>
              <View style={{gap:16}}>
              {students.map((student, index) => (
                <Pressable 
                  style={({pressed}) => [{backgroundColor:pressed ? '#F6FEFB' : colors.White, borderRadius:10, marginHorizontal:16, borderWidth:1, borderColor: pressed ? colors.Main_Green : colors.Gray02}]} 
                  key={index}
                  onPress={() => {
                    setSelectedStudent(student)
                    if (isMessage) {
                      bottomSheetModalRef.current?.close();
                      setMessageModalVisible(true);
                    }
                    if (!isMessage) {
                      setStep(1)
                    }
                  }}
                >
                  <View 
                    style={{paddingVertical:16, flexDirection:'row', alignItems:'center', gap:32, paddingHorizontal:32}}
                    > 
                    <View style={{width:60, height:60, borderRadius:30, backgroundColor:colors.Gray02, overflow:'hidden'}}>
                      {student.imagePath !== null &&
                      <ImageBackground src={student.imagePath} style={{flex:1}}>
                        <View style={{backgroundColor:"rgba(0, 0, 0, 0.1)", flex:1}}/>
                      </ImageBackground>}
                    </View>
                    <View style={{gap:4}}>
                      <Text style={[textStyles.SB3, {color:colors.Black}]}>{student.name}</Text>
                      <Text style={[textStyles.R2, {color:colors.Gray06}]}>{student.schoolName} {student.grade}학년</Text>
                    </View>
                  </View>
                </Pressable>
              ))}
              </View>
              <View/>
            </View>}
            {step === 1 && <View style={{paddingHorizontal:16}}>
              <View style={{flexDirection:'row', alignItems:'center'}}>
                <View style={{flex:1, flexDirection:'row'}}>
                  <TouchableOpacity onPress={() => {setStep(0); setSelectedStudent(null)}}>
                    <BackIcon/>
                  </TouchableOpacity>
                </View>
                <Text style={[textStyles.SB1, {color:colors.Black}]}>날짜 선택하기</Text>
                <View style={{flex:1, flexDirection:'row'}}>
                  <View style={{flex:1}}/>
                  <TouchableOpacity onPress={() => bottomSheetModalRef.current?.close()}>
                  <XIcon width={21} height={21} color={colors.Black}/>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{height:24}}/>
              <View style={{height:1, backgroundColor:colors.Gray02}}/>
              <View style={{height:24}}/>
              <View style={{gap:16}}>
                <View 
                  style={{marginHorizontal:16, paddingVertical:8, flexDirection:'row', alignItems:'center', gap:32, paddingHorizontal:32}}
                > 
                  <View style={{width:60, height:60, borderRadius:30, backgroundColor:colors.Gray03, overflow:'hidden'}}>
                    {selectedStudent.imagePath !== null &&
                    <ImageBackground src={selectedStudent.imagePath} style={{flex:1}}>
                      <View style={{backgroundColor:"rgba(0, 0, 0, 0.1)", flex:1}}/>
                    </ImageBackground>}
                  </View>
                  <View style={{gap:4}}>
                    <Text style={[textStyles.SB3, {color:colors.Black}]}>{selectedStudent.name}</Text>
                    <Text style={[textStyles.R2, {color:colors.Gray06}]}>{selectedStudent.schoolName} {selectedStudent.grade}학년</Text>
                  </View>
                </View>
              </View>
              <View style={{height:8}}/>
              <View style={{ paddingHorizontal: 16 }}>
                <View style={{ paddingHorizontal: 32, position:'absolute', zIndex:1, top:9 }}>
                  <Text style={[textStyles.SB3, { color: colors.Gray07}]}>
                    {year}년 {month}월
                  </Text>
                </View>
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
                  onMonthChange={(monthData) => {
                    console.log(monthData);
                    setMonth(monthData.month);
                    setYear(monthData.year);
                  }}
                  dayComponent={renderDay}
                />
              </View>
              <View style={{height:16}}/>
              <CustomButton title={'결석 신청하기'} onPress={() => {setModalVisible(true)}} disabled={!selected}/>
              <View style={{height:16}}/>
            </View>}
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default GroupMain;
