import React, { Component } from 'react';
import Svg, {Path, Rect, Circle, Defs, Stop, ClipPath, G, Mask} from "react-native-svg";
import { StatusBar } from 'expo-status-bar';
import DropDownPicker from "react-native-custom-dropdown";
import PieChart from 'react-native-expo-pie-chart';
import { VictoryPie } from "victory-native";
import DatePicker from 'react-native-datepicker';
// import { LineChart, YAxis, Grid } from 'react-native-svg-charts'
import {AuthContext} from "../AuthContext/context";
import i18n from "i18n-js";
import {en, ru} from "../../i18n/supportedLanguages";
import {
    LineChart,
    BarChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";

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
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";


const data = [190, 200, 210, 240, 245]
const contentInset = { top: 20, bottom: 20 }

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
            voltage_item_info: 0,
            minimum_info: 0,
            maximum_info: 0,
            todayDate: '',

            date_begin: '2022-09-06',
            date_end: '2022-09-06',
            chart_data_day: [],
            chart_labels: [],
            chartData: [],
            chart_show: false,
            chart_type: 'day',
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
        this.props.navigation.navigate("TestReport",{
            params: this.props.id,
            params2: this.props.device_id
        });
    }
    redirectToNewTest = () => {
        this.props.navigation.navigate("NewTest");

    }
    getChartData = async (callback) => {

        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr   = 'Bearer ' + userToken;
        let {date_begin, date_end, chart_type} = this.state;
        let id = this.props.id; // 4
        console.log(id, 'dqdqwdwq')

        try {
            fetch(`https://apiv1.zis.ru/tests/avg_data/${id}?date_begin=${date_begin}&date_end=${date_end}&period=${chart_type}&data_type=power`, {
                method: 'GET',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then((response) => {
                return response.json()
            }).then(async (response)  => {

                console.log(response, 'response avg_data')

                console.log(response.avg, 'vt')
                console.log(response.avg/1000, 'kv')
                // AVG 3500 Вт / 3.5 кВ

                if (response.hasOwnProperty('statusCode') && response.statusCode == 400 || response.hasOwnProperty('statusCode') && response.statusCode == 403) {
                    await this.setState({
                        chartData: []
                    })
                } else {
                    await this.setState({
                        chartData: response.data.length > 0 ? response.data : [],
                        minimum_info: response.min,
                        maximum_info: response.max,
                        voltage_item_info: response.avg
                    })
                }


                await callback()
            })
        } catch (e) {
            console.log(e)
        }
    }


    pressToDay = async () => {
        // let date = new Date().getDate();
        // date = date < 10 ? `0${date}` : date;
        //
        // let month = new Date().getMonth() + 1;
        // let year = new Date().getFullYear();
        // let todayDate =  year + '-' + month + '-' + date;
        //
        // console.log(todayDate, 'setDayData')

        let test_start_date = moment(this.props.test_report_start_time).format('YYYY-MM-DD');


        await this.setState({
            date_begin: test_start_date,
            date_end: test_start_date,
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

        for (const item in chartData) {
            let timestamp = chartData[item].timestamp
            // let new_timestamp = new Date(timestamp);
            // let time = new_timestamp.getHours();
            let hours = timestamp.split('T')[1];
            chartData[item].timestamp2 = hours.slice(0,2);
        }

        chartData.sort(function(a, b) {
            return a.timestamp2 - b.timestamp2;
        })

        // console.log(chartData, 'chartData');

        let chartData1 = [];
        for (const item in chartData) {
            chartData1.push(parseFloat(chartData[item].power));
        }

        let minimum_info = chartData1.length > 0 ? Math.min(...chartData1) : 0
        let maximum_info = chartData1.length > 0 ? Math.max(...chartData1) : 0


        let chartLabels = [];
        for (const item in chartData) {
            chartLabels.push(chartData[item].timestamp2);
        }

        chartLabels = [... new Set(chartLabels)] // get uniques value;


        this.setState({
            chart_show:true,
            chartData: chartData1.length > 0 ? chartData1 : [0],
            chart_labels: chartLabels ,
            // minimum_info: minimum_info,
            // maximum_info: maximum_info,
        })

    }


    pressToWeek = async () => {
        // let dateOffset = (24*60*60*1000) * 7; //6 days
        // let firstday = new Date();
        // firstday.setTime(firstday.getTime() - dateOffset);
        // firstday = moment(firstday).format('YYYY-MM-DD')
        //
        // let date = new Date().getDate();
        // date = date < 10 ? `0${date}` : date;
        // let month = new Date().getMonth() + 1;
        // let year = new Date().getFullYear();
        // let lastday =  year + '-' + month + '-' + date;//format: yyyy-mm-dd;
        //
        // console.log(lastday, 'lastday');
        // console.log(firstday, 'firstday');

        let test_start_date = moment(this.props.test_report_start_time).format('YYYY-MM-DD');
        let futureMonth =  moment(test_start_date).add(1, 'W');
        let lastday = moment(futureMonth).format('YYYY-MM-DD')


        await this.setState({
            date_begin: test_start_date,
            date_end: lastday,
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
            let timestamp = chartData[item].timestamp
            let new_timestamp = new Date(timestamp);
            let hours = new_timestamp.getDay();
            chartData[item].timestamp2 = hours;
        }

        chartData.sort(function(a, b) {
            return a.timestamp2 - b.timestamp2;
        })

        console.log(chartData, 'chartData');

        let chartData1 = [];
        for (const item in chartData) {
            chartData1.push(chartData[item].power);
        }

        let minimum_info = chartData1.length > 0 ? Math.min(...chartData1) : 0
        let maximum_info = chartData1.length > 0 ? Math.max(...chartData1) : 0

        let chartLabels = [];
        for (const item in chartData) {
            chartLabels.push(chartData[item].timestamp2);
        }
        chartLabels = [... new Set(chartLabels)] // get uniques value;

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

        this.setState({
            chart_show:true,
            chartData: chartData1.length > 0 ? chartData1 : [0],
            chart_labels: chartLabels,
            // minimum_info: minimum_info,
            // maximum_info: maximum_info,
        })

    }

    pressToMonth = async () => {

        // let dateOffset = (24*60*60*1000) * 30; //6 days
        // let firstday = new Date();
        // firstday.setTime(firstday.getTime() - dateOffset);
        // firstday = moment(firstday).format('YYYY-MM-DD')
        //
        // let date = new Date().getDate();
        // date = date < 10 ? `0${date}` : date;
        // let month = new Date().getMonth() + 1;
        // let year = new Date().getFullYear();
        // let lastday =  year + '-' + month + '-' + date;//format: yyyy-mm-dd;
        //
        // console.log(lastday, 'lastday');
        // console.log(firstday, 'firstday');

        let test_start_date = moment(this.props.test_report_start_time).format('YYYY-MM-DD');
        let futureMonth =  moment(test_start_date).add(1, 'M');
        let lastday = moment(futureMonth).format('YYYY-MM-DD')


        this.setState({
            date_begin: test_start_date,
            date_end: lastday,
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
        let {chartData} = this.state;

        for (const item in chartData) {
            let timestamp = chartData[item].timestamp
            let new_timestamp = new Date(timestamp);

            let hours = timestamp.split('T')[0];
            chartData[item].timestamp2 = hours.slice(-2);

            console.log(timestamp + '==d==' + hours.slice(-2));

            // let hours = new_timestamp.getDay();
            // chartData[item].timestamp2 = hours;

        }

        chartData.sort(function(a, b) {
            return a.timestamp2 - b.timestamp2;
        })


        let chartData1 = [];
        for (const item in chartData) {
            chartData1.push(parseFloat(chartData[item].power));
        }

        let minimum_info = chartData1.length > 0 ? Math.min(...chartData1) : 0
        let maximum_info = chartData1.length > 0 ? Math.max(...chartData1) : 0

        let chartLabels = [];
        for (const item in chartData) {
            chartLabels.push(chartData[item].timestamp2);
        }
        chartLabels = [... new Set(chartLabels)] // get uniques value;

        this.setState({
            chart_show:true,
            chartData: chartData1.length > 0 ? chartData1 : [0],
            chart_labels: chartLabels,
            // minimum_info:minimum_info,
            // maximum_info:maximum_info,
        })

    }



    componentDidMount() {
        const { navigation } = this.props;

        // this.setLanguageFromStorage();
        // this.pressToDay()

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

    closeMenu = () => {
        this.setState({
            headerMenuPopup: false
        })
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
        date = date < 10 ? `0${date}` : date;
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
        date = date < 10 ? `0${date}` : date;
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
        // let dateOffset = (24*60*60*1000) * 30; //6 days
        // let firstday = new Date(date_begin);
        // firstday.setTime(firstday.getTime() - dateOffset);
        // firstday = moment(firstday).format('YYYY-MM-DD')
        //
        // console.log(firstday, 'firstday')
        // console.log(date_begin, 'lastday');
        //
        // await this.setState({
        //     date_begin:firstday,
        //     date_end:date_begin
        // })

        let lastday = moment(date_begin).format('YYYY-MM-DD');
        lastday = moment(lastday).add(-1, 'M');
        lastday = moment(lastday).format('YYYY-MM-DD')


        await this.setState({
            date_begin:lastday,
            date_end:date_begin
        })
        await this.pressToMonthAfterPressToArrow();
    }
    goToNextMonth = async () => {

        let {date_begin, date_end, chart_type, chart_show} = this.state;

        if (!chart_show) {
            return false
        }

        // let dateOffset = (24*60*60*1000) * 30; //6 days
        // let firstday = new Date(date_end);
        // firstday.setTime(firstday.getTime() + dateOffset);
        // firstday = moment(firstday).format('YYYY-MM-DD')
        //
        // let date = new Date().getDate();
        // date = date < 10 ? `0${date}` : date;
        // let month = new Date().getMonth() + 1;
        // let year = new Date().getFullYear();
        // let lastday =  year + '-' + month + '-' + date;//format: yyyy-mm-dd;
        //
        // console.log(date_end, 'date_end')
        // console.log(firstday, 'firstday')
        // await this.setState({
        //     date_begin:date_end,
        //     date_end:firstday
        // })
        let lastday = moment(date_end).format('YYYY-MM-DD');
        lastday = moment(lastday).add(1, 'M');
        lastday = moment(lastday).format('YYYY-MM-DD')

        await this.setState({
            date_begin:date_end,
            date_end:lastday
        })
        await this.pressToMonthAfterPressToArrow();

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
                                <Text style={styles.all_devices_general_page_header_title}>{this.state.language.power}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.all_devices_general_page_header_menu_btn} onPress={() => {this.setState({headerMenuPopup: true})}}>
                                <Svg width={28} height={25} viewBox="0 0 28 25" fill="none" xmlns="http://www.w3.org/2000/svg"><Path fill="#004B84" d="M0 0H28V3H0z" /><Path fill="#004B84" d="M0 11H28V14H0z" /><Path fill="#004B84" d="M0 22H28V25H0z" /></Svg>
                            </TouchableOpacity>
                        </View>

                    </View>
                    <ScrollView style={styles.all_devices_general_page_main_wrapper}>
                        <View style={styles.impulse_surges_items_main_wrapper}>
                            <View style={styles.impulse_surges_items_second_wrapper}>

                                <View style={styles.impulse_surges_item_icon_title_wrapper}>
                                    <View style={styles.impulse_surges_item_icon}>
                                        <Svg width={21} height={21} viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <Circle cx={10.5} cy={10.5} r={10.5} fill="#10BCCE" />
                                            <Path d="M7.952 6l2.01 6.838h.077L12.052 6H14l-2.866 9H8.87L6 6h1.952z" fill="#fff"/>
                                        </Svg>
                                    </View>
                                    <Text style={styles.impulse_surges_item_info1}>AVG {this.state.voltage_item_info ? this.state.voltage_item_info : 0} {this.state.language.vt} / {this.state.voltage_item_info ? (this.state.voltage_item_info / 1000).toFixed(3) : 0} {this.state.language.kv}</Text>
                                </View>

                                <View style={styles.impulse_surges_item}>
                                    <Text style={styles.impulse_surges_item_title}>{this.state.language.minimum}</Text>
                                    <Text style={styles.impulse_surges_item_info}>{this.state.minimum_info} W</Text>
                                </View>

                                <View style={styles.impulse_surges_item}>
                                    <Text style={styles.impulse_surges_item_title}>{this.state.language.maximum}</Text>
                                    <Text style={styles.impulse_surges_item_info}>{this.state.maximum_info} W</Text>
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

                                {/*<View style={[styles.impulse_surges_item_img]}>*/}
                                {/*    <Image style={styles.impulse_surges_item_img_child} source={require('../../assets/images/chart_img5.png')}/>*/}
                                {/*</View>*/}

                                <View style={{ height: 200, flexDirection: 'row', width: '100%', marginBottom:25 }}>

                                    {this.state.chart_show ?
                                        <LineChart
                                            data={{
                                                labels:  this.state.chart_labels,
                                                datasets: [
                                                    // {
                                                    //     data: [130, 135, 140, 145,  260,130, 135, 140, 145, 260, 220 ],
                                                    //     // color: (opacity = 1) => `silver`, // optional
                                                    //     strokeWidth: 2, // optional
                                                    //     withDots: false, //a flage to make it hidden
                                                    // },

                                                    {
                                                        data: this.state.chartData, //, [210, 215, 240, 220, 210],
                                                        // color: (opacity = 1) => `silver`, // optional
                                                        // strokeWidth: 2 // optional
                                                        withDots: false, //a flage to make it hidden
                                                    },
                                                ],
                                            }}
                                            width={screenWidth}
                                            height={220}
                                            chartConfig={chartConfig}
                                            bezier
                                            withDots={true}
                                            withInnerLines={true}
                                            withOuterLines={false}
                                            withVerticalLines={false}
                                            withHorizontalLines={true}
                                            // yAxisSuffix={'V'}
                                            // fromNumber={260}
                                            // fromZero={false}
                                        />

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

    impulse_surges_item_img: {
        width: 346,
        height: 221,
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
        fontSize: 18,
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
});
