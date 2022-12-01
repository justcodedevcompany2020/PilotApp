import React, { Component } from 'react';
import Svg, {Path, Rect, Circle, Defs, Stop, ClipPath, G, Mask} from "react-native-svg";
import { StatusBar } from 'expo-status-bar';
import DropDownPicker from "react-native-custom-dropdown";
import  TopMenu from '../includes/header_menu';
import i18n from "i18n-js";
import {en, ru} from "../../i18n/supportedLanguages";
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




export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            headerMenuPopup: false,
            enterNewDevice: '',
            wifiAccess: '',
            wifiPassword: '',
            language: en,
            language_name: 'en',
        };

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


    static contextType = AuthContext;

    componentDidMount() {
        const { navigation } = this.props;
        this.setLanguageFromStorage();
        this.focusListener = navigation.addListener("focus", () => {
            this.setLanguageFromStorage();
        });

    }

    componentWillUnmount() {
        // Remove the event listener
        if (this.focusListener) {
            this.focusListener();
            // console.log('Bum END')
        }

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


    redirectToAllDevices = () => {
        this.props.navigation.navigate("AllDevices");

    }

    redirectToSettings = () => {
        this.props.navigation.navigate("Settings");

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
                            <TouchableOpacity style={styles.title_back_btn_wrapper} onPress={() => {this.redirectToAddingNew()}}>
                                <View style={styles.back_btn}>
                                    <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <Path d="M9.633 0l1.406 1.406-8.297 8.227 8.297 8.226-1.406 1.407L0 9.633 9.633 0z" fill="#004B84"/>
                                    </Svg>
                                </View>
                                <Text style={styles.all_devices_general_page_header_title}>{this.state.language.device_setup}</Text>
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

                        <View style={styles.new_device_has_been_found_icon_title_wrapper}>

                            <View style={styles.new_device_settings_icon}>
                                <Svg width={45} height={45} viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <Path d="M40.324 17.719l1.336-6.293-6.117-1.969-1.969-6.152-6.293 1.37L22.5.353l-4.781 4.324-6.293-1.371-1.969 6.117-6.152 2.004 1.336 6.293L.35 22.5l4.325 4.781-1.371 6.293 6.117 1.969 1.969 6.117 6.293-1.336 4.816 4.324 4.781-4.324 6.293 1.336 1.969-6.117 6.117-1.969-1.336-6.293 4.324-4.781-4.324-4.781zm-1.793 14.027l-5.133 1.652-1.652 5.133-5.273-1.125-3.973 3.586-3.973-3.62-5.273 1.124-1.652-5.098-5.133-1.652 1.125-5.273L4.008 22.5l3.62-3.973-1.124-5.273 5.098-1.652 1.652-5.133 5.273 1.125L22.5 4.008l3.973 3.62 5.273-1.124 1.652 5.098 5.133 1.652-1.125 5.273 3.586 3.973-3.62 3.973 1.16 5.273z" fill="#10BCCE"/>
                                    <Path d="M23.906 15.469h-2.812v5.625h-5.625v2.812h5.625v5.625h2.812v-5.625h5.625v-2.812h-5.625v-5.625z" fill="#10BCCE"/>
                                </Svg>
                            </View>

                            <View style={styles.new_device_has_been_found_info_box}>
                                <Text style={styles.new_device_has_been_found_info1}>{this.state.language.new_device_has_been_found}</Text>
                                <Text style={styles.new_device_has_been_found_info2}>{this.state.language.make_device_settings}</Text>
                            </View>
                        </View>
                        <View style={styles.device_info_main_wrapper}>
                            <Text style={styles.device_info_main_title}>{this.state.language.device_info}</Text>
                            <Text style={styles.device_info_detail}>ID: A44E:4439:B2E6</Text>
                            <Text style={styles.device_info_detail}>Smart Outlet</Text>
                            <Text style={styles.device_info_detail}>HW v1.0.7  SW v2.32</Text>
                            <Text style={styles.device_info_detail2}>IP: 192.168.0.1</Text>
                        </View>

                        <View style={styles.device_setup_inputs_btn_wrapper}>
                            <Text style={styles.device_setup_title}>{this.state.language.setup_parameters}</Text>
                            <TextInput
                                style={styles.new_device_input_field}
                                onChangeText={(val) => this.setState({wifiAccess: val})}
                                value={this.state.wifiAccess}
                                placeholder={this.state.language.wifi_access_name}
                                placeholderTextColor='#4A4A4A'

                            />
                            <TextInput
                                style={styles.new_device_input_field}
                                onChangeText={(val) => this.setState({wifiPassword: val})}
                                value={this.state.wifiPassword}
                                placeholder={this.state.language.wifi_password}
                                placeholderTextColor='#4A4A4A'
                            />
                            <TouchableOpacity style={styles.confirm_new_device_btn}>
                                <Text style={styles.confirm_new_device_btn_text}>{this.state.language.confirm}</Text>
                            </TouchableOpacity>
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
        paddingHorizontal: 29,

    },

    all_devices_general_page_header: {
        width: '100%',
        marginBottom: 55,
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
        fontSize: 21,
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
    new_device_has_been_found_icon_title_wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        paddingHorizontal: 16,
    },
    new_device_settings_icon: {
        marginRight: 13,
    },
    new_device_has_been_found_info1: {
        color: '#004B84',
        fontWeight: '400',
        fontSize: 16,
    },
    new_device_has_been_found_info2: {
        color: '#10BCCE',
        fontWeight: '400',
        fontSize: 8,
    },
    device_info_main_wrapper: {
        marginBottom: 50,
        paddingHorizontal: 8,
    },
    device_info_main_title: {
        color: '#004B84',
        marginBottom: 7,
        fontWeight: '400',
        fontSize: 16,
    },
    device_info_detail: {
        color: '#4A4A4A',
        marginBottom: 8,
        fontWeight: '400',
        fontSize: 12,
        paddingHorizontal: 17,

    },
    device_info_detail2: {
        color: '#004B84',
        fontWeight: '400',
        fontSize: 12,
        textDecorationLine: 'underline',
        paddingHorizontal: 17,
    },
    device_setup_title: {
        marginBottom: 16,
        color: '#004B84',
        fontWeight: '400',
        fontSize: 16,
    },
    new_device_input_field: {
        width: '100%',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#10BCCE',
        paddingHorizontal: 13,
        paddingVertical: 12,
        // color: '#D3D3D3',
        color: '#4A4A4A',
        fontWeight: '400',
        fontSize: 12,
    },
    confirm_new_device_btn: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#004B84',
        height: 40,

    },
    confirm_new_device_btn_text: {
        color: '#ffffff',
        fontWeight: '400',
        fontSize: 16,
    }
});
