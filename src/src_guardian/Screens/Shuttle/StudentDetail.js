import { View, Text, Image } from 'react-native';
import SmileIcon from '../../../assets/icons/SmileIcon.svg';
import { textStyles, colors } from '../../../styles/globalStyle';
import CustomHeader from '../../../components/CustomHeader';

const StudentInfoRow = ({ title, content, isIcon }) => (
  <View>
    <Text style={[textStyles.SB3, { color: colors.Black }]}>{title}</Text>
    <View style={{ height: 8 }} />
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {isIcon && <SmileIcon />}
      {isIcon && <View style={{ width: 8 }} />}
      <Text style={[textStyles.R2, { color: colors.Black }]}>{content}</Text>
    </View>
  </View>
);

const StudentDetail = ({ navigation, route }) => {
  const { studentInfo } = route.params;

  return (
    <View style={{flex:1, backgroundColor:colors.White_Green}}>
      <CustomHeader title="학생 프로필" />
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
        <StudentInfoRow title="정보" content={`${studentInfo.schoolName} ${studentInfo.grade}학년`} isIcon />
        <StudentInfoRow title="대기 장소" content={studentInfo.waypointName} />
        <StudentInfoRow title="특이사항" content={studentInfo.notes} />
      </View>
      <View style={{height:10, backgroundColor:colors.Gray02}} />

    </View>
  );
};

export default StudentDetail;
