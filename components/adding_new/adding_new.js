import React, { Component } from 'react';
import Svg, {Path, Rect, Circle, Defs, Stop, ClipPath, G, Mask} from "react-native-svg";
import { StatusBar } from 'expo-status-bar';
import DropDownPicker from "react-native-custom-dropdown";
import  TopMenu from '../includes/header_menu';
import * as Network from 'expo-network';
import i18n from "i18n-js";
import {en, ru} from "../../i18n/supportedLanguages";
import {AuthContext} from "../AuthContext/context";


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
import AsyncStorage from "@react-native-async-storage/async-storage";



export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            headerMenuPopup: false,
            enterNewDevice: '',
            inetAvalaibel: true,
            add_device_info: [],
            addDeviceSuccess: false,
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


    redirectToDeviceSetup = async () => {
        await clearInterval(this.interval);
        this.props.navigation.navigate("DeviceSetup");
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

    componentDidMount() {
        const { navigation } = this.props;
        this.setLanguageFromStorage();
        this.checkInternet();
        this.searchDevices();


        this.focusListener = navigation.addListener("focus", () => {
            this.setLanguageFromStorage();
            this.checkInternet();
            this.searchDevices();
        });

    }



    componentWillUnmount() {
        // Remove the event listener
        if (this.focusListener) {
            this.focusListener();
            console.log('Bum END FOCUS')
            clearInterval(this.interval);

        }
        console.log('Bum END')
        clearInterval(this.interval);

    }

    checkInternet = async () => {

        let inet = await Network.getNetworkStateAsync()
       await this.setState({
            inetAvalaibel: inet.isConnected
        })
    }

    searchDevices = async () => {
        // await AsyncStorage.clear();

        clearInterval(this.interval);

        this.interval = setInterval(async () => {
            let inet = await Network.getNetworkStateAsync()
            if (inet.isConnected) {

                let userToken = await AsyncStorage.getItem('userToken');
                let AuthStr = 'Bearer ' + userToken;

                try {
                    fetch(`https://apiv1.zis.ru/devices/nearby`, {
                        method: 'GET',
                        headers: {
                            'Authorization': AuthStr,
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },


                    }).then((response) => {
                        return response.json()
                    }).then((response) => {

                        console.log(response, 'search device interval' )

                        this.setState({
                            add_device_info: response,
                        })


                    })
                } catch (e) {
                    console.log(e)
                }

            } else {
                alert("No Internet");
            }

        }, 3000)



    }

    refreshDevices = async () => {
        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;

        try {
            fetch(`https://apiv1.zis.ru/devices/nearby`, {
                method: 'GET',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },


            }).then((response) => {
                return response.json()
            }).then((response) => {

                console.log(response, 'search device')

                this.setState({
                    add_device_info: response,
                })


            })
        } catch (e) {
            console.log(e)
        }

    }

    addDevice = async (id) => {
        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;

        try {
            fetch(`https://apiv1.zis.ru/devices/link/` + id, {
                method: 'POST',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },


            }).then((response) => {
                return response.json()
            }).then((response) => {

                console.log(response, 'search device');

                  if  (response.hasOwnProperty('result')) {
                        if (response.result == 'success') {
                            this.setState({
                                addDeviceSuccess: true
                            })
                             this.refreshDevices();
                        }
                  }


            })
        } catch (e) {
            console.log(e)
        }
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
                            <Text style={styles.all_devices_general_page_header_title}>{this.state.language.adding_new}</Text>
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

                        <View style={styles.adding_new_page_icon_img_input_box}>
                            <View style={styles.adding_new_page_icon_title_box}>
                                <View style={styles.adding_new_page_icon}>
                                    <Svg width={283} height={194} viewBox="0 0 283 194" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <Path d="M133.908 127.161c-18.892 0-34.43-15.361-34.43-34.43 0-18.892 15.361-34.43 34.43-34.43 19.068 0 34.429 15.361 34.429 34.43-.176 19.069-15.537 34.43-34.429 34.43zm0-63.74c-16.244 0-29.486 13.243-29.486 29.487s13.242 29.486 29.486 29.486c16.243 0 29.486-13.242 29.486-29.486-.177-16.244-13.419-29.486-29.486-29.486z" fill="#10BCCE"/>
                                        <Path d="M179.814 142.522l-24.012-23.836 3.884-3.884 23.836 24.012-3.708 3.708z" fill="#10BCCE"/>
                                        <Path fillRule="evenodd" clipRule="evenodd" d="M99.728 23.898C75.638 32.96 58 62.232 58 96.944c0 34.713 17.639 63.985 41.728 73.047v-4.709c-22.077-8.946-38.133-36.157-38.133-68.338 0-32.18 16.056-59.392 38.133-68.337v-4.709zM48.07 0C19.91 14.76 0 51.057 0 93.493c0 42.436 19.91 78.733 48.07 93.493v-6.492c-25.468-14.454-43.31-47.967-43.31-87 0-39.035 17.842-72.548 43.31-87.002V0zM183 170.088c24.089-9.061 41.728-38.334 41.728-73.046S207.089 33.057 183 23.995v4.709c22.077 8.946 38.133 36.157 38.133 68.338 0 32.18-16.056 59.392-38.133 68.338v4.708zM234.658 193.986c28.16-14.76 48.07-51.057 48.07-93.493 0-42.436-19.91-78.732-48.07-93.493v6.492c25.468 14.454 43.31 47.967 43.31 87.001 0 39.034-17.842 72.547-43.31 87.001v6.492z" fill="#10BCCE"/>
                                    </Svg>
                                </View>
                                <Text style={styles.adding_new_page_icon_title}>{this.state.language.searching}...</Text>
                            </View>

                            {this.state.add_device_info.map((item, index) => {
                                return (
                                    <View style={styles.adding_new_device_img_info_btn_main_wrapper} key={index}>
                                        <View style={styles.adding_new_device_img_info_box}>
                                            <View style={styles.adding_new_device_img}>
                                                <Image  style={styles.adding_new_device_img_child} source={require('../../assets/images/adding_new_img.png')}/>
                                            </View>

                                            <View style={styles.adding_new_device_info_box}>
                                                <Text style={styles.adding_new_device_code_info}>{item.ident}</Text>
                                                <Text style={styles.adding_new_device_name}>{item.device_type} {item.hw_version} {item.sw_version}</Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity style={styles.adding_new_device_btn} onPress={() => this.addDevice(item.id)}>
                                            <Text style={styles.adding_new_device_btn_text}>{this.state.language.add}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            })}

                            <View style={styles.enter_new_device_number_input_search_btn_wrapper}>
                                <TextInput
                                    style={styles.enter_new_device_number_input_field}
                                    onChangeText={(val) => this.setState({enterNewDevice: val})}
                                    value={this.state.enterNewDevice}
                                    placeholder="Enter device number"
                                    placeholderTextColor='#D3D3D3'
                                />
                                <TouchableOpacity style={styles.enter_new_device_number_search_btn}>
                                    <Svg width={25} height={25} viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <Path d="M10.82 18.398c-4.18 0-7.617-3.398-7.617-7.617 0-4.18 3.399-7.617 7.617-7.617a7.602 7.602 0 017.617 7.617C18.398 15 15 18.398 10.82 18.398zm0-14.101c-3.593 0-6.523 2.93-6.523 6.523 0 3.594 2.93 6.524 6.523 6.524 3.594 0 6.524-2.93 6.524-6.524-.04-3.593-2.969-6.523-6.524-6.523z" fill="#fff"/>
                                        <Path d="M20.977 21.797l-5.313-5.274.86-.859 5.273 5.313-.82.82z" fill="#fff"/>
                                    </Svg>
                                </TouchableOpacity>
                            </View>

                        </View>

                        <View style={styles.adding_new_manual_device_setup_page_buttons_box}>
                            <TouchableOpacity style={styles.adding_new_manual_btn}>
                                <Text style={styles.adding_new_manual_btn_text}>{this.state.language.manual}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.adding_new_device_setup_page_btn} onPress={() => {this.redirectToDeviceSetup()}}>
                                <Text style={styles.adding_new_device_setup_page_btn_text}>{this.state.language.device_setup_page}</Text>
                            </TouchableOpacity>
                        </View>




                    </ScrollView>

                    {this.state.addDeviceSuccess &&
                        <View style={styles.add_device_success_popup}>
                            <View style={styles.add_device_success_popup_wrapper}>
                                <TouchableOpacity style={styles.title_back_btn_wrapper} onPress={() => {this.setState({addDeviceSuccess: false})}}>
                                    <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <Path d="M9.633 0l1.406 1.406-8.297 8.227 8.297 8.226-1.406 1.407L0 9.633 9.633 0z" fill="#004B84"/>
                                    </Svg>
                                </TouchableOpacity>
                                <Text style={styles.add_device_success_info}></Text>
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
        paddingLeft: 38,
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

    adding_new_page_icon_title_box: {
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        marginBottom: 42,
    },
    adding_new_page_icon: {
        marginBottom: 12,
    },
    adding_new_page_icon_title: {
         fontWeight: '400',
         fontSize: 16,
        color: '#10BCCE',
    },
    adding_new_device_img_info_btn_main_wrapper: {
        marginBottom: 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 11,
    },
    adding_new_device_img_info_box: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    adding_new_device_img: {
       marginRight: 16,
        width: 40,
        height: 40,
        resizeMode: 'cover',
        borderRadius: 100,
    },
    adding_new_device_img_child: {
        width: '100%',
        height: '100%',
    },
    adding_new_device_code_info: {
      color: '#004B84',
      fontWeight: '400',
      fontSize: 12,
    },
    adding_new_device_name: {
        color: '#10BCCE',
        fontWeight: '300',
        fontSize: 8,
    },
    adding_new_device_btn: {
        width: 60,
        height: 40,
        backgroundColor: '#004B84',
        justifyContent: 'center',
        alignItems: 'center',
    },
    adding_new_device_btn_text: {
        color: '#ffffff',
        fontWeight: '400',
        fontSize: 16,
    },
    enter_new_device_number_input_search_btn_wrapper: {
        marginBottom: 43,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 11,
    },
    enter_new_device_number_input_field: {
        width: '100%',
        flex: 1,
        marginRight: 6,
        borderWidth: 1,
        borderColor: '#10BCCE',
        paddingHorizontal: 13,
        paddingVertical: 12,
        color: '#D3D3D3',
        fontWeight: '400',
        fontSize: 12,
    },
    enter_new_device_number_search_btn: {
        width: 40,
        height: 40,
        backgroundColor: '#004B84',
        justifyContent: 'center',
        alignItems: 'center',
    },
    adding_new_manual_btn: {
        width: '100%',
        height: 40,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#004B84',
    },
    adding_new_manual_btn_text: {
        color: '#ffffff',
        fontWeight: '400',
        fontSize: 16,
    },
    adding_new_device_setup_page_btn: {
        width: '100%',
        height: 40,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#004B84',
    },
    adding_new_device_setup_page_btn_text: {
        color: '#ffffff',
        fontWeight: '400',
        fontSize: 16,
    },
    add_device_success_popup: {
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
        alignItems: 'center',
        justifyContent: 'center',
        // paddingTop: 100,
    },
    add_device_success_popup_wrapper: {
        width: '90%',
        backgroundColor: '#ffffff',
        alignSelf: 'center',
        // alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingTop: 25,
        paddingBottom: 18,
        position: 'relative',
        height: 200
    },
    add_device_success_info: {
        textAlign: 'center',
        fontWeight: '400',
        fontSize: 24,
        color: '#004B84',
    },
    title_back_btn_wrapper: {
        position: 'absolute',
        width: '100%',
        top: 25,
        left: 25,

    }
});
