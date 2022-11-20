import React, { Component } from 'react';
import Svg, {Path, Rect, Circle, Defs, Stop, ClipPath, G, Mask} from "react-native-svg";
import { StatusBar } from 'expo-status-bar';
import DropDownPicker from "react-native-custom-dropdown";
import PieChart from 'react-native-expo-pie-chart';
import { VictoryPie } from "victory-native";
import DatePicker from 'react-native-datepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

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



export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            headerMenuPopup: false,
            turnOffTheLoadSwitchValue: false,
            settingNameSwitchValue: false,
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
            protection_upper_voltage_input_error: false,
            upper_voltage_delay_popup: false,
            upper_voltage_delay: '',
            selectedUpperVoltageDelay: '',
            protection_upper_voltage_input: '',

            protection_lower_voltage_input_error: false,
            protection_lower_voltage_input: '',

            lower_voltage_delay_popup: false,
            selectedLowerVoltageDelay: null,
            power_restore_delay_input_error: false,
            power_restore_delay_input: '',
            startup_delay_input_error: false,

            startup_delay_input: '',
            selectedUpperVoltageDelay_error: false,
            selectedLowerVoltageDelay_error: false,

            isOpenDatePicker: false,
            isOpenDatePicker2: false,
            dateOriginValue: new Date(),

            timeOriginValue: '',
            timeLabelValue: '',
            timeOriginValue2: '',
            timeLabelValue2: '',
            showCloseDateButtonForIos: false,

            start_date_error: false,
            to_date_error: false,

            date_error: false,
            date_error_text: '',
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

    turnOffTheLoadToggleSwitch = (value) => {
        this.setState({ turnOffTheLoadSwitchValue: value, turnOffTheLoadSwitchValuePopup: true });
    };

    settingNameToggleSwitch = (value) => {
        this.setState({ settingNameSwitchValue: value });
    };

    redirectToDetailsGeneralPage = () => {
        this.props.navigation.navigate("DetailsGeneralPage");
    }

    redirectToTestMode = () => {
        this.props.navigation.navigate("TestMode", {
            params: this.props.id
        });
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

    redirectToTestReport = async () => {

        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;
        let id = this.props.id;

        let {timeLabelValue, timeLabelValue2, protection_upper_voltage_input, selectedUpperVoltageDelay, protection_lower_voltage_input, selectedLowerVoltageDelay, power_restore_delay_input, startup_delay_input} = this.state;

        if (timeLabelValue.length == '' || timeLabelValue2.length == '' || protection_upper_voltage_input < 230 || protection_upper_voltage_input > 280  || selectedUpperVoltageDelay == ''  || protection_lower_voltage_input < 150 || protection_lower_voltage_input > 220 || selectedLowerVoltageDelay == '' || power_restore_delay_input > 300 || startup_delay_input > 300 ) {
            if (timeLabelValue.length == '') {
                this.setState({
                    start_date_error: true
                })
            } else {
                this.setState({
                    start_date_error: false
                })
            }

            if (timeLabelValue2.length == '') {
                this.setState({
                    to_date_error: true
                })
            } else {
                this.setState({
                    to_date_error: false
                })
            }
            if (protection_upper_voltage_input < 230 || protection_upper_voltage_input > 280) {
                this.setState({
                    protection_upper_voltage_input_error: true
                })
                return false;
            } else {
                this.setState({
                    protection_upper_voltage_input_error: false
                })
            }

            if (selectedUpperVoltageDelay == '') {
                this.setState({
                    selectedUpperVoltageDelay_error: true
                })
            } else {
                this.setState({
                    selectedUpperVoltageDelay_error: false
                })
            }
            if (protection_lower_voltage_input < 150 || protection_lower_voltage_input > 220) {
                this.setState({
                    protection_lower_voltage_input_error: true
                })
                return false;
            } else {
                this.setState({
                    protection_lower_voltage_input_error: false
                })
            }

            if (selectedLowerVoltageDelay == '') {
                this.setState({
                    selectedLowerVoltageDelay_error: true
                })
            } else {
                this.setState({
                    selectedLowerVoltageDelay_error: false
                })
            }

            if (power_restore_delay_input > 300) {
                this.setState({
                    power_restore_delay_input_error: true
                })


            } else {
                this.setState({
                    power_restore_delay_input_error: false
                })
            }

            if (startup_delay_input > 300) {
                this.setState({
                    startup_delay_input_error: true
                })


            } else {
                this.setState({
                    startup_delay_input_error: false
                })
            }


            return  false;
        }


        console.log({
            device_id: id,
            start_date:  timeLabelValue,
            end_date: timeLabelValue2,
            upper_voltage_trigger:  parseInt(protection_upper_voltage_input)  ,
            upper_voltage_delay:  parseInt(selectedUpperVoltageDelay),
            lower_voltage_trigger:  parseInt(protection_lower_voltage_input),
            lower_voltage_delay:  parseInt(selectedLowerVoltageDelay),
            power_restore_delay:  parseInt(power_restore_delay_input),
            startup_delay:  parseInt(startup_delay_input),

        }, 'api')

        try {
            fetch(`https://apiv1.zis.ru/tests`, {
                method: 'POST',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    device_id: id,
                    start_date:  timeLabelValue,
                    end_date: timeLabelValue2,
                    upper_voltage_trigger:  parseInt(protection_upper_voltage_input),
                    upper_voltage_delay:  parseInt(selectedUpperVoltageDelay),
                    lower_voltage_trigger:  parseInt(protection_lower_voltage_input),
                    lower_voltage_delay:  parseInt(selectedLowerVoltageDelay),
                    power_restore_delay:  parseInt(power_restore_delay_input),
                    startup_delay:  parseInt(startup_delay_input),

                })



            }).then((response) => {
                return response.json()
            }).then((response) => {

                console.log(response, ' DEVICE Data')
                if (response.hasOwnProperty('result')) {
                     if (response.result == 'success') {
                         this.props.navigation.navigate("TestMode", {
                             params: this.props.id,
                         });

                     }
                } else {
                    if (response.hasOwnProperty('description')) {
                         if (response.description.ru == 'Сочетание дат начала и окончания теста некорректно') {
                             this.setState({
                                 date_error: true,
                                 date_error_text: 'Дата старта меньше текущей',
                             })
                         } else {
                             this.setState({
                                 date_error: false,
                                 date_error_text: '',
                             })
                         }
                    }
                }
            })
        } catch (e) {
            console.log(e)
        }

    }

    closeMenu = () => {
        this.setState({
            headerMenuPopup: false
        })
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
            // let userToken = await AsyncStorage.getItem('userToken');
            // let AuthStr = 'Bearer ' + userToken;
            // let id = this.props.id;
            //
            // try {
            //     fetch(`https://apiv1.zis.ru/tests/device/`+ id, {
            //         method: 'POST',
            //         headers: {
            //             'Authorization': AuthStr,
            //             'Accept': 'application/json',
            //             'Content-Type': 'application/json',
            //         },
            //         body: JSON.stringify({
            //             upper_voltage_trigger: protection_upper_voltage_input,
            //
            //         })
            //
            //
            //
            //     }).then((response) => {
            //         return response.json()
            //     }).then((response) => {
            //
            //         console.log(response, ' DEVICE Data')
            //
            //         // this.setState({
            //         //     // name: this.state.edit_name,
            //         //     pre_configuration_popup: false,
            //         // })
            //
            //         // this.getDeviceData();
            //
            //
            //
            //
            //
            //
            //     })
            // } catch (e) {
            //     console.log(e)
            // }
        }




    }
    chooseUpperVoltageDelay = async (item) => {

        this.setState({
            selectedUpperVoltageDelay: item.value,
            upper_voltage_delay_popup: false,
        })

        // console.log( typeof item.value,item.value, 'fff');
        //
        // let userToken = await AsyncStorage.getItem('userToken');
        // let AuthStr   = 'Bearer ' + userToken;
        // let id        = this.props.id;
        //
        // console.log(`https://apiv1.zis.ru/devices/`+ id);
        // console.log(AuthStr);
        //
        //
        // try {
        //     fetch(`https://apiv1.zis.ru/devices/`+ id, {
        //         method: 'PATCH',
        //         headers: {
        //             'Authorization': AuthStr,
        //             'Accept': 'application/json',
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             upper_voltage_delay: parseInt(item.value),
        //         })
        //     }).then((response) => {
        //         return response.json()
        //     }).then((response) => {
        //
        //         console.log(response, ' DEVICE Data')
        //
        //         this.setState({
        //             upper_voltage_delay_popup: false,
        //         })
        //         this.getDeviceData();
        //
        //
        //     })
        // } catch (e) {
        //     console.log(e)
        // }

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
            // let userToken = await AsyncStorage.getItem('userToken');
            // let AuthStr = 'Bearer ' + userToken;
            // let id = this.props.id;
            //
            // try {
            //     fetch(`https://apiv1.zis.ru/devices/`+ id, {
            //         method: 'PATCH',
            //         headers: {
            //             'Authorization': AuthStr,
            //             'Accept': 'application/json',
            //             'Content-Type': 'application/json',
            //         },
            //         body: JSON.stringify({
            //             lower_voltage_trigger: protection_lower_voltage_input,
            //
            //         })
            //
            //
            //
            //     }).then((response) => {
            //         return response.json()
            //     }).then((response) => {
            //
            //         console.log(response, ' DEVICE Data')
            //
            //         // this.setState({
            //         //     // name: this.state.edit_name,
            //         //     pre_configuration_popup: false,
            //         // })
            //
            //         // this.getDeviceData();
            //
            //
            //
            //
            //
            //
            //     })
            // } catch (e) {
            //     console.log(e)
            // }
        }




    }
    chooseLowerVoltageDelay = async (item) => {

        this.setState({
            selectedLowerVoltageDelay: item.value,
            lower_voltage_delay_popup: false,
        })

        // console.log( typeof item.value,item.value, 'fff');
        //
        // let userToken = await AsyncStorage.getItem('userToken');
        // let AuthStr   = 'Bearer ' + userToken;
        // let id        = this.props.id;
        //
        // console.log(`https://apiv1.zis.ru/devices/`+ id);
        // console.log(AuthStr);
        //
        //
        // try {
        //     fetch(`https://apiv1.zis.ru/devices/`+ id, {
        //         method: 'PATCH',
        //         headers: {
        //             'Authorization': AuthStr,
        //             'Accept': 'application/json',
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             lower_voltage_delay: parseInt(item.value),
        //         })
        //     }).then((response) => {
        //         return response.json()
        //     }).then((response) => {
        //
        //         console.log(response, ' DEVICE Data')
        //
        //         this.setState({
        //             lower_voltage_delay_popup: false,
        //         })
        //         this.getDeviceData();
        //
        //
        //     })
        // } catch (e) {
        //     console.log(e)
        // }

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
            // let userToken = await AsyncStorage.getItem('userToken');
            // let AuthStr = 'Bearer ' + userToken;
            // let id = this.props.id;
            //
            // try {
            //     fetch(`https://apiv1.zis.ru/devices/`+ id, {
            //         method: 'PATCH',
            //         headers: {
            //             'Authorization': AuthStr,
            //             'Accept': 'application/json',
            //             'Content-Type': 'application/json',
            //         },
            //         body: JSON.stringify({
            //             power_restore_delay: power_restore_delay_input,
            //
            //         })
            //
            //
            //
            //     }).then((response) => {
            //         return response.json()
            //     }).then((response) => {
            //
            //         console.log(response, ' DEVICE Data')
            //
            //         // this.setState({
            //         //     // name: this.state.edit_name,
            //         //     pre_configuration_popup: false,
            //         // })
            //
            //         // this.getDeviceData();
            //
            //
            //
            //
            //
            //
            //     })
            // } catch (e) {
            //     console.log(e)
            // }
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
            // let userToken = await AsyncStorage.getItem('userToken');
            // let AuthStr = 'Bearer ' + userToken;
            // let id = this.props.id;
            //
            // try {
            //     fetch(`https://apiv1.zis.ru/devices/`+ id, {
            //         method: 'PATCH',
            //         headers: {
            //             'Authorization': AuthStr,
            //             'Accept': 'application/json',
            //             'Content-Type': 'application/json',
            //         },
            //         body: JSON.stringify({
            //             startup_delay: startup_delay_input,
            //
            //         })
            //
            //
            //
            //     }).then((response) => {
            //         return response.json()
            //     }).then((response) => {
            //
            //         console.log(response, ' DEVICE Data')
            //
            //         // this.setState({
            //         //     // name: this.state.edit_name,
            //         //     pre_configuration_popup: false,
            //         // })
            //
            //         // this.getDeviceData();
            //
            //
            //
            //
            //
            //
            //     })
            // } catch (e) {
            //     console.log(e)
            // }
        }




    }
    onChangeTime = async (event, timeOriginValue) => {



        console.log(moment(timeOriginValue).format("YYYY-MM-DD HH:mm:ss"), 'sukaaaaaaaaaaaaaaa')
        // console.log( moment().format("HH:mm:ss"), 'Cureent time');
        // console.log( moment(timeOriginValue).format("HH:mm:ss"), ' moment(timeOriginValue).format("hh:mm:ss"),')

        if (event.type != 'set' ) {
            await this.setState({
                isOpenDatePicker: false
            })
            return false
        }



        await this.setState({
            timeOriginValue: timeOriginValue,
            timeLabelValue: moment(timeOriginValue).format("YYYY-MM-DD HH:mm:ss"),
            // isOpenTimePicker: Platform.OS !== "ios" ? false : true,
            // showCloseDateButtonForIos: true
        })
        //
        // await AsyncStorage.setItem('timerEndTime', JSON.stringify(timeOriginValue));

        // console.log(moment(timeOriginValue).format("dddd, MMM DD at HH:mm a"), 'date time');

    }
    onChangeTime2 = async (event, timeOriginValue2) => {



        console.log(moment(timeOriginValue2).format("YYYY-MM-DD HH:mm:ss"), 'timeOriginValue')
        console.log(typeof timeOriginValue2, 'timeOriginValue')
        // console.log( moment().format("HH:mm:ss"), 'Cureent time');
        // console.log( moment(timeOriginValue).format("HH:mm:ss"), ' moment(timeOriginValue).format("hh:mm:ss"),')

        if (event.type != 'set' ) {
            await this.setState({
                isOpenDatePicker2: false
            })
            return false
        }



        await this.setState({
            timeOriginValue2: timeOriginValue2,
            timeLabelValue2: moment(timeOriginValue2).format("YYYY-MM-DD HH:mm:ss"),
            // isOpenTimePicker: Platform.OS !== "ios" ? false : true,
            // showCloseDateButtonForIos: true
        })
        //
        // await AsyncStorage.setItem('timerEndTime', JSON.stringify(timeOriginValue));

        // console.log(moment(timeOriginValue2).format("MMMM Do YYYY, h:mm:ss a"), 'date time');

    }

    render() {



        // turnOffTheLoadSwitchValuePopup
        if (this.state.turnOffTheLoadSwitchValuePopup) {
            return (
                <View style={styles.turn_off_the_load_switch_value_popup}>
                    <View style={styles.turn_off_the_load_switch_value_popup_wrapper}>
                          <Text style={styles.turn_off_the_load_switch_value_popup_title}>Внимание!</Text>
                          <Text style={styles.turn_off_the_load_switch_value_popup_info}>
                              Подключенные устройства будут отключены от сети во время проведения тестирования.
                          </Text>
                        <TouchableOpacity style={styles.turn_off_the_load_switch_value_popup_cancel_btn} onPress={() => {this.setState({turnOffTheLoadSwitchValuePopup: false, turnOffTheLoadSwitchValue: false          })}}>
                            <Text style={styles.turn_off_the_load_switch_value_popup_cancel_btn_text}>Отмена</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.turn_off_the_load_switch_value_popup_confirm_btn}>
                            <Text style={styles.turn_off_the_load_switch_value_popup_confirm_btn_text}>Ok</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
                            <TouchableOpacity style={styles.title_back_btn_wrapper} onPress={() => {this.redirectToTestMode()}}>
                                <View style={styles.back_btn}>
                                    <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <Path d="M9.633 0l1.406 1.406-8.297 8.227 8.297 8.226-1.406 1.407L0 9.633 9.633 0z" fill="#004B84"/>
                                    </Svg>
                                </View>
                                <Text style={styles.all_devices_general_page_header_title}>New test</Text>
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
                    <KeyboardAwareScrollView
                        style={styles.all_devices_general_page_main_wrapper}
                        enableOnAndroid={true}
                        // enableAutoAutomaticScrol='true'
                        keyboardOpeningTime={0}>
                        <View style={styles.new_test_items_wrapper}>
                            {this.state.date_error &&
                            <Text style={styles.error_text}>{this.state.date_error_text}</Text>
                            }
                            <View style={styles.new_test_item}>
                                <Text style={styles.new_test_item_title}>Start</Text>
                                <TouchableOpacity onPress={() => {
                                    this.setState({
                                        isOpenDatePicker: true
                                    })


                                }}

                                >



                                    <Text
                                        style={[

                                            styles.input, {fontWeight: this.state.timeLabelValue  == '' ?  "400" : 'bold',   fontSize: this.state.timeLabelValue  == '' ? 12 : 15, color: "#10BCCE", paddingTop:14,},
                                            {borderWidth: 1, borderColor: this.state.start_date_error === true ? 'red' : '#10BCCE', width: 157,  textAlign: 'right', height: 40, paddingHorizontal: 12}
                                        ]}
                                    >
                                        {this.state.timeLabelValue  == '' ?

                                            <Text>Start Date</Text>
                                            :

                                            this.state.timeLabelValue

                                        }
                                    </Text>


                                </TouchableOpacity>


                            </View>

                            <View style={styles.new_test_item}>
                                <Text style={styles.new_test_item_title}>To</Text>
                                <TouchableOpacity onPress={() => {
                                    this.setState({
                                        isOpenDatePicker2: true
                                    })
                                }}

                                >



                                    <Text
                                        style={[

                                            styles.input, {fontWeight: this.state.timeLabelValue2  == '' ?  "400" : 'bold',   fontSize: this.state.timeLabelValue2  == '' ? 12 : 15, color: "#10BCCE", paddingTop:14,},
                                            {borderWidth: 1, borderColor: this.state.to_date_error === true ? 'red' : '#10BCCE', width: 157,  textAlign: 'right', height: 40, paddingHorizontal: 12}
                                        ]}
                                    >
                                        {this.state.timeLabelValue2  == '' ?

                                            <Text>To Date</Text>
                                            :

                                            this.state.timeLabelValue2

                                        }
                                    </Text>
                                    {/*<TextInput*/}
                                    {/*    value={this.state.edit_birth}*/}
                                    {/*    editable={false}*/}
                                    {/*    style={[*/}

                                    {/*        styles.input,*/}
                                    {/*        this.state.edit_birth_error && {*/}
                                    {/*            borderWidth: 1, borderColor: '#A4223C'*/}
                                    {/*        },*/}
                                    {/*        this.state.edit_birth_valid && {*/}
                                    {/*            borderWidth: 1, borderColor: '#337363'*/}
                                    {/*        }*/}
                                    {/*    ]}*/}
                                    {/*    underlineColorAndroid='transparent'*/}
                                    {/*    label={*/}
                                    {/*        <Text*/}
                                    {/*            style={[*/}
                                    {/*                {color: this.state.edit_birth_error ? '#A4223C' : this.state.edit_birth_valid ? '#337363' : '#55545F'},*/}
                                    {/*                {color: "#000000", fontWeight: 'normal', fontSize: 12,}*/}

                                    {/*            ]*/}
                                    {/*            }>*/}
                                    {/*            {i18n.t('date_of_birth')}*/}
                                    {/*        </Text>*/}
                                    {/*    }*/}
                                    {/*    error={false}*/}
                                    {/*    // onBlur={() => this.onBlurCountry()}*/}
                                    {/*    theme={{colors: {text: '#000000', primary: 'transparent'}}}*/}
                                    {/*    underlineColor='transparent'*/}
                                    {/*    selectionColor='transparent'*/}
                                    {/*    activeOutlineColor='transparent'*/}

                                    {/*/>*/}
                                    {this.state.edit_birth_error &&

                                    <Text style={styles.error_text}>
                                        {this.state.edit_birth_error_text}
                                    </Text>

                                    }

                                </TouchableOpacity>
                            </View>
                            <View style={styles.new_test_item}>
                                <Text style={styles.new_test_item_title}>Выключать нагрузку?</Text>
                                <Switch

                                    trackColor={{ false: '#767577', true: '#004B84' }}
                                    // thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                                    onValueChange={this.turnOffTheLoadToggleSwitch}
                                    value={this.state.turnOffTheLoadSwitchValue}
                                />
                            </View>
                            <View style={[styles.new_test_item]}>
                                <Text style={[styles.new_test_item_title, {color: this.state.protection_upper_voltage_input_error === true ? 'red' : '#4A4A4A'}]}>
                                    Protection upper voltage (V)
                                </Text>
                                <View style={styles.new_test_item_input_field_box}>
                                    <TextInput
                                        style={[styles.new_test_item_input_field, {marginRight: 18, flex: 1, borderColor: '#10BCCE',  }]}
                                        onChangeText={(val) => {
                                            this.chooseProtectionUpperVoltage(val)
                                        }}
                                        value={this.state.protection_upper_voltage_input}
                                        placeholder={this.state.protection_upper_voltage_input}
                                        placeholderTextColor={'#10BCCE'}
                                        // editable={this.state.protection_preset != 'Manual setup' ? false : true}
                                        // keyboardType = 'numeric'
                                        // keyboardType="numeric"

                                    />
                                </View>

                            </View>
                            <View style={[styles.new_test_item]}>
                                <Text style={styles.new_test_item_title}>Upper voltage delay (sec) </Text>
                                <TouchableOpacity style={styles.preferences_item_btn} onPress={() => {
                                    this.setState({
                                        upper_voltage_delay_popup: true
                                    })
                                }}>
                                    <Text style={[styles.preferences_item_btn_text, {color: this.state.selectedUpperVoltageDelay_error === true ? 'red' : '#4A4A4A'}]}>{this.state.selectedUpperVoltageDelay}</Text>
                                    <View style={styles.preferences_item_btn_icon}>
                                        <Svg
                                            width={12}
                                            height={20}
                                            viewBox="0 0 12 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <Path
                                                d="M1.406 19.266L0 17.859l8.297-8.226L0 1.406 1.406 0l9.633 9.633-9.633 9.633z"
                                                fill= {"#004B84"}
                                            />
                                        </Svg>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.new_test_item]}>
                                <Text style={[styles.new_test_item_title, {color: this.state.protection_lower_voltage_input_error === true ? 'red' : '#4A4A4A'}]}>Protection lower voltage (V)</Text>
                                <View style={styles.new_test_item_input_field_box}>
                                    <TextInput
                                        style={[styles.new_test_item_input_field, {marginRight: 18, flex: 1, borderColor: '#10BCCE'}]}
                                        onChangeText={(val) => {
                                            this.chooseProtectionLowerVoltage(val);
                                        }}
                                        value={this.state.protection_lower_voltage_input}
                                        placeholder={this.state.protection_lower_voltage_input}
                                        placeholderTextColor={'#10BCCE'}
                                        // editable={this.state.protection_preset != 'Manual setup' ? false : true}
                                    />
                                </View>

                            </View>
                            <View style={[styles.new_test_item]}>
                                <Text style={styles.new_test_item_title}>Lower voltage delay (sec)</Text>
                                <TouchableOpacity style={styles.preferences_item_btn} onPress={() => {
                                    this.setState({
                                        lower_voltage_delay_popup: true
                                    })
                                }}>
                                    <Text style={[styles.preferences_item_btn_text, {color: this.state.selectedLowerVoltageDelay_error === true ? 'red' : '#4A4A4A'}]}>{this.state.selectedLowerVoltageDelay}</Text>
                                    <View style={styles.preferences_item_btn_icon}>
                                        <Svg
                                            width={12}
                                            height={20}
                                            viewBox="0 0 12 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <Path
                                                d="M1.406 19.266L0 17.859l8.297-8.226L0 1.406 1.406 0l9.633 9.633-9.633 9.633z"
                                                fill= {"#004B84"}
                                            />
                                        </Svg>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.new_test_item]}>
                                <Text style={[styles.new_test_item_title, {color: this.state.power_restore_delay_input_error === true ? 'red' : '#4A4A4A'}]}>Power restore delay (sec)</Text>
                                <View style={styles.new_test_item_input_field_box}>
                                    <TextInput
                                        style={[styles.new_test_item_input_field, {marginRight: 18, flex: 1, borderColor: '#10BCCE'}]}
                                        onChangeText={(val) => {
                                            this.choosePowerRestoreDelay(val);
                                        }}
                                        value={this.state.power_restore_delay_input}
                                        placeholder={this.state.power_restore_delay_input}
                                        placeholderTextColor={'#10BCCE'}
                                        // editable={this.state.protection_preset != 'Manual setup' ? false : true}
                                    />
                                </View>

                            </View>
                            <View style={[styles.new_test_item]}>
                                <Text style={[styles.new_test_item_title, {color: this.state.startup_delay_input_error === true ? 'red' : '#4A4A4A'}]}>Startup delay (sec)</Text>
                                <View style={styles.new_test_item_input_field_box}>
                                    <TextInput
                                        style={[styles.new_test_item_input_field, {marginRight: 18, flex: 1,  borderColor:'#10BCCE'}]}
                                        onChangeText={(val) => {
                                            this.chooseStartupDelay(val);
                                        }}
                                        value={this.state.startup_delay_input}
                                        placeholder={this.state.startup_delay_input}
                                        placeholderTextColor={'#10BCCE'}
                                        // editable={this.state.protection_preset != 'Manual setup' ? false : true}
                                    />
                                </View>

                            </View>

                        </View>
                    </KeyboardAwareScrollView>


                    <View style={styles.new_test_footer}>
                        <TouchableOpacity style={styles.new_test_schedule_btn} onPress={() => {this.redirectToTestReport()}}>
                            <Text style={styles.new_test_schedule_btn_text}>Schedule</Text>
                        </TouchableOpacity>
                    </View>


                    {this.state.isOpenDatePicker &&
                    <View style={styles.timepicker_popup}>
                        <View style={styles.timepicker_popup_wrapper}>
                            <TouchableOpacity style={{width: '100%', position: 'absolute', left: 20, top: 60}} onPress={() => {this.setState({isOpenDatePicker: false})}}>
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
                                mode={'datetime'}
                                is24Hour={true}
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={(event, timeOriginValue) => {this.onChangeTime(event, timeOriginValue)}}
                            />

                            {/*<TouchableOpacity style={styles.save_btn} onPress={() => this.saveTimeOn()}>*/}
                            {/*    <Text style={styles.save_btn_text}>Save</Text>*/}
                            {/*</TouchableOpacity>*/}

                        </View>
                    </View>

                    }


                    {this.state.isOpenDatePicker2 &&
                    <View style={styles.timepicker_popup}>
                        <View style={styles.timepicker_popup_wrapper}>
                            <TouchableOpacity style={{width: '100%', position: 'absolute', left: 20, top: 60}} onPress={() => {this.setState({isOpenDatePicker2: false})}}>
                                <View>
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
                            </TouchableOpacity>
                            <DateTimePicker
                                style={{width: '100%', height: 500, marginBottom: 50, justifyContent: 'center', alignItems: 'center', alignSelf: 'center',}}
                                testID="dateTimePicker"
                                value={this.state.dateOriginValue}
                                mode={'datetime'}
                                is24Hour={true}
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={(event, timeOriginValue2) => {this.onChangeTime2(event, timeOriginValue2)}}
                            />

                            {/*<TouchableOpacity style={styles.save_btn} onPress={() => this.saveTimeOn()}>*/}
                            {/*    <Text style={styles.save_btn_text}>Save</Text>*/}
                            {/*</TouchableOpacity>*/}

                        </View>

                    </View>
                    }


                    {this.state.upper_voltage_delay_popup  &&
                    <View style={styles.turn_off_the_load_switch_value_popup}>
                        <View style={[styles.turn_off_the_load_switch_value_popup_wrapper, {paddingBottom: 200, paddingTop: 60}]}>
                            <TouchableOpacity style={[styles.title_back_btn_wrapper, {width: '100%', position: 'absolute', left: 20, top: 20}]} onPress={() => {this.setState({upper_voltage_delay_popup: false})}}>
                                <View>
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
                            </TouchableOpacity>

                            <DropDownPicker
                                items={
                                    [
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
                                        // {label: '20.5', value: '20.5'},
                                    ]

                                }
                                placeholder='Protection upper voltage (V)'
                                containerStyle={{ height: 45, width: '100%',  zIndex: 999999, borderRadius: 0, }}
                                style={[styles.phone_code_dropdown,
                                    {backgroundColor: '#004B84', height: 45, borderRadius: 0}
                                ]}
                                itemStyle={{
                                    justifyContent: 'flex-start',
                                    width: 50,
                                    zIndex: 15
                                }}
                                selectedLabelStyle={{
                                    fontSize: 16,
                                    color: "#ffffff",
                                    fontWeight: '400',
                                }}
                                labelStyle={{
                                    fontSize: 16,
                                    color: "#ffffff",
                                    fontWeight: '400',

                                }}
                                placeholderStyle={{
                                    fontSize: 14,
                                    color: "#ffffff",
                                    fontWeight: '400',
                                }}


                                dropDownStyle={{backgroundColor: '#004B84',  width: '100%',  zIndex: 999999, borderRadius: 0,}}
                                value={this.state.selectedUpperVoltageDelay}
                                defaultValue={this.state.selectedUpperVoltageDelay}


                                // selectedLabel='English'
                                arrowColor={'white'}
                                // onChangeItem={this.onChangeDropDownItem}
                                onChangeItem={item => {
                                    this.chooseUpperVoltageDelay(item);
                                }}


                            />
                        </View>
                    </View>
                    }

                    {this.state.lower_voltage_delay_popup  &&
                    <View style={styles.turn_off_the_load_switch_value_popup}>
                        <View style={[styles.turn_off_the_load_switch_value_popup_wrapper, {paddingBottom: 200, paddingTop: 60}]}>
                            <TouchableOpacity style={[styles.title_back_btn_wrapper, {width: '100%', position: 'absolute', left: 20, top: 20}]} onPress={() => {this.setState({lower_voltage_delay_popup: false})}}>
                                <View>
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
                            </TouchableOpacity>

                            <DropDownPicker
                                items={
                                    [
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
                                        // {label: '20.5', value: '20.5'},
                                    ]

                                }
                                placeholder='Lower voltage delay (sec) '
                                containerStyle={{ height: 45, width: '100%',  zIndex: 999999, borderRadius: 0, }}
                                style={[styles.phone_code_dropdown,
                                    {backgroundColor: '#004B84', height: 45, borderRadius: 0}
                                ]}
                                itemStyle={{
                                    justifyContent: 'flex-start',
                                    width: 50,
                                    zIndex: 15
                                }}
                                selectedLabelStyle={{
                                    fontSize: 16,
                                    color: "#ffffff",
                                    fontWeight: '400',
                                }}
                                labelStyle={{
                                    fontSize: 16,
                                    color: "#ffffff",
                                    fontWeight: '400',

                                }}
                                placeholderStyle={{
                                    fontSize: 14,
                                    color: "#ffffff",
                                    fontWeight: '400',
                                }}


                                dropDownStyle={{backgroundColor: '#004B84',  width: '100%',  zIndex: 999999, borderRadius: 0,}}
                                value={this.state.selectedLowerVoltageDelay}
                                defaultValue={this.state.selectedLowerVoltageDelay}


                                // selectedLabel='English'
                                arrowColor={'white'}
                                // onChangeItem={this.onChangeDropDownItem}
                                onChangeItem={item => {
                                    this.chooseLowerVoltageDelay(item);
                                }}


                            />
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
        marginBottom: 36,
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
        backgroundColor:  'rgba(0, 0, 0, 0.3)',
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
        paddingTop: 100,
    },
    turn_off_the_load_switch_value_popup_wrapper: {
         width: 284,
        backgroundColor: '#ffffff',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 25,
        paddingTop: 25,
        paddingBottom: 18,
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
        marginBottom: 14,
        width: '100%',

    },
    new_test_item_title: {
       fontWeight: '400',
       fontSize: 16,
        color: '#4A4A4A',

    },

    new_test_item_input_field: {
        borderWidth: 1,
        borderColor: '#10bcce4d',
        width: '100%',
        height: 40,
        paddingHorizontal: 8,
        color: '#10bcce4d',
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
    new_test_schedule_btn: {
        width: '100%',
        height: 40,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#004B84',
    },
    new_test_schedule_btn_text: {
        color: '#ffffff',
        fontWeight: '400',
        fontSize: 16,
    },
    dateBirth_icon: {
        position: 'absolute',
        right: -120,
        bottom: -17
    },
    inputWrapper: {
        height: 50,
        position: 'relative',
        top: -30,
    },
    new_test_footer: {
        width: '100%',
        paddingHorizontal: 20,
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

    error_text: {
        fontSize: 14,
        fontWeight: '400',
        marginVertical: 5,
        color: 'red'

    }
});
