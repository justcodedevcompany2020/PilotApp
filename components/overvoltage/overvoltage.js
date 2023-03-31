import React, { Component } from 'react';
import Svg, {Path, Rect, Circle, Defs, Stop, ClipPath, G, Mask} from "react-native-svg";
import { StatusBar } from 'expo-status-bar';
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
    Pressable, Platform,
} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import AsyncStorage from "@react-native-async-storage/async-storage";


import {
    SafeAreaView,
    SafeAreaProvider,
    SafeAreaInsetsContext,
    useSafeAreaInsets,
    initialWindowMetrics,
} from 'react-native-safe-area-context';
import TopMenu from "../includes/header_menu";
import moment from "moment";
import {WebView} from "react-native-webview";

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
            undervoltage_item_info: 0,
            limit: this.props.overvoltage_limit,
            upper_voltage_trigger: this.props.upper_voltage_trigger,
            peak_value: 0,
            todayDate: '',
            total_duration: 0,

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

        this.webviewRef = React.createRef()

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

        // date_begin = '2022-09-01';
        // date_end = '2022-09-06';

        let url = `https://apiv1.zis.ru/tests/voltage_problems/${id}?date_begin=${date_begin}&date_end=${date_end}&data_type=overvoltage&period=${chart_type}`;

        console.log(url)

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

                console.log(response, 'responsedwdwdw')

                if (response.hasOwnProperty('statusCode') && response.statusCode == 400 || response.hasOwnProperty('statusCode') && response.statusCode == 403) {
                    await this.setState({
                        chartData: [],
                        peak_value: 0,
                        total_duration: 0,
                        undervoltage_item_info: 0
                    })
                } else {
                    await this.setState({
                        chartData: response.data,
                        peak_value: response.peakVoltage ? parseFloat(response.peakVoltage) : 0,
                        total_duration: response.duration ? parseFloat(response.duration) : 0,
                        undervoltage_item_info: response.promlemVoltagePercentage ? parseFloat(response.promlemVoltagePercentage) : 0
                    })
                }

                await callback();

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

        let {chartData, chart_type, upper_voltage_trigger} = this.state;

        for (const item in chartData) {
            chartData[item].voltage = parseFloat(chartData[item].voltage);
        }

        for (const item in chartData) {
            let timestamp = chartData[item].timestamp;
            timestamp = timestamp.split('.')[0];
            chartData[item].timestamp = timestamp;
        }

        //
        // chartData.sort(function(a, b) {
        //     return a.timestamp2 - b.timestamp2;
        // })
        //
        //
        // let chartData1 = [];
        // for (let i = 1; i <= 24; i++) {
        //
        //     // chartData1.push( [i.toString(), 0])
        //
        //     chartData1.push( [i.toString(), this.state.peak_value, this.state.peak_value]);
        //
        // }
        //
        // for (const item in chartData)
        // {
        //     let day = chartData[item].timestamp2;
        //     let day_without_zero = day < 10 ? parseInt(day) : day;
        //     console.log(day_without_zero, 'day_without_zero')
        //     if(day_without_zero == 0) {
        //         chartData1[day_without_zero][1] = parseFloat(chartData[item].voltage);
        //         // chartData1[day_without_zero][2] = parseFloat(this.state.limit);
        //     } else {
        //         chartData1[day_without_zero-1][1] = parseFloat(chartData[item].voltage);
        //         // chartData1[day_without_zero-1][2] = parseFloat(this.state.limit);
        //     }
        // }
        //
        //
        // let newChartData1 = chartData1.slice();
        // newChartData1.unshift(['label', 'voltage', 'limit']);
        // chartData1 = newChartData1;
        // console.log(chartData1, 'chartData1')

        await this.setState({
            chart_show:true,
            // chartData: chartData1,
            chartData: chartData,
        })


        // let jsonChartData1 = JSON.stringify(chartData1);
        let jsonChartData1 = JSON.stringify({data: chartData, chart_type: chart_type, upper_voltage_trigger: upper_voltage_trigger});
        this.webviewRef.current.postMessage(jsonChartData1);

        console.log(jsonChartData1, 'jsonChartData1jsonChartData1')



        // console.log(chartData, 'chartData');

       //  let chartData1 = [];
       //  for (const item in chartData) {
       //      chartData1.push(parseFloat(chartData[item].voltage));
       //  }
       //
       //  let chartLabels = [];
       //  for (const item in chartData) {
       //      chartLabels.push(chartData[item].timestamp2+':00');
       //  }
       //
       //  chartLabels = [... new Set(chartLabels)] // get uniques value;
       //
       //  // console.log(chartData1, 'chartData1chartData1chartData1')
       //  console.log(chartLabels, 'chartLabels')
       //  // console.log([... new Set(chartLabels)], 'chartLabelschartLabels')
       //
       // await this.setState({
       //      chart_show:true,
       //      chartData: chartData1.length > 0 ? chartData1 : [0],
       //      // chart_labels: ['10', '11','12','13','14','15','16','17','18','19','20'],
       //      chart_labels: chartLabels ,
       //  })

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
        let futureMonth =  moment(test_start_date).add(1, 'W').subtract(1, "days");
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

        let {chartData,chart_type, upper_voltage_trigger, language_name} = this.state;

        for (const item in chartData) {
            chartData[item].timestamp = moment(chartData[item].timestamp).format('YYYY-MM-DD');
            chartData[item].voltage = parseFloat(chartData[item].voltage);
        }

        // for (const item in chartData) {
        //     let timestamp = chartData[item].timestamp;
        //     timestamp = timestamp.split('.')[0];
        //     chartData[item].timestamp = timestamp;
        // }

        // chartData.chart_type = chart_type
        // for (const item in chartData) {
        //     let timestamp = chartData[item].timestamp
        //     let new_timestamp = new Date(timestamp);
        //     let hours = new_timestamp.getDay();
        //     chartData[item].timestamp2 = hours;
        // }

        // chartData.sort(function(a, b) {
        //     return a.timestamp2 - b.timestamp2;
        // })


        // console.log(chartData, 'chartData');
        //
        // let chartData1 = [];
        //
        // for (let i = 1; i <= 7; i++) {
        //
        //     let week_name = '';
        //
        //     if(i == 1) {
        //         week_name = 'ПН'
        //     } else if(i == 2) {
        //         week_name = 'ВТ'
        //     } else if(i == 3) {
        //         week_name = 'СР'
        //     } else if(i == 4) {
        //         week_name = 'ЧТ'
        //     } else if(i == 5) {
        //         week_name = 'ПТ'
        //     } else if(i == 6) {
        //         week_name = 'СБ'
        //     } else if(i == 7) {
        //         week_name = 'ВС'
        //     }
        //
        //     chartData1.push( [week_name, this.state.peak_value, this.state.peak_value])
        // }
        //
        // console.log(chartData1, 'chartData1');
        //
        //
        // for (const item in chartData)
        // {
        //     let day = chartData[item].timestamp2;
        //     let day_without_zero = day == 0 ? 7 : day;
        //
        //     chartData1[day_without_zero-1][1] = parseFloat(chartData[item].voltage);
        // }
        // console.log(chartData1, 'chartData1');
        //
        //
        // console.log(chartData, 'chartData');
        //
        // let newChartData1 = chartData1.slice();
        // newChartData1.unshift(['Label', 'voltage', 'Limit']);
        // chartData1 = newChartData1;
        //
        // console.log(chartData1, 'chartData1')
        // console.log(chartData, 'chartDatachartData')

        let jsonChartData1 = JSON.stringify({
            data: chartData,
            chart_type: chart_type,
            upper_voltage_trigger: upper_voltage_trigger,
            language_name:language_name
        });
        this.setState({
            chart_show:true,
            chartData: chartData,
        })

        console.log(jsonChartData1, 'jsonChartData1 WEEEEKKK')
        this.webviewRef.current.postMessage(jsonChartData1);




        // console.log(chartData, 'chartData');
        //
        // let chartData1 = [];
        // for (const item in chartData) {
        //     chartData1.push(chartData[item].voltage);
        // }
        //
        // let chartLabels = [];
        // for (const item in chartData) {
        //     chartLabels.push(chartData[item].timestamp2);
        // }
        // chartLabels = [... new Set(chartLabels)] // get uniques value;
        //
        // for (const chartLabelsItem in chartLabels) {
        //
        //     if(chartLabels[chartLabelsItem] == 1) {
        //         chartLabels[chartLabelsItem] = 'ПН'
        //     } else if(chartLabels[chartLabelsItem] == 2) {
        //         chartLabels[chartLabelsItem] = 'ВТ'
        //     } else if(chartLabels[chartLabelsItem] == 3) {
        //         chartLabels[chartLabelsItem] = 'СР'
        //     } else if(chartLabels[chartLabelsItem] == 4) {
        //         chartLabels[chartLabelsItem] = 'ЧТ'
        //     } else if(chartLabels[chartLabelsItem] == 5) {
        //         chartLabels[chartLabelsItem] = 'ПТ'
        //     } else if(chartLabels[chartLabelsItem] == 6) {
        //         chartLabels[chartLabelsItem] = 'СБ'
        //     } else if(chartLabels[chartLabelsItem] == 0) {
        //         chartLabels[chartLabelsItem] = 'ВС'
        //     }
        //
        // }
        //
        // this.setState({
        //     chart_show:true,
        //     chartData: chartData1.length > 0 ? chartData1 : [0],
        //     chart_labels: chartLabels,
        // })

    }

    pressToMonth = async () => {

        let test_start_date = moment(this.props.test_report_start_time);
        let test_end_date = moment(this.props.test_report_end_time);

        let futureMonth =  moment(test_start_date.format('YYYY-MM-DD')).add(1, 'M').subtract(1, "days");
        let lastday = moment(futureMonth).format('YYYY-MM-DD')
        let check = test_end_date.diff(test_start_date, 'months');

        this.setState({
            date_begin: test_start_date.format('YYYY-MM-DD'),
            date_end:   check == 0 ? test_end_date.format('YYYY-MM-DD') : lastday,
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

        let {chartData,chart_type, upper_voltage_trigger, language_name} = this.state;

        for (const item in chartData) {
            chartData[item].timestamp = moment(chartData[item].timestamp).format('YYYY-MM-DD');
            chartData[item].voltage = parseFloat(chartData[item].voltage);
        }
        chartData.chart_type = chart_type;

        await this.setState({
            chart_show:true,
            // chartData: chartData1,
            chartData: chartData,
        })


        // let jsonChartData1 = JSON.stringify(chartData1);
        let jsonChartData1 = JSON.stringify({
            data: chartData,
            chart_type: chart_type,
            upper_voltage_trigger: upper_voltage_trigger,
            language_name:language_name
        });
        this.webviewRef.current.postMessage(jsonChartData1);

        console.log(jsonChartData1, 'jsonChartData1jsonChartData1')

        // for (const item in chartData) {
        //     let timestamp = chartData[item].timestamp
        //     let new_timestamp = new Date(timestamp);
        //
        //     let hours = timestamp.split('T')[0];
        //     chartData[item].timestamp2 = hours.slice(-2);
        //
        //     console.log(timestamp + '==d==' + hours.slice(-2));
        //
        //     // let hours = new_timestamp.getDay();
        //     // chartData[item].timestamp2 = hours;
        //
        // }
        //
        // chartData.sort(function(a, b) {
        //     return a.timestamp2 - b.timestamp2;
        // })
        //
        //
        // let chartData1 = [];
        //
        // for (let i = 1; i <= 30; i++) {
        //     chartData1.push( [i.toString(), this.state.peak_value, this.state.peak_value ])
        // }
        //
        // for (const item in chartData)
        // {
        //     let day = chartData[item].timestamp2;
        //     let day_without_zero = day < 10 ? day.slice(1) :  day;
        //     chartData1[day_without_zero-1][1] = parseFloat(chartData[item].voltage);
        // }
        //
        // let newChartData1 = chartData1.slice();
        // newChartData1.unshift(['Label', 'voltage', 'limit']);
        // chartData1 = newChartData1;
        //
        // console.log(chartData1, 'chartData1')
        // console.log(chartData, 'chartDatachartData')
        //
        // let jsonChartData1 = JSON.stringify(chartData1);
        // this.webviewRef.current.postMessage(jsonChartData1);
        //
        // this.setState({
        //     chart_show:true,
        //     chartData: chartData1,
        // })


        //
        // let chartData1 = [];
        // for (const item in chartData) {
        //     chartData1.push(parseFloat(chartData[item].voltage));
        // }
        // console.log(chartData1, 'chartData');
        //
        // let chartLabels = [];
        // for (const item in chartData) {
        //     chartLabels.push(chartData[item].timestamp2);
        // }
        // chartLabels = [... new Set(chartLabels)] // get uniques value;
        //
        // this.setState({
        //     chart_show:true,
        //     chartData: chartData1.length > 0 ? chartData1 : [0],
        //     chart_labels: chartLabels,
        // })

    }



    componentDidMount() {
        const { navigation } = this.props;
        // this.setLanguageFromStorage();
        // this.pressToDay()
        this.focusListener = navigation.addListener("focus", () => {
            this.setLanguageFromStorage();
            // this.pressToDay()
        });
    }
    componentWillUnmount() {
        if (this.focusListener) {
            this.focusListener();
        }
    }


    goToPrevDay = async () => {

        let {date_begin, chart_type, chart_show} = this.state;

        console.log(chart_show, 'chart_show')
        if (!chart_show) {
            return false
        }

        console.log(date_begin, 'date_begin')
        const date = new Date(date_begin);
        console.log(date, 'date')

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

    // goToPrevWeek = async () => {
    //
    //     let {date_begin, date_end, chart_type, chart_show} = this.state;
    //     if (!chart_show) {
    //         return false
    //     }
    //
    //     let dateOffset = (24*60*60*1000) * 7; //6 days
    //     let firstday = new Date(date_begin);
    //     firstday.setTime(firstday.getTime() - dateOffset);
    //     firstday = moment(firstday).format('YYYY-MM-DD')
    //
    //     let date = new Date().getDate();
    //     date = date < 10 ? `0${date}` : date;
    //     let month = new Date().getMonth() + 1;
    //     let year = new Date().getFullYear();
    //     let lastday =  year + '-' + month + '-' + date;//format: yyyy-mm-dd;
    //
    //     console.log(firstday, 'firstday')
    //     console.log(date_begin, 'lastday')
    //     await this.setState({
    //         date_begin:firstday,
    //         date_end:date_begin
    //     })
    //     await this.pressToWeekAfterPressToArrow();
    // }
    //
    //
    // goToNextWeek = async () => {
    //
    //     let {date_begin, date_end, chart_type, chart_show} = this.state;
    //     if (!chart_show) {
    //         return false
    //     }
    //     let dateOffset = (24*60*60*1000) * 7; //6 days
    //     let firstday = new Date(date_end);
    //     firstday.setTime(firstday.getTime() + dateOffset);
    //     firstday = moment(firstday).format('YYYY-MM-DD')
    //
    //     let date = new Date().getDate();
    //     date = date < 10 ? `0${date}` : date;
    //     let month = new Date().getMonth() + 1;
    //     let year = new Date().getFullYear();
    //     let lastday =  year + '-' + month + '-' + date;//format: yyyy-mm-dd;
    //
    //     console.log(date_end, 'date_end')
    //     console.log(firstday, 'firstday')
    //     await this.setState({
    //         date_begin:date_end,
    //         date_end:firstday
    //     })
    //     await this.pressToWeekAfterPressToArrow();
    //
    // }

    goToPrevWeek = async () => {

        let {date_begin, date_end, chart_type, chart_show} = this.state;
        if (!chart_show) {
            return false
        }

        let futureMonth =  moment(date_begin).subtract(6, "day");
        let lastday = moment(futureMonth).format('YYYY-MM-DD')

        await this.setState({
            date_begin:lastday,
            date_end:date_begin
        })

        await this.pressToWeekAfterPressToArrow();


    }
    goToNextWeek = async () => {

        let {date_begin, date_end, chart_type, chart_show} = this.state;
        let futureMonth =  moment(date_end).add(1, 'W').subtract(1, "days");
        let lastday = moment(futureMonth).format('YYYY-MM-DD')

        await this.setState({
            date_begin:date_end,
            date_end:lastday
        })
        await this.pressToWeekAfterPressToArrow();

    }

    goToPrevMonth = async () => {

        let {date_begin, date_end, chart_type, chart_show} = this.state;
        if (!chart_show) {
            return false
        }
        let dateOffset = (24*60*60*1000) * 30; //6 days
        let firstday = new Date(date_begin);
        firstday.setTime(firstday.getTime() - dateOffset);
        firstday = moment(firstday).format('YYYY-MM-DD')

        console.log(firstday, 'firstday')
        console.log(date_begin, 'lastday');

        await this.setState({
            date_begin:firstday,
            date_end:date_begin
        })
        await this.pressToMonthAfterPressToArrow();
    }
    goToNextMonth = async () => {

        let {date_begin, date_end, chart_type, chart_show} = this.state;
        if (!chart_show) {
            return false
        }
        let dateOffset = (24*60*60*1000) * 30; //6 days
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
        await this.pressToMonthAfterPressToArrow();

    }



    closeMenu = () => {
        this.setState({
            headerMenuPopup: false
        })
    }




    printTotalDuration = () => {


        let timestamp = this.state.total_duration;
        let hours = Math.floor(timestamp / 60 / 60);
        let minutes = Math.floor(timestamp / 60) - (hours * 60);
        let seconds = timestamp % 60;
        let formatted = hours + 'h ' + minutes + 'm ' + seconds+ 's';

        return formatted;
    }


    WebViewContent = () =>
    {
        let type = Platform.OS == 'android' ? 'document' : 'window';
        return `
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
            <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
            
              <script type="text/javascript">
                    ${type}.addEventListener("message", message => {
                  
                        google.charts.load('current', {'packages':['corechart']});
                        google.charts.setOnLoadCallback(drawVisualization);
                              
                        //Перевод
                        const translateMonth = {
                            en: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
                            ru: ["Янв","Фев","Мар","Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек"] 
                        };
                        const translateWeek = {
                            en: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
                            ru: ["ВС","ПН","ВТ","СР","ЧТ","ПТ","СБ"] 
                        };
                        const translateChart = {
                            chartDate: { en: 'Date', ru: 'Дата' },
                            chartRecomended: { en: 'Recomended', ru: 'Рекомендованое PILOT(R)' },
                            chartLimit: { en: 'Limit', ru: 'Предельное значение' },
                            chartValue: { en: 'Value', ru: 'Пиковое значение' },      
                        };
                              
                             
                              function drawVisualization() 
                              {
                                var chartData1 =  JSON.parse(message.data)     
                                // alert(typeof chartData1)
                                var language = 'ru'; //Локалмзация en | ru
                                var recommended = 255; //Граница рекомендуемого для оценки повышеного напряжения (всегда 255)
                                var userLimit = chartData1.upper_voltage_trigger  // 280; // Граница которую указал пользователь для тестирования
                           
                        //ПРимер по часам
                        //       var showAs = 'hours';
                                if(chartData1.chart_type == 'day') {
                                    showAs = 'hours';
                                }
                                
                                if(chartData1.chart_type == 'week') {
                                    showAs = 'week';
                                }
                                
                                if(chartData1.chart_type == 'month') {
                                    showAs = 'days';
                                }
                                
                                console.log(chartData1, 'dddddddddddddddddd')
                                var apiDataArray = chartData1.data;
                                //  var apiDataArray = [{"timestamp": '2023-01-10',  "voltage": 308}];
                                //  var apiDataArray = [{"timestamp":"2023-01-10","voltage":300}];
                        
                        //Готовим массив под наполнение
                                var dataArray = []; 
                                dataArray.push([// Заголовок графика ['Дата', 'Ркомендованное PILOT(R)', 'Граница',  'Пикоое значение']
                                translateChart.chartDate[language], 
                                  translateChart.chartRecomended[language], 
                                  translateChart.chartLimit[language],  
                                  translateChart.chartValue[language]
                                 ]), 
                                apiDataArray.forEach((element) => {
                                 
                                //Заголовки подписей
                                var caption = ''
                                var mydate = new Date(element.timestamp);
                                if ( showAs == 'days' ) { caption = mydate.getDate() + ' ' + translateMonth[language][mydate.getMonth()] };
                                if ( showAs == 'week' ) { caption = translateWeek[language][mydate.getDay()] };
                                if ( showAs == 'hours' ) { caption = mydate.getHours() + ':00'};   
                                   
                          dataArray.push([
                                  caption,  //Заголовок
                                    recommended,        //Рекомендованная граница
                                    userLimit,          // Пользовательская граница
                                    element.voltage//Целевое значение
                                    ]);
                        });
                                
                                
                        //Отправляем данные в диаграму        
                                var data = google.visualization.arrayToDataTable(dataArray);
                        
                        
                        //Рассчитываем границу графика для подрезки      
                        // var minimalValue = ( recommended > userLimit ) ? userLimit - 20 : recommended - 20;
                        var minimalValue = 220;
                        
                        //Настройки графиков
                                var options = {
                                  /*title : 'Monthly12',*/
                                  legend: 'none',
                                  vAxis: {
                                  /*title: 'V',*/
                                    /*scaleType: 'log',*/
                                    viewWindow: {min: minimalValue}, //подрезка графика
                                  },
                                  hAxis: {
                                 /*title: 'Date',*/
                                  },
                            
                                 
                                  series: {
                                    0: {type: 'area', color: '10BCCE', areaOpacity: 0.2,  lineWidth: 0}, //график рекомендуемых
                                    1: {type: 'line', color: 'ff0000'}, // красная линия
                                    2: {type: 'bars', color: 'F24A4A'} // данные
                                  }
                                };
                        
                                var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
                                chart.draw(data, options);
                              }

                    });

              </script>
              
            <div id="chart_div" style="width: 100%; height: 300px;"></div>`
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
                                <Text style={styles.all_devices_general_page_header_title}>{this.state.language.overvoltage}</Text>
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

                    <View style={{maxWidth: 350, alignSelf: 'center', width:'100%'}}>
                        <Svg width={83} height={83} viewBox="0 0 83 83" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <G clipPath="url(#clip0_2219_51)">
                                <Path d="M28.531 75.219H54.47M25.516 54.145a25.775 25.775 0 01-9.954-20.264c-.065-14.071 11.25-25.776 25.322-26.1a25.937 25.937 0 0116.632 46.331 7.845 7.845 0 00-3.047 6.193v1.945a2.594 2.594 0 01-2.594 2.594h-20.75a2.594 2.594 0 01-2.594-2.594v-1.945a7.91 7.91 0 00-3.015-6.16z" stroke="#D65751" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                                <Path fillRule="evenodd" clipRule="evenodd" d="M33.5 34.125a1.875 1.875 0 100-3.75 1.875 1.875 0 000 3.75zm16.875 0a1.875 1.875 0 100-3.75 1.875 1.875 0 000 3.75zM41.937 51a4.687 4.687 0 100-9.375 4.687 4.687 0 000 9.375zm0-1.875a2.813 2.813 0 100-5.625 2.813 2.813 0 000 5.625zm9.148-24.437l1.048 1.555-6.218 4.194-1.048-1.555 6.218-4.194zm-12.077 4.194l-1.048 1.555-6.218-4.194 1.048-1.555 6.218 4.194z" fill="#D65751"/>
                            </G>
                            <Defs>
                                <ClipPath id="clip0_2219_51">
                                    <Path fill="#fff" d="M0 0H83V83H0z" />
                                </ClipPath>
                            </Defs>
                        </Svg>
                    </View>

                    <ScrollView style={styles.all_devices_general_page_main_wrapper}>
                        <View style={styles.impulse_surges_items_main_wrapper}>

                            <View style={styles.impulse_surges_item_img_dates_info_wrapper}>

                                <View style={{height: 300, width: '100%',  marginBottom: 35}}>


                                    {!this.state.chart_show &&

                                        <View style={{zIndex: 99999, width: '100%', height: '100%', justifyContent:'center', alignItems:'center', position:'absolute', bottom:0, left:0, backgroundColor: 'white'}}>
                                            <ActivityIndicator size="large" color="#0000ff"/>
                                        </View>

                                    }

                                    {this.state.chart_show && this.state.chartData.length == 0 &&

                                        <View style={{paddingHorizontal: 25,zIndex: 99999, width: '100%', height: '100%', justifyContent:'center', alignItems:'center', position:'absolute', bottom:0, left:0, backgroundColor: 'white'}}>
                                            <Text style={{textAlign:'center'}}>
                                                {this.state.language.no_grafik_data}
                                                {/*Нет данных для отображение за выбранный период.*/}
                                            </Text>
                                        </View>
                                    }

                                    <WebView
                                        // onLoadStart={() => setVisible(true)}
                                        onLoad={() => this.pressToDay()}
                                        mixedContentMode="compatibility"
                                        ref={this.webviewRef}
                                        source={{ html: this.WebViewContent() }}
                                    />

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

                                {/*{this.state.chart_type == 'month' &&*/}
                                {/*   <View style={[styles.impulse_surges_change_date_buttons_info_wrapper]}>*/}

                                        {/*<TouchableOpacity*/}
                                        {/*    onPress={() => {*/}
                                        {/*        this.goToPrevMonth()*/}
                                        {/*    }}*/}
                                        {/*    style={styles.impulse_surges_change_minus_date_button}*/}
                                        {/*>*/}
                                        {/*    <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                                        {/*        <Path d="M9.633 0l1.406 1.406-8.297 8.227 8.297 8.226-1.406 1.407L0 9.633 9.633 0z" fill="#fff"/>*/}
                                        {/*    </Svg>*/}
                                        {/*</TouchableOpacity>*/}

                                        {/*<Text style={[styles.impulse_surges_change_date_info, {marginHorizontal: 15  }]}>{this.state.date_begin} - {this.state.date_end}</Text>*/}

                                        {/*<TouchableOpacity*/}
                                        {/*    onPress={() => {*/}
                                        {/*        this.goToNextMonth()*/}
                                        {/*    }}*/}
                                        {/*    style={styles.impulse_surges_change_plus_date_button}*/}
                                        {/*>*/}
                                        {/*    <Svg width={11} height={20} viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                                        {/*        <Path d="M1.401 0L0 1.406l8.268 8.227L0 17.859l1.401 1.407L11 9.633 1.401 0z" fill="#fff"/>*/}
                                        {/*    </Svg>*/}
                                        {/*</TouchableOpacity>*/}

                                      {/*</View>*/}
                                {/*// }*/}

                                <View  style={[styles.impulse_surges_dates_info_buttons_main_wrapper,  {marginTop: 29}]}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.pressToDay()
                                        }}
                                        style={[styles.impulse_surges_dates_info_button,  this.state.chart_type == 'day' ? styles.active_impulse_surges_dates_info_button : {}]}
                                    >
                                        <Text style={styles.impulse_surges_dates_info_button_text}>{this.state.language.day}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.pressToWeek()
                                        }}
                                        style={[styles.impulse_surges_dates_info_button, this.state.chart_type == 'week' ? styles.active_impulse_surges_dates_info_button : {}]}
                                    >
                                        <Text style={styles.impulse_surges_dates_info_button_text}>{this.state.language.week}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.pressToMonth()
                                        }}
                                        style={[styles.impulse_surges_dates_info_button, this.state.chart_type == 'month' ? styles.active_impulse_surges_dates_info_button : {}]}
                                    >
                                        <Text style={styles.impulse_surges_dates_info_button_text}>{this.state.language.month}</Text>
                                    </TouchableOpacity>
                                </View>


                                <View style={styles.impulse_surges_items_second_wrapper}>

                                    {/*<View style={styles.impulse_surges_item_icon_title_wrapper}>*/}
                                    {/*    <View style={styles.impulse_surges_item_icon}>*/}
                                    {/*        <Svg width={22} height={19} viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                                    {/*            <Path d="M11.323.004l9.904 18.274-20.777-.56L11.323.004z" fill="#F24A4A"/>*/}
                                    {/*        </Svg>*/}
                                    {/*    </View>*/}

                                    {/*    <Text style={styles.impulse_surges_item_info1}>{this.state.undervoltage_item_info}</Text>*/}
                                    {/*</View>*/}

                                    <View style={styles.impulse_surges_item}>
                                        <Text style={styles.impulse_surges_item_title}>{this.state.language.total_duration}</Text>
                                        <Text style={styles.impulse_surges_item_info}>
                                            {this.printTotalDuration()}
                                            {/*{this.state.total_duration}*/}
                                        </Text>
                                    </View>

                                    <View style={styles.impulse_surges_item}>
                                        <Text style={styles.impulse_surges_item_title}>{this.state.language.peak_value}</Text>
                                        <Text style={styles.impulse_surges_item_info}>{this.state.peak_value} {this.state.language.voltage_n}</Text>
                                    </View>
                                    <View style={styles.impulse_surges_item}>
                                        <Text style={styles.impulse_surges_item_title}>{this.state.language.limit}</Text>
                                        <Text style={styles.impulse_surges_item_info}>{this.state.limit} {this.state.language.voltage_n}</Text>
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
        width: 339,
        height: 221,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        marginBottom: 15,
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
        marginBottom: 20,
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
    active_impulse_surges_dates_info_button: {
        backgroundColor:'#05365a'
    }
});
