import React, { Component } from 'react';
import Svg, {Path, Rect, Circle, Defs, Stop, ClipPath, G, Mask} from "react-native-svg";
import { StatusBar } from 'expo-status-bar';
import DropDownPicker from "react-native-custom-dropdown";
import PieChart from 'react-native-expo-pie-chart';
import { VictoryPie } from "victory-native";
import DatePicker from 'react-native-datepicker';
import {AuthContext} from "../AuthContext/context";
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
import {LineChart} from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";


const chartConfig = {
    backgroundGradientFrom: "white",
    backgroundGradientFromOpacity:1,
    backgroundGradientTo: "white",
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `silver`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
    // decimalPlaces: 0,
    linejoinType: "round",
    scrollableDotFill: '#fff',
    scrollableDotRadius: 6,
    scrollableDotStrokeColor: 'tomato',
    scrollableDotStrokeWidth: 3,
    scrollableInfoViewStyle: {
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: '#121212',
        borderRadius: 2,
        marginTop: 25,
        marginLeft: 25
    },

};
const screenWidth = Dimensions.get("window").width;


export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            headerMenuPopup: false,
            power_stages_item_info: 0,
            limit: '215 V',
            peak_value: '214.4 V',
            todayDate: '',
            total_duration: 0,

            date_begin: '2022-09-06',
            date_end: '2022-09-06',
            chart_data_day: [],
            chart_labels: [],
            chartData: [],
            chart_show: false,
            chart_type: 'day',
            chartDataResult: [],

            loadedPage: false,
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



    redirectToTestReport = () => {
        this.props.navigation.navigate("TestReport", {
            params: this.props.id,
            params2: this.props.device_id
        });

    }

    getChartData = async (callback) => {

        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr   = 'Bearer ' + userToken;
        let {date_begin, date_end, chart_type} = this.state;

        // let url = `https://apiv1.zis.ru/tests/power_outages/${this.props.id}?date_begin=${date_begin}&date_end=${date_end}`;
        let url = `https://apiv1.zis.ru/tests/power_outages/10?date_begin=${date_begin}&date_end=${date_end}`;
        console.log(url, 'power outages url')
        try {
            fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then((response) => {
                return response.json()
            }).then(async (response)  => {
                let total_duration =  response.hasOwnProperty('statusCode') && response.statusCode == 400 ? 0 : response.duration;
                let minutes = Math.floor(total_duration / 60);
                let seconds = total_duration - minutes * 60;

                await this.setState({
                    total_duration: `${minutes}m ${seconds}s`,
                    power_stages_item_info: response.hasOwnProperty('statusCode') && response.statusCode == 400 ? 0 :  parseFloat(response.powerOutagesPercentage).toFixed(1),
                    chartData: response.hasOwnProperty('statusCode') && response.statusCode == 400 ? [] :  response.data
                })

                await callback()
            })
        } catch (e) {
            console.log(e)
        }
    }


    pressToDay = async () => {
        let date = new Date().getDate();
        let month = new Date().getMonth() + 1;
        let year = new Date().getFullYear();
        let todayDate =  year + '-' + month + '-' + date;

        console.log(todayDate, 'setDayData')

        await this.setState({
            date_begin: todayDate,
            date_end: todayDate,
            // date_begin: '2022-09-06',
            // date_end: '2022-09-06',
            chart_type: 'day',
            chart_show: false
        })
        await this.getChartData(() => {
            this.setDayData()
        })

    }
    pressToDayAfterPressToArrow = async () => {
        await this.setState({
            chart_type: 'day',
            chart_show: false
        })
        await this.getChartData(() => {
            this.setDayData()
        })
    }
    setDayData = async () => {

        let {chartData} = this.state;

        console.log(chartData, 'chartData')

        let time_line = [];
        let minutes_length = 60*24;

        let zero_data = [];
        for (let i = 0; i < minutes_length; i++) {
            zero_data.push(1)
        }

        console.log()

        for (const chartDataItem of chartData) {

            let timeBegintime   = chartDataItem.timeBegin.split('T')[1];
            let timeBeginhour   = timeBegintime.slice(0,2);
            let timeBeginminute = timeBegintime.slice(3,5);
            let timeBeginminuteResult = (timeBeginhour * 60) + parseFloat(timeBeginminute);

            let timeEndtime   = chartDataItem.timeEnd.split('T')[1];
            let timeEndhour   = timeEndtime.slice(0,2);
            let timeEndminute = timeEndtime.slice(3,5);
            let timeEndminuteResult = (timeEndhour * 60) + parseFloat(timeEndminute);

            time_line.push([timeBeginminuteResult, timeEndminuteResult]);

        }



        for (let i = 0; i < time_line.length; i++) {
            for (let j = time_line[i][0]; j < time_line[i][1] ; j++) {
                zero_data[j] = 0
            }
        }

        let chart_labels = [];
        for (let i = 1; i <=24 ; i++) {
            chart_labels.push(i);
        }

        await this.setState({
            chartDataResult:zero_data,
            chart_show: true,
            // chart_labels: ['01:00','4:00', '8:00', '12:00', '16:00', '20:00', '0:00']
            chart_labels: chart_labels
        })

        console.log(time_line, 'time_line')

        return false;

        // for (const item in chartData) {
        //     let timestamp = chartData[item].timestamp
        //     // let new_timestamp = new Date(timestamp);
        //     // let time = new_timestamp.getHours();
        //     let hours = timestamp.split('T')[1];
        //     chartData[item].timestamp2 = hours.slice(0,2);
        // }
        //
        // chartData.sort(function(a, b) {
        //     return a.timestamp2 - b.timestamp2;
        // })
        //
        // // console.log(chartData, 'chartData');
        //
        // let chartData1 = [];
        // for (const item in chartData) {
        //     chartData1.push(parseFloat(chartData[item].voltage));
        // }
        //
        // let chartLabels = [];
        // for (const item in chartData) {
        //     chartLabels.push(chartData[item].timestamp2);
        // }
        //
        // chartLabels = [... new Set(chartLabels)] // get uniques value;
        //
        // // console.log(chartData1, 'chartData1chartData1chartData1')
        // // console.log(chartLabels, 'chartLabels')
        // // console.log([... new Set(chartLabels)], 'chartLabelschartLabels')
        //
        // this.setState({
        //     chart_show:true,
        //     chartData: chartData1.length > 0 ? chartData1 : [0],
        //     // chart_labels: ['10', '11','12','13','14','15','16','17','18','19','20'],
        //     chart_labels: chartLabels ,
        // })

    }

    pressToWeek = async () => {

        let curr = new Date; // get current date
        let first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
        let last = first + 6; // last day is the first day + 6

        let firstday = new Date(curr.setDate(first));
        let lastday  = new Date(curr.setDate(last));
            firstday = moment(firstday).format('YYYY-MM-DD');
            lastday  = moment(lastday).format('YYYY-MM-DD');

        await this.setState({
            date_begin: firstday,
            date_end: lastday,
            // date_begin: '2022-09-06',
            // date_end: '2022-09-07',
            chart_type: 'week',
            chart_show: false
        })


        await this.getChartData(() => {
            this.setWeekData()
        })

    }
    pressToWeekAfterPressToArrow = async () => {

        await this.setState({
            chart_type: 'week',
            chart_show: false
        })
        await this.getChartData(() => {
            this.setWeekData()
        })

    }
    setWeekData = async () => {

        let {chartData} = this.state;

        for (const item in chartData) {
            let timestamp = chartData[item].timeBegin.split('T')[0];
            let new_timestamp = new Date(timestamp);
            let hours = new_timestamp.getDay();
            chartData[item].week_day = hours;
        }

        chartData.sort(function(a, b) {
            return a.week_day - b.week_day;
        })


        let time_line = [];
        let minutes_length = 24 * 7;

        let zero_data = [];
        for (let i = 0; i < minutes_length; i++) {
            zero_data.push(1)
        }

        for (const chartDataItem of chartData) {
            let timeBeginhour1   = chartDataItem.week_day;

            let timeBegintime2   = chartDataItem.timeBegin.split('T')[1];
            let timeBeginhour2   = timeBegintime2.slice(0,2);

            let beginResult = ((parseInt(timeBeginhour1)-1) * 24) + parseInt(timeBeginhour2);


            let timeEndhour1   = chartDataItem.week_day;

            let timeEndtime2   = chartDataItem.timeEnd.split('T')[0];
            let timeEndhour2   = timeEndtime2.slice(0,2);
            let endResult =  ((parseInt(timeEndhour1)-1) * 24) + parseInt(timeEndhour2);;


            time_line.push([beginResult, endResult]);

        }

        for (let i = 0; i < time_line.length; i++) {
            for (let j = time_line[i][0]; j <= time_line[i][1] ; j++) {
                zero_data[j] = 0
            }
        }

        let chartLabels = [];
        for (let i = 0; i < 7 ; i++) {
            chartLabels.push(i);
        }

        for (const chartLabelsItem in chartLabels) {

            if(chartLabels[chartLabelsItem] == 1) {
                chartLabels[chartLabelsItem] = 'ПН'
            } else if(chartLabels[chartLabelsItem] == 2) {
                chartLabels[chartLabelsItem] = 'ВТ'
            } else if(chartLabels[chartLabelsItem] == 3) {
                chartLabels[chartLabelsItem] = 'СР'
            } else if(chartLabels[chartLabelsItem] == 4) {
                chartLabels[chartLabelsItem] = 'ЧТ'
            } else if(chartLabels[chartLabelsItem] == 5) {
                chartLabels[chartLabelsItem] = 'ПТ'
            } else if(chartLabels[chartLabelsItem] == 6) {
                chartLabels[chartLabelsItem] = 'СБ'
            } else if(chartLabels[chartLabelsItem] == 0) {
                chartLabels[chartLabelsItem] = 'ВС'
            }

        }

        await this.setState({
            chartDataResult:zero_data,
            chart_show: true,
            chart_labels: chartLabels
        })

    }

    pressToMonth = async () => {
        const now = new Date();
        let firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        let lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        firstDay = moment(firstDay).format('YYYY-MM-DD');
        lastDay  = moment(lastDay).format('YYYY-MM-DD');

        this.setState({
            date_begin: firstDay,
            date_end: lastDay,
            // date_begin: '2022-09-06',
            // date_end: '2022-09-07',

            chart_type: 'month',
            chart_show: false
        })


        await this.getChartData(() => {
            this.setMonthData()
        })

    }
    pressToMonthAfterPressToArrow = async () => {
        await this.setState({
            chart_type: 'month',
            chart_show: false
        })

        await this.getChartData(() => {
            this.setMonthData()
        })

    }
    setMonthData = async () => {

        let {chartData, date_begin, date_end} = this.state;
        let month_day_count = date_end.slice(-2);

        console.log(date_begin, date_end, month_day_count, 'date_begin, date_end')

        let time_line = [];
        let minutes_length = 24 * month_day_count;

        let zero_data = [];
        for (let i = 0; i < minutes_length; i++) {
            zero_data.push(1)
        }


        for (const chartDataItem of chartData) {

            let timeBegintime1   = chartDataItem.timeBegin.split('T')[0];
            let timeBeginhour1   = timeBegintime1.slice(-2);

            let timeBegintime2   = chartDataItem.timeBegin.split('T')[1];
            let timeBeginhour2   = timeBegintime2.slice(0,2);

            let beginResult = ((parseInt(timeBeginhour1)-1) * 24) + parseInt(timeBeginhour2);


            let timeEndtime1   = chartDataItem.timeEnd.split('T')[0];
            let timeEndhour1   = timeEndtime1.slice(-2);

            let timeEndtime2   = chartDataItem.timeEnd.split('T')[0];
            let timeEndhour2   = timeEndtime2.slice(0,2);
            let endResult =  ((parseInt(timeEndhour1)-1) * 24) + parseInt(timeEndhour2);;

            // let timeBegintime1   = chartDataItem.timeBegin.split('T')[0];
            // let timeBeginhour1   = timeBegintime1.slice(-2);
            // let timeBeginminute1 = (60*24) * parseInt(timeBeginhour1);
            //
            // let timeBegintime   = chartDataItem.timeBegin.split('T')[1];
            // let timeBeginhour   = timeBegintime.slice(0,2);
            // let timeBeginminute = timeBegintime.slice(3,5);
            // let timeBeginminuteResult = (timeBeginhour * 60) + parseFloat(timeBeginminute);
            //
            // let beginResult = timeBeginminute1 + timeBeginminuteResult;
            //
            //
            // let timeEndtime1   = chartDataItem.timeEnd.split('T')[0];
            // let timeEndhour1   = timeEndtime1.slice(-2);
            // let timeEndminute1 = (60*24) * parseInt(timeEndhour1);
            //
            // let timeEndtime   = chartDataItem.timeEnd.split('T')[1];
            // let timeEndhour   = timeEndtime.slice(0,2);
            // let timeEndminute = timeEndtime.slice(3,5);
            // let timeEndminuteResult = (timeEndhour * 60) + parseFloat(timeEndminute);
            //
            // let endResult = timeEndminute1 + timeEndminuteResult;

            console.log(beginResult,endResult, 'beginResult')

            time_line.push([beginResult, endResult]);

        }


        for (let i = 0; i < time_line.length; i++) {
            for (let j = time_line[i][0]; j <= time_line[i][1] ; j++) {
                zero_data[j] = 0
            }
        }


        let chart_labels = [];
        for (let i = 1; i <= month_day_count ; i++) {
            chart_labels.push(i)
        }

        // console.log(zero_data, 'time_line')

        await this.setState({
            chartDataResult:zero_data,
            chart_show: true,
            chart_labels: chart_labels
        })

        return false;

    }

    componentDidMount() {
        const { navigation } = this.props;
        this.setLanguageFromStorage();
        this.pressToDay()

        this.focusListener = navigation.addListener("focus", () => {
            this.setLanguageFromStorage();
            this.pressToDay()
        });
    }
    componentWillUnmount() {
        if (this.focusListener) {
            this.focusListener();
        }
    }


    goToPrevDay = async () => {

        let {date_begin, chart_type, chart_show} = this.state;
        if (!chart_show) {
            return false
        }

        const date = new Date(date_begin);
        const dateCopy = new Date(date.getTime());
        dateCopy.setDate(dateCopy.getDate() -1);

        let day = dateCopy.getDate() <= 9 ? `0${dateCopy.getDate()}` : dateCopy.getDate();
        let month = dateCopy.getMonth() + 1;
        month = month <= 9 ? `0${month}` : month;
        let year = dateCopy.getFullYear();
        let todayDate =  year + '-' + month + '-' + day;

        console.log( todayDate)
        await this.setState({
            date_begin:todayDate,
            date_end:todayDate
        })
        this.pressToDayAfterPressToArrow();
    }
    goToNextDay = async () => {
        let {date_begin, chart_type, chart_show} = this.state;
        if (!chart_show) {
            return false
        }

        const date = new Date(date_begin);
        const dateCopy = new Date(date.getTime());
        dateCopy.setDate(dateCopy.getDate() + 1);

        let day = dateCopy.getDate() <= 9 ? `0${dateCopy.getDate()}` : dateCopy.getDate();
        let month = dateCopy.getMonth() + 1;
        month = month <= 9 ? `0${month}` : month;
        let year = dateCopy.getFullYear();
        let todayDate =  year + '-' + month + '-' + day;

        console.log( todayDate)
        await this.setState({
            date_begin:todayDate,
            date_end:todayDate
        })
        this.pressToDayAfterPressToArrow();
    }

    goToPrevWeek = async () => {

        let {date_begin, date_end, chart_type, chart_show} = this.state;
        if (!chart_show) {
            return false
        }

        let dateOffset = (24*60*60*1000) * 7; //6 days
        let firstday = new Date(date_begin);
        firstday.setTime(firstday.getTime() - dateOffset);
        firstday = moment(firstday).format('YYYY-MM-DD')

        let date = new Date().getDate();
        let month = new Date().getMonth() + 1;
        let year = new Date().getFullYear();
        let lastday =  year + '-' + month + '-' + date;//format: yyyy-mm-dd;

        console.log(firstday, 'firstday')
        console.log(date_begin, 'lastday')
        await this.setState({
            date_begin:firstday,
            date_end:date_begin
        })
        await this.pressToWeekAfterPressToArrow();
    }
    goToNextWeek = async () => {

        let {date_begin, date_end, chart_type, chart_show} = this.state;
        if (!chart_show) {
            return false
        }
        let dateOffset = (24*60*60*1000) * 7; //6 days
        let firstday = new Date(date_end);
        firstday.setTime(firstday.getTime() + dateOffset);
        firstday = moment(firstday).format('YYYY-MM-DD')

        let date = new Date().getDate();
        let month = new Date().getMonth() + 1;
        let year = new Date().getFullYear();
        let lastday =  year + '-' + month + '-' + date;//format: yyyy-mm-dd;

        console.log(date_end, 'date_end')
        console.log(firstday, 'firstday')
        await this.setState({
            date_begin:date_end,
            date_end:firstday
        })
        await this.pressToWeekAfterPressToArrow();

    }

    goToPrevMonth = async () => {

        let {date_begin, date_end, chart_type, chart_show} = this.state;
        if (!chart_show) {
            return false
        }

        let now = new Date(date_begin);
        let firstDay = new Date(now.getFullYear(), now.getMonth()-1, 1);
        let lastDay = new Date(now.getFullYear(), now.getMonth(), 0);

        firstDay = moment(firstDay).format('YYYY-MM-DD');
        lastDay  = moment(lastDay).format('YYYY-MM-DD');

        await this.setState({
            date_begin:firstDay,
            date_end:lastDay
        })
        await this.pressToMonthAfterPressToArrow();
    }
    goToNextMonth = async () => {

        let {date_begin, date_end, chart_type, chart_show} = this.state;
        if (!chart_show) {
            return false
        }

        let now = new Date(date_end);
        let firstDay = new Date(now.getFullYear(), now.getMonth()+1, 1);
        let lastDay = new Date(now.getFullYear(), now.getMonth() + 2, 0);

        firstDay = moment(firstDay).format('YYYY-MM-DD');
        lastDay  = moment(lastDay).format('YYYY-MM-DD');

        await this.setState({
            date_begin:firstDay,
            date_end:lastDay
        })
        await this.pressToMonthAfterPressToArrow();

    }


    closeMenu = () => {

        this.setState({
            headerMenuPopup: false
        })
    }

    render() {




        return (
            <SafeAreaView style={styles.container} >
                <StatusBar style="dark" />

                {this.state.headerMenuPopup &&
                    <TopMenu navigation={this.props.navigation} closeMenu={this.closeMenu} />
                }

                <View style={[styles.container, { paddingTop: 25, paddingBottom: 29}]} >

                    <View style={styles.all_devices_general_page_header}>
                        <View style={styles.all_devices_general_page_header_child}>
                            <TouchableOpacity style={styles.title_back_btn_wrapper} onPress={() => {this.redirectToTestReport()}}>
                                <View style={styles.back_btn}>
                                    <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <Path d="M9.633 0l1.406 1.406-8.297 8.227 8.297 8.226-1.406 1.407L0 9.633 9.633 0z" fill="#004B84"/>
                                    </Svg>
                                </View>
                                <Text style={styles.all_devices_general_page_header_title}>{this.state.language.power_outages}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.all_devices_general_page_header_menu_btn} onPress={() => {this.setState({headerMenuPopup: true})}}>
                                <Svg width={28} height={25} viewBox="0 0 28 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <Path fill="#004B84" d="M0 0H28V3H0z" />
                                    <Path fill="#004B84" d="M0 11H28V14H0z" />
                                    <Path fill="#004B84" d="M0 22H28V25H0z" />
                                </Svg>
                            </TouchableOpacity>
                        </View>

                    </View>
                    <ScrollView style={styles.all_devices_general_page_main_wrapper}>
                        <View style={styles.impulse_surges_items_main_wrapper}>
                            <View style={styles.impulse_surges_items_second_wrapper}>
                                <View style={styles.impulse_surges_item_icon_title_wrapper}>
                                    <View style={styles.impulse_surges_item_icon}>
                                        <Svg width={15} height={18} viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <Path fill="#BDBDBD" d="M0 0H6V18H0z" />
                                            <Path fill="#BDBDBD" d="M9 0H15V18H9z" />
                                        </Svg>
                                    </View>
                                    <Text style={styles.impulse_surges_item_info1}>{this.state.power_stages_item_info}%</Text>
                                </View>
                                <View style={styles.impulse_surges_item}>
                                    <Text style={styles.impulse_surges_item_title}>{this.state.language.total_duration}</Text>
                                    <Text style={styles.impulse_surges_item_info}>{this.state.total_duration}</Text>
                                </View>

                            </View>
                            <View  style={styles.impulse_surges_dates_info_buttons_main_wrapper}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.pressToDay()
                                    }}
                                    style={styles.impulse_surges_dates_info_button}
                                >
                                    <Text style={styles.impulse_surges_dates_info_button_text}>{this.state.language.day}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        this.pressToWeek()
                                    }}
                                    style={styles.impulse_surges_dates_info_button}
                                >
                                    <Text style={styles.impulse_surges_dates_info_button_text}>{this.state.language.week}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        this.pressToMonth()
                                    }}
                                    style={styles.impulse_surges_dates_info_button}
                                >
                                    <Text style={styles.impulse_surges_dates_info_button_text}>{this.state.language.month}</Text>
                                </TouchableOpacity>

                            </View>
                            <View style={styles.impulse_surges_item_img_dates_info_wrapper}>

                                <View style={{ height: 200, flexDirection: 'row', width: '100%', marginBottom:25 }}>

                                    {this.state.chart_show ?

                                        <View style={{flex:1, height: 150,marginHorizontal: 20}}>

                                            <View style={{flex:1, height: 150, backgroundColor:'white',flexDirection:'row', position:'relative'}}>


                                                {this.state.chartDataResult.map((item, index)=> {

                                                    if (this.state.chart_type == 'month') {
                                                        if (item == 0) {
                                                            return (
                                                                <View key={index} style={{backgroundColor:'white', height:'100%', flex:1}}>
                                                                    {/*{index % 24 == 0 &&*/}
                                                                    {/*    <Text style={styles.monthlabelText}>{1}-</Text>*/}
                                                                    {/*}*/}
                                                                </View>
                                                            )
                                                        } else {
                                                            return (
                                                                <View key={index} style={{backgroundColor:'#004B84',height:'100%', flex:1}}>
                                                                    {/*{index % 24 == 0 &&*/}
                                                                    {/*    <Text style={styles.monthlabelText}>{1}-</Text>*/}
                                                                    {/*}*/}
                                                                </View>
                                                            )
                                                        }
                                                    } else if(this.state.chart_type == 'day') {
                                                        if (item == 0) {
                                                            return (
                                                                <View key={index} style={{backgroundColor:'white', height:'100%', flex:1}}>
                                                                </View>
                                                            )
                                                        } else {
                                                            return (
                                                                <View key={index} style={{backgroundColor:'#004B84', height:'100%', flex:1}}>
                                                                </View>
                                                            )
                                                        }
                                                    } else if(this.state.chart_type == 'week') {
                                                        if (item == 0) {
                                                            return (
                                                                <View key={index} style={{backgroundColor:'white', height:'100%', flex:1}}>
                                                                    {/*<Text style={styles.weeklabelText}>{this.getWeekNames(index)}</Text>*/}
                                                                </View>
                                                            )
                                                        } else {
                                                            return (
                                                                <View key={index} style={{backgroundColor:'#004B84', height:'100%', flex:1}}>
                                                                    {/*<Text style={styles.weeklabelText}>{this.getWeekNames(index)}</Text>*/}
                                                                </View>
                                                            )
                                                        }
                                                    }

                                                })}

                                                <View style={{width:'100%', height: 0.5, borderWidth:0.5, borderColor: 'black',borderStyle:'dashed', position:'absolute', zIndex:5, top: 0}}></View>
                                                <View style={{width:'100%', height: 0.5, borderWidth:0.5, borderColor: 'black',borderStyle:'dashed', position:'absolute', zIndex:5, top: '50%'}}></View>
                                                <View style={{width:'100%', height: 0.5, borderWidth:0.5, borderColor: 'black',borderStyle:'dashed', position:'absolute', zIndex:5, bottom: 0}}></View>

                                            </View>

                                            <View style={styles.labelWrapper}>

                                                {this.state.chart_labels.map((item, index) => {
                                                    if(this.state.chart_type == 'day') {
                                                        return (
                                                            <Text key={index} style={[styles.labelText, {flex:1}]}>{item}</Text>
                                                        )
                                                    }

                                                    if(this.state.chart_type == 'month') {
                                                        return (
                                                            <Text key={index} style={[styles.labelText, {flex:1}]}>{item}</Text>
                                                        )
                                                    }


                                                    if(this.state.chart_type == 'week') {
                                                        return (
                                                            <Text key={index} style={[styles.labelText, {flex:1}]}>{item}</Text>
                                                        )
                                                    }
                                                })}

                                            </View>

                                        </View>

                                        :

                                        <View style={{width: '100%', height: '100%', justifyContent:'center', alignItems:'center'}}>
                                            <ActivityIndicator size="large" color="#0000ff"/>
                                        </View>
                                    }
                                </View>


                                {this.state.chart_type == 'day' &&
                                <View style={styles.impulse_surges_change_date_buttons_info_wrapper}>

                                    <TouchableOpacity
                                        onPress={() => {
                                            this.goToPrevDay()
                                        }}
                                        style={styles.impulse_surges_change_minus_date_button}
                                    >
                                        <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <Path d="M9.633 0l1.406 1.406-8.297 8.227 8.297 8.226-1.406 1.407L0 9.633 9.633 0z" fill="#fff"/>
                                        </Svg>
                                    </TouchableOpacity>

                                    <Text style={[styles.impulse_surges_change_date_info, {marginHorizontal: 15}]}>{this.state.date_begin}</Text>

                                    <TouchableOpacity
                                        onPress={() => {
                                            this.goToNextDay()
                                        }}
                                        style={styles.impulse_surges_change_plus_date_button}
                                    >
                                        <Svg width={11} height={20} viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <Path d="M1.401 0L0 1.406l8.268 8.227L0 17.859l1.401 1.407L11 9.633 1.401 0z" fill="#fff"/>
                                        </Svg>
                                    </TouchableOpacity>
                                </View>
                                }

                                {this.state.chart_type == 'week' &&
                                <View style={[styles.impulse_surges_change_date_buttons_info_wrapper]}>

                                    <TouchableOpacity
                                        onPress={() => {
                                            this.goToPrevWeek()
                                        }}
                                        style={styles.impulse_surges_change_minus_date_button}
                                    >
                                        <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <Path d="M9.633 0l1.406 1.406-8.297 8.227 8.297 8.226-1.406 1.407L0 9.633 9.633 0z" fill="#fff"/>
                                        </Svg>
                                    </TouchableOpacity>

                                    <Text style={[styles.impulse_surges_change_date_info, {marginHorizontal: 15  }]}>{this.state.date_begin} - {this.state.date_end}</Text>

                                    <TouchableOpacity
                                        onPress={() => {
                                            this.goToNextWeek()
                                        }}
                                        style={styles.impulse_surges_change_plus_date_button}
                                    >
                                        <Svg width={11} height={20} viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <Path d="M1.401 0L0 1.406l8.268 8.227L0 17.859l1.401 1.407L11 9.633 1.401 0z" fill="#fff"/>
                                        </Svg>
                                    </TouchableOpacity>

                                </View>
                                }

                                {this.state.chart_type == 'month' &&
                                <View style={[styles.impulse_surges_change_date_buttons_info_wrapper]}>

                                    <TouchableOpacity
                                        onPress={() => {
                                            this.goToPrevMonth()
                                        }}
                                        style={styles.impulse_surges_change_minus_date_button}
                                    >
                                        <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <Path d="M9.633 0l1.406 1.406-8.297 8.227 8.297 8.226-1.406 1.407L0 9.633 9.633 0z" fill="#fff"/>
                                        </Svg>
                                    </TouchableOpacity>

                                    <Text style={[styles.impulse_surges_change_date_info, {marginHorizontal: 15  }]}>{this.state.date_begin} - {this.state.date_end}</Text>

                                    <TouchableOpacity
                                        onPress={() => {
                                            this.goToNextMonth()
                                        }}
                                        style={styles.impulse_surges_change_plus_date_button}
                                    >
                                        <Svg width={11} height={20} viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <Path d="M1.401 0L0 1.406l8.268 8.227L0 17.859l1.401 1.407L11 9.633 1.401 0z" fill="#fff"/>
                                        </Svg>
                                    </TouchableOpacity>

                                </View>
                                }

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
        marginBottom: 31,
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

    impulse_surges_item_img: {
        width: 283,
        height: 202,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        marginBottom: 25,
    },
    impulse_surges_item_img_child: {
        width: '100%',
        height: '100%',
    },
    impulse_surges_items_second_wrapper: {
        width: '100%',
        paddingHorizontal: 25,
        marginBottom: 19,
    },
    impulse_surges_item_icon_title_wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    impulse_surges_item_info1: {
        color: '#000000',
        fontWeight: '700',
        fontSize: 32,
        marginLeft: 9,
    },
    impulse_surges_item: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    impulse_surges_item_title: {
        color: '#4A4A4A',
        fontWeight: '400',
        fontSize: 16,
    },
    impulse_surges_item_info: {
        color: '#10BCCE',
        fontWeight: '600',
        fontSize: 16,
    },
    impulse_surges_dates_info_buttons_main_wrapper: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 44,
        paddingLeft: 18,
        paddingRight: 21,
    },
    impulse_surges_dates_info_button: {
        width: '32%',
        height: 40,
        backgroundColor: '#004B84',
        alignItems: 'center',
        justifyContent: 'center',
    },
    impulse_surges_dates_info_button_text: {
        color: '#ffffff',
        fontWeight: '400',
        fontSize: 16,
    },
    impulse_surges_change_minus_date_button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        backgroundColor: '#004B84',

    },
    impulse_surges_change_plus_date_button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        backgroundColor: '#004B84',

    },
    impulse_surges_change_date_buttons_info_wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 80,
    },
    impulse_surges_change_date_info: {
        color: '#4A4A4A',
        fontWeight: '400',
        fontSize: 16,
    },
    labelWrapper:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop: 10
    },
    labelText: {
        // width: '3.4%',
        fontSize:8,
        textAlign:'center',

    },
    monthlabelText: {
        width: 10,
        fontSize:8,
        textAlign:'center',
        position:'absolute',
        bottom:-20,
        alignSelf: 'center'
    },
    weeklabelText: {
        fontSize:8,
        textAlign:'center',
        position:'absolute',
        bottom:-20,
        alignSelf: 'center'
    }

});
