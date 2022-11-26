import React, { Component } from 'react';
import Svg, {Path, Rect, Circle, Defs, Stop, ClipPath, G, Mask} from "react-native-svg";
import { StatusBar } from 'expo-status-bar';
import DropDownPicker from "react-native-custom-dropdown";
import {AuthContext} from "../AuthContext/context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import md5 from 'md5';

import i18n from "i18n-js";
import {en, ru} from "../../i18n/supportedLanguages";
import  TopMenu from '../includes/header_menu';

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
            all_devices: [
                {
                    id: 5,
                    name: 'Add new',
                    show_share_button: true
                },
            ],
            headerMenuPopup: false,
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


    redirectToDetailsGeneralPage = (id) => {
        this.props.navigation.navigate("DetailsGeneralPage", {
            params: id,
        });
    }


    componentDidMount() {
        const { navigation } = this.props;
        this.setLanguageFromStorage();
        this.getAllDevices();
        this.focusListener = navigation.addListener("focus", () => {
            this.setLanguageFromStorage();
            this.getAllDevices();
        });

    }

    componentWillUnmount() {
        // Remove the event listener
        if (this.focusListener) {
            this.focusListener();
            // console.log('Bum END')
        }

    }

    getAllDevices = async () => {
       // await AsyncStorage.clear();

        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;

        try {
            fetch(`https://apiv1.zis.ru/devices/my_devices`, {
                method: 'GET',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },


            }).then((response) => {
                return response.json()
            }).then((response) => {

                response.push({
                    "device_type": "add_new_devices",
                    "id": '',
                    "ident": "",
                    "name": "",
                    "owner": false,
                    "status": true,
                })
                console.log(response, 'ALL DEVICES')
                // new_resp[new_resp.length].show_share_button = true
                this.setState({
                    all_devices: response
                })

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

    render() {

        // if (this.state.headerMenuPopup) {
        //     return (
        //         <TopMenu navigation={this.props.navigation} closeMenu={this.closeMenu} />
        //     )
        // }

        return (
            <SafeAreaView style={styles.container}>

                {this.state.headerMenuPopup &&
                    <TopMenu navigation={this.props.navigation} closeMenu={this.closeMenu} />
                }

                <View style={[styles.container, { paddingTop: 25, paddingBottom: 29}]} >

                    <StatusBar style="dark" />

                    <View style={styles.all_devices_general_page_header}>
                        <View style={styles.all_devices_general_page_header_child}>
                            <Text style={styles.all_devices_general_page_header_title}>{this.state.language.my_devices}</Text>
                            <TouchableOpacity style={styles.all_devices_general_page_header_menu_btn} onPress={() => {this.setState({headerMenuPopup: true})}}>
                                <Svg width={28} height={25} viewBox="0 0 28 25" fill="none" xmlns="http://www.w3.org/2000/svg"><Path fill="#004B84" d="M0 0H28V3H0z" /><Path fill="#004B84" d="M0 11H28V14H0z" /><Path fill="#004B84" d="M0 22H28V25H0z" /></Svg>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView style={styles.all_devices_general_page_main_wrapper}>
                        <View style={styles.all_devices_general_page_items_main_wrapper}>
                            {this.state.all_devices.map((item, index) => {

                                if (item.device_type == 'add_new_devices') {
                                    return (
                                        <TouchableOpacity key={index}  style={[styles.all_devices_general_page_button, {paddingTop:15}]} onPress={() => {this.redirectToAddingNew()}}>

                                            <View style={styles.all_devices_general_page_button}>
                                                <Svg width={55} height={55} viewBox="0 0 54 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <Path fill="#fff" stroke="#10BCCE" strokeDasharray="10 10" d="M0.5 0.5H53.5V56.5H0.5z"/>
                                                    <Path stroke="#10BCCE" d="M27.5 17L27.5 39" />
                                                    <Path stroke="#10BCCE" d="M38 28.5L16 28.5" />
                                                </Svg>
                                            </View>

                                            <View style={[styles.all_devices_general_page_button_info_box, {position:'relative', top:-25}]}>
                                                <Text style={styles.all_devices_general_page_button_name}>Add new</Text>
                                            </View>

                                        </TouchableOpacity>
                                    )
                                }

                                return (
                                    <TouchableOpacity key={index} style={styles.all_devices_general_page_button} onPress={() => {this.redirectToDetailsGeneralPage(item.id)}}>
                                        <View  style={styles.all_devices_general_page_button_icons_img_box}>

                                            <View style={styles.all_devices_general_page_button_icon_circle_box}>
                                                {!item.status &&
                                                    <View style={[styles.all_devices_general_page_button_icon_circle,  {backgroundColor: '#EB5757'} ]}></View>
                                                }

                                                {item.status &&
                                                    <View style={[styles.all_devices_general_page_button_icon_circle,  {backgroundColor: '#27AE60'} ]}></View>
                                                }
                                            </View>

                                            <View  style={styles.all_devices_general_page_button_main_img}>
                                                <Image style={styles.all_devices_general_page_img} source={require('../../assets/images/device_img.png')}/>
                                            </View>

                                            {item.show_share_button &&
                                                <View style={styles.all_devices_general_page_share_button}>
                                                    <Svg width={14} height={14} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <Path d="M3.456 8.772a1.718 1.718 0 01-1.728-1.728c0-.963.766-1.728 1.728-1.728.963 0 1.728.765 1.728 1.728 0 .94-.765 1.728-1.728 1.728zm0-2.822c-.59 0-1.072.481-1.072 1.072 0 .59.482 1.072 1.072 1.072.59 0 1.072-.482 1.072-1.072 0-.569-.481-1.072-1.072-1.072zM10.478 5.25A1.718 1.718 0 018.75 3.522c0-.963.766-1.728 1.728-1.728.963 0 1.728.765 1.728 1.728 0 .962-.787 1.728-1.728 1.728zm0-2.8c-.59 0-1.072.481-1.072 1.072 0 .59.481 1.072 1.072 1.072.59 0 1.072-.482 1.072-1.072 0-.59-.481-1.072-1.072-1.072zM10.478 12.272a1.718 1.718 0 01-1.728-1.728c0-.963.766-1.728 1.728-1.728.963 0 1.728.765 1.728 1.728 0 .962-.787 1.728-1.728 1.728zm0-2.8c-.59 0-1.072.481-1.072 1.072 0 .59.481 1.072 1.072 1.072.59 0 1.072-.482 1.072-1.072 0-.59-.481-1.072-1.072-1.072z" fill="#10BCCE"/>
                                                        <Path d="M9.056 10.238L4.55 7.984l.306-.634 4.528 2.253-.328.635zM4.856 6.716l-.306-.613L9.056 3.85l.328.612-4.528 2.254z" fill="#10BCCE"/>
                                                    </Svg>
                                                </View>
                                            }

                                        </View>
                                        <View style={styles.all_devices_general_page_button_info_box}>
                                            <Text style={styles.all_devices_general_page_button_name}>{item.name}</Text>
                                            <Text style={styles.all_devices_general_page_button_device_name}>Smart Outlet</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}





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
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#ffffff',
        width: "100%",
        height: "100%",

    },

    all_devices_general_page_main_wrapper: {
        width: '100%',
        flex: 1,
        paddingHorizontal: 5,
    },

    all_devices_general_page_header: {
        width: '100%',
        marginBottom: 49,
        paddingBottom: 25,
        borderBottomWidth: 1,
        borderBottomColor: '#004B84',
    },

    all_devices_general_page_header_child: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 21,
        paddingLeft: 38,
    },
    all_devices_general_page_header_title: {
        fontWeight: '400',
        fontSize: 24,
        color: '#004B84',
    },

    all_devices_general_page_button_main_img: {
        width: 55,
        height: 55,
        resizeMode: 'cover',
        marginBottom: 15,
    },

    all_devices_general_page_img: {
        width: '100%',
        height: '100%',
    },
    all_devices_general_page_button_name: {
        fontSize: 12,
        color: '#004B84',
        marginBottom: 5,
        textAlign: 'center',
    },
    all_devices_general_page_button_device_name: {
        fontSize: 8,
        fontWeight: '400',
        color: '#10BCCE',
        textAlign: 'center',
    },
    all_devices_general_page_button: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
        // marginRight: 10,
        position: 'relative',
        width: '33%'
    },
    all_devices_general_page_button_icon_circle: {
        width: 9,
        height: 9,
        borderRadius: 100,
        position: 'absolute',
        right: -7,
    },
    all_devices_general_page_share_button: {
        position: 'absolute',
        right: -7,
        bottom: 12,
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
    all_devices_general_page_add_new_button_icon: {
        marginBottom: 13,
        height: 55,
    },

    all_devices_general_page_items_main_wrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        width: '100%',

    }
});
