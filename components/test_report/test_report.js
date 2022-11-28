import React, { Component } from 'react';
import Svg, {Path, Rect, Circle, Defs, Stop, ClipPath, G, Mask} from "react-native-svg";
import { StatusBar } from 'expo-status-bar';
import DropDownPicker from "react-native-custom-dropdown";
import {
    LineChart,
    BarChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart,
    PieChart
} from "react-native-chart-kit";
import { VictoryPie } from "victory-native";
import DatePicker from 'react-native-datepicker';
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
const screenWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get('window').height;

import {
    SafeAreaView,
    SafeAreaProvider,
    SafeAreaInsetsContext,
    useSafeAreaInsets,
    initialWindowMetrics,
} from 'react-native-safe-area-context';
import TopMenu from "../includes/header_menu";

import { DonutChart } from "react-native-circular-chart";
const chartConfig = {
    color: (opacity = 1) => `silver`,
};

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
             headerMenuPopup: false,
             report_status: 'In progress',
             report_status_progress: true,
             report_start_time: '',
             report_end_time: '',
             undervoltage: 0,
             overvoltage: 0,
             power_outages: 0,
             impulse_surges: '14',
             consumption: '75.5 kWh',
             voltage: '214.4 - 244.9 V',
             amperage: '0.01 - 3.11 A',
             loaded: true,
             blue_chart_data: 0,
             undervoltage_limit: 0,
             overvoltage_limit: 0,

            language: en,
            language_name: 'en',
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
        this.props.navigation.navigate("ImpulseSurges", {
            params: this.props.id,
            params2: this.props.device_id,
            impulse_surges: this.state.impulse_surges
        });

    }

    redirectToPower = () => {
        this.props.navigation.navigate("Power", {
            params: this.props.id,
            params2: this.props.device_id
        });
    }

    redirectToTestMode = () => {
        console.log(this.props.id)

        this.props.navigation.navigate("TestMode", {
            params: this.props.device_id,
        });

    }

    redirectToUndervoltage = () => {
        this.props.navigation.navigate("Undervoltage", {
            params: this.props.id,
            params2: this.props.device_id,
            params3: this.state.undervoltage_limit
        });
    }

    redirectToOvervoltage = () => {
        this.props.navigation.navigate("Overvoltage", {
            params: this.props.id,
            params2: this.props.device_id,
            params3: this.state.overvoltage_limit
        });

    }

    redirectToPowerOutages = () => {
        this.props.navigation.navigate("PowerOutages", {
            params: this.props.id,
            params2: this.props.device_id,
        });

    }

    redirectToVoltage = () => {
        this.props.navigation.navigate("Voltage", {
            params: this.props.id,
            params2: this.props.device_id,
            params3: this.state.voltage ? this.state.voltage : 0,
            voltage_min: this.state.voltage_min ? this.state.voltage_min : 0,
            voltage_max: this.state.voltage_max ? this.state.voltage_max : 0
        });
    }

    redirectToAmperage = () => {

        this.props.navigation.navigate("Amperage", {
            params: this.props.id,
            params2: this.props.device_id,
            amperage_min: this.state.amperage_min,
            amperage_max: this.state.amperage_max
        });
    }

    redirectToConsumption = () => {
        this.props.navigation.navigate("Consumption", {
            params: this.props.id,
            params2: this.props.device_id,
            params3: this.state.consumption ? this.state.consumption : 0
        });

    }

    redirectToOsciloscope = () => {
        this.props.navigation.navigate("Osciloscope");

    }

    closeMenu = () => {
        this.setState({
            headerMenuPopup: false
        })
    }


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



    componentDidMount() {
        const { navigation } = this.props;
        this.setLanguageFromStorage();
        this.getTestReportInfo();
        this.focusListener = navigation.addListener("focus", () => {
            this.setLanguageFromStorage();
            this.getTestReportInfo();
        });
    }

    componentWillUnmount() {
        if (this.focusListener) {
            this.focusListener();
        }
    }

    getTestReportInfo = async () => {
        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr   = 'Bearer ' + userToken;
        let id        = this.props.id;

        try {
        } catch (e) {
            console.log(e)
        }
        fetch(`https://apiv1.zis.ru/tests/`+ id, {
            method: 'GET',
            headers: {
                'Authorization': AuthStr,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            return response.json()
        }).then( async (response) => {

            console.log(response, 'test report')

            let report_start_time = new Date(response.start_date);
            let report_end_time   = new Date(response.end_date);
            let current_date      = new Date();

            let test_report_status = '';

            if(this.checkInProgress(report_start_time,report_end_time,current_date)) {
                test_report_status = 'in_progress';
            } else if(this.checkScheduled(report_start_time, current_date)) {
                test_report_status = 'scheduled'; // запланирован;
            } else if(this.checkWillBeDeleted(report_end_time, current_date)) {
                test_report_status = 'will_be_deleted'; // должен быть удален;
            }


            let undervoltage_limit = response.lower_voltage_trigger // Undervoltage limit желтый
            let overvoltage_limit = response.upper_voltage_trigger // Overvoltage (Uppervoltage) limit красный

            let undervoltage  = response.undervoltage ? parseFloat(response.undervoltage) : 0;
            let overvoltage   = response.overvoltage ? parseFloat(response.overvoltage) : 0;
            let power_outages = response.power_outages ? parseFloat(response.power_outages) : 0;
            let blue_chart_data = (100 - (undervoltage + overvoltage + power_outages));

            await this.setState({
                test_report_status: test_report_status,
                report_start_time: response.start_date,
                report_end_time: response.end_date,
                undervoltage:  undervoltage,
                overvoltage: overvoltage,
                power_outages: power_outages,
                impulse_surges:response.impulse_surges ? response.impulse_surges : 0,
                consumption: response.consumption ? response.consumption : 0,
                voltage: response.upper_voltage_trigger,
                voltage_max: response.voltage_max ? response.voltage_max : 0,
                voltage_min: response.voltage_min ? response.voltage_min : 0,
                amperage: response.amperage_max,
                amperage_min: response.amperage_min ? response.amperage_min : 0,
                amperage_max: response.amperage_max ? response.amperage_max : 0,
                blue_chart_data: blue_chart_data,
                loaded: true,

                undervoltage_limit: undervoltage_limit,
                overvoltage_limit: overvoltage_limit
            })

        })
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

   getCirclePowerChartData = async () => {

        let {undervoltage, overvoltage, power_outages} = this.state;

        undervoltage  = this.state.undervoltage ? parseFloat(this.state.undervoltage) : 0;
        overvoltage   = this.state.overvoltage ? parseFloat(this.state.overvoltage) : 0;
        power_outages = this.state.power_outages ? parseFloat(this.state.power_outages) : 0;

        let blue = (100 - (undervoltage + overvoltage + power_outages));

        let result = {
            undervoltage:undervoltage,
            overvoltage: overvoltage,
            power_outages: power_outages,
            blue: parseFloat(blue)
        };
       console.log(result, 'result')

   }

    getWillBeDeletedDate = () => {
        let date = new Date(this.state.report_end_time);
        let dateCopy = new Date(date.getTime());
        dateCopy.setDate(dateCopy.getDate());

        let day = dateCopy.getDate() <= 9 ? `0${dateCopy.getDate()}` : dateCopy.getDate();
        let month = dateCopy.getMonth() + 2;
        month = month <= 9 ? `0${month}` : month;
        let year = dateCopy.getFullYear();
        let new_date =  year + '-' + month + '-' + day;

        return  new_date
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

                            <TouchableOpacity style={styles.title_back_btn_wrapper} onPress={() => {this.redirectToTestMode()}}>
                                <View style={styles.back_btn}>
                                    <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <Path d="M9.633 0l1.406 1.406-8.297 8.227 8.297 8.226-1.406 1.407L0 9.633 9.633 0z" fill="#004B84"/>
                                    </Svg>
                                </View>
                                <Text style={styles.all_devices_general_page_header_title}>{this.state.language.test_report}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.all_devices_general_page_header_menu_btn} onPress={() => {this.setState({headerMenuPopup: true})}}>
                                <Svg width={28} height={25} viewBox="0 0 28 25" fill="none" xmlns="http://www.w3.org/2000/svg"><Path fill="#004B84" d="M0 0H28V3H0z" /><Path fill="#004B84" d="M0 11H28V14H0z" /><Path fill="#004B84" d="M0 22H28V25H0z" /></Svg>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView style={styles.all_devices_general_page_main_wrapper}>
                        <View style={styles.test_report_items_main_wrapper}>
                            <View style={styles.test_report_status_start_end_time_info_items_wrapper}>
                                <View style={styles.test_report_status_start_end_time_info_item}>

                                    <Text style={styles.test_report_status_start_end_time_info_item_title}>{this.state.language.status}</Text>

                                    <View style={styles.test_report_status_start_end_time_info_item_icon_text_box}>
                                        {this.state.test_report_status == 'scheduled' &&
                                            <View style={styles.test_report_status_start_end_time_info_item_icon}>

                                                <Text style={styles.test_report_status_start_end_time_info_item_text}>
                                                    {this.state.language.scheduled}
                                                </Text>
                                            </View>
                                        }

                                        {this.state.test_report_status == 'in_progress' &&
                                            <View style={styles.test_report_status_start_end_time_info_item_icon}>
                                                <Svg width={9} height={11} viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <Path d="M9 5.5L.75 10.263V.737L9 5.5z" fill="#10BCCE" />
                                                </Svg>
                                                <Text style={styles.test_report_status_start_end_time_info_item_text}>
                                                    {this.state.language.in_progress}
                                                </Text>
                                            </View>
                                        }


                                        {this.state.test_report_status == 'will_be_deleted' &&
                                            <View style={styles.test_report_status_start_end_time_info_item_icon}>
                                                <Svg width={8} height={8} viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" >
                                                    <G clipPath="url(#clip0_8_28)">
                                                        <Path d="M2 6.333c0 .369.298.667.667.667h2.666A.666.666 0 006 6.333v-4H2v4zm4.333-5H5.167L4.833 1H3.167l-.334.333H1.667V2h4.666v-.667z" fill="#EB5757"/>
                                                    </G>
                                                    <Defs>
                                                        <ClipPath id="clip0_8_28">
                                                            <Path fill="#fff" d="M0 0H8V8H0z" />
                                                        </ClipPath>
                                                    </Defs>
                                                </Svg>
                                                <Text style={styles.test_report_status_start_end_time_info_item_text}>
                                                    Will be delete at {this.getWillBeDeletedDate()}
                                                </Text>
                                            </View>
                                        }

                                    </View>

                                </View>

                                <View style={styles.test_report_status_start_end_time_info_item}>
                                    <Text style={styles.test_report_status_start_end_time_info_item_title}>{this.state.language.start_time}</Text>
                                    <Text style={styles.test_report_status_start_time_info}>{this.state.report_start_time}</Text>
                                </View>

                                <View style={styles.test_report_status_start_end_time_info_item}>
                                    <Text style={styles.test_report_status_start_end_time_info_item_title}>{this.state.language.end_time}</Text>
                                    <Text style={styles.test_report_status_end_time_info}>{this.state.report_end_time}</Text>
                                </View>

                                {/*<TouchableOpacity style={styles.report_status_button} onPress={() => {this.redirectToOsciloscope()}}>*/}
                                {/*    <Text style={styles.report_status_button_text}>Osciloscope</Text>*/}
                                {/*</TouchableOpacity>*/}

                            </View>
                            <View style={styles.report_chart_main_info_items_wrapper}>
                                <View  style={styles.report_chart_main_info_item_box}>

                                    <View style={styles.report_chart_main_info_item}>
                                        <Text style={styles.report_chart_main_info_item_title}>{this.state.language.power}</Text>

                                        <View style={[{  width: '100%',  justifyContent:'center', alignItems:'center' }]}>


                                            {this.state.loaded ?

                                                <PieChart
                                                    data={[
                                                        {
                                                            name: "Undervoltage",
                                                            population: this.state.undervoltage ,
                                                            color: "#EB5757",
                                                        },
                                                        {
                                                            name: "Overvoltage",
                                                            population: this.state.overvoltage ,
                                                            color: "#F2994A",
                                                        },
                                                        {
                                                            name: "Power outages",
                                                            population: this.state.power_outages ,
                                                            color: "#BDBDBD",
                                                        },
                                                        {
                                                            name: "Moscow",
                                                            population: this.state.blue_chart_data,
                                                            color: "#10BCCE",
                                                        }]}
                                                    width={screenWidth}
                                                    height={260}
                                                    chartConfig={chartConfig}
                                                    accessor={"population"}
                                                    backgroundColor={"transparent"}
                                                    // paddingLeft={"15"}
                                                    center={[100, 0]}
                                                    // absolute
                                                    hasLegend={false}
                                                />
                                                :

                                                <ActivityIndicator/>
                                            }



                                        </View>

                                    </View>


                                </View>
                                <View style={styles.report_chart_details_main_items_wrapper}>
                                    <View style={styles.report_chart_details_item}>
                                        <View style={styles.report_chart_details_item_icon_title_box}>
                                            <View style={styles.report_chart_details_item_icon}>

                                                <Svg width={15} height={13} viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <Path d="M7.5 13L.139.25H14.86L7.5 13z" fill="#F2994A" />
                                                </Svg>

                                            </View>
                                            <Text style={styles.report_chart_details_item_title}>{this.state.language.undervoltage}</Text>
                                        </View>
                                        <TouchableOpacity style={styles.report_chart_details_item_button}
                                              onPress={() => {
                                                  this.redirectToUndervoltage()
                                              }}
                                        >
                                            <Text style={styles.report_chart_details_item_button_text}>{this.state.undervoltage ? this.state.undervoltage: 0 }%</Text>
                                            <View style={styles.report_chart_details_item_button_icon}>
                                                <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <Path d="M1.406 19.266L0 17.859l8.297-8.226L0 1.406 1.406 0l9.633 9.633-9.633 9.633z" fill="#004B84"/>
                                                </Svg>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.report_chart_details_item}>

                                        <View style={styles.report_chart_details_item_icon_title_box}>

                                            <View style={styles.report_chart_details_item_icon}>
                                                <Svg width={15} height={13} viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <Path d="M7.5 0l7.361 12.75H.14L7.5 0z" fill="#EB5757" />
                                                </Svg>
                                            </View>

                                            <Text style={styles.report_chart_details_item_title}>{this.state.language.overvoltage}</Text>

                                        </View>
                                        <TouchableOpacity
                                            style={styles.report_chart_details_item_button}
                                            onPress={() => {
                                                this.redirectToOvervoltage()
                                            }}
                                        >
                                            <Text style={styles.report_chart_details_item_button_text}>{this.state.overvoltage ? this.state.overvoltage : 0}%</Text>
                                            <View style={styles.report_chart_details_item_button_icon}>
                                                <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <Path d="M1.406 19.266L0 17.859l8.297-8.226L0 1.406 1.406 0l9.633 9.633-9.633 9.633z" fill="#004B84"/>
                                                </Svg>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.report_chart_details_item}>
                                        <View style={styles.report_chart_details_item_icon_title_box}>
                                            <View style={styles.report_chart_details_item_icon}>
                                                <Svg width={11} height={13} viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg"><Path fill="#BDBDBD" d="M0 0H4V13H0z" /><Path fill="#BDBDBD" d="M7 0H11V13H7z" /></Svg>
                                            </View>
                                            <Text style={styles.report_chart_details_item_title}>{this.state.language.power_outages}</Text>
                                        </View>
                                        <TouchableOpacity style={styles.report_chart_details_item_button} onPress={() => {this.redirectToPowerOutages()}}>
                                            <Text style={styles.report_chart_details_item_button_text}>{this.state.power_outages ? this.state.power_outages : 0}%</Text>
                                            <View style={styles.report_chart_details_item_button_icon}>
                                                <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <Path d="M1.406 19.266L0 17.859l8.297-8.226L0 1.406 1.406 0l9.633 9.633-9.633 9.633z" fill="#004B84"/>
                                                </Svg>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.report_chart_details_item}>
                                        <View style={styles.report_chart_details_item_icon_title_box}>
                                            <View style={styles.report_chart_details_item_icon}>
                                                <Svg width={15} height={12} viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <Path d="M0 9.167V12h15V9.167H9L7.5 0l-2 9.167H0z" fill="#004B84" />
                                                </Svg>
                                            </View>
                                            <Text style={styles.report_chart_details_item_title}>{this.state.language.impulse_surges}</Text>
                                        </View>
                                        <TouchableOpacity style={styles.report_chart_details_item_button} onPress={() => {this.redirectToImpulseSurges()}}>
                                            <Text style={styles.report_chart_details_item_button_text}>
                                                {this.state.impulse_surges ? this.state.impulse_surges : 0}
                                            </Text>
                                            <View style={styles.report_chart_details_item_button_icon}>
                                                <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <Path d="M1.406 19.266L0 17.859l8.297-8.226L0 1.406 1.406 0l9.633 9.633-9.633 9.633z" fill="#004B84"/>
                                                </Svg>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.report_chart_details_item}>

                                        <View style={styles.report_chart_details_item_icon_title_box}>
                                            <View style={styles.report_chart_details_item_icon}>
                                                <Svg width={14} height={14} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <Circle cx={7} cy={7} r={7} fill="#10BCCE" />
                                                    <Path d="M4 7.571h2.756L5.798 11 10 6.429H7.244L8.2 3 4 7.571z" fill="#fff"/>
                                                </Svg>
                                            </View>
                                            <Text style={styles.report_chart_details_item_title}>{this.state.language.consumption}</Text>
                                        </View>

                                        <TouchableOpacity style={styles.report_chart_details_item_button} onPress={() => {this.redirectToConsumption()}}>
                                            <Text style={styles.report_chart_details_item_button_text}>{this.state.consumption ? this.state.consumption : 0} kWh</Text>
                                            <View style={styles.report_chart_details_item_button_icon}>
                                                <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <Path d="M1.406 19.266L0 17.859l8.297-8.226L0 1.406 1.406 0l9.633 9.633-9.633 9.633z" fill="#004B84"/>
                                                </Svg>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.report_chart_details_item}>
                                        <View style={styles.report_chart_details_item_icon_title_box}>
                                            <View style={styles.report_chart_details_item_icon}>
                                                <Svg width={14} height={14} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <Circle cx={7} cy={7} r={7} fill="#10BCCE" />
                                                    <Path d="M5.557 4.182l1.406 4.42h.054l1.41-4.42H9.79L7.784 10H6.2L4.19 4.182h1.367z" fill="#fff"/>
                                                </Svg>
                                            </View>
                                            <Text style={styles.report_chart_details_item_title}>{this.state.language.voltage}</Text>
                                        </View>
                                        <TouchableOpacity style={styles.report_chart_details_item_button} onPress={() => {this.redirectToVoltage()}}>
                                            <Text style={styles.report_chart_details_item_button_text}>
                                                {/*{this.state.voltage ? this.state.voltage : 0}*/}
                                                {this.state.voltage_min} - {this.state.voltage_max} V
                                            </Text>
                                            <View style={styles.report_chart_details_item_button_icon}>
                                                <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <Path d="M1.406 19.266L0 17.859l8.297-8.226L0 1.406 1.406 0l9.633 9.633-9.633 9.633z" fill="#004B84"/>
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
                                            <Text style={styles.report_chart_details_item_title}>{this.state.language.amperage}</Text>
                                        </View>
                                        <TouchableOpacity style={styles.report_chart_details_item_button}
                                              onPress={() => {
                                                  this.redirectToAmperage()
                                              }}
                                        >
                                            <Text style={styles.report_chart_details_item_button_text}>
                                                {/*{this.state.amperage ? this.state.amperage : 0}*/}
                                                {this.state.amperage_min} - {this.state.amperage_max} A

                                            </Text>
                                            <View style={styles.report_chart_details_item_button_icon}>
                                                <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <Path d="M1.406 19.266L0 17.859l8.297-8.226L0 1.406 1.406 0l9.633 9.633-9.633 9.633z" fill="#004B84"/>
                                                </Svg>
                                            </View>
                                        </TouchableOpacity>
                                    </View>


                                    <View style={styles.report_chart_details_item}>
                                        <View style={styles.report_chart_details_item_icon_title_box}>
                                            <View style={styles.report_chart_details_item_icon}>
                                                <Svg width={14} height={14} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <Circle cx={7} cy={7} r={7} fill="#10BCCE" />
                                                    <Path
                                                        d="M5.509 10H4.19L6.2 4.182h1.585L9.79 10H8.472L7.014 5.511H6.97L5.509 10zm-.083-2.287H8.54v.96H5.426v-.96z"
                                                        fill="#fff"
                                                    />
                                                </Svg>
                                            </View>
                                            <Text style={styles.report_chart_details_item_title}>{this.state.language.power}</Text>
                                        </View>
                                        <TouchableOpacity style={styles.report_chart_details_item_button}
                                              onPress={() => {
                                                  this.redirectToPower()
                                              }}
                                        >
                                            <Text style={styles.report_chart_details_item_button_text}></Text>
                                            <View style={styles.report_chart_details_item_button_icon}>
                                                <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <Path d="M1.406 19.266L0 17.859l8.297-8.226L0 1.406 1.406 0l9.633 9.633-9.633 9.633z" fill="#004B84"/>
                                                </Svg>
                                            </View>
                                        </TouchableOpacity>
                                    </View>



                                    <View style={styles.report_stop_now_button_box}>
                                        <TouchableOpacity style={styles.report_stop_now_button}>
                                            <Text style={styles.report_stop_now_button_text}>{this.state.language.stop_now}</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </View>
                        </View>
                    </ScrollView>
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

    test_report_status_start_end_time_info_item_icon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center'
    },
    test_report_status_start_end_time_info_item_icon_text_box: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center'
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
