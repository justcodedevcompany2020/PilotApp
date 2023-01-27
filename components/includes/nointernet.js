import React, { Component } from 'react';
import Svg, {Path, Rect, Circle, Defs, Stop, ClipPath, G, Mask} from "react-native-svg";
import { StatusBar } from 'expo-status-bar';
import {AuthContext} from "../AuthContext/context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import md5 from 'md5';

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




export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            headerMenuPopup: false,
            enterNewDevice: '',
            wifiAccess: '',
            wifiPassword: '',

            userInfo: [],
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
        this.props.closeMenu();
        this.props.navigation.navigate("AddingNew");

    }

    redirectToAllDevices = () => {
        this.props.closeMenu();
        this.props.navigation.navigate("AllDevices");
    }

    redirectToDeviceSetup = () => {
        this.props.closeMenu();
        this.props.navigation.navigate("DeviceSetup");
    }

    getProfileInfo = async () => {
        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;
        try {
            fetch(`https://apiv1.zis.ru/account`, {
                method: 'GET',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }).then((response) => {
                return response.json()
            }).then((response) => {
                this.setState({
                    userInfo:  response,
                    switchValue:response.notification_enabled,
                    selectedLanguage: response.language
                })
            })
        } catch (e) {
            console.log(e)
        }

    }


    componentDidMount() {
        const { navigation } = this.props;
        // this.getProfileInfo();
        this.setLanguageFromStorage();
        this.focusListener = navigation.addListener("focus", () => {
            // this.getProfileInfo();
            this.setLanguageFromStorage();
        });

    }

    componentWillUnmount() {
        if (this.focusListener) {
            this.focusListener();
        }
    }


    redirectToSettings = () => {
        this.props.closeMenu();
        this.props.navigation.navigate("Settings");

    }
    redirectToManual = () => {
        this.props.closeMenu();
        this.props.navigation.navigate("Manual");
    }

    logOut = () => {
        this.context.signOut(() => {
            this.props.navigation.navigate('Login')
        }).then(r => console.log("logOut"));
    }



    render() {
        return (
            <View style={styles.container} >

                     <View style={{flex:1, width: '100%', justifyContent:'center', alignItems:'center', }}>

                         <Svg width={81} height={81} viewBox="0 0 81 81" fill="none" xmlns="http://www.w3.org/2000/svg">
                             <Path d="M2.808 59.598c-2.606 0-2.606-3.962 0-3.962 10.922 0 19.777 8.854 19.777 19.777 0 2.606-3.962 2.606-3.962 0 0-8.735-7.08-15.815-15.815-15.815zM53.823 6.9c-1.677-1.982 1.34-4.536 3.017-2.554l9.9 11.713 9.897-11.713c1.677-1.982 4.695.572 3.018 2.554L69.327 19.12l10.328 12.222c1.677 1.982-1.34 4.536-3.018 2.554L66.74 22.184 56.84 33.897c-1.677 1.982-4.694-.572-3.017-2.554l10.328-12.221L53.823 6.9zM2.808 26.52c-2.606 0-2.606-3.962 0-3.962 29.19 0 52.854 23.664 52.854 52.854 0 2.606-3.962 2.606-3.962 0C51.7 48.41 29.81 26.52 2.808 26.52zm0 16.538c-2.606 0-2.606-3.962 0-3.962 20.056 0 36.315 16.26 36.315 36.316 0 2.606-3.961 2.606-3.961 0 0-17.868-14.486-32.354-32.354-32.354z" fill="#10BCCE"/>
                         </Svg>


                         <Text style={{marginTop:12, marginBottom:45}}>{this.state.language.no_internet}</Text>



                         <TouchableOpacity onPress={() => {this.props.navigation.navigate('DeviceSetup')}} style={styles.button}>
                             <Text style={{color: 'white', fontSize: 16}}>{this.state.language.local_setup}</Text>
                         </TouchableOpacity>

                         <TouchableOpacity onPress={() => {this.props.navigation.navigate('Manual')}} style={styles.button}>
                             <Text style={{color: 'white', fontSize: 16}}>{this.state.language.manual}</Text>
                         </TouchableOpacity>

                     </View>

            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        width: "100%",
        height: "100%",
        // paddingTop: 48,
        // paddingBottom: 29,
        position:'absolute',
        bottom: 0,
        left: 0,
        zIndex: 55
    },

    all_devices_general_page_main_wrapper: {
        width: '100%',
        flex: 1,
        paddingHorizontal: 20,

    },

    all_devices_general_page_header: {
        width: '100%',
        marginBottom: 22,
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
        // backgroundColor:  '#ffffff',
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
        flexDirection:'row',
    },
    header_menu_popup_wrapper: {
        width: '100%',
        maxWidth: 280,
        backgroundColor: '#004B84',
        height: '100%',
        paddingHorizontal: 22,
        paddingTop: 50,
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
        textDecorationLine: 'underline'

    },

    header_menu_popup_email_btn: {
        marginBottom: 50
    },


    title_back_btn_wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    back_btn:{
        marginRight: 8,
    },
    settings_item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    settings_item_title: {
        color: '#4A4A4A',
        fontWeight: '400',
        fontSize: 16,
    },
    settings_input_field: {
        width:  163,
        borderWidth: 1,
        borderColor: '#10BCCE',
        paddingVertical: 10,
        paddingLeft: 14,
        paddingRight: 10,
        // justifyContent: 'flex-end',
        // alignItems: 'flex-end',
        // alignSelf: 'flex-end',
    },
    settings_input_field_text: {
        color: '#10BCCE',
        fontWeight: '600',
        fontSize: 16,
        textAlign: 'right'

    },
    settings_item_btn: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',

    },

    settings_item_btn_text: {
        marginRight: 8,
        color: '#10BCCE',
        fontWeight: '600',
        fontSize: 16,
    },

    edit_password_popup: {
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

    timezone_popup: {
        backgroundColor:  'rgba(255, 255, 255, 0.80)',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 999,
        zIndex: 999999,
        height: windowHeight + 40,
        width: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },

    timezone_popup_wrapper: {
        backgroundColor: '#ffffff',
        shadowColor: '#004B84',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 999,
        width: '90%',
        paddingHorizontal: 25,
        paddingTop: 80,
        paddingBottom: 60,
        borderRadius: 10,
        position: 'relative'
    },


    edit_password_popup_wrapper: {
        width: '100%',
        paddingTop: 120,
        paddingBottom: 62,
        position: 'relative',

    },
    login_header_logo: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    edit_password_info_wrapper: {
        paddingHorizontal: 25,
        width: '100%',
        // flex: 1,
    },
    edit_password_input_field: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#10BCCE',
        width: '100%',
        paddingHorizontal: 13,
        height: 45,
        color: '#D3D3D3',
        fontWeight: '400',
        fontSize: 12,
    },
    edit_password_input_field_wrapper: {
        marginBottom: 15,
    },
    edit_password_confirm_btn: {
        backgroundColor: '#004B84',
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 30,

    },
    edit_password_confirm_btn_text: {
        fontSize: 16,
        fontWeight: '400',
        color: '#ffffff',
    },

    error_text: {
        fontSize: 15,
        fontWeight: '500',
        color: 'red',
        marginBottom: 10,
    },
    edit_password_popup_close_btn: {
        position: 'absolute',
        right: 20,
        top: 60,
    },
    timezone_popup_close_btn: {
        position: 'absolute',
        right: 15,
        top: 20,
    },
    languages_dropDown_wrapper: {
        marginBottom: 17,
        width: '100%',
    },

    timezone_popup_confirm_btn: {
        width:  200,
        borderWidth: 1,
        borderColor: '#10BCCE',
        paddingVertical: 10,
        // paddingLeft: 14,
        // paddingRight: 10,
        marginTop: 40,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',

    },

    timezone_popup_confirm_btn_text: {
        color: '#10BCCE',
        fontWeight: '600',
        fontSize: 16,
        textAlign: 'center'
    },

    button: {
        width: '100%',
        maxWidth: 245,
        height: 40,
        backgroundColor:'#004B84',
        justifyContent:'center',
        alignItems:'center',
        marginBottom:12
    }

});
