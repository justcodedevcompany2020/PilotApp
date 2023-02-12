import React, { Component } from 'react';
import Svg, {Path, Rect, Circle, Defs, Stop, ClipPath, G, Mask} from "react-native-svg";
import { StatusBar } from 'expo-status-bar';
import {AuthContext} from "../AuthContext/context";
import i18n from "i18n-js";
import {en, ru} from "../../i18n/supportedLanguages";
import { WebView } from 'react-native-webview';

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
import {LineChart, BarChart} from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import {clear} from "react-native/Libraries/LogBox/Data/LogBoxData";

const screenWidth = Dimensions.get("window").width;

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            headerMenuPopup: false,
            peak_limit: 0,
            peak_limit_dinamyc_count: 0,
            peak_value: '0',
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

            osciloscope_data: [],
            show_loader: false,
            show_error: false,
            request_status: '',
            request_date: moment().format("YYYY-MM-DD hh:mm:ss")

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

        if(this.props.prev_page == 'test_mode')
        {
            this.props.navigation.navigate("TestMode", {
                params: this.props.id,
                params2: null
            });

        } else if( this.props.prev_page == 'test_report') {

            this.props.navigation.navigate("TestReport", {
                params: this.props.id,
                params2:this.props.device_id
            });

        }

    }








    componentDidMount() {

        const { navigation } = this.props;
        // this.requestToOsciloscopeAndGetId()
        this.focusListener = navigation.addListener("focus", () => {
            this.requestToOsciloscopeAndGetId()
        });

    }

    componentWillUnmount() {
        clearInterval(this.interval);

        if (this.focusListener) {
            this.focusListener();
        }
    }

    closeMenu = () => {
        this.setState({
            headerMenuPopup: false
        })
    }

    requestToOsciloscopeAndGetId = async () => {

        clearInterval(this.interval);

        await this.setState({
            osciloscope_data: [],
            show_loader: true,
            show_error: false,
            request_status: 'pending',
            request_date: moment().format("YYYY-MM-DD hh:mm:ss")
        });

        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr   = 'Bearer ' + userToken;
        let {date_begin, date_end, chart_type, language_name} = this.state;
        // let device_id = this.props.id; // 10
        let device_id = 26; // 10

        console.log(AuthStr)
        console.log(`https://apiv1.zis.ru/tests/create_osci/${device_id}`);

        try {
            fetch(`https://apiv1.zis.ru/tests/create_osci/${device_id}`, {
                method: 'POST',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then((response) => {
                return response.json()
            }).then(async (response)  => {

                console.log(response, 'getOsciloscopeData');

                if(response.hasOwnProperty('error'))
                {
                    let error = language_name == 'ru' ? response.error.ru : response.language == 'en' ? response.error.en : response.error.en ;

                    console.log( error );

                    return false

                } else if(response.hasOwnProperty('id')) {

                    let request_id = response.id;
                    let interval_max_count = 30;

                    this.interval_count = 1;

                    this.interval = setInterval(() => {


                        if (this.interval_count > interval_max_count)
                        {
                            clearInterval(this.interval);
                            return false
                        }

                        this.getOsciloscopeData(request_id)

                        console.log(this.interval_count, 'this.interval_count')

                        // this.getOsciloscopeData(request_id)
                        this.interval_count = this.interval_count + 1;
                    }, 2000)


                }

                // await callback()
            })
        } catch (e) {
            console.log(e)
        }

    }


    getOsciloscopeData = async (request_id)=>
    {

        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr   = 'Bearer ' + userToken;
        let {date_begin, date_end, chart_type, language_name} = this.state;
        // let device_id = this.props.id; // 10

        console.log(AuthStr)
        console.log(`https://apiv1.zis.ru/tests/get_osci_data/${request_id}`);

        try {
            fetch(`https://apiv1.zis.ru/tests/get_osci_data/${request_id}`, {
                method: 'GET',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then((response) => {
                return response.json()
            }).then(async (response)  => {

                console.log(response, 'getOsciloscopeData');

                if (response.hasOwnProperty('data'))
                {
                    this.setState({
                        osciloscope_data: response.data,
                        show_loader: false,
                        show_error: false,
                        request_status: 'set_data',
                    });


                    clearInterval(this.interval);
                }

                else if(response.hasOwnProperty('request_status'))
                {
                    this.setState({
                        osciloscope_data: [],
                        show_loader: true,
                        show_error: false,
                        request_status: 'pending'
                    });

                } else if(response.hasOwnProperty('error')) {

                    let request_error_status = response.error;
                    let request_error_text = language_name == 'ru' ? response.description.ru : response.language == 'en' ? response.description.en : response.description.en ;

                    this.setState({
                        osciloscope_data: [],
                        show_loader: false,
                        show_error: true,
                        request_status: request_error_status, // no_connection | data_error
                        error_text: request_error_text
                    });

                    clearInterval(this.interval);

                }

                // await callback()
            })
        } catch (e) {
            console.log(e)
        }

    }


    getFatafromStateForChart = async () => {

        let {osciloscope_data, language_name} = this.state;

        let jsonChartData = JSON.stringify({data: osciloscope_data, language_name:language_name});

        console.log(jsonChartData);

        this.webviewRef.current.postMessage(jsonChartData);

    }

    render() {

        let {chartData} = this.state;

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
                                <Text style={styles.all_devices_general_page_header_title}>{this.state.language.osciloscope}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.all_devices_general_page_header_menu_btn} onPress={() => {this.setState({headerMenuPopup: true})}}>
                                <Svg width={28} height={25} viewBox="0 0 28 25" fill="none" xmlns="http://www.w3.org/2000/svg"><Path fill="#004B84" d="M0 0H28V3H0z" /><Path fill="#004B84" d="M0 11H28V14H0z" /><Path fill="#004B84" d="M0 22H28V25H0z" /></Svg>
                            </TouchableOpacity>

                        </View>

                    </View>


                    <View style={styles.impulse_surges_items_second_wrapper}>
                        <View style={styles.impulse_surges_item}>
                            <Text style={styles.impulse_surges_item_title}>
                                {this.state.language.request_date}
                            </Text>
                            <Text style={styles.impulse_surges_item_info}>
                                {this.state.request_date}

                                {/*{parseInt(this.state.peak_value).toFixed(1)} {this.state.language.voltage_n}*/}
                            </Text>
                        </View>
                    </View>


                    <ScrollView style={styles.all_devices_general_page_main_wrapper}>
                        <View style={styles.impulse_surges_items_main_wrapper}>

                            <View style={styles.impulse_surges_item_img_dates_info_wrapper}>


                                <View style={{height: 500, width: '100%', }}>


                                    {/*chartData*/}

                                    {this.state.show_error &&

                                       <View style={{flex:1, justifyContent:'center', alignItems:'center' }}>
                                           <Svg width={120} height={120} viewBox="0 0 81 81" fill="none" xmlns="http://www.w3.org/2000/svg">
                                               <Path d="M2.808 59.598c-2.606 0-2.606-3.962 0-3.962 10.923 0 19.777 8.854 19.777 19.777 0 2.606-3.962 2.606-3.962 0 0-8.735-7.08-15.815-15.815-15.815zM53.823 6.9c-1.677-1.982 1.34-4.536 3.018-2.554L66.74 16.06l9.898-11.713c1.677-1.982 4.694.572 3.017 2.554L69.327 19.12l10.328 12.223c1.677 1.98-1.34 4.535-3.017 2.553L66.74 22.184l-9.9 11.713c-1.677 1.982-4.694-.572-3.017-2.553l10.328-12.222L53.823 6.9zM2.808 26.52c-2.606 0-2.606-3.962 0-3.962 29.19 0 52.854 23.664 52.854 52.854 0 2.606-3.962 2.606-3.962 0C51.7 48.41 29.81 26.52 2.808 26.52zm0 16.538c-2.606 0-2.606-3.962 0-3.962 20.056 0 36.315 16.26 36.315 36.316 0 2.606-3.961 2.606-3.961 0 0-17.868-14.486-32.354-32.354-32.354z" fill="#10BCCE"/>
                                           </Svg>

                                           <Text style={{marginTop: 23, fontSize: 16, color: '#10BCCE'}}>
                                               {this.state.error_text}
                                           </Text>
                                       </View>
                                    }

                                    {this.state.show_loader && this.state.request_status === 'pending' &&

                                        <View style={{flex:1, justifyContent:'center', alignItems:'center' }}>

                                            {/*<Svg width={120} height={120} viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                                            {/*    <Path d="M54 10.125V27M22.95 22.95l11.813 11.813M10.125 54H27M22.95 85.05l11.813-11.813M54 97.875V81M85.05 85.05L73.237 73.237M97.875 54H81M85.05 22.95L73.237 34.763" stroke="#10BCCE" strokeWidth={3} strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round"/>*/}
                                            {/*</Svg>*/}

                                            <ActivityIndicator size="large" color="#10BCCE"/>


                                            <Text style={{marginTop: 23, fontSize: 16, color: '#10BCCE'}}>
                                                {this.state.language.request_in_progress}
                                            </Text>
                                        </View>

                                    }



                                    {this.state.osciloscope_data.length > 0  && this.state.show_loader == false  && this.state.show_error == false && this.state.request_status =='set_data' &&

                                        <WebView
                                            // onLoadStart={() => this.getFatafromStateForChart()}
                                            onLoad={() => this.getFatafromStateForChart()}
                                            mixedContentMode="compatibility"
                                            ref={this.webviewRef}
                                            source={{ html: `
                                            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
                                            <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    
                                              <script type="text/javascript">
    
                                               document.addEventListener("message", message => {
    
                                                      google.charts.load('current', {'packages':['corechart']});
                                                      google.charts.setOnLoadCallback(drawVisualization);
    
                                                //Перевод
                                                      const translateChart = {
                                                      chartDate: { en: 'Period', ru: 'Период' },
                                                      chartValue: { en: 'Value', ru: 'Значение' },
                                                       };
    
    
                                                      function drawVisualization() {
                                                        var chartData1 =  JSON.parse(message.data)     
                                                        var language = chartData1.language_name; //Локалмзация en | ru
                                                         var apiDataArray = chartData1.data;
    
                                                      //    var apiDataArray = [
                                                      //    0,
                                                      //    0.1,
                                                      //    0.3,
                                                      //    0.6,
                                                      //    0.7,
                                                      //    0.8,
                                                      //    0.85,
                                                      //    0.88,
                                                      //    0.91,
                                                      //    0.93,
                                                      //    0.94,
                                                      //    0.95,
                                                      //    0.96,
                                                      //    0.97,
                                                      //    0.98,
                                                      //    0.99,
                                                      //    1,
                                                      //    0.99,
                                                      //    0.98,
                                                      //    0.97,
                                                      //    0.96,
                                                      //    0.95,
                                                      //    0.94,
                                                      //    0.93,
                                                      //    0.91,
                                                      //    0.88,
                                                      //    0.85,
                                                      //    0.8,
                                                      //    0.7,
                                                      //    0.6,
                                                      //    0.3,
                                                      //    0.1,
                                                      //    0,
                                                      //    -0.1,
                                                      //    -0.3,
                                                      //    -0.6,
                                                      //    -0.7,
                                                      //    -0.8,
                                                      //    -0.85,
                                                      //    -0.88,
                                                      //    -0.91,
                                                      //    -0.93,
                                                      //    -0.94,
                                                      //    -0.95,
                                                      //    -0.96,
                                                      //    -0.97,
                                                      //    -0.98,
                                                      //    -0.99,
                                                      //    -1,
                                                      //    -0.99,
                                                      //    -0.98,
                                                      //    -0.97,
                                                      //    -0.96,
                                                      //    -0.95,
                                                      //    -0.94,
                                                      //    -0.93,
                                                      //    -0.91,
                                                      //    -0.88,
                                                      //    -0.85,
                                                      //    -0.8,
                                                      //    -0.7,
                                                      //    -0.6,
                                                      //    -0.3,
                                                      //    -0.1,
                                                      //    0
                                                      // ];
    
    
    
                                                //Готовим массив под наполнение
                                                        var dataArray = [];
                                                        var i = -1;
                                                        dataArray.push([// Заголовок графика ['Дата', 'значение']
                                                          translateChart.chartDate[language],
                                                          translateChart.chartValue[language]
                                                         ]),
    
                                                        apiDataArray.forEach((element) => {
    
                                                  dataArray.push([//готовим массив
                                                          i,
                                                            element//Целевое значение
                                                          ]);
    
                                                          i= i + 1/(apiDataArray.length-1)*2; //рассчитываем смещение
                                                });
    
    
                                                //Отправляем данные в диаграму
                                                        var data = google.visualization.arrayToDataTable(dataArray);
    
                                                //Настройки графиков
                                                        var options = {
                                                          legend: 'none',
                                                          width: 400,
                                                            height: 400,
                                                          vAxis: {
                                                            ticks: [-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1],
                                                          },
                                                          hAxis: {
                                                             ticks: [-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1]
                                                          },
                                                          series: {
                                                          0: {type: 'area', color: '004B84', areaOpacity: 0.1,  lineWidth: 3 },
                                                            }
                                                        };
    
                                                        var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
                                                        chart.draw(data, options);
                                                      }
                                              
                                              });
    
                                              </script>
                                                <div id="chart_div" style="width: 100%; height: 400px; overflow:hidden"></div>` }}
                                        />

                                    }

                                </View>


                                <TouchableOpacity style={[styles.osciloscope_refresh_button, this.state.show_loader && {backgroundColor:'#BDBDBD' }]}
                                  onPress={() => {
                                      if( this.state.osciloscope_data.length > 0  &&
                                          this.state.show_loader == false  &&
                                          this.state.show_error == false &&
                                          this.state.request_status =='set_data'
                                      ) {
                                          this.requestToOsciloscopeAndGetId()
                                      }

                                      else if( this.state.show_loader == false  &&
                                          this.state.show_error == true
                                      ) {
                                          this.requestToOsciloscopeAndGetId()
                                      }

                                  }}
                                >
                                    <Text style={[styles.osciloscope_refresh_button_text, this.state.show_loader && {color:'white' }]}>
                                        {this.state.language.refresh_text}
                                        {/*Refresh*/}
                                    </Text>
                                </TouchableOpacity>

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
        width: 313,
        height: 221,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
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
    },

    osciloscope_refresh_button: {
        width: '100%',
        height: 40,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#004B84',
        maxWidth: 326

    },
    osciloscope_refresh_button_text: {
        color: '#ffffff',
        fontWeight: '400',
        fontSize: 16,
    },
});
