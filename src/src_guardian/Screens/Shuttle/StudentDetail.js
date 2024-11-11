import { View, Text, Image, TouchableOpacity } from 'react-native';
import SmileIcon from '../../../assets/icons/SmileIcon.svg';
import { textStyles, colors } from '../../../styles/globalStyle';
import CustomHeader from '../../../components/CustomHeader';
import ArrowIcon from '../../../assets/icons/ArrowIcon.svg';
import { ScrollView } from 'react-native-gesture-handler';
import CustomButton from '../../../components/CustomButton';
import useStudentMessages from '../../hooks/queries/useStudentMessages';
import MessageItem from '../../../components/MessageItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const StudentInfoRow = ({ title, content }) => (
  <View>
    <Text style={[textStyles.SB3, { color: colors.Black }]}>{title}</Text>
    <View style={{ height: 8 }} />
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={[textStyles.R2, { color: colors.Black }]}>{content}</Text>
    </View>
  </View>
);

const StudentDetail = ({ navigation, route }) => {
  const { studentInfo } = route.params;
  const insets = useSafeAreaInsets();
  const {data, isPending} = useStudentMessages()


  return (
    <View style={{flex:1, backgroundColor:colors.White_Green, paddingBottom: insets.bottom, paddingTop: insets.top}}>
      <CustomHeader title="학생 프로필" />
      <ScrollView>
        <View style={{alignItems:'center'}}>
          <View style={{width:100, height:100, borderRadius:50, borderWidth:1, borderColor: colors.Gray04, overflow: 'hidden'}}>
            <Image 
            src={studentInfo.imagePath} 
            style={{width:100, height:100}} 
            />
          </View>
          <View style={{height: 16}} />
          <Text style={[textStyles.M4, { color: colors.Black }]}>
            {studentInfo.schoolName}
          </Text>
          <View style={{ height: 4 }} />
          <Text style={[textStyles.SB1, { color: colors.Black }]}>
            {studentInfo.name}
          </Text>
        </View>
        <View style={{padding:32, gap:24}}>
          <StudentInfoRow title="학년" content={`${studentInfo.grade}학년`}/>
          <StudentInfoRow title="대기 장소" content={studentInfo.waypointName} />
          <StudentInfoRow title="특이사항" content={studentInfo.notes} />
        </View>
        <View style={{height:10, backgroundColor:colors.Gray02, marginBottom:16}} />
        <View style={{flexDirection:'row', padding:16, justifyContent:'space-between'}}>
          <Text style={[textStyles.SB3, { color: colors.Black }]}>보호자 메시지</Text>
          <TouchableOpacity style={{flexDirection:'row', alignItems:'center', gap:8}} onPress={() => navigation.navigate('MessageList', {studentName: studentInfo.name})}>
            <Text style={[textStyles.R2, { color: colors.Gray06 }]}>목록보기</Text>
            <ArrowIcon width={16} height={16} color={colors.Gray06}/>
          </TouchableOpacity>
        </View>
        {!isPending && 
        <MessageItem name={`${studentInfo.name} 어머니`} imagePath={data[0].imagePath} receivedAt={data[0].transferredAt} content={data[0].content}/>
        }
      </ScrollView>
      <View style={{padding:16}}>
        {/* 출근하기 이후 마지막 경유지 출석 완료시 퇴근하기 버튼 활성화, 완료 전까지는 운행중이라는 비활성화 버튼 제공 */}
        <CustomButton title={'보호자에게 전화하기'} onPress={() => {}}/>
      </View>  
    </View>
  );
};

export default StudentDetail;
