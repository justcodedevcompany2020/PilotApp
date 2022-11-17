import React, { Component } from 'react';
import Svg, {Path, Rect, Circle, Defs, Stop, ClipPath, G, Mask} from "react-native-svg";
import { StatusBar } from 'expo-status-bar';
import DropDownPicker from "react-native-custom-dropdown";
import PieChart from 'react-native-expo-pie-chart';
import { VictoryPie } from "victory-native";
import DatePicker from 'react-native-datepicker';
import {AuthContext} from "../AuthContext/context";
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    Text,
    Alert,
    Button,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    ActivityIndicator,
    ImageBackground,
    ScrollView,
    Dimensions,
    Switch,
    FlatList,
    Linking,
    Pressable,
} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import {
    SafeAreaView,
    SafeAreaProvider,
    SafeAreaInsetsContext,
    useSafeAreaInsets,
    initialWindowMetrics,
} from 'react-native-safe-area-context';
import TopMenu from "../includes/header_menu";



export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
             headerMenuPopup: false,
             report_status: 'In progress',
             report_status_progress: true,
             report_start_time: '2022-07-15 15:00',
             report_end_time: '2022-07-23 10:00',
             undervoltage: '12.4%',
             overvoltage: '9.7%',
             power_outages: '1.2%',
             impulse_surges: '14',
             consumption: '75.5 kWh',
             voltage: '214.4 - 244.9 V',
             amperage: '0.01 - 3.11 A',

        };

    }

    static contextType = AuthContext;

    pressCall = () => {
        const url='tel://+7 (495) 984-21-01'
        Linking.openURL(url)
    }


    handlePress = () => {
        Linking.openURL('mailto://pilot@zis.ru');
    };

    redirectToAddingNew = () => {
        this.props.navigation.navigate("AddingNew");

    }

    redirectToDeviceSetup = () => {
        this.props.navigation.navigate("DeviceSetup");

    }

    redirectToSettings = () => {
        this.props.navigation.navigate("Settings");

    }

    redirectToAllDevices = () => {
        this.props.navigation.navigate("AllDevices");

    }


    redirectToRegistration = () => {
        this.props.navigation.navigate("Registration");

    }



    redirectToImpulseSurges = () => {
        this.props.navigation.navigate("ImpulseSurges");

    }

    redirectToTestMode = () => {
        this.props.navigation.navigate("TestMode", {
            params: this.props.id,
        });

    }

    redirectToUndervoltage = () => {
        this.props.navigation.navigate("Undervoltage");

    }

    redirectToPowerOutages = () => {
        this.props.navigation.navigate("PowerOutages");

    }

    redirectToVoltage = () => {
        this.props.navigation.navigate("Voltage");

    }

    redirectToConsumption = () => {
        this.props.navigation.navigate("Consumption");

    }

    redirectToOsciloscope = () => {
        this.props.navigation.navigate("Osciloscope");

    }

    closeMenu = () => {
        this.setState({
            headerMenuPopup: false
        })
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.getTestReportInfo();
        this.focusListener = navigation.addListener("focus", () => {
            this.getTestReportInfo();


        });

    }

    componentWillUnmount() {
        // Remove the event listener
        if (this.focusListener) {
            this.focusListener();
            // console.log('Bum END')
        }

    }

    getTestReportInfo = async () => {
        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;
        let id = this.props.id;


        console.log(id, 'idddddddddd')

        try {
            fetch(`https://apiv1.zis.ru/tests/`+ id, {
                method: 'GET',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }

            }).then((response) => {
                return response.json()
            }).then((response) => {

                console.log(response, 'test report')

                this.setState({
                    report_start_time: response.start_date,
                    report_end_time: response.end_date,
                    undervoltage: response.undervoltage,
                    overvoltage: response.uppervoltage,
                    power_outages: response.power_outages,
                    impulse_surges:response.impulse_surges,
                    consumption: response.consumption,
                    voltage: response.upper_voltage_trigger,
                    amperage: response.amperage_max,
                })

            })
        } catch (e) {
            console.log(e)
        }
    }

    render() {

        // headerMenuPopup
        if (this.state.headerMenuPopup) {
            return (
                <TopMenu navigation={this.props.navigation} closeMenu={this.closeMenu} />
            )
        }


        return (
            <SafeAreaView style={styles.container} >
                <StatusBar style="dark" />
                <View style={styles.all_devices_general_page_header}>
                    <View style={styles.all_devices_general_page_header_child}>
                        <TouchableOpacity style={styles.title_back_btn_wrapper} onPress={() => {this.redirectToTestMode()}}>
                            <View style={styles.back_btn}>
                                <Svg
                                    width={12}
                                    height={20}
                                    viewBox="0 0 12 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <Path
                                        d="M9.633 0l1.406 1.406-8.297 8.227 8.297 8.226-1.406 1.407L0 9.633 9.633 0z"
                                        fill="#004B84"
                                    />
                                </Svg>
                            </View>
                            <Text style={styles.all_devices_general_page_header_title}>Test report</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.all_devices_general_page_header_menu_btn} onPress={() => {this.setState({headerMenuPopup: true})}}>
                            <Svg
                                width={28}
                                height={25}
                                viewBox="0 0 28 25"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <Path fill="#004B84" d="M0 0H28V3H0z" />
                                <Path fill="#004B84" d="M0 11H28V14H0z" />
                                <Path fill="#004B84" d="M0 22H28V25H0z" />
                            </Svg>
                        </TouchableOpacity>
                    </View>

                </View>
                <ScrollView style={styles.all_devices_general_page_main_wrapper}>

                      <View style={styles.test_report_items_main_wrapper}>
                             <View style={styles.test_report_status_start_end_time_info_items_wrapper}>
                                  <View style={styles.test_report_status_start_end_time_info_item}>
                                       <Text style={styles.test_report_status_start_end_time_info_item_title}>Status</Text>
                                       <View style={styles.test_report_status_start_end_time_info_item_icon_text_box}>
                                           {this.state.report_status_progress &&
                                             <View style={styles.test_report_status_start_end_time_info_item_icon}>
                                                 <Svg
                                                     width={9}
                                                     height={11}
                                                     viewBox="0 0 9 11"
                                                     fill="none"
                                                     xmlns="http://www.w3.org/2000/svg"
                                                 >
                                                     <Path d="M9 5.5L.75 10.263V.737L9 5.5z" fill="#10BCCE" />
                                                 </Svg>
                                             </View>
                                           }
                                           <Text style={styles.test_report_status_start_end_time_info_item_text}>{this.state.report_status}</Text>
                                       </View>

                                  </View>
                                   <View style={styles.test_report_status_start_end_time_info_item}>
                                       <Text style={styles.test_report_status_start_end_time_info_item_title}>Start time</Text>
                                       <Text style={styles.test_report_status_start_time_info}>{this.state.report_start_time}</Text>

                                 </View>
                                   <View style={styles.test_report_status_start_end_time_info_item}>
                                       <Text style={styles.test_report_status_start_end_time_info_item_title}>End time</Text>
                                       <Text style={styles.test_report_status_end_time_info}>{this.state.report_end_time}</Text>

                                 </View>
                                   <TouchableOpacity style={styles.report_status_button} onPress={() => {this.redirectToOsciloscope()}}>
                                        <Text style={styles.report_status_button_text}>Osciloscope</Text>
                                   </TouchableOpacity>
                             </View>
                             <View style={styles.report_chart_main_info_items_wrapper}>
                                 <View  style={styles.report_chart_main_info_item_box}>
                                     <View style={styles.report_chart_main_info_item}>
                                         <Text style={styles.report_chart_main_info_item_title}>Power</Text>
                                         <View style={[styles.report_chart_main_info_item_img, {  width: 242, height: 242,}]}>
                                             <Image style={styles.report_chart_main_info_item_img_child} source={require('../../assets/images/report_chart_img1.png')}/>
                                         </View>
                                     </View>
                                     <View style={[styles.report_chart_main_info_item]}>
                                         <Text style={styles.report_chart_main_info_item_title}>Power outages</Text>
                                         <View style={[styles.report_chart_main_info_item_img, {  width: 313, height: 221,}]}>
                                             <Image style={styles.report_chart_main_info_item_img_child} source={require('../../assets/images/report_chart_img2.png')}/>
                                         </View>
                                     </View>
                                 </View>
                                 <View style={styles.report_chart_details_main_items_wrapper}>
                                     <View style={styles.report_chart_details_item}>
                                         <View style={styles.report_chart_details_item_icon_title_box}>
                                             <View style={styles.report_chart_details_item_icon}>
                                                 <Svg
                                                     width={15}
                                                     height={13}
                                                     viewBox="0 0 15 13"
                                                     fill="none"
                                                     xmlns="http://www.w3.org/2000/svg"
                                                 >
                                                     <Path d="M7.5 0l7.361 12.75H.14L7.5 0z" fill="#EB5757" />
                                                 </Svg>
                                             </View>
                                             <Text style={styles.report_chart_details_item_title}>Undervoltage</Text>
                                         </View>
                                         <TouchableOpacity style={styles.report_chart_details_item_button} onPress={() => {this.redirectToUndervoltage()}}>
                                             <Text style={styles.report_chart_details_item_button_text}>{this.state.undervoltage  ? this.state.undervoltage: 0 }</Text>
                                             <View style={styles.report_chart_details_item_button_icon}>
                                                 <Svg
                                                     width={12}
                                                     height={20}
                                                     viewBox="0 0 12 20"
                                                     fill="none"
                                                     xmlns="http://www.w3.org/2000/svg"
                                                 >
                                                     <Path
                                                         d="M1.406 19.266L0 17.859l8.297-8.226L0 1.406 1.406 0l9.633 9.633-9.633 9.633z"
                                                         fill="#004B84"
                                                     />
                                                 </Svg>
                                             </View>
                                         </TouchableOpacity>
                                     </View>
                                     <View style={styles.report_chart_details_item}>
                                         <View style={styles.report_chart_details_item_icon_title_box}>
                                             <View style={styles.report_chart_details_item_icon}>
                                                 <Svg
                                                     width={15}
                                                     height={13}
                                                     viewBox="0 0 15 13"
                                                     fill="none"
                                                     xmlns="http://www.w3.org/2000/svg"
                                                 >
                                                     <Path d="M7.5 13L.139.25H14.86L7.5 13z" fill="#F2994A" />
                                                 </Svg>
                                             </View>
                                             <Text style={styles.report_chart_details_item_title}>Overvoltage</Text>
                                         </View>
                                         <TouchableOpacity style={styles.report_chart_details_item_button}>
                                             <Text style={styles.report_chart_details_item_button_text}>{this.state.overvoltage ? this.state.overvoltage : 0}</Text>
                                             <View style={styles.report_chart_details_item_button_icon}>
                                                 <Svg
                                                     width={12}
                                                     height={20}
                                                     viewBox="0 0 12 20"
                                                     fill="none"
                                                     xmlns="http://www.w3.org/2000/svg"
                                                 >
                                                     <Path
                                                         d="M1.406 19.266L0 17.859l8.297-8.226L0 1.406 1.406 0l9.633 9.633-9.633 9.633z"
                                                         fill="#004B84"
                                                     />
                                                 </Svg>
                                             </View>
                                         </TouchableOpacity>
                                     </View>
                                     <View style={styles.report_chart_details_item}>
                                         <View style={styles.report_chart_details_item_icon_title_box}>
                                             <View style={styles.report_chart_details_item_icon}>
                                                 <Svg
                                                     width={11}
                                                     height={13}
                                                     viewBox="0 0 11 13"
                                                     fill="none"
                                                     xmlns="http://www.w3.org/2000/svg"
                                                 >
                                                     <Path fill="#BDBDBD" d="M0 0H4V13H0z" />
                                                     <Path fill="#BDBDBD" d="M7 0H11V13H7z" />
                                                 </Svg>
                                             </View>
                                             <Text style={styles.report_chart_details_item_title}>Power outages</Text>
                                         </View>
                                         <TouchableOpacity style={styles.report_chart_details_item_button} onPress={() => {this.redirectToPowerOutages()}}>
                                             <Text style={styles.report_chart_details_item_button_text}>{this.state.power_outages ? this.state.power_outages : 0}</Text>
                                             <View style={styles.report_chart_details_item_button_icon}>
                                                 <Svg
                                                     width={12}
                                                     height={20}
                                                     viewBox="0 0 12 20"
                                                     fill="none"
                                                     xmlns="http://www.w3.org/2000/svg"
                                                 >
                                                     <Path
                                                         d="M1.406 19.266L0 17.859l8.297-8.226L0 1.406 1.406 0l9.633 9.633-9.633 9.633z"
                                                         fill="#004B84"
                                                     />
                                                 </Svg>
                                             </View>
                                         </TouchableOpacity>
                                     </View>
                                     <View style={styles.report_chart_details_item}>
                                         <View style={styles.report_chart_details_item_icon_title_box}>
                                             <View style={styles.report_chart_details_item_icon}>
                                                 <Svg
                                                     width={15}
                                                     height={12}
                                                     viewBox="0 0 15 12"
                                                     fill="none"
                                                     xmlns="http://www.w3.org/2000/svg"
                                                 >
                                                     <Path d="M0 9.167V12h15V9.167H9L7.5 0l-2 9.167H0z" fill="#004B84" />
                                                 </Svg>
                                             </View>
                                             <Text style={styles.report_chart_details_item_title}> Impulse surges (above 325V)</Text>
                                         </View>
                                         <TouchableOpacity style={styles.report_chart_details_item_button} onPress={() => {this.redirectToImpulseSurges()}}>
                                             <Text style={styles.report_chart_details_item_button_text}>{this.state.impulse_surges ? this.state.impulse_surges : 0}</Text>
                                             <View style={styles.report_chart_details_item_button_icon}>
                                                 <Svg
                                                     width={12}
                                                     height={20}
                                                     viewBox="0 0 12 20"
                                                     fill="none"
                                                     xmlns="http://www.w3.org/2000/svg"
                                                 >
                                                     <Path
                                                         d="M1.406 19.266L0 17.859l8.297-8.226L0 1.406 1.406 0l9.633 9.633-9.633 9.633z"
                                                         fill="#004B84"
                                                     />
                                                 </Svg>
                                             </View>
                                         </TouchableOpacity>
                                     </View>
                                     <View style={styles.report_chart_details_item}>
                                         <View style={styles.report_chart_details_item_icon_title_box}>
                                             <View style={styles.report_chart_details_item_icon}>
                                                 <Svg
                                                     width={14}
                                                     height={14}
                                                     viewBox="0 0 14 14"
                                                     fill="none"
                                                     xmlns="http://www.w3.org/2000/svg"
                                                 >
                                                     <Circle cx={7} cy={7} r={7} fill="#10BCCE" />
                                                     <Path
                                                         d="M4 7.571h2.756L5.798 11 10 6.429H7.244L8.2 3 4 7.571z"
                                                         fill="#fff"
                                                     />
                                                 </Svg>
                                             </View>
                                             <Text style={styles.report_chart_details_item_title}>Consumption</Text>
                                         </View>
                                         <TouchableOpacity style={styles.report_chart_details_item_button} onPress={() => {this.redirectToConsumption()}}>
                                             <Text style={styles.report_chart_details_item_button_text}>{this.state.consumption ? this.state.consumption : 0}</Text>
                                             <View style={styles.report_chart_details_item_button_icon}>
                                                 <Svg
                                                     width={12}
                                                     height={20}
                                                     viewBox="0 0 12 20"
                                                     fill="none"
                                                     xmlns="http://www.w3.org/2000/svg"
                                                 >
                                                     <Path
                                                         d="M1.406 19.266L0 17.859l8.297-8.226L0 1.406 1.406 0l9.633 9.633-9.633 9.633z"
                                                         fill="#004B84"
                                                     />
                                                 </Svg>
                                             </View>
                                         </TouchableOpacity>
                                     </View>
                                     <View style={styles.report_chart_details_item}>
                                         <View style={styles.report_chart_details_item_icon_title_box}>
                                             <View style={styles.report_chart_details_item_icon}>
                                                 <Svg
                                                     width={14}
                                                     height={14}
                                                     viewBox="0 0 14 14"
                                                     fill="none"
                                                     xmlns="http://www.w3.org/2000/svg"
                                                 >
                                                     <Circle cx={7} cy={7} r={7} fill="#10BCCE" />
                                                     <Path
                                                         d="M5.557 4.182l1.406 4.42h.054l1.41-4.42H9.79L7.784 10H6.2L4.19 4.182h1.367z"
                                                         fill="#fff"
                                                     />
                                                 </Svg>
                                             </View>
                                             <Text style={styles.report_chart_details_item_title}>Voltage</Text>
                                         </View>
                                         <TouchableOpacity style={styles.report_chart_details_item_button} onPress={() => {this.redirectToVoltage()}}>
                                             <Text style={styles.report_chart_details_item_button_text}>{this.state.voltage ? this.state.voltage : 0}</Text>
                                             <View style={styles.report_chart_details_item_button_icon}>
                                                 <Svg
                                                     width={12}
                                                     height={20}
                                                     viewBox="0 0 12 20"
                                                     fill="none"
                                                     xmlns="http://www.w3.org/2000/svg"
                                                 >
                                                     <Path
                                                         d="M1.406 19.266L0 17.859l8.297-8.226L0 1.406 1.406 0l9.633 9.633-9.633 9.633z"
                                                         fill="#004B84"
                                                     />
                                                 </Svg>
                                             </View>
                                         </TouchableOpacity>
                                     </View>
                                     <View style={styles.report_chart_details_item}>
                                         <View style={styles.report_chart_details_item_icon_title_box}>
                                             <View style={styles.report_chart_details_item_icon}>
                                                 <Svg
                                                     width={14}
                                                     height={14}
                                                     viewBox="0 0 14 14"
                                                     fill="none"
                                                     xmlns="http://www.w3.org/2000/svg"
                                                 >
                                                     <Circle cx={7} cy={7} r={7} fill="#10BCCE" />
                                                     <Path
                                                         d="M5.509 10H4.19L6.2 4.182h1.585L9.79 10H8.472L7.014 5.511H6.97L5.509 10zm-.083-2.287H8.54v.96H5.426v-.96z"
                                                         fill="#fff"
                                                     />
                                                 </Svg>
                                             </View>
                                             <Text style={styles.report_chart_details_item_title}>Amperage</Text>
                                         </View>
                                         <TouchableOpacity style={styles.report_chart_details_item_button}>
                                             <Text style={styles.report_chart_details_item_button_text}>{this.state.amperage ? this.state.amperage : 0}</Text>
                                             <View style={styles.report_chart_details_item_button_icon}>
                                                 <Svg
                                                     width={12}
                                                     height={20}
                                                     viewBox="0 0 12 20"
                                                     fill="none"
                                                     xmlns="http://www.w3.org/2000/svg"
                                                 >
                                                     <Path
                                                         d="M1.406 19.266L0 17.859l8.297-8.226L0 1.406 1.406 0l9.633 9.633-9.633 9.633z"
                                                         fill="#004B84"
                                                     />
                                                 </Svg>
                                             </View>
                                         </TouchableOpacity>
                                     </View>
                                     <View style={styles.report_stop_now_button_box}>
                                         <TouchableOpacity style={styles.report_stop_now_button}>
                                             <Text style={styles.report_stop_now_button_text}>Stop now</Text>
                                         </TouchableOpacity>
                                     </View>

                                 </View>
                             </View>
                      </View>

                </ScrollView>


            </SafeAreaView>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        width: "100%",
        height: "100%",
        paddingTop: 48,
        paddingBottom: 29,


    },

    all_devices_general_page_main_wrapper: {
        width: '100%',
        flex: 1,
        // paddingHorizontal: 25,

    },

    all_devices_general_page_header: {
        width: '100%',
        marginBottom: 28,
        paddingBottom: 25,
        borderBottomWidth: 1,
        borderBottomColor: '#004B84',

    },
    all_devices_general_page_header_child: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 21,
        paddingLeft: 19,
    },
    all_devices_general_page_header_title: {
        fontWeight: '400',
        fontSize: 24,
        color: '#004B84',
    },


    header_menu_popup: {
        backgroundColor:  '#ffffff',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 999,
        zIndex: 999999,
        width: '100%',
        height: windowHeight + 40,
        position: 'absolute',
        left: 0,
        top: 0,
        // alignSelf: 'center',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    header_menu_popup_wrapper: {
        width: '100%',
        maxWidth: 280,
        backgroundColor: '#004B84',
        height: '100%',
        paddingHorizontal: 22,
        paddingBottom: 70,
        paddingTop: 70,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        position: 'relative'

    },
    header_menu_popup_close_btn: {
        position: 'absolute',
        right: 20,
        top: 60,
    },
    header_menu_popup_logo: {
        marginBottom: 28,
    },
    header_menu_popup_logout_button: {
        marginBottom: 40,
        borderWidth: 1,
        borderColor: '#FFFFFF',
        paddingHorizontal: 14,
        paddingVertical: 17,
        flexDirection: 'row',
        alignItems: 'center',
    },
    header_menu_popup_logout_button_text: {
        marginRight: 16,
        fontWeight: '400',
        color: '#ffffff',
        fontSize: 12,
    },
    header_menu_popup_nav_list_item_text: {
        fontWeight: '400',
        color: '#ffffff',
        fontSize: 16,
    },
    header_menu_popup_nav_list_item: {
        marginBottom: 25,
    },
    // header_menu_popup_logo_nav_btn_wrapper:{
    //    marginBottom: 110,
    // },

    header_menu_popup_call_btn: {
        marginBottom: 5,
    },
    header_menu_popup_call_btn_text: {
        fontWeight: '700',
        color: '#ffffff',
        fontSize: 24,

    },
    header_menu_popup_email_btn_text: {
        fontWeight: '400',
        color: '#ffffff',
        fontSize: 16,

    },

    header_menu_popup_email_btn: {
        marginBottom: 36
    },


    title_back_btn_wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    back_btn:{
        marginRight: 8,
    },

    test_report_status_start_end_time_info_items_wrapper: {
        width: '100%',
        marginBottom: 23,
        paddingHorizontal: 25,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    report_chart_main_info_item_box: {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        marginBottom: 22,
    },
    test_report_status_start_end_time_info_item: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 21,
    },
    test_report_status_start_end_time_info_item_title: {
        fontWeight: '400',
        fontSize: 16,
        color: '#4A4A4A',
    },

    test_report_status_start_end_time_info_item_icon_text_box: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    test_report_status_start_end_time_info_item_text: {
        fontWeight: '400',
        fontSize: 16,
        color: '#4A4A4A',
        marginLeft: 6,
    },
    test_report_status_start_time_info: {
        color: '#10BCCE',
        opacity: 0.6,
        fontWeight: '600',
        fontSize: 16,
    },

    test_report_status_end_time_info: {
        color: '#10BCCE',
        fontWeight: '600',
        fontSize: 16,
    },

    report_status_button: {
        width: '100%',
        height: 40,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#004B84',
    },
    report_status_button_text: {
        color: '#ffffff',
        fontWeight: '400',
        fontSize: 16,
    },
    report_chart_main_info_items_wrapper: {
       width: '100%',
    },
    report_chart_main_info_item: {
        marginBottom: 25,
        paddingHorizontal: 35,
    },
    report_chart_main_info_item_title: {
        color: '#004B84',
        fontWeight: '400',
        fontSize: 16,
        marginBottom: 18,
    },
    report_chart_main_info_item_img: {
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    report_chart_main_info_item_img_child: {
        width: '100%',
        height: '100%',
    },
    report_chart_details_item: {
        width: '100%',
        paddingLeft: 18,
        paddingRight: 24,
        paddingBottom: 15,
        marginBottom: 22,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',

    },
    report_chart_details_item_icon_title_box: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    report_chart_details_item_title: {
        marginLeft: 13,
        fontWeight: '400',
        fontSize: 16,
        color: '#4A4A4A',
    },

    report_chart_details_item_button: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    report_chart_details_item_button_text: {
        color: '#10BCCE',
        fontWeight: '600',
        fontSize: 16,
        marginRight: 15,
    },
    report_stop_now_button: {
        width: '100%',
        height: 40,
        backgroundColor: '#EB5757',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    report_stop_now_button_text: {
        color: '#ffffff',
        fontWeight: '400',
        fontSize: 16,
    },
    report_stop_now_button_box: {
        width: '100%',
        paddingLeft: 18,
        paddingRight: 31,
    }
});