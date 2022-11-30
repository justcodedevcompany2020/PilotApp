import React, { Component } from 'react';
import Svg, {Path, Rect, Circle, Defs, Stop, ClipPath, G, Mask} from "react-native-svg";
import { StatusBar } from 'expo-status-bar';
import DropDownPicker from "react-native-custom-dropdown";
import PieChart from 'react-native-expo-pie-chart';
import { VictoryPie } from "victory-native";
import {AuthContext} from "../AuthContext/context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from "i18n-js";
import {en, ru} from "../../i18n/supportedLanguages";



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
            switchValue: false,
            reports: [
                {
                    id: 1,
                    report_status_icon_progress:  true,
                    report_status_icon_delete:  false,
                    report_status_text: 'In progress',
                    from: '2022-07-01 05:00',
                    to: '2022-07-04 05:00',
                    report_detail1: '1’445.53W',
                    report_detail2: '214.4 - 244.9V',
                    report_detail3: '0.01 - 3.11A',
                    graphicDataDetailsRed: '12.4%',
                    graphicDataDetailsOrange: '9.7%',
                    graphicDataDetailsGrey: '1.2%',
                    report_status_info_box: true,
                },
                {
                    id: 2,
                    report_status_icon_progress:  false,
                    report_status_icon_delete:  true,
                    report_status_text: 'Will be delete at 2022-07-22',
                    from: '2022-06-22 02:42',
                    to: '2022-07-04 08:42',
                    report_detail1: '545.53W',
                    report_detail2: '221.6 - 239.5V',
                    report_detail3: '4.41 - 4.73A',
                    graphicDataDetailsRed: '12.4%',
                    graphicDataDetailsOrange: '9.7%',
                    graphicDataDetailsGrey: '1.2%',
                    report_status_info_box: false,
                },
            ],
            graphicData: [

                { y: 77, x: '76.7%'},
                { y: 25, x: '9.7%'},
                { y: 15, x: '12.4%'},
                { y: 6, x: '1.2%'},


            ],
            graphicColor: ['#10BCCE', '#EB5757', '#F2994A', '#BDBDBD',  ],
            test_mode_info: [],
            language: en,
            language_name: 'en',

        };

    }


    static contextType = AuthContext;

    setLanguageFromStorage = async ()=> {

        await AsyncStorage.getItem('language',(err,item) => {

            let language = item ? JSON.parse(item) : {};

            if (language.hasOwnProperty('language')) {
                this.setState({
                    language: language.language == 'ru' ? ru : language.language == 'en' ?  en : en ,
                    language_name: language.language == 'ru' ? 'ru' : language.language == 'en' ?  'en'  : 'en',
                    selectedLanguage:  language.language == 'ru' ? 'ru' : language.language == 'en' ?  'en'  : 'en'
                })
            } else {
                this.setState({
                    language: en,
                    language_name: 'en'
                })
            }

        })

    }



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

    toggleSwitch = (value) => {
        this.setState({ switchValue: value });
    };

    redirectToDetailsGeneralPage = () => {
        this.props.navigation.navigate("DetailsGeneralPage", {
            params: this.props.id
        });

    }
    redirectToNewTest = () => {
        this.props.navigation.navigate("NewTest", {
            params: this.props.id,
        });


    }

    redirectToTestReport = (report_id) => {
        this.props.navigation.navigate("TestReport", {
            params: report_id,
            params2: this.props.id,
        });
    }



    componentDidMount() {
        const { navigation } = this.props;
        this.setLanguageFromStorage();
        this.getTestModeInfo();
        this.focusListener = navigation.addListener("focus", () => {
        this.setLanguageFromStorage();
        this.getTestModeInfo();



        });

    }

    componentWillUnmount() {
        // Remove the event listener
        if (this.focusListener) {
            this.focusListener();
            // console.log('Bum END')
        }

    }

    getTestModeInfo = async () => {
        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;
        let id = this.props.id;

        console.log(id, 'this.props.id')

        try {
            fetch(`https://apiv1.zis.ru/tests/device/`+ id, {
                method: 'GET',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }

            }).then((response) => {
                return response.json()
            }).then((response) => {

                console.log(response, 'test mode')



               this.setState({
                   test_mode_info: response,
               })

            })
        } catch (e) {
            console.log(e)
        }
    }

    checkInProgress = (dateStart, dateEnd, date) =>{
        return date > dateStart && date < dateEnd;
    }
    checkScheduled = (dateStart, date) =>{
        return date < dateStart ;
    }

    checkWillBeDeleted = (dateEnd, date) =>{
        return date > dateEnd ;
    }

    getWillBeDeletedDate = (item) => {
        let date = new Date(item.end_date);
        let dateCopy = new Date(date.getTime());
        dateCopy.setDate(dateCopy.getDate());

        let day = dateCopy.getDate() <= 9 ? `0${dateCopy.getDate()}` : dateCopy.getDate();
        let month = dateCopy.getMonth() + 2;
        month = month <= 9 ? `0${month}` : month;
        let year = dateCopy.getFullYear();
        let new_date =  year + '-' + month + '-' + day;

        return  new_date
    }

    checkTestReportStatus = (item) => {
        let report_start_time = new Date(item.start_date);
        let report_end_time   = new Date(item.end_date);
        let current_date      = new Date();

        console.log(report_start_time, report_end_time, current_date)

        let test_report_status = '';

        if(this.checkInProgress(report_start_time,report_end_time,current_date)) {
            test_report_status = 'in_progress';
        } else if(this.checkScheduled(report_start_time, current_date)) {
            test_report_status = 'scheduled'; // запланирован;
        } else if(this.checkWillBeDeleted(report_end_time, current_date)) {
            test_report_status = 'will_be_deleted'; // должен быть удален;
        }

        return test_report_status

    }


    closeMenu = () => {
        this.setState({
            headerMenuPopup: false
        })
    }

    render() {


        return (
            <SafeAreaView style={styles.container} >

                {this.state.headerMenuPopup &&
                    <TopMenu navigation={this.props.navigation} closeMenu={this.closeMenu} />
                }

                <View style={[styles.container, { paddingTop: 25, paddingBottom: 29}]} >
                    <StatusBar style="dark" />
                    <View style={styles.all_devices_general_page_header}>
                        <View style={styles.all_devices_general_page_header_child}>
                            <TouchableOpacity style={styles.title_back_btn_wrapper} onPress={() => {this.redirectToDetailsGeneralPage()}}>
                                <View style={styles.back_btn}>
                                    <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <Path d="M9.633 0l1.406 1.406-8.297 8.227 8.297 8.226-1.406 1.407L0 9.633 9.633 0z" fill="#004B84"/>
                                    </Svg>
                                </View>
                                <Text style={styles.all_devices_general_page_header_title}>{this.state.language.test_mode}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.all_devices_general_page_header_menu_btn} onPress={() => {this.setState({headerMenuPopup: true})}}>
                                <Svg width={28} height={25} viewBox="0 0 28 25" fill="none" xmlns="http://www.w3.org/2000/svg"><Path fill="#004B84" d="M0 0H28V3H0z" /><Path fill="#004B84" d="M0 11H28V14H0z" /><Path fill="#004B84" d="M0 22H28V25H0z" />
                                </Svg>
                            </TouchableOpacity>
                        </View>


                    </View>
                    <ScrollView style={styles.all_devices_general_page_main_wrapper}>

                        {this.state.test_mode_info.length == 0 &&
                            <View style={styles.test_not_found_title_wrapper}>
                                <Text style={styles.test_not_found_title}>{this.state.language.test_not_found}</Text>
                            </View>
                        }

                        {this.state.test_mode_info.map((report, index) => {

                            return (
                                <View style={styles.report_item}  key={index}>

                                    <View style={styles.chart_box_img_report_item_info_main_wrapper}>
                                        {/*<View style={styles.chart_box_img}>*/}
                                        {/*    <Image style={styles.chart_box_img_child} source={require('../../assets/images/chart_box_img.png')}/>*/}
                                        {/*</View>*/}

                                        <View style={styles.report_item_info_main_wrapper}>
                                            <View style={styles.report_item_info_title_icon_box}>

                                                {this.checkTestReportStatus(report) == 'scheduled'  &&

                                                    <View style={styles.report_item_info_icon}>
                                                        <Text style={styles.report_item_info_title}>{this.state.language.scheduled}</Text>

                                                    </View>

                                                }


                                                {this.checkTestReportStatus(report) == 'in_progress'  &&

                                                    <View style={styles.report_item_info_icon}>
                                                        <Svg width={6} height={7} viewBox="0 0 6 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <Path d="M6 3.5L.75 6.531V.47L6 3.5z" fill="#10BCCE" />
                                                        </Svg>
                                                        <Text style={styles.report_item_info_title}>{this.state.language.in_progress}</Text>

                                                    </View>

                                                }

                                                {this.checkTestReportStatus(report) == 'will_be_deleted'  &&

                                                    <View style={styles.report_item_info_icon}>
                                                        <Svg width={8} height={8} viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <Path d="M2 6.333c0 .369.298.667.667.667h2.666A.666.666 0 006 6.333v-4H2v4zm4.333-5H5.167L4.833 1H3.167l-.334.333H1.667V2h4.666v-.667z" fill="#EB5757"/>
                                                        </Svg>
                                                        <Text style={styles.report_item_info_title}>Will be deleted {this.getWillBeDeletedDate(report)}</Text>
                                                    </View>

                                                }


                                                <Text style={styles.report_item_info_title}>{report.report_status_text}</Text>

                                            </View>
                                            <View style={styles.report_item_date_info_box}>
                                                <Text style={styles.report_item_date_info}>From {report.start_date}</Text>
                                                <Text style={styles.report_item_date_info}>To {report.end_date}</Text>
                                            </View>
                                            <View style={styles.report_item_details_second_main_wrapper}>
                                                <Text style={styles.report_item_details_second_info}>{report.consumption  ? report.consumption : 0 }</Text>
                                                <Text style={styles.report_item_details_second_info}>{report.voltage_min  ? report.voltage_min : 0 } - {report.voltage_max  ? report.voltage_max : 0 }</Text>
                                                <Text style={styles.report_item_details_second_info}>{report.amperage_min  ? report.amperage_min : 0 } - {report.amperage_max  ? report.amperage_max : 0 }</Text>

                                            </View>

                                        </View>
                                    </View>

                                    <View style={styles.report_btn_status_info_wrapper}>
                                        <TouchableOpacity style={styles.report_btn} onPress={() => this.redirectToTestReport(report.id)}>
                                            <Text style={styles.report_btn_text}>{this.state.language.report}</Text>
                                        </TouchableOpacity>
                                        {report.report_status_info_box &&
                                        <TouchableOpacity style={styles.report_status_info_box}>
                                            <Text style={styles.report_status_info}>{this.state.language.oscilloscope}</Text>
                                        </TouchableOpacity>
                                        }

                                    </View>

                                </View>

                            );
                        })}




                    </ScrollView>

                    <View style={styles.all_devices_general_page_footer}>
                        <TouchableOpacity style={styles.start_a_new_test_button} onPress={() => {this.redirectToNewTest()}}>
                            <Text style={styles.start_a_new_test_button_text}>{this.state.language.start_new_test}</Text>
                        </TouchableOpacity>

                    </View>
                </View>



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
    },

    all_devices_general_page_main_wrapper: {
        width: '100%',
        flex: 1,
        paddingHorizontal: 25,
    },

    all_devices_general_page_header: {
        width: '100%',
        marginBottom: 21,
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
        fontSize: 22,
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


    report_item: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        marginBottom: 42,
    },
    chart_box_img_report_item_info_main_wrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    report_item_info_title_icon_box: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 2,
    },

    chart_box_img: {
        width: 60,
        height: 60,
        resizeMode: 'cover',
        marginRight: 10,
    },
    chart_box_img_child: {
        width: '100%',
        height: '100%',
    },
    report_item_info_title: {
        fontWeight: '400',
        fontSize: 8,
        color: '#4A4A4A',
        marginLeft: 3
    },
    report_item_date_info: {
        fontWeight: '500',
        fontSize: 12,
        color: '#004B84',
        lineHeight: 17,
    },
    report_item_details_second_main_wrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    report_item_details_second_info: {
        fontWeight: '400',
        fontSize: 8,
        color: '#10BCCE',
        marginRight: 12,
    },
    report_btn: {
        width: 78,
        height: 40,
        backgroundColor: '#004B84',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    report_btn_text: {
        color: '#ffffff',
        fontWeight: '400',
        fontSize: 16,
    },
    report_status_info_box: {
        width: 78,
        height: 20,
        backgroundColor: '#004B84',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 1,
    },
    report_status_info: {
        color: '#ffffff',
        fontWeight: '400',
        fontSize: 8,
    },
    report_item_date_info_box: {
        marginBottom: 2
    },
    start_a_new_test_button: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        height: 40,
        backgroundColor: '#004B84',
    },
    start_a_new_test_button_text: {
        color: '#ffffff',
        fontWeight: '400',
        fontSize: 16,
    },
    test_not_found_title_wrapper: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        paddingTop: 200
    },
    test_not_found_title: {
        fontSize: 20,
        color: '#004B84',
        fontWeight: '500',
        textAlign: 'center',
    },
    all_devices_general_page_footer: {
        width: '100%',
        paddingHorizontal: 21,
    },
    report_item_info_icon: {
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    }
});
