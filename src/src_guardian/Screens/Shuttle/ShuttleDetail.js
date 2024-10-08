import { useLayoutEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { colors, textStyles } from '../../../styles/globalStyle';
import BackIcon from '../../../assets/icons/BackIcon.svg';
import MapIcon from '../../../assets/icons/MapIcon.svg';
import { formatDate } from '../../../utils/formatDate';
import SelectedGoToSchool from '../../../assets/icons/SelectedGoToSchool.svg';
import SelectedDropOffSchool from '../../../assets/icons/SelectedDropOffSchool.svg';
import NotSelectedGoToSchool from '../../../assets/icons/NotSelectedGoToSchool.svg';
import NotSelectedDropOffSchool from '../../../assets/icons/NotSelectedDropOffSchool.svg';

const ShuttleDetail = ({ navigation }) => {
  const [ goToSchoolStatus, setGoToSchoolStatus ] = useState(true);
  const [dropOffSchoolStatus, setDropOfSchoolStatus] = useState(false);

  // today 날짜
  const formattedDate = formatDate(); 

  // 등하교 버튼 상태 관리
  const handleGoToSchoolPress = () => {
    setGoToSchoolStatus(true);
    setDropOfSchoolStatus(false); // 등교 비활성화
  };

  const handleDropOffSchoolPress = () => {
    setGoToSchoolStatus(false);
    setDropOfSchoolStatus(true); // 하교 비활성화
  };

  // 상단 헤더 적용
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ alignItems: 'center', gap: 4 }}>
          <Text style={[textStyles.B1, { color: colors.Black }]}> 아주초등학교 </Text>
          <Text style={[textStyles.B2, { color: colors.Black }]}> 네모 그룹 </Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ paddingLeft: 16 }}>
          <BackIcon />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => { navigation.navigate('ShuttleMap') }} style={{ paddingRight: 16 }}>
          <MapIcon />
        </TouchableOpacity>
      ),
      headerStyle: {
        elevation: 0, // Android에서의 그림자 제거
        shadowOpacity: 0, // iOS에서의 그림자 제거
        height: 80, 
      },
    });
  }, [navigation]);



  return (
    <View style={{ backgroundColor:'white', flex:1 }}>
      <View style={{ height: 16 }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap:8 }}>
        <Text style={[textStyles.M2, {color:colors.Black, paddingLeft:32, paddingRight:8}]}>{formattedDate}</Text>
        {/* 등교 버튼 */}
        <TouchableOpacity onPress={handleGoToSchoolPress}>
          {goToSchoolStatus ? <SelectedGoToSchool /> : <NotSelectedGoToSchool />}
        </TouchableOpacity>
        {/* 하교 버튼 */}
        <TouchableOpacity onPress={handleDropOffSchoolPress}>
          {dropOffSchoolStatus ? <SelectedDropOffSchool /> : <NotSelectedDropOffSchool />}
        </TouchableOpacity>
      </View>
      <View style={{ height: 24 }} />
      
    </View>
  );
};

export default ShuttleDetail;

