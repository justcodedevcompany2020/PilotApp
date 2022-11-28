import React, { Component } from 'react';
import Svg, {Path, Rect, Circle, Defs, Stop, ClipPath, G, Mask} from "react-native-svg";
import { StatusBar } from 'expo-status-bar';
import DropDownPicker from "react-native-custom-dropdown";
import PieChart from 'react-native-expo-pie-chart';
import { VictoryPie } from "victory-native";
import DatePicker from 'react-native-datepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";


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
import pre_configuration from "../pre_configuration/pre_configuration";



export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            headerMenuPopup: false,
            powerProtectionSwitchValue: false,
            useScheduleSwitchValue: false,
            settingNameSwitchValue: false,
            pushNotificationsSwitchValue: false,
            setting_name1: '',
            setting_name2: '',
            setting_name3: '',
            setting_name4: '',


            edit_birth: '',
            edit_birth_error: false,
            edit_birth_valid: false,
            edit_birth_error_text: '',

            edit_birth2: '',
            edit_birth_error2: false,
            edit_birth_valid2: false,
            edit_birth_error_text2: '',

            turnOffTheLoadSwitchValuePopup: false,

            language: en,
            language_name: 'en',
            mainData: [],
            protection_upper_voltage_input: '',
            protection_lower_voltage_input: '',
            power_restore_delay_input: '',
            startup_delay_input: '',

            pre_configuration_popup: false,
            sort_by_pre_configuration1: true,
            sort_by_pre_configuration2: false,
            sort_by_pre_configuration3: false,
            sort_by_pre_configuration4: false,
            sort_by_pre_configuration5: false,

            protection_preset: '',
            shared_access_popup: false,


            SharedAccessPopup: false,
            email: '',

            protection_upper_voltage_input_error: false,
            protection_lower_voltage_input_error: false,
            power_restore_delay_input_error: false,
            startup_delay_input_error: false,
            protection_upper_voltage_popup: false,
            selectedUpperVoltageDelay: null,
            selectedLowerVoltageDelay: null,
            selectedAmperageDelay: null,
            upper_voltage_delay_popup: false,
            upper_voltage_delay_data: [
                {label: '0', value: '0'},
                {label: '0.5', value: '0.5'},
                {label: '1', value: '1'},
                {label: '1.5', value: '1.5'},
                {label: '2', value: '2'},
                {label: '2.5', value: '2.5'},
                {label: '3', value: '3'},
                {label: '3.5', value: '3.5'},
                {label: '4', value: '4'},
                {label: '4.5', value: '4.5'},
                {label: '5', value: '5'},
                {label: '5.5', value: '5.5'},
                {label: '6', value: '6'},
                {label: '6.5', value: '6.5'},
                {label: '7', value: '7'},
                {label: '7.5', value: '7.5'},
                {label: '8', value: '8'},
                {label: '8.5', value: '8.5'},
                {label: '9', value: '9'},
                {label: '9.5', value: '9.5'},
                {label: '10', value: '10'},
                {label: '10.5', value: '10.5'},
                {label: '11', value: '11'},
                {label: '11.5', value: '11.5'},
                {label: '12', value: '12'},
                {label: '12.5', value: '12.5'},
                {label: '13', value: '13'},
                {label: '13.5', value: '13.5'},
                {label: '14', value: '14'},
                {label: '14.5', value: '14.5'},
                {label: '15', value: '15'},
                {label: '15.5', value: '15.5'},
                {label: '16', value: '16'},
                {label: '16.5', value: '16.5'},
                {label: '17', value: '17'},
                {label: '17.5', value: '17.5'},
                {label: '18', value: '18'},
                {label: '18.5', value: '18.5'},
                {label: '19', value: '19'},
                {label: '19.5', value: '19.5'},
                {label: '20', value: '20'},
            ],
            lower_voltage_delay_popup: false,
            lower_voltage_delay_data: [
                {label: '0', value: '0'},
                {label: '0.5', value: '0.5'},
                {label: '1', value: '1'},
                {label: '1.5', value: '1.5'},
                {label: '2', value: '2'},
                {label: '2.5', value: '2.5'},
                {label: '3', value: '3'},
                {label: '3.5', value: '3.5'},
                {label: '4', value: '4'},
                {label: '4.5', value: '4.5'},
                {label: '5', value: '5'},
                {label: '5.5', value: '5.5'},
                {label: '6', value: '6'},
                {label: '6.5', value: '6.5'},
                {label: '7', value: '7'},
                {label: '7.5', value: '7.5'},
                {label: '8', value: '8'},
                {label: '8.5', value: '8.5'},
                {label: '9', value: '9'},
                {label: '9.5', value: '9.5'},
                {label: '10', value: '10'},
                {label: '10.5', value: '10.5'},
                {label: '11', value: '11'},
                {label: '11.5', value: '11.5'},
                {label: '12', value: '12'},
                {label: '12.5', value: '12.5'},
                {label: '13', value: '13'},
                {label: '13.5', value: '13.5'},
                {label: '14', value: '14'},
                {label: '14.5', value: '14.5'},
                {label: '15', value: '15'},
                {label: '15.5', value: '15.5'},
                {label: '16', value: '16'},
                {label: '16.5', value: '16.5'},
                {label: '17', value: '17'},
                {label: '17.5', value: '17.5'},
                {label: '18', value: '18'},
                {label: '18.5', value: '18.5'},
                {label: '19', value: '19'},
                {label: '19.5', value: '19.5'},
                {label: '20', value: '20'},
            ],
            upper_voltage_delay: '',
            lower_voltage_delay: '',
            amperage_delay: '',
            shared_accounts: [],

            shared_popup_email_error: false,
            shared_popup_email_error_text: '',
            amperage_trigger_input_error: false,
            amperage_trigger_input: '',

            week_days_popup: false,

            useWeekDayMondaySwitchValue: false,
            useWeekDayTuesdaySwitchValue: false,
            useWeekDayWednesdaySwitchValue: false,
            useWeekDayThursdaySwitchValue: false,
            useWeekDayFridaySwitchValue: false,
            useWeekDaySaturdaySwitchValue: false,
            useWeekDaySundaySwitchValue: false,
            schedule_days: '',
            isOpenDatePicker: false,
            isOpenDatePicker2: false,
            dateOriginValue: new Date(),

            timeOriginValue: '',
            timeLabelValue: '',
            showCloseDateButtonForIos: false,

            schedule_time_on: '',
            schedule_time_off: '',

            amperage_delay_popup: false,
            amperage_delay_data: [
                {label: '0', value: '0'},
                {label: '0.5', value: '0.5'},
                {label: '1', value: '1'},
                {label: '1.5', value: '1.5'},
                {label: '2', value: '2'},
                {label: '2.5', value: '2.5'},
                {label: '3', value: '3'},
                {label: '3.5', value: '3.5'},
                {label: '4', value: '4'},
                {label: '4.5', value: '4.5'},
                {label: '5', value: '5'},
                {label: '5.5', value: '5.5'},
                {label: '6', value: '6'},
                {label: '6.5', value: '6.5'},
                {label: '7', value: '7'},
                {label: '7.5', value: '7.5'},
                {label: '8', value: '8'},
                {label: '8.5', value: '8.5'},
                {label: '9', value: '9'},
                {label: '9.5', value: '9.5'},
                {label: '10', value: '10'},
                {label: '10.5', value: '10.5'},
                {label: '11', value: '11'},
                {label: '11.5', value: '11.5'},
                {label: '12', value: '12'},
                {label: '12.5', value: '12.5'},
                {label: '13', value: '13'},
                {label: '13.5', value: '13.5'},
                {label: '14', value: '14'},
                {label: '14.5', value: '14.5'},
                {label: '15', value: '15'},
                {label: '15.5', value: '15.5'},
                {label: '16', value: '16'},
                {label: '16.5', value: '16.5'},
                {label: '17', value: '17'},
                {label: '17.5', value: '17.5'},
                {label: '18', value: '18'},
                {label: '18.5', value: '18.5'},
                {label: '19', value: '19'},
                {label: '19.5', value: '19.5'},
                {label: '20', value: '20'},
            ]

        };

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

    powerProtectionToggleSwitch = (value) => {
        this.setState({ powerProtectionSwitchValue: value });
    };
    useScheduleToggleSwitch = async (value) => {

        await this.setState({ useScheduleSwitchValue: value });

        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;
        let id = this.props.id;

        try {
            fetch(`https://apiv1.zis.ru/devices/`+ id, {
                method: 'PATCH',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    use_schedule: value,
                })
            }).then((response) => {
                return response.json()
            }).then((response) => {
                console.log(response, ' DEVICE Data')
                this.getDeviceData();
            })
        } catch (e) {
            console.log(e)
        }
    };


    timeOn = () => {
        this.setState({
            isOpenTimePicker: true,
        })
    }
    timeOff = () => {
        this.setState({
            isOpenTimePicker2: true,
        })
    }


    saveWeekDays = async () => {
        let {useWeekDayMondaySwitchValue, useWeekDayTuesdaySwitchValue, useWeekDayWednesdaySwitchValue, useWeekDayThursdaySwitchValue, useWeekDayFridaySwitchValue, useWeekDaySaturdaySwitchValue, useWeekDaySundaySwitchValue} = this.state;

        let week_days_switch_values_quantity = '';

        if (useWeekDayMondaySwitchValue === true) {
            week_days_switch_values_quantity += 1;
        }
        if (useWeekDayTuesdaySwitchValue === true) {
            week_days_switch_values_quantity += '2';
        }

        if (useWeekDayWednesdaySwitchValue === true) {
            week_days_switch_values_quantity += '3';
        }

        if (useWeekDayThursdaySwitchValue === true) {
            week_days_switch_values_quantity += '4';
        }

        if (useWeekDayFridaySwitchValue === true) {
            week_days_switch_values_quantity += '5';
        }

        if (useWeekDaySaturdaySwitchValue === true) {
            week_days_switch_values_quantity += '6';
        }


        if (useWeekDaySundaySwitchValue === true) {
            week_days_switch_values_quantity += '7';
        }

        if(week_days_switch_values_quantity == '') {
            this.setState({
                week_days_popup: false,
            })
            return false
        }

        console.log(week_days_switch_values_quantity, 'week_days_switch_values_quantity')


        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;
        let id = this.props.id;

        try {
            fetch(`https://apiv1.zis.ru/devices/`+ id, {
                method: 'PATCH',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    schedule_days: week_days_switch_values_quantity.toString(),
                })

            }).then((response) => {
                return response.json()
            }).then((response) => {

                console.log(response, ' DEVICE Data')



                this.getDeviceData();
                this.setState({
                    week_days_popup: false,
                })

            })
        } catch (e) {
            console.log(e)
        }
    }

    useWeekDayMondayToggleSwitch = async (value) => {
        this.setState({ useWeekDayMondaySwitchValue: value });


    };
    useWeekDayTuesdayToggleSwitch =  (value) => {
        this.setState({ useWeekDayTuesdaySwitchValue: value });


    };
    useWeekDayWednesdayToggleSwitch =  (value) => {
        this.setState({ useWeekDayWednesdaySwitchValue: value });

    };
    useWeekDayThursdayToggleSwitch =  (value) => {
        this.setState({ useWeekDayThursdaySwitchValue: value });

    };
    useWeekDayFridayToggleSwitch =  (value) => {
        this.setState({ useWeekDayFridaySwitchValue: value });

    };
    useWeekDaySaturdayToggleSwitch =  (value) => {
        this.setState({ useWeekDaySaturdaySwitchValue: value });

    };
    useWeekDaySundayToggleSwitch =  (value) => {
        this.setState({ useWeekDaySundaySwitchValue: value });
    };

    settingNameToggleSwitch = (value) => {
        this.setState({ settingNameSwitchValue: value });
    };
    pushNotificationsToggleSwitch  = async (value) => {
        this.setState({ pushNotificationsSwitchValue: value });

        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;
        let id = this.props.id;

        try {
            fetch(`https://apiv1.zis.ru/devices/`+ id, {
                method: 'PATCH',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    notification_enabled: value,
                })
            }).then((response) => {
                return response.json()
            }).then((response) => {

                console.log(response, 'pushNotificationsToggleSwitch')
                this.getDeviceData();
            })
        } catch (e) {
            console.log(e)
        }

    };

    redirectToDetailsGeneralPage = () => {
        this.props.navigation.navigate("DetailsGeneralPage", {
            params: this.props.id,
        });
    }
    redirectToSharedAccess= () => {
        this.props.navigation.navigate("SharedAccess");

    }

    redirectToPreConfiguration = () => {
        this.props.navigation.navigate("PreConfiguration");

    }

    dateBirth = (date) => {
        this.setState({
            edit_birth: date,
            edit_birth_error: false,
            edit_birth_valid: true,
        })

    }
    dateBirth2 = (date) => {
        this.setState({
            edit_birth2: date,
            edit_birth_error2: false,
            edit_birth_valid2: true,
        })

    }

    setLanguageFromStorage = async ()=> {

        await AsyncStorage.getItem('language',(err,item) => {

            let language = item ? JSON.parse(item) : {};


            if (language.hasOwnProperty('language')) {
                //
                // console.log(language, 'language')
                //
                // return false;

                // i18n.locale = language.language;
                // i18n.locale = ru;

                this.setState({
                    language: language.language == 'ru' ? ru : language.language == 'en' ?  en : en ,
                    language_name: language.language == 'ru' ? 'ru' : language.language == 'en' ?  'en'  : 'en',
                    selectedLanguage:  language.language == 'ru' ? 'ru' : language.language == 'en' ?  'en'  : 'en'

                })


            } else {

                // i18n.locale = 'en';
                this.setState({
                    language: en,
                    language_name: 'en'
                })
            }


        })

    }



    getDeviceData = async () => {

        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;
        let id = this.props.id;

        try {
            fetch(`https://apiv1.zis.ru/devices/`+ id, {
                method: 'GET',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },


            }).then((response) => {
                return response.json()
            }).then((response) => {

                console.log(response, ' DEVICE Data')

                console.log(response.shared_accounts, 'response.shared_accounts');

                let schedule_days = response.schedule_days ? response.schedule_days : '';
                schedule_days = schedule_days.split('')

                console.log(schedule_days,'schedule_days')

                let useWeekDayMondaySwitchValue = false;
                let useWeekDayTuesdaySwitchValue = false;
                let useWeekDayWednesdaySwitchValue = false;
                let useWeekDayThursdaySwitchValue = false;
                let useWeekDayFridaySwitchValue = false;
                let useWeekDaySaturdaySwitchValue = false;
                let useWeekDaySundaySwitchValue = false;


                for (const schedule_day in schedule_days) {
                    console.log(schedule_days[schedule_day])

                    if (schedule_days[schedule_day] == 1) {
                        useWeekDayMondaySwitchValue = true;
                    }
                    else if (schedule_days[schedule_day] == 2) {
                        useWeekDayTuesdaySwitchValue = true;
                    }
                    else if (schedule_days[schedule_day] == 3) {
                        useWeekDayWednesdaySwitchValue = true;
                    }
                    else if (schedule_days[schedule_day] == 4) {
                        useWeekDayThursdaySwitchValue = true;
                    }
                    else if (schedule_days[schedule_day] == 5) {
                        useWeekDayFridaySwitchValue = true;
                    }
                    else if (schedule_days[schedule_day] == 6) {
                        useWeekDaySaturdaySwitchValue = true;
                    }
                    else if (schedule_days[schedule_day] == 7) {
                        useWeekDaySundaySwitchValue = true;
                    }

                }

                this.setState({
                    mainData: response,
                    shared_accounts: response.shared_accounts,
                    protection_upper_voltage_input: response.upper_voltage_trigger ? response.upper_voltage_trigger.toString() : '',
                    protection_lower_voltage_input:  response.lower_voltage_trigger ? response.lower_voltage_trigger.toString() : '',
                    power_restore_delay_input:   response.power_restore_delay ? response.power_restore_delay.toString() : '',
                    startup_delay_input:  response.startup_delay ? response.startup_delay.toString() : '',
                    amperage_trigger_input:  response.amperage_trigger ? response.amperage_trigger.toString() : '',
                    useScheduleSwitchValue: response.use_schedule,
                    pushNotificationsSwitchValue: response.notification_enabled,
                    powerProtectionSwitchValue: response.protection_is_on,
                    protection_preset: response.protection_preset,
                    upper_voltage_delay: response.upper_voltage_delay ? parseFloat(response.upper_voltage_delay).toFixed(1) : 0,
                    lower_voltage_delay: response.lower_voltage_delay ? parseFloat(response.lower_voltage_delay).toFixed(1) : 0,
                    amperage_delay: response.amperage_delay ? parseFloat(response.amperage_delay).toFixed(1) : 0,

                    sort_by_pre_configuration1: response.protection_preset == 'AV' ? true : false,
                    sort_by_pre_configuration2:  response.protection_preset == 'Air conditioner' ? true : false,
                    sort_by_pre_configuration3: response.protection_preset == 'Refrigerator' ? true : false,
                    sort_by_pre_configuration4: response.protection_preset == 'Other home  appliance' ? true : false,
                    sort_by_pre_configuration5: response.protection_preset == 'Manual setup' ? true : false,
                    schedule_days: response.schedule_days,
                    schedule_time_on: response.schedule_time_on,
                    schedule_time_off: response.schedule_time_off,

                    useWeekDayMondaySwitchValue: useWeekDayMondaySwitchValue,
                    useWeekDayTuesdaySwitchValue: useWeekDayTuesdaySwitchValue,
                    useWeekDayWednesdaySwitchValue: useWeekDayWednesdaySwitchValue,
                    useWeekDayThursdaySwitchValue: useWeekDayThursdaySwitchValue,
                    useWeekDayFridaySwitchValue: useWeekDayFridaySwitchValue,
                    useWeekDaySaturdaySwitchValue: useWeekDaySaturdaySwitchValue,
                    useWeekDaySundaySwitchValue: useWeekDaySundaySwitchValue,

                })





            })
        } catch (e) {
            console.log(e)
        }

    }





    componentDidMount() {
        const { navigation } = this.props;
        this.setLanguageFromStorage();
        this.getDeviceData();
        this.focusListener = navigation.addListener("focus", () => {

            this.setLanguageFromStorage();
            this.getDeviceData();


        });

    }

    componentWillUnmount() {
        // Remove the event listener
        if (this.focusListener) {
            this.focusListener();
            // console.log('Bum END')
        }

    }


    closeMenu = () => {
        this.setState({
            headerMenuPopup: false
        })
    }

//onChangeTime
    onChangeTurnOnTime = async (event, timeOriginValue) => {



        console.log(timeOriginValue, 'timeOriginValue')
        // console.log( moment().format("HH:mm:ss"), 'Cureent time');
        // console.log( moment(timeOriginValue).format("HH:mm:ss"), ' moment(timeOriginValue).format("hh:mm:ss"),')

        if (event.type != 'set' ) {
            await this.setState({
                isOpenTimePicker: false
            })
            return false
        }



        await this.setState({
            timeOriginValue: timeOriginValue,
            timeLabelValue: moment(timeOriginValue).format("HH:mm"),
            turnOnTime: moment(timeOriginValue).format("HH:mm"),
            // isOpenTimePicker: Platform.OS !== "ios" ? false : true,
            isOpenTimePicker: false
            // showCloseDateButtonForIos: true
        })
        //
        // await AsyncStorage.setItem('timerEndTime', JSON.stringify(timeOriginValue));

        this.saveTimeOn();
        console.log(moment(timeOriginValue).format("HH:mm"), 'date time');

    }
    onChangeTurnOffTime = async (event, timeOriginValue) => {
        console.log(timeOriginValue, 'timeOriginValuewwwwww')

        if (event.type != 'set' ) {
            await this.setState({
                isOpenTimePicker2: false
            })
            return false
        }

        await this.setState({
            timeOriginValue: timeOriginValue,
            timeLabelValue: moment(timeOriginValue).format("HH:mm"),
            turnOffTime: moment(timeOriginValue).format("HH:mm"),
            isOpenTimePicker2: false
        })
        console.log(moment(timeOriginValue).format("HH:mm"), 'date time');
        this.saveTimeOff();

    }


    chooseNewPreConfiguration = async (key) => {

        let value = '';

        if(key === 'sort_by_pre_configuration1') {
            value = 'AV'
        }

        if(key === 'sort_by_pre_configuration2') {
            value = 'Air conditioner'
        }

        if(key === 'sort_by_pre_configuration3') {
            value = 'Refrigerator'
        }

        if(key === 'sort_by_pre_configuration4') {
            value = 'Other home  appliance'
        }

        if(key === 'sort_by_pre_configuration5') {
            value = 'Manual setup'
        }

        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;
        let id = this.props.id;

        try {
            fetch(`https://apiv1.zis.ru/devices/`+ id, {
                method: 'PATCH',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    protection_preset: value,

                })



            }).then((response) => {
                return response.json()
            }).then((response) => {

                console.log(response, ' DEVICE Data')
                this.setState({
                    // name: this.state.edit_name,
                    pre_configuration_popup: false,
                })
                this.getDeviceData();
            })
        } catch (e) {
            console.log(e)
        }

    }

    chooseProtectionUpperVoltage = async (val) => {

         val = val.replace(/\D/g, '');

        this.setState({protection_upper_voltage_input: val});

        let protection_upper_voltage_input = val;
        if (protection_upper_voltage_input < 230 || protection_upper_voltage_input > 280 ) {
            this.setState({
                protection_upper_voltage_input_error: true
            })
            return false;
        } else  {
            this.setState({
                protection_upper_voltage_input_error: false
            })
            let userToken = await AsyncStorage.getItem('userToken');
            let AuthStr = 'Bearer ' + userToken;
            let id = this.props.id;

            try {
                fetch(`https://apiv1.zis.ru/devices/`+ id, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': AuthStr,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        upper_voltage_trigger: protection_upper_voltage_input,

                    })

                }).then((response) => {
                    return response.json()
                }).then((response) => {

                    console.log(response, ' chooseProtectionUpperVoltage UPDATE');

                    // this.setState({
                    //     // name: this.state.edit_name,
                    //     pre_configuration_popup: false,
                    // })

                    // this.getDeviceData();

                })
            } catch (e) {
                console.log(e)
            }
        }




    }
    chooseProtectionLowerVoltage = async (val) => {

         val = val.replace(/\D/g, '');

        this.setState({protection_lower_voltage_input: val});

        let protection_lower_voltage_input = val;
        if (protection_lower_voltage_input < 150 || protection_lower_voltage_input > 220 ) {
            this.setState({
                protection_lower_voltage_input_error: true
            })
            return false;
        } else  {
            this.setState({
                protection_lower_voltage_input_error: false
            })
            let userToken = await AsyncStorage.getItem('userToken');
            let AuthStr = 'Bearer ' + userToken;
            let id = this.props.id;

            try {
                fetch(`https://apiv1.zis.ru/devices/`+ id, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': AuthStr,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        lower_voltage_trigger: protection_lower_voltage_input,
                    })

                }).then((response) => {
                    return response.json()
                }).then((response) => {

                    console.log(response, ' DEVICE Data')

                    // this.setState({
                    //     // name: this.state.edit_name,
                    //     pre_configuration_popup: false,
                    // })

                    // this.getDeviceData();
                })
            } catch (e) {
                console.log(e)
            }
        }




    }
    choosePowerRestoreDelay = async (val) => {

         val = val.replace(/\D/g, '');

        this.setState({power_restore_delay_input: val});

        let power_restore_delay_input = val;
        if (power_restore_delay_input > 300 ) {
            this.setState({
                power_restore_delay_input_error: true
            })
            return false;

        } else  {
            this.setState({
                power_restore_delay_input_error: false
            })
            let userToken = await AsyncStorage.getItem('userToken');
            let AuthStr = 'Bearer ' + userToken;
            let id = this.props.id;

            try {
                fetch(`https://apiv1.zis.ru/devices/`+ id, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': AuthStr,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        power_restore_delay: power_restore_delay_input,

                    })



                }).then((response) => {
                    return response.json()
                }).then((response) => {

                    console.log(response, ' DEVICE Data')

                    // this.setState({
                    //     // name: this.state.edit_name,
                    //     pre_configuration_popup: false,
                    // })

                    // this.getDeviceData();






                })
            } catch (e) {
                console.log(e)
            }
        }




    }
    chooseStartupDelay = async (val) => {

         val = val.replace(/\D/g, '');

        this.setState({startup_delay_input: val});

        let startup_delay_input = val;
        if (startup_delay_input > 300 ) {
            this.setState({
                startup_delay_input_error: true
            })
            return false;

        } else  {
            this.setState({
                startup_delay_input_error: false
            })
            let userToken = await AsyncStorage.getItem('userToken');
            let AuthStr = 'Bearer ' + userToken;
            let id = this.props.id;

            try {
                fetch(`https://apiv1.zis.ru/devices/`+ id, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': AuthStr,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        startup_delay: startup_delay_input,

                    })



                }).then((response) => {
                    return response.json()
                }).then((response) => {

                    console.log(response, ' DEVICE Data')

                    // this.setState({
                    //     // name: this.state.edit_name,
                    //     pre_configuration_popup: false,
                    // })

                    // this.getDeviceData();






                })
            } catch (e) {
                console.log(e)
            }
        }




    }
    chooseAmperageTrigger = async (val) => {

         val = val.replace(/\D/g, '');

        this.setState({amperage_trigger_input: val});

        let amperage_trigger_input = val;
        if (amperage_trigger_input > 20 ) {
            this.setState({
                amperage_trigger_input_error: true
            })
            // return false;

        } else  {
            this.setState({
                amperage_trigger_input_error: false
            })
            let userToken = await AsyncStorage.getItem('userToken');
            let AuthStr = 'Bearer ' + userToken;
            let id = this.props.id;

            try {
                fetch(`https://apiv1.zis.ru/devices/`+ id, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': AuthStr,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        amperage_trigger: amperage_trigger_input,

                    })



                }).then((response) => {
                    return response.json()
                }).then((response) => {

                    console.log(response, ' DEVICE Data')

                    // this.setState({
                    //     // name: this.state.edit_name,
                    //     pre_configuration_popup: false,
                    // })

                    // this.getDeviceData();






                })
            } catch (e) {
                console.log(e)
            }
        }




    }



    chooseUpperVoltageDelay = async (item) => {

         this.setState({
            selectedUpperVoltageDelay: item.value,
        })

        console.log( typeof item.value,item.value, 'fff');

        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr   = 'Bearer ' + userToken;
        let id        = this.props.id;

        console.log(`https://apiv1.zis.ru/devices/`+ id);
        console.log(AuthStr);
        console.log(parseFloat(item.value), 'parseFloat(item.value)');


        try {
            fetch(`https://apiv1.zis.ru/devices/`+ id, {
                method: 'PATCH',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    upper_voltage_delay: parseFloat(item.value),
                })
            }).then((response) => {
                return response.json()
            }).then((response) => {

                console.log(response, ' DEVICE Data')

                    this.setState({
                        upper_voltage_delay_popup: false,
                    })
                    this.getDeviceData();


            })
        } catch (e) {
            console.log(e)
        }

    }
    chooseAmperageDelay = async (item) => {

         this.setState({
            selectedAmperageDelay: item.value,
        })

        console.log( typeof item.value,item.value, 'fff');

        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr   = 'Bearer ' + userToken;
        let id        = this.props.id;

        console.log(`https://apiv1.zis.ru/devices/`+ id);
        console.log(AuthStr);


        try {
            fetch(`https://apiv1.zis.ru/devices/`+ id, {
                method: 'PATCH',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amperage_delay: parseFloat(item.value),
                })
            }).then((response) => {
                return response.json()
            }).then((response) => {

                console.log(response, ' DEVICE Data')

                    this.setState({
                        amperage_delay_popup: false,
                    })
                    this.getDeviceData();


            })
        } catch (e) {
            console.log(e)
        }

    }



    chooseLowerVoltageDelay = async (item) => {

         this.setState({
            selectedLowerVoltageDelay: item.value,
        })

        console.log( typeof item.value,item.value, 'fff');

        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr   = 'Bearer ' + userToken;
        let id        = this.props.id;

        console.log(`https://apiv1.zis.ru/devices/`+ id);
        console.log(AuthStr);


        try {
            fetch(`https://apiv1.zis.ru/devices/`+ id, {
                method: 'PATCH',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lower_voltage_delay: parseFloat(item.value),
                })
            }).then((response) => {
                return response.json()
            }).then((response) => {

                console.log(response, ' DEVICE Data')

                    this.setState({
                        lower_voltage_delay_popup: false,
                    })
                    this.getDeviceData();


            })
        } catch (e) {
            console.log(e)
        }

    }
    saveTimeOn = async () => {

        let {turnOnTime} = this.state;

        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr   = 'Bearer ' + userToken;
        let id        = this.props.id;

        console.log(`https://apiv1.zis.ru/devices/`+ id);
        console.log(AuthStr);


        try {
            fetch(`https://apiv1.zis.ru/devices/`+ id, {
                method: 'PATCH',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    schedule_time_on: turnOnTime,
                })
            }).then((response) => {
                return response.json()
            }).then((response) => {

                console.log(response, ' DEVICE Data')

                    this.setState({
                        isOpenDatePicker: false,
                    })
                    this.getDeviceData();
            })
        } catch (e) {
            console.log(e)
        }

    }
    saveTimeOff = async (item) => {

        let {timeLabelValue} = this.state;

        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr   = 'Bearer ' + userToken;
        let id        = this.props.id;

        console.log(`https://apiv1.zis.ru/devices/`+ id);
        console.log(AuthStr);


        try {
            fetch(`https://apiv1.zis.ru/devices/`+ id, {
                method: 'PATCH',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    schedule_time_off: timeLabelValue,
                })
            }).then((response) => {
                return response.json()
            }).then((response) => {

                console.log(response, ' DEVICE Data')

                    this.setState({
                        isOpenDatePicker2: false,
                    })
                    this.getDeviceData();


            })
        } catch (e) {
            console.log(e)
        }

    }


    sharedNewAccount = async () => {


        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;
        let id = this.props.id;
        let account_login = this.state.email;

        // if (account_login == '' ) {
        //     this.setState({
        //         shared_popup_email_error: true,
        //         shared_popup_email_error_text: 'Поле обязательно!'
        //     })
        //     return false
        // } else {
        //     this.setState({
        //         shared_popup_email_error: false,
        //         shared_popup_email_error_text: ''
        //     })
        // }
        try {
            fetch(`https://apiv1.zis.ru/devices/share/`, {
                method: 'POST',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    device_id: id,
                    account_login: account_login
                })

            }).then((response) => {
                return response.json()
            }).then((response) => {

                console.log(response, 'devices/share')

                if (response.result) {
                    this.setState({
                        SharedAccessPopup: false,
                        shared_popup_email_error: false,
                        shared_popup_email_error_text:''
                    })

                    this.getDeviceData();
                } else {

                    if(response.hasOwnProperty('error')) {
                        this.setState({
                            shared_popup_email_error: true,
                            shared_popup_email_error_text: response.description.en
                        })
                    }
                }


            })
        } catch (e) {
            console.log(e)
        }



    }


    deleteDevice = async () => {
        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;
        let id = this.props.id;


        try {
            fetch(`https://apiv1.zis.ru/devices/unlink/` + id, {
                method: 'POST',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },


            }).then((response) => {
                return response.json()
            }).then((response) => {

                console.log(response, 'devices/share')

                if (response.hasOwnProperty('result')) {
                    if (response.result == 'success') {
                        this.props.navigation.navigate("AllDevices");
                    }
                }




            })
        } catch (e) {
            console.log(e)
        }


    }



    deleteSharedAccount = async (email) => {


        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;
        let id = this.props.id;

        try {
            fetch(`https://apiv1.zis.ru/devices/cancel_sharing`, {
                method: 'POST',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    device_id: id,
                    account_login: email
                })

            }).then((response) => {
                return response.json()
            }).then((response) => {

                console.log(response, 'cancel_sharing')

                if (response.result) {
                    // this.setState({
                    //     SharedAccessPopup: false
                    // })

                    this.getDeviceData();
                } else {

                }


            })
        } catch (e) {
            console.log(e)
        }



    }


    openWeekDaysPopUp = async () => {
        let {mainData} = this.state;
        let schedule_days = mainData.schedule_days ? mainData.schedule_days : '';
        schedule_days = schedule_days.split('')

        console.log(schedule_days,'schedule_days')

        let useWeekDayMondaySwitchValue = false;
        let useWeekDayTuesdaySwitchValue = false;
        let useWeekDayWednesdaySwitchValue = false;
        let useWeekDayThursdaySwitchValue = false;
        let useWeekDayFridaySwitchValue = false;
        let useWeekDaySaturdaySwitchValue = false;
        let useWeekDaySundaySwitchValue = false;


        for (const schedule_day in schedule_days) {
            console.log(schedule_days[schedule_day])

            if (schedule_days[schedule_day] == 1) {
                useWeekDayMondaySwitchValue = true;
            }
            else if (schedule_days[schedule_day] == 2) {
                useWeekDayTuesdaySwitchValue = true;
            }
            else if (schedule_days[schedule_day] == 3) {
                useWeekDayWednesdaySwitchValue = true;
            }
            else if (schedule_days[schedule_day] == 4) {
                useWeekDayThursdaySwitchValue = true;
            }
            else if (schedule_days[schedule_day] == 5) {
                useWeekDayFridaySwitchValue = true;
            }
            else if (schedule_days[schedule_day] == 6) {
                useWeekDaySaturdaySwitchValue = true;
            }
            else if (schedule_days[schedule_day] == 7) {
                useWeekDaySundaySwitchValue = true;
            }

        }


        await this.setState({
            useWeekDayMondaySwitchValue: useWeekDayMondaySwitchValue,
            useWeekDayTuesdaySwitchValue: useWeekDayTuesdaySwitchValue,
            useWeekDayWednesdaySwitchValue: useWeekDayWednesdaySwitchValue,
            useWeekDayThursdaySwitchValue: useWeekDayThursdaySwitchValue,
            useWeekDayFridaySwitchValue: useWeekDayFridaySwitchValue,
            useWeekDaySaturdaySwitchValue: useWeekDaySaturdaySwitchValue,
            useWeekDaySundaySwitchValue: useWeekDaySundaySwitchValue,
            week_days_popup: true
        })
    }


    render() {
        // SharedAccessPopup
        if (this.state.SharedAccessPopup) {
            return (
                <SafeAreaView style={styles.turn_off_the_load_switch_value_popup}>

                    <View style={styles.turn_off_the_load_switch_value_popup_wrapper}>

                        <TouchableOpacity
                            style={{position:'absolute', top: 5, right: 5}}
                              onPress={() => {
                                  this.setState({
                                      SharedAccessPopup: false,
                                      shared_popup_email_error: false,
                                      shared_popup_email_error_text:''
                                  })
                              }}
                        >
                            <Svg width={30} height={30} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <Path d="M4.024 5.351a.938.938 0 111.327-1.327l9.65 9.65 9.648-9.65a.938.938 0 111.328 1.327L16.326 15l9.65 9.649a.94.94 0 01-1.327 1.327L15 16.326l-9.649 9.65a.939.939 0 11-1.327-1.327L13.674 15l-9.65-9.649z" fill="#004B84"/>
                            </Svg>
                        </TouchableOpacity>

                        <Text style={styles.turn_off_the_load_switch_value_popup_title}>Share</Text>

                        {this.state.shared_popup_email_error &&
                            <Text style={{width: '100%', textAlign:'left', fontSize: 13, color: 'red', marginBottom: 5}}>
                                {this.state.shared_popup_email_error_text}
                            </Text>
                        }

                        <TextInput
                            style={styles.login_input_field}
                            onChangeText={(val) => this.setState({email: val})}
                            value={this.state.email}
                            placeholder="Email address"
                        />
                        <TouchableOpacity style={styles.turn_off_the_load_switch_value_popup_confirm_btn}
                              onPress={() => {
                                  this.sharedNewAccount()
                              }}
                        >
                            <Text style={styles.turn_off_the_load_switch_value_popup_confirm_btn_text}>Ok</Text>
                        </TouchableOpacity>
                    </View>

                </SafeAreaView>
            )
        }

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
                                <Text style={styles.all_devices_general_page_header_title}>{this.state.language.preferences}</Text>
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

                        <View style={styles.new_test_items_wrapper}>
                            <View style={styles.new_test_item}>
                                <Text style={styles.new_test_item_title}>
                                    {/* Power Protection */}
                                    {this.state.language.power_protection}
                                </Text>
                                <Switch
                                    trackColor={{ false: '#767577', true: '#004B84' }}
                                    // thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                                    onValueChange={this.powerProtectionToggleSwitch}
                                    value={this.state.powerProtectionSwitchValue}
                                />
                            </View>
                            <View style={styles.new_test_item}>
                                <Text style={styles.new_test_item_title}>
                                    {/*Pre-configuration*/}
                                    {this.state.language.pre_configuration}
                                </Text>
                                <TouchableOpacity style={styles.preferences_item_btn} onPress={() => {this.setState({pre_configuration_popup: true})}}>
                                    <Text style={styles.preferences_item_btn_text}>{this.state.protection_preset}</Text>
                                    <View style={styles.preferences_item_btn_icon}>
                                        <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <Path d="M1.406 19.266L0 17.859l8.297-8.226L0 1.406 1.406 0l9.633 9.633-9.633 9.633z" fill="#004B84"/>
                                        </Svg>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.new_test_item]}>
                                <Text style={[styles.new_test_item_title, {color: this.state.protection_upper_voltage_input_error === true ? 'red' : '#4A4A4A'}]}>
                                    {this.state.language.protection_upper_voltage_title}
                                </Text>
                                <View style={styles.new_test_item_input_field_box}>
                                    <TextInput
                                        style={[styles.new_test_item_input_field, {marginRight: 18, flex: 1, borderColor: this.state.protection_preset != 'Manual setup' ?  '#10bcce4d' : '#10BCCE',  }]}
                                        onChangeText={(val) => {
                                            this.chooseProtectionUpperVoltage(val)
                                        }}
                                        value={this.state.protection_upper_voltage_input}
                                        // placeholder='3.43'
                                        placeholderTextColor={this.state.protection_preset != 'Manual setup' ? '#10bcce4d' : '#10BCCE'}
                                        editable={this.state.protection_preset != 'Manual setup' ? false : true}
                                        // keyboardType = 'numeric'
                                        // keyboardType="numeric"

                                    />
                                </View>

                            </View>
                            <View style={[styles.new_test_item]}>
                                <Text style={styles.new_test_item_title}>{this.state.language.upper_voltage_sec}</Text>
                                <TouchableOpacity style={styles.preferences_item_btn} onPress={() => {
                                    if (this.state.protection_preset != 'Manual setup') {
                                        return false
                                    } else  {
                                        this.setState({
                                            upper_voltage_delay_popup: true
                                        })
                                    }
                                }}>
                                    <Text style={styles.preferences_item_btn_text}>{this.state.upper_voltage_delay}</Text>
                                    <View style={styles.preferences_item_btn_icon}>
                                        <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <Path d="M1.406 19.266L0 17.859l8.297-8.226L0 1.406 1.406 0l9.633 9.633-9.633 9.633z" fill= {this.state.protection_preset != 'Manual setup' ? "#004b8469" : "#004B84"}/>
                                        </Svg>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.new_test_item]}>
                                <Text style={[styles.new_test_item_title, {color: this.state.protection_lower_voltage_input_error === true ? 'red' : '#4A4A4A'}]}>{this.state.language.protection_lower_voltage_title}</Text>
                                <View style={styles.new_test_item_input_field_box}>
                                    <TextInput
                                        style={[styles.new_test_item_input_field, {marginRight: 18, flex: 1, borderColor: this.state.protection_preset != 'Manual setup' ?  '#10bcce4d' : '#10BCCE'}]}
                                        onChangeText={(val) => {
                                            this.chooseProtectionLowerVoltage(val);
                                        }}
                                        value={this.state.protection_lower_voltage_input}
                                        placeholderTextColor={this.state.protection_preset != 'Manual setup' ? '#10bcce4d' : '#10BCCE'}
                                        editable={this.state.protection_preset != 'Manual setup' ? false : true}
                                    />
                                </View>

                            </View>
                            <View style={[styles.new_test_item]}>
                                <Text style={styles.new_test_item_title}>{this.state.language.lower_voltage_delay_sec}</Text>
                                <TouchableOpacity style={styles.preferences_item_btn} onPress={() => {
                                    if (this.state.protection_preset != 'Manual setup') {
                                        return false
                                    } else  {
                                        this.setState({
                                            lower_voltage_delay_popup: true
                                        })
                                    }
                                }}>
                                    <Text style={styles.preferences_item_btn_text}>{this.state.lower_voltage_delay}</Text>
                                    <View style={styles.preferences_item_btn_icon}>
                                        <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <Path d="M1.406 19.266L0 17.859l8.297-8.226L0 1.406 1.406 0l9.633 9.633-9.633 9.633z" fill= {this.state.protection_preset != 'Manual setup' ? "#004b8469" : "#004B84"}/>
                                        </Svg>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={[styles.new_test_item]}>
                                <Text style={[styles.new_test_item_title, {color: this.state.power_restore_delay_input_error === true ? 'red' : '#4A4A4A'}]}>{this.state.language.power_restore_delay_sec}</Text>
                                <View style={styles.new_test_item_input_field_box}>
                                    <TextInput
                                        style={[styles.new_test_item_input_field, {marginRight: 18, flex: 1, borderColor: this.state.protection_preset != 'Manual setup' ?  '#10bcce4d' : '#10BCCE'}]}
                                        onChangeText={(val) => {
                                            this.choosePowerRestoreDelay(val);
                                        }}
                                        value={this.state.power_restore_delay_input}
                                        // placeholder="3500"
                                        placeholderTextColor={this.state.protection_preset != 'Manual setup' ? '#10bcce4d' : '#10BCCE'}
                                        editable={this.state.protection_preset != 'Manual setup' ? false : true}
                                    />
                                </View>

                            </View>
                            <View style={[styles.new_test_item]}>
                                <Text style={[styles.new_test_item_title, {color: this.state.startup_delay_input_error === true ? 'red' : '#4A4A4A'}]}>{this.state.language.startup_delay_sec}</Text>
                                <View style={styles.new_test_item_input_field_box}>
                                    <TextInput
                                        style={[styles.new_test_item_input_field, {marginRight: 18, flex: 1,  borderColor: this.state.protection_preset != 'Manual setup' ?  '#10bcce4d' : '#10BCCE'}]}
                                        onChangeText={(val) => {
                                            this.chooseStartupDelay(val);
                                        }}
                                        value={this.state.startup_delay_input}
                                        // placeholder="3500"
                                        placeholderTextColor={this.state.protection_preset != 'Manual setup' ? '#10bcce4d' : '#10BCCE'}
                                        editable={this.state.protection_preset != 'Manual setup' ? false : true}
                                    />
                                </View>

                            </View>
                            <View style={[styles.new_test_item]}>
                                <Text style={[styles.new_test_item_title, {color: this.state.amperage_trigger_input_error === true ? 'red' : '#4A4A4A'}]}>{this.state.language.current_protection_title}</Text>
                                <View style={styles.new_test_item_input_field_box}>
                                    <TextInput
                                        style={[styles.new_test_item_input_field,]}
                                        onChangeText={(val) => {
                                            this.chooseAmperageTrigger(val);
                                        }}
                                        value={this.state.amperage_trigger_input}
                                        // placeholder="3500"
                                        placeholderTextColor= '#10BCCE'

                                    />
                                </View>

                            </View>



                            <View style={[styles.new_test_item]}>
                                <Text style={styles.new_test_item_title}>{this.state.language.current_protection_delay}</Text>
                                <TouchableOpacity style={styles.preferences_item_btn} onPress={() =>  this.setState({amperage_delay_popup: true})}>
                                    <Text style={styles.preferences_item_btn_text}>{this.state.amperage_delay}</Text>
                                    <View style={styles.preferences_item_btn_icon}>
                                        <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <Path d="M1.406 19.266L0 17.859l8.297-8.226L0 1.406 1.406 0l9.633 9.633-9.633 9.633z" fill="#004B84"/>
                                        </Svg>
                                    </View>
                                </TouchableOpacity>
                            </View>


                            <View style={styles.new_test_item}>
                                <Text style={styles.new_test_item_title}>{this.state.language.use_schedule}</Text>
                                <Switch

                                    trackColor={{ false: '#767577', true: '#004B84' }}
                                    // thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                                    onValueChange={this.useScheduleToggleSwitch}
                                    value={this.state.useScheduleSwitchValue}
                                />
                            </View>

                            <View style={[styles.new_test_item, {marginBottom: 23}]}>
                                <Text style={styles.new_test_item_title}>{this.state.language.week_days}</Text>
                                <TouchableOpacity style={styles.preferences_item_btn}
                                    onPress={() => {
                                        this.openWeekDaysPopUp()
                                    }}
                                >
                                    <Text style={styles.preferences_item_btn_text}>{this.state.schedule_days}</Text>
                                    <View style={styles.preferences_item_btn_icon}>
                                        <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <Path d="M1.406 19.266L0 17.859l8.297-8.226L0 1.406 1.406 0l9.633 9.633-9.633 9.633z" fill="#004B84"/>
                                        </Svg>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={[styles.new_test_item, {marginBottom: 23}]}>
                                <Text style={styles.new_test_item_title}>{this.state.language.turn_on_time}</Text>
                                <TouchableOpacity style={styles.preferences_item_btn} onPress={() => this.timeOn()}>
                                    <Text style={styles.preferences_item_btn_text}>{this.state.schedule_time_on}</Text>
                                    <View style={styles.preferences_item_btn_icon}>
                                        <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <Path d="M1.406 19.266L0 17.859l8.297-8.226L0 1.406 1.406 0l9.633 9.633-9.633 9.633z" fill="#004B84"/>
                                        </Svg>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={[styles.new_test_item, {marginBottom: 23}]}>
                                <Text style={styles.new_test_item_title}>{this.state.language.turn_of_time}</Text>
                                <TouchableOpacity style={styles.preferences_item_btn} onPress={() => this.timeOff()}>
                                    <Text style={styles.preferences_item_btn_text}>{this.state.schedule_time_off}</Text>
                                    <View style={styles.preferences_item_btn_icon}>
                                        <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <Path d="M1.406 19.266L0 17.859l8.297-8.226L0 1.406 1.406 0l9.633 9.633-9.633 9.633z" fill="#004B84"/>
                                        </Svg>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.new_test_item}>
                                <Text style={styles.new_test_item_title}>{this.state.language.push_notifications}</Text>
                                <Switch
                                    trackColor={{ false: '#767577', true: '#004B84' }}
                                    // thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                                    onValueChange={this.pushNotificationsToggleSwitch}
                                    value={this.state.pushNotificationsSwitchValue}
                                />
                            </View>

                            <View style={[styles.new_test_item, {marginBottom: 25}]}>
                                <Text style={styles.new_test_item_title}>{this.state.language.shared_access}</Text>
                                <TouchableOpacity style={styles.preferences_item_btn} onPress={() => {this.setState({shared_access_popup: true})}}>
                                    <Text style={styles.preferences_item_btn_text}>{this.state.shared_accounts.length} account</Text>
                                    <View style={styles.preferences_item_btn_icon}>
                                        <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <Path d="M1.406 19.266L0 17.859l8.297-8.226L0 1.406 1.406 0l9.633 9.633-9.633 9.633z" fill="#004B84"/>
                                        </Svg>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.preferences_unlink_btn} onPress={() => this.deleteDevice()}>
                                <Text style={styles.preferences_unlink_btn_text}>{this.state.language.unlink}</Text>
                            </TouchableOpacity>
                        </View>


                    </ScrollView>

                    {this.state.pre_configuration_popup &&
                        <View style={styles.pre_configuration_popup}>
                            <View style={styles.pre_configuration_popup_wrapper}>
                                <View style={styles.all_devices_general_page_header}>
                                    <View style={styles.all_devices_general_page_header_child}>
                                        <TouchableOpacity style={styles.title_back_btn_wrapper} onPress={() => {this.setState({pre_configuration_popup: false})}}>
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
                                            <Text style={styles.all_devices_general_page_header_title}>{this.state.language.pre_configuration}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <ScrollView style={styles.all_devices_general_page_main_wrapper}>
                                    <View style={styles.pre_configuration_items_wrapper}>
                                        <Text style={styles.pre_configuration_item_info}>
                                            {this.state.language.pre_configuration_popup_title}
                                        </Text>
                                        <View style={styles.sort_by_pre_configuration_radio_input}>
                                            <TouchableOpacity
                                                style={[styles.sort_by_pre_configuration_radio_input_button]}
                                                onPress={()=> {
                                                    this.setState({
                                                        sort_by_pre_configuration1: true,
                                                        sort_by_pre_configuration2: false,
                                                        sort_by_pre_configuration3: false,
                                                        sort_by_pre_configuration4: false,
                                                        sort_by_pre_configuration5: false,
                                                    })
                                                    this.chooseNewPreConfiguration('sort_by_pre_configuration1')
                                                }}>
                                                {this.state.sort_by_pre_configuration1 &&
                                                <View style={styles.activeRadioRound}>

                                                </View>
                                                }
                                            </TouchableOpacity>
                                            <Text style={styles.sort_by_pre_configuration_radio_input_title}>AV</Text>

                                        </View>
                                        <View style={styles.sort_by_pre_configuration_radio_input}>
                                            <TouchableOpacity
                                                style={[styles.sort_by_pre_configuration_radio_input_button]}
                                                onPress={()=> {
                                                    this.setState({
                                                        sort_by_pre_configuration1: false,
                                                        sort_by_pre_configuration2: true,
                                                        sort_by_pre_configuration3: false,
                                                        sort_by_pre_configuration4: false,
                                                        sort_by_pre_configuration5: false,
                                                    })
                                                    this.chooseNewPreConfiguration('sort_by_pre_configuration2')
                                                }}>
                                                {this.state.sort_by_pre_configuration2 &&
                                                <View style={styles.activeRadioRound}>

                                                </View>
                                                }
                                            </TouchableOpacity>
                                            <Text style={styles.sort_by_pre_configuration_radio_input_title}>Air conditioner</Text>

                                        </View>
                                        <View style={styles.sort_by_pre_configuration_radio_input}>
                                            <TouchableOpacity
                                                style={[styles.sort_by_pre_configuration_radio_input_button]}
                                                onPress={()=> {
                                                    this.setState({
                                                        sort_by_pre_configuration1: false,
                                                        sort_by_pre_configuration2: false,
                                                        sort_by_pre_configuration3: true,
                                                        sort_by_pre_configuration4: false,
                                                        sort_by_pre_configuration5: false,
                                                    })
                                                    this.chooseNewPreConfiguration('sort_by_pre_configuration3')
                                                }}>
                                                {this.state.sort_by_pre_configuration3 &&
                                                <View style={styles.activeRadioRound}>

                                                </View>
                                                }
                                            </TouchableOpacity>
                                            <Text style={styles.sort_by_pre_configuration_radio_input_title}>Refrigerator</Text>

                                        </View>
                                        <View style={styles.sort_by_pre_configuration_radio_input}>
                                            <TouchableOpacity
                                                style={[styles.sort_by_pre_configuration_radio_input_button]}
                                                onPress={()=> {
                                                    this.setState({
                                                        sort_by_pre_configuration1: false,
                                                        sort_by_pre_configuration2: false,
                                                        sort_by_pre_configuration3: false,
                                                        sort_by_pre_configuration4: true,
                                                        sort_by_pre_configuration5: false,
                                                    })
                                                    this.chooseNewPreConfiguration('sort_by_pre_configuration4')
                                                }}>
                                                {this.state.sort_by_pre_configuration4 &&
                                                <View style={styles.activeRadioRound}>

                                                </View>
                                                }
                                            </TouchableOpacity>
                                            <Text style={styles.sort_by_pre_configuration_radio_input_title}>Other home  appliance</Text>

                                        </View>
                                        <View style={styles.sort_by_pre_configuration_radio_input}>
                                            <TouchableOpacity
                                                style={[styles.sort_by_pre_configuration_radio_input_button]}
                                                onPress={()=> {
                                                    this.setState({
                                                        sort_by_pre_configuration1: false,
                                                        sort_by_pre_configuration2: false,
                                                        sort_by_pre_configuration3: false,
                                                        sort_by_pre_configuration4: false,
                                                        sort_by_pre_configuration5: true,
                                                    })
                                                    this.chooseNewPreConfiguration('sort_by_pre_configuration5')
                                                }}>
                                                {this.state.sort_by_pre_configuration5 &&
                                                <View style={styles.activeRadioRound}>

                                                </View>
                                                }
                                            </TouchableOpacity>
                                            <Text style={styles.sort_by_pre_configuration_radio_input_title}>Manual setup</Text>

                                        </View>


                                    </View>

                                </ScrollView>
                            </View>
                        </View>
                    }

                    {this.state.shared_access_popup &&
                        <View style={styles.shared_access_popup}>
                            <View style={styles.shared_access_popup_wrapper}>

                                <View style={styles.all_devices_general_page_header}>
                                    <View style={styles.all_devices_general_page_header_child}>
                                        <TouchableOpacity style={styles.title_back_btn_wrapper} onPress={() => {this.setState({shared_access_popup: false})}}>
                                            <View style={styles.back_btn}>
                                                <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <Path d="M9.633 0l1.406 1.406-8.297 8.227 8.297 8.226-1.406 1.407L0 9.633 9.633 0z" fill="#004B84"/>
                                                </Svg>
                                            </View>
                                            <Text style={styles.all_devices_general_page_header_title}>{this.state.language.shared_access}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <ScrollView style={styles.all_devices_general_page_main_wrapper}>
                                    <View style={styles.shared_access_info_wrapper}>

                                        <Text style={styles.shared_access_info1}>
                                            {this.state.language.shared_access_popup_title}
                                        </Text>


                                        {/*Exist accounts list start*/}
                                        <View style={[styles.existAccountsList, {marginBottom: 27}]}>


                                            {this.state.shared_accounts.map((item, index) => {
                                                return (
                                                    <View key={index} style={styles.shared_access_gmail_info_delete_btn_wrapper}>
                                                        <Text style={styles.shared_access_gmail_info}>{item}</Text>
                                                        <TouchableOpacity
                                                            style={styles.shared_access_delete_btn}
                                                            onPress={() => {
                                                                this.deleteSharedAccount(item)
                                                            }}
                                                        >
                                                            <Text style={styles.shared_access_delete_btn_text}>{this.state.language.delete}</Text>
                                                            <View style={styles.shared_access_delete_btn_icon}>
                                                                <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <Path d="M1.406 19.266L0 17.859l8.297-8.226L0 1.406 1.406 0l9.633 9.633-9.633 9.633z" fill="#004B84"/>
                                                                </Svg>
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            })}


                                        </View>
                                        {/*Exist accounts list end*/}

                                        <TouchableOpacity style={styles.add_account_btn} onPress={() => {this.setState({shared_access_popup: false, SharedAccessPopup: true})}}>
                                            <Text style={styles.add_account_btn_text}>{this.state.language.add_account}</Text>
                                        </TouchableOpacity>
                                    </View>

                                </ScrollView>
                            </View>
                        </View>
                    }

                    {this.state.upper_voltage_delay_popup  &&
                        <View style={styles.turn_off_the_load_switch_value_popup}>
                            <View style={[styles.turn_off_the_load_switch_value_popup_wrapper, {height: 300}]}>
                                <TouchableOpacity style={[styles.title_back_btn_wrapper, {width: '100%', position: 'absolute', left: 20, top: 20}]} onPress={() => {this.setState({upper_voltage_delay_popup: false})}}>
                                    <View>
                                        <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <Path d="M9.633 0l1.406 1.406-8.297 8.227 8.297 8.226-1.406 1.407L0 9.633 9.633 0z" fill="#004B84"/>
                                        </Svg>
                                    </View>
                                </TouchableOpacity>


                                <ScrollView style={{flex:1, width: '100%',  marginTop: 30}}>
                                    {this.state.upper_voltage_delay_data.map((item, index) => {
                                        return (
                                            <TouchableOpacity style={{width:'100%', paddingVertical: 10, backgroundColor:'white', borderBottomColor: '#10BCCE', borderBottomWidth: 1,  alignItems:'center'}} key={index} onPress={() => {this.chooseUpperVoltageDelay(item)}}>
                                                <Text style={{color:'#10BCCE', textAlign:'center', width:'100%'}}>{item.value}</Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </ScrollView>


                            </View>
                        </View>
                    }

                    {this.state.amperage_delay_popup  &&
                        <View style={styles.turn_off_the_load_switch_value_popup}>
                            <View style={[styles.turn_off_the_load_switch_value_popup_wrapper, {height: 300}]}>
                                <TouchableOpacity style={[styles.title_back_btn_wrapper, {width: '100%', position: 'absolute', left: 20, top: 20}]} onPress={() => {this.setState({amperage_delay_popup: false})}}>
                                    <View>
                                        <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <Path d="M9.633 0l1.406 1.406-8.297 8.227 8.297 8.226-1.406 1.407L0 9.633 9.633 0z" fill="#004B84"/>
                                        </Svg>
                                    </View>
                                </TouchableOpacity>

                                <ScrollView style={{flex:1, width: '100%',  marginTop: 30}}>
                                    {this.state.amperage_delay_data.map((item, index) => {
                                        return (
                                            <TouchableOpacity style={{width:'100%', paddingVertical: 10, backgroundColor:'white', borderBottomColor: '#10BCCE', borderBottomWidth: 1,  alignItems:'center'}} key={index} onPress={() => {this.chooseAmperageDelay(item)}}>
                                                <Text style={{color:'#10BCCE', textAlign:'center', width:'100%'}}>{item.value}</Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </ScrollView>


                            </View>
                        </View>
                    }

                    {this.state.lower_voltage_delay_popup  &&
                        <View style={styles.turn_off_the_load_switch_value_popup}>
                        <View style={[styles.turn_off_the_load_switch_value_popup_wrapper, {height: 300}]}>
                            <TouchableOpacity style={[styles.title_back_btn_wrapper, {width: '100%', position: 'absolute', left: 20, top: 20}]} onPress={() => {this.setState({lower_voltage_delay_popup: false})}}>
                                <View>
                                    <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <Path d="M9.633 0l1.406 1.406-8.297 8.227 8.297 8.226-1.406 1.407L0 9.633 9.633 0z" fill="#004B84"/>
                                    </Svg>
                                </View>
                            </TouchableOpacity>


                            <ScrollView style={{flex:1, width: '100%',  marginTop: 30}}>
                                {this.state.lower_voltage_delay_data.map((item, index) => {
                                    return (
                                        <TouchableOpacity style={{width:'100%', paddingVertical: 10, backgroundColor:'white', borderBottomColor: '#10BCCE', borderBottomWidth: 1,  alignItems:'center'}} key={index} onPress={() => {this.chooseLowerVoltageDelay(item)}}>
                                            <Text style={{color:'#10BCCE', textAlign:'center', width:'100%'}}>{item.value}</Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </ScrollView>


                        </View>
                    </View>
                    }

                    {this.state.week_days_popup  &&
                        <View style={styles.turn_off_the_load_switch_value_popup}>
                        <View style={[styles.turn_off_the_load_switch_value_popup_wrapper, {paddingTop: 45, paddingBottom: 35}]}>
                            <View style={styles.week_days_popup_header}>
                                <TouchableOpacity style={[styles.title_back_btn_wrapper]} onPress={() => {this.setState({week_days_popup: false})}}>
                                    <View>
                                        <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <Path d="M9.633 0l1.406 1.406-8.297 8.227 8.297 8.226-1.406 1.407L0 9.633 9.633 0z" fill="#004B84"/>
                                        </Svg>
                                    </View>
                                </TouchableOpacity>
                                <Text style={styles.week_days_popup_title}>{this.state.language.scheduler}</Text>
                            </View>

                            <View style={styles.week_days_item}>
                                <Text style={styles.week_day_name}>{this.state.language.monday}</Text>
                                <Switch
                                    trackColor={{ false: '#767577', true: '#004B84' }}
                                    onValueChange={this.useWeekDayMondayToggleSwitch}
                                    value={this.state.useWeekDayMondaySwitchValue}
                                />
                            </View>
                            <View style={styles.week_days_item}>
                                <Text style={styles.week_day_name}>{this.state.language.tuesday}</Text>
                                <Switch
                                    trackColor={{ false: '#767577', true: '#004B84' }}
                                    onValueChange={this.useWeekDayTuesdayToggleSwitch}
                                    value={this.state.useWeekDayTuesdaySwitchValue}
                                />
                            </View>
                            <View style={styles.week_days_item}>
                                <Text style={styles.week_day_name}>{this.state.language.wednesday}</Text>
                                <Switch
                                    trackColor={{ false: '#767577', true: '#004B84' }}
                                    onValueChange={this.useWeekDayWednesdayToggleSwitch}
                                    value={this.state.useWeekDayWednesdaySwitchValue}
                                />
                            </View>
                            <View style={styles.week_days_item}>
                                <Text style={styles.week_day_name}>{this.state.language.thursday}</Text>
                                <Switch
                                    trackColor={{ false: '#767577', true: '#004B84' }}
                                    onValueChange={this.useWeekDayThursdayToggleSwitch}
                                    value={this.state.useWeekDayThursdaySwitchValue}
                                />
                            </View>
                            <View style={styles.week_days_item}>
                                <Text style={styles.week_day_name}>{this.state.language.friday}</Text>
                                <Switch
                                    trackColor={{ false: '#767577', true: '#004B84' }}
                                    onValueChange={this.useWeekDayFridayToggleSwitch}
                                    value={this.state.useWeekDayFridaySwitchValue}
                                />
                            </View>
                            <View style={styles.week_days_item}>
                                <Text style={styles.week_day_name}>{this.state.language.saturday}</Text>
                                <Switch
                                    trackColor={{ false: '#767577', true: '#004B84' }}
                                    onValueChange={this.useWeekDaySaturdayToggleSwitch}
                                    value={this.state.useWeekDaySaturdaySwitchValue}
                                />
                            </View>
                            <View style={styles.week_days_item}>
                                <Text style={styles.week_day_name}>{this.state.language.sunday}</Text>
                                <Switch
                                    trackColor={{ false: '#767577', true: '#004B84' }}
                                    onValueChange={this.useWeekDaySundayToggleSwitch}
                                    value={this.state.useWeekDaySundaySwitchValue}
                                />
                            </View>


                            <TouchableOpacity style={styles.save_btn} onPress={() => this.saveWeekDays()}>
                                <Text style={styles.save_btn_text}>{this.state.language.save}</Text>
                            </TouchableOpacity>



                        </View>
                    </View>
                    }

                    {this.state.isOpenTimePicker &&
                         <View style={styles.timepicker_popup}>
                        <View style={styles.timepicker_popup_wrapper}>
                            <TouchableOpacity style={{width: '100%', position: 'absolute', left: 20, top: 60}} onPress={() => {this.setState({isOpenTimePicker: false})}}>
                                <View>
                                    <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <Path
                                            d="M9.633 0l1.406 1.406-8.297 8.227 8.297 8.226-1.406 1.407L0 9.633 9.633 0z"
                                            fill="#004B84"
                                        />
                                    </Svg>
                                </View>
                            </TouchableOpacity>
                            <DateTimePicker
                                style={{width: '100%', height: 500, marginBottom: 50, justifyContent: 'center', alignItems: 'center', alignSelf: 'center',}}
                                testID="dateTimePicker"
                                value={this.state.dateOriginValue}
                                mode={'time'}
                                is24Hour={true}
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={(event, timeOriginValue) => {this.onChangeTurnOnTime(event, timeOriginValue)}}
                            />

                            <TouchableOpacity style={styles.save_btn} onPress={() => this.saveTimeOn()}>
                                <Text style={styles.save_btn_text}>{this.state.language.save}</Text>
                            </TouchableOpacity>

                        </View>

                    </View>
                    }

                    {this.state.isOpenTimePicker2 &&
                        <View style={styles.timepicker_popup}>
                        <View style={styles.timepicker_popup_wrapper}>
                            <TouchableOpacity style={{width: '100%', position: 'absolute', left: 20, top: 60}} onPress={() => {this.setState({isOpenTimePicker2: false})}}>
                                <View>
                                    <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <Path d="M9.633 0l1.406 1.406-8.297 8.227 8.297 8.226-1.406 1.407L0 9.633 9.633 0z" fill="#004B84"/>
                                    </Svg>
                                </View>
                            </TouchableOpacity>
                            <DateTimePicker
                                style={{width: '100%', height: 500, marginBottom: 50, justifyContent: 'center', alignItems: 'center', alignSelf: 'center',}}
                                testID="dateTimePicker"
                                value={this.state.dateOriginValue}
                                mode={'time'}
                                is24Hour={true}
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={(event, timeOriginValue) => {this.onChangeTurnOffTime(event, timeOriginValue)}}
                            />

                            <TouchableOpacity style={styles.save_btn} onPress={() => this.saveTimeOff()}>
                                <Text style={styles.save_btn_text}>{this.state.language.save}</Text>
                            </TouchableOpacity>

                        </View>

                    </View>
                    }
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
        paddingHorizontal: 20,

    },

    all_devices_general_page_header: {
        width: '100%',
        marginBottom: 23,
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

    turn_off_the_load_switch_value_popup: {
        backgroundColor:  'rgba(0, 0, 0, 0.6)',
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
        bottom: 0,
        alignSelf: 'center',
        flex:1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingTop: 100,
    },
    turn_off_the_load_switch_value_popup_wrapper: {
        width: '90%',
        backgroundColor: '#ffffff',
        alignSelf: 'center',
        // alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 25,
        paddingTop: 25,
        paddingBottom: 18,
        position: 'relative'
    },
    turn_off_the_load_switch_value_popup_title: {
        marginBottom: 23,
        textAlign: 'center',
        fontWeight: '400',
        fontSize: 24,
        color: '#004B84',
    },
    turn_off_the_load_switch_value_popup_info: {
        marginBottom: 35,
        textAlign: 'center',
        fontWeight: '400',
        fontSize: 16,
        color: '#4A4A4A',
        lineHeight: 20,
    },
    turn_off_the_load_switch_value_popup_cancel_btn: {
        width: '100%',
        height: 40,
        marginBottom: 17,
        backgroundColor: '#004B84',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    turn_off_the_load_switch_value_popup_cancel_btn_text: {
        color: '#ffffff',
        fontWeight: '400',
        fontSize: 16,
    },
    turn_off_the_load_switch_value_popup_confirm_btn: {
        width: '100%',
        height: 40,
        marginBottom: 17,
        backgroundColor: '#004B84',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    turn_off_the_load_switch_value_popup_confirm_btn_text: {
        color: '#ffffff',
        fontWeight: '400',
        fontSize: 16,
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

    new_test_item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        width: '100%',

    },
    new_test_item_title: {
        fontWeight: '400',
        fontSize: 16,
        color: '#4A4A4A',

    },

    new_test_item_input_field: {
        borderWidth: 1,
        borderColor: '#10BCCE',
        width: '100%',
        height: 40,
        paddingHorizontal: 8,
        color: '#10BCCE',
        fontWeight: '600',
        fontSize: 16,
        // alignItems: 'flex-end',
        // alignSelf: 'flex-end',
        // justifyContent: 'flex-end',
        textAlign: 'right'
    },
    new_test_item_input_field_box: {
        width: 67,
    },
    preferences_unlink_btn: {
        width: '100%',
        height: 40,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#004B84',
    },
    preferences_unlink_btn_text: {
        color: '#ffffff',
        fontWeight: '400',
        fontSize: 16,
    },



    preferences_item_btn: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',

    },

    preferences_item_btn_text: {
        marginRight: 8,
        color: '#10BCCE',
        fontWeight: '600',
        fontSize: 16,
    },
    // title_back_btn_wrapper: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    // },
    // back_btn:{
    //     marginRight: 8,
    // },

    pre_configuration_item_info: {
        marginBottom: 28,
        color: '#4A4A4A',
        fontWeight: '400',
        fontSize: 16,
        paddingRight: 35,
    },
    sort_by_pre_configuration_radio_input: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 12,
    },
    sort_by_pre_configuration_radio_input_button: {
        width: 24,
        height: 24,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#004B84',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sort_by_pre_configuration_radio_input_title: {
        fontWeight: '400',
        fontSize: 16,
        color: '#4A4A4A',
    },
    activeRadioRound: {
        width: 14,
        height: 14,
        backgroundColor: '#10BCCE',
        borderRadius: 100,
    },

    pre_configuration_popup: {
        backgroundColor:  'white',
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
    pre_configuration_popup_wrapper: {
        flex: 1,
        width: '100%',
        position: 'relative',
        paddingTop: 25,
    },

    shared_access_popup: {
        backgroundColor:  '#ffffff',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 999,
        zIndex: 999999,
        width: '100%',
        height: windowHeight,
        position: 'absolute',
        left: 0,
        top: 25,
        // alignSelf: 'center',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },

    timepicker_popup: {
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


    timepicker_popup_wrapper: {
        width: '100%',
        height: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        position: 'relative',
        // backgroundColor: 'red',
        paddingTop: 50,
        paddingHorizontal: 30,

    },
    shared_access_popup_wrapper: {
        flex: 1,
        width: '100%',
        position: 'relative',
        // paddingTop: 60,
    },
    shared_access_info1: {
        marginBottom: 47,
        color: '#4A4A4A',
        fontWeight: '400',
        fontSize: 16,
        paddingRight: 35,
    },
    shared_access_gmail_info_delete_btn_wrapper: {
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    shared_access_gmail_info: {
        color: '#4A4A4A',
        fontWeight: '400',
        fontSize: 16,
    },
    shared_access_delete_btn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    shared_access_delete_btn_text: {
        color: '#10BCCE',
        fontWeight: '600',
        fontSize: 16,
        marginRight: 8,
    },
    add_account_btn: {
        width: '100%',
        height: 40,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#004B84',
    },
    add_account_btn_text: {
        color: '#ffffff',
        fontWeight: '400',
        fontSize: 16,
    },


    login_input_field: {
        width: '100%',
        height: 40,
        marginBottom: 23,
        borderWidth: 1,
        borderColor: '#10BCCE',
        paddingHorizontal: 13,
        color: '#D3D3D3',
        fontWeight: '400',
        fontSize: 12,
    },
    // protection_upper_voltage_popup: {
    //
    // },
    // protection_upper_voltage_popup_wrapper: {
    //
    // },


    week_days_popup_header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingBottom: 23,
        borderBottomWidth: 1,
        borderBottomColor: '#004B84',
        marginBottom: 53,

    },
    week_days_popup_title: {
        fontWeight: '400',
        color: '#004B84',
        fontSize: 24,
        marginLeft: 16,
    },
    week_days_item: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 27,
    },

    week_day_name: {
        fontWeight: '400',
        fontSize: 16,
        color: '#4A4A4A',
    },
    save_btn: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor:'#004B84',

    },
    save_btn_text: {
        color: '#ffffff',
        fontWeight: '400',
        fontSize: 16,
    }

});
