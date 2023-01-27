import React, { Component } from 'react';
import Svg, {Path, Rect, Circle, Defs, Stop, ClipPath, G, Mask} from "react-native-svg";
import { StatusBar } from 'expo-status-bar';
import {AuthContext} from "../AuthContext/context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import  TopMenu from '../includes/header_menu';

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
import moment from "moment";



export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            headerMenuPopup: false,
            enterNewDevice: '',
            wifiAccess: '',
            wifiPassword: '',
            switchValue: false,
            status: 'Online',
            consumption: '754.5 W/h',
            power: '1222W',
            voltage: '234.4 V',
            amperage: '3.43 A',
            number_of_protection_triggered: '6',
            last_data: '2022-08-12 12:44:12',
            started_time: '2022-08-12 10:12:42',
            living_room_socket: 'Living Room Socket',
            id: 'ID: A44E:4439:B2E6',
            smart_outlet: 'Smart Outlet',
            device_detail: 'HW v1.0.7  SW v2.32',
            device_data: [],

            status_switch: false,

            edit_name_popup: false,
            language: en,
            language_name: 'en',
            edit_name: '',
            name: '',

        };

    }

    static contextType = AuthContext;

    pressCall = () => {
        const url='tel://+7 (495) 984-21-01'
        Linking.openURL(url)
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
        if (this.focusListener) {
            this.focusListener();
        }
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

    redirectToTestMode = () => {
        let device_data = this.state.device_data;

        this.props.navigation.navigate("TestMode", {
            params: device_data.id,
        });

    }
    redirectToPreferences = () => {
        let device_data = this.state.device_data;

        this.props.navigation.navigate("Preferences", {
            params: device_data.id,
        });

    }


    toggleSwitch = async (value) => {
        this.setState({
            status_switch: value
        })
        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;
        let id = this.props.id;

        try {
            fetch(`https://apiv1.zis.ru/devices/power_on/${id}/${value}`, {
                method: 'POST',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }).then((response) => {
                return response.json()
            }).then((response) => {

                console.log(response, 'switch')


                // this.getDeviceData();

            })
        } catch (e) {
            console.log(e)
        }
    };


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

                this.setState({
                    device_data: response,
                    status_switch: response.power_on,
                    edit_name: response.name,
                    name: response.name,
                })

            })
        } catch (e) {
            console.log(e)
        }

    }


    editName = async () => {

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
                    name: this.state.edit_name,

                })


            }).then((response) => {
                return response.json()
            }).then((response) => {

                // console.log(response, ' DEVICE Data')

                this.setState({
                    // name: this.state.edit_name,
                    edit_name_popup: false,
                })

                this.getDeviceData();




            })
        } catch (e) {
            console.log(e)
        }

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

    closeMenu = () => {
        this.setState({
            headerMenuPopup: false
        })
    }


    convertDateFormat = (date) =>
    {
        return moment(date).format('YYYY-MM-DD HH:mm');
    }

    render() {



        return (
            <SafeAreaView style={styles.container} >

                {this.state.headerMenuPopup &&
                    <TopMenu navigation={this.props.navigation} closeMenu={this.closeMenu} />
                }

                <View style={[styles.container, { paddingTop: 25, paddingBottom: 15}]} >

                    <StatusBar style="dark" />
                    <View style={styles.all_devices_general_page_header}>
                        <View style={styles.all_devices_general_page_header_child}>
                            <TouchableOpacity style={styles.title_back_btn_wrapper} onPress={() => {this.redirectToAllDevices()}}>
                                <View style={styles.back_btn}>
                                    <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <Path d="M9.633 0l1.406 1.406-8.297 8.227 8.297 8.226-1.406 1.407L0 9.633 9.633 0z" fill="#004B84"/>
                                    </Svg>
                                </View>
                                <Text style={styles.all_devices_general_page_header_title}>{this.state.name}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.all_devices_general_page_header_menu_btn} onPress={() => {this.setState({headerMenuPopup: true})}}>
                                <Svg width={28} height={25} viewBox="0 0 28 25" fill="none" xmlns="http://www.w3.org/2000/svg"><Path fill="#004B84" d="M0 0H28V3H0z" /><Path fill="#004B84" d="M0 11H28V14H0z" /><Path fill="#004B84" d="M0 22H28V25H0z" /></Svg>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView style={styles.all_devices_general_page_main_wrapper}>

                        <View style={styles.details_general_page_img_info_main_wrapper}>
                            <View style={styles.details_general_page_img}>
                                <Image style={styles.details_general_page_img_child} source={require('../../assets/images/device_general_page_img.png')}/>
                            </View>
                            <View style={styles.details_general_page_info_box}>
                                <View style={styles.details_general_page_info_name_edit_btn_wrapper}>

                                    <Text  style={styles.details_general_page_info_name}>{this.state.name}</Text>

                                    <TouchableOpacity style={styles.details_general_page_info_name_edit_btn} onPress={() => {this.setState({edit_name_popup: true})}}>
                                        <Svg width={15} height={15} viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <G clipPath="url(#clip0_6_105)"><Path d="M8.745 1.62L7.38.255A.866.866 0 006.763 0a.867.867 0 00-.617.255L.433 5.97a.35.35 0 00-.1.2l-.33 2.433a.35.35 0 00.395.395l2.433-.33a.35.35 0 00.2-.1l5.714-5.713A.867.867 0 009 2.237a.866.866 0 00-.255-.617zM2.619 7.988L.76 8.24l.253-1.86L5.06 2.333 6.668 3.94 2.619 7.988zm5.63-5.63L7.164 3.443 5.557 1.837 6.642.75a.17.17 0 01.242 0L8.25 2.116a.17.17 0 010 .242z" fill="#10BCCE"/></G>
                                            <Defs><ClipPath id="clip0_6_105"><Path fill="#fff" d="M0 0H9V9H0z" /></ClipPath></Defs>
                                        </Svg>
                                    </TouchableOpacity>

                                </View>
                                <Text style={styles.details_general_page_info}>{this.state.device_data.ident}</Text>
                                <Text style={styles.details_general_page_info}>{this.state.smart_outlet}</Text>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={[styles.details_general_page_info, {marginBottom: 0}]}>{this.state.device_data.hw_version}</Text>
                                    <Text style={[styles.details_general_page_info, {marginBottom: 0}]}>{this.state.device_data.sw_version}</Text>
                                </View>

                            </View>
                        </View>

                        <View style={styles.details_general_page_items_main_wrapper}>
                            <View style={styles.details_general_page_item}>

                                <Text style={styles.details_general_page_item_title}>{this.state.language.status}</Text>

                                {this.state.device_data.status   &&
                                <Text style={styles.details_general_page_item_info}>{this.state.language.online}</Text>
                                }

                                {!this.state.device_data.status   &&
                                <Text style={styles.details_general_page_item_info}>{this.state.language.offline}</Text>
                                }

                            </View>
                            <View style={styles.details_general_page_item}>
                                <Text style={styles.details_general_page_item_title}>{this.state.language.load}</Text>

                                {this.state.device_data.status &&
                                    <Switch
                                        trackColor={{ false: 'silver', true: '#004B84' }}
                                        thumbColor={'white'}
                                        onValueChange={this.toggleSwitch}
                                        value={this.state.status_switch}
                                    />
                                }

                                {!this.state.device_data.status &&
                                    <Switch
                                        trackColor={{ false: 'silver', true: '#004B84' }}
                                        thumbColor={'white'}
                                        // onValueChange={this.toggleSwitch}
                                        value={false}
                                    />
                                }


                            </View>
                            <View style={styles.details_general_page_item}>
                                <Text style={styles.details_general_page_item_title}>{this.state.language.consumption}</Text>
                                <Text style={styles.details_general_page_item_info}>{this.state.device_data.consumption}</Text>
                            </View>
                            <View style={styles.details_general_page_item}>
                                <Text style={styles.details_general_page_item_title}>{this.state.language.power}</Text>
                                <Text style={styles.details_general_page_item_info}>{this.state.device_data.active_power}</Text>
                            </View>
                            <View style={styles.details_general_page_item}>
                                <Text style={styles.details_general_page_item_title}>{this.state.language.voltage}</Text>
                                <Text style={styles.details_general_page_item_info}>{this.state.device_data.voltage}</Text>
                            </View>
                            <View style={styles.details_general_page_item}>
                                <Text style={styles.details_general_page_item_title}>{this.state.language.amperage}</Text>
                                <Text style={styles.details_general_page_item_info}>{this.state.device_data.amperage}</Text>
                            </View>
                            <View style={styles.details_general_page_item}>
                                <Text style={styles.details_general_page_item_title}>{this.state.language.number_of_protection}</Text>
                                <Text style={styles.details_general_page_item_info}>{this.state.device_data.protection_triggered}</Text>

                            </View>
                            <View style={[styles.details_general_page_item, {flexDirection: 'row', alignItems: 'flex-start'}]}>
                                <Text style={[styles.details_general_page_item_title, {marginBottom: 5}]}>{this.state.language.last_data}</Text>
                                <Text style={styles.details_general_page_item_info}>

                                    {this.convertDateFormat(this.state.device_data.last_data)}

                                </Text>
                            </View>
                            <View style={[styles.details_general_page_item, {flexDirection: 'row', alignItems: 'flex-start'}]}>
                                <Text style={[styles.details_general_page_item_title, {marginBottom: 5}]}>{this.state.language.started_time}</Text>
                                <Text style={styles.details_general_page_item_info}>

                                    {this.convertDateFormat(this.state.device_data.start_time)}

                                </Text>
                            </View>
                        </View>

                    </ScrollView>

                    <View style={styles.details_general_page_preferences_test_buttons_wrapper}>
                        <TouchableOpacity style={styles.details_general_page_preferences_button} onPress={() => {this.redirectToPreferences()}}>
                            <Text  style={styles.details_general_page_preferences_button_text}>
                                {this.state.language.preferences}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity  style={styles.details_general_page_test_button} onPress={() => {this.redirectToTestMode()}}>
                            <View  style={styles.details_general_page_test_button_icon}>
                                <Svg width={40} height={14} viewBox="0 0 40 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <Path fillRule="evenodd" clipRule="evenodd" d="M38.577 12.609l-.794-.522c-.21.478-.586.783-1.087.696-.502-.087-.418-.392-.376-.913l1.588-5.696h1.755l.293-1.044H38.2l1.045-3.87-3.51 1.218-.753 2.652h-1.295l-.293 1.044h1.296l-1.463 5.522c-.293 1-.084 2.304 1.964 2.304 1.505 0 2.591-.26 3.386-1.391zM15.38 3.174c.126.696 1.087 1.087 2.048.826.962-.304 1.547-1.087 1.38-1.74-.21-.695-1.087-1.086-2.048-.825-.962.26-1.63 1.043-1.38 1.739zm11.285 9.913c-1.38 0-1.839-2-1.17-3.957.585-1.913 2.173-3.347 3.343-3.347 1.547-.087 1.589 2.347 1.003 3.956-.501 1.522-1.462 3.348-3.176 3.348zm6.604-4.348c.125-2.435-1.463-3.87-4.43-3.739-2.132.087-4.222 1.087-5.392 2.609-.794 1.087-1.254 2.521-.962 3.826.377 1.521 1.756 2.521 4.389 2.521 2.967-.043 6.102-2.043 6.395-5.217zM13.834 6.174h.752l-1.755 6.478h-1.588l-.293 1.044h11.16l.292-1.044h-1.588l3.218-11.478h-4.598l-.292 1.043h1.38l-2.76 10.392H16.05l2.006-7.522h-3.803l-.418 1.087z" fill="#fff"/>
                                    <Path fillRule="evenodd" clipRule="evenodd" d="M11.535 4.74c-.334 1.303-1.044 2.043-1.839 2.52-1.044.653-2.257.653-2.967.566l1.505-5.609c.585-.087 1.797-.087 2.59.435.628.391 1.004 1 .711 2.087zM4.89 2.26L2.09 12.61H.293L0 13.652h6.938l.293-1.043H5.474l1.003-3.783c2.466.044 4.138-.26 5.392-.826 1.212-.565 1.922-1.304 2.34-2.13.251-.479.418-1.044.502-1.653.042-.478 0-.913-.21-1.304-.417-.74-1.002-1.174-1.796-1.391-.962-.305-2.174-.348-3.553-.348h-5.81L3.052 2.26H4.89zM28.964 2.043C28.964.913 28.086 0 27 0c-1.087 0-1.965.913-1.965 2.043 0 1.13.878 2.044 1.965 2.044 1.086 0 1.964-.913 1.964-2.044zm-.334 0C28.63 3 27.877 3.74 27 3.74c-.92 0-1.63-.782-1.63-1.696 0-.956.71-1.695 1.63-1.695.92 0 1.63.739 1.63 1.695zm-2.132-.782h.543c.21 0 .376.13.376.304 0 .218-.167.348-.418.348h-.501v-.652zm-.334 1.913h.334v-.957h.209c.25 0 .376.087.627.566l.167.347h.418l-.25-.434c-.168-.305-.293-.479-.502-.566.376 0 .627-.217.627-.565 0-.26-.168-.565-.71-.565h-.92v2.174z" fill="#fff"/>
                                </Svg>
                            </View>
                            <Text style={styles.details_general_page_test_button_text}>
                                {/*Test*/}
                                {this.state.language.test}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {this.state.edit_name_popup &&
                        <View style={styles.edit_name_popup}>
                            <View style={styles.edit_name_popup_wrapper}>
                                <TouchableOpacity
                                    style={styles.edit_name_popup_close_btn}
                                    onPress={() => {this.setState({edit_name_popup: false})}}
                                >
                                    <Svg width={25} height={25} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <Path d="M4.024 5.351a.938.938 0 111.327-1.327l9.65 9.65 9.648-9.65a.938.938 0 111.328 1.327L16.326 15l9.65 9.649a.94.94 0 01-1.327 1.327L15 16.326l-9.649 9.65a.939.939 0 11-1.327-1.327L13.674 15l-9.65-9.649z" fill="#004B84"/>
                                    </Svg>
                                </TouchableOpacity>
                                <View style={styles.edit_name_input}>
                                    <TextInput
                                        style={styles.edit_name_input_field}
                                        onChangeText={(val) => this.setState({edit_name: val})}
                                        value={this.state.edit_name}
                                        // placeholder={this.state.device_data.name}
                                        placeholderTextColor='#4A4A4A'
                                    />
                                </View>
                                <TouchableOpacity style={styles.save_btn} onPress={() => {this.editName()}}>
                                    <Text style={styles.save_btn_text}>
                                        OK
                                        {/*{this.state.language.save}*/}
                                    </Text>
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
        paddingHorizontal: 25,
        paddingTop: 34,
    },

    all_devices_general_page_header: {
        width: '100%',
        marginBottom: 0,
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

    details_general_page_img_info_main_wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 39,
    },
    details_general_page_img: {
        width: 102,
        height: 102,
        borderRadius: 100,
        marginRight: 17,
        resizeMode: 'cover',
    },
    details_general_page_img_child: {
        width: '100%',
        height: '100%',

    },
    details_general_page_info_name_edit_btn_wrapper: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 11,
    },
    details_general_page_info_name: {
        fontWeight: '400',
        fontSize: 16,
        color: '#004B84',
    },
    details_general_page_info_name_edit_btn: {
        position: 'absolute',
        right: -20,
        top: -5,
        padding: 5
    },
    details_general_page_info: {
        marginBottom: 8,
        fontWeight: '400',
        fontSize: 12,
        color: '#4A4A4A',
    },
    details_general_page_item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 22,
    },
    details_general_page_item_title: {
        fontWeight: '400',
        fontSize: 16,
        color: '#4A4A4A',
    },
    details_general_page_item_info: {
        fontWeight: '600',
        fontSize: 16,
        color: '#10BCCE',
    },
    details_general_page_preferences_button: {
        width: '100%',
        height: 40,
        marginBottom: 14,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#004B84',
    },
    details_general_page_preferences_button_text: {
       color: '#ffffff',
        fontWeight: '400',
        fontSize: 16,
    },
    details_general_page_test_button: {
        width: '100%',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#004B84',
    },
    details_general_page_test_button_text: {
        color: '#ffffff',
        fontWeight: '400',
        fontSize: 16,
        marginLeft: 8,
        position: 'relative',
        top: 2,
    },
    edit_name_popup: {
        backgroundColor:  'rgba(255, 255, 255, 0.80)',
        // shadowColor: '#000000',
        // shadowOffset: { width: 0, height: 4 },
        // shadowOpacity: 0.25,
        // shadowRadius: 4,
        // elevation: 10,
        zIndex: 999999,
        height: windowHeight + 40,
        width: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 100,
    },

    edit_name_popup_wrapper: {
        backgroundColor: '#ffffff',
        shadowColor: '#004B84',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 10,
        width: '90%',
        paddingHorizontal: 25,
        paddingTop: 80,
        paddingBottom: 60,
        borderRadius: 10,
        position: 'relative'
    },

    edit_name_popup_close_btn: {
        position: 'absolute',
        right: 20,
        top: 20,
    },
    edit_name_input_field: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#10BCCE',
        width: '100%',
        paddingHorizontal: 13,
        height: 45,
        // color: '#D3D3D3',
        color: '#4A4A4A',
        fontWeight: '400',
        fontSize: 12,
    },


     edit_name_input: {
        marginBottom: 40,
    },

   save_btn: {
        width: 250,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        height: 44,
        // backgroundColor: '#0080DE',
        // borderRadius: 20,
       // width: '100%',
       // height: 40,
       flexDirection: 'row',
       // alignItems: 'center',
       // alignSelf: 'center',
       // justifyContent: 'center',
       backgroundColor: '#004B84',
    },
   save_btn_text: {
        color: '#ffffff',
        // fontWeight: '700',
        fontSize: 16,
    },
    details_general_page_preferences_test_buttons_wrapper: {
        width: '100%',
        paddingVertical: 15,
        paddingHorizontal: 25
    },
    details_general_page_items_main_wrapper: {
        marginBottom: 20
    }
});
