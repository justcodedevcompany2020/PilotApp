import React, { Component } from 'react';
import Svg, {Path, Rect, Circle, Defs, Stop, ClipPath, G, Mask} from "react-native-svg";
import { StatusBar } from 'expo-status-bar';
// import DropDownPicker from "react-native-custom-dropdown";
import {AuthContext} from "../AuthContext/context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import md5 from 'md5';

import i18n from "i18n-js";
import {en, ru} from "../../i18n/supportedLanguages";
import  TopMenu from '../includes/header_menu';
import DropDownPicker from 'react-native-dropdown-picker';

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
            switchValue: false,
            settingsLogin: '',
            settingsPassword: '',
            edit_password_popup: false,


            selectedLanguage:  'en',

            old_password: '',
            new_password: '',
            confirm_password: '',

            edit_password_error: false,
            edit_password_error_text: '',

            userInfo: [],

            timezones: [],

            selectedTimeZone: null,

            timeZonesPopup: false,

            language: en,
            language_name: 'en',

            languages: [
                {label: 'English', value: 'en', selected: true, icon: () => <Image style={{width: 26, height: 16}} source={require('../../assets/images/flag_uk.png')}/>},
                {label: 'Русский', value: 'ru', selected: true, icon: () => <Image style={{width: 26, height: 16}} source={require('../../assets/images/flag_russia.png')}/>},
            ],

            openLanguages: false,
            openTimezones: false,
        };

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


    redirectToAllDevices = () => {
        this.props.navigation.navigate("AllDevices");

    }

    redirectToDeviceSetup = () => {
        this.props.navigation.navigate("DeviceSetup");

    }

    toggleSwitch = async (value) => {
        this.setState({ switchValue: value });
        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;

        try {
            fetch(`https://apiv1.zis.ru/account`, {
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

                console.log(response, 'switchValue')

            })
        } catch (e) {
            console.log(e)
        }
    };



    deleteAccount = async () => {
        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;


        console.log(AuthStr, 'AuthStr')

            try {
                fetch(`https://apiv1.zis.ru/account`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': AuthStr,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },

                }).then((response) => {
                    return response.json()
                }).then((response) => {

                    console.log(response, 'delete')

                    if (response.hasOwnProperty('result')) {
                        if (response.result == 'success') {
                            this.context.signOut(() => {
                                this.props.navigation.navigate('Login')

                            }).then(r => console.log("logOut"));                  }
                    }




                })
            } catch (e) {
                console.log(e)
            }

    }


    editPassword = async () => {
        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;

        let {old_password, new_password, confirm_password, userInfo} = this.state;

         if (old_password == '' || new_password == '' || confirm_password == '' || new_password != confirm_password  || new_password.length < 6) {
              if (old_password == '' || new_password == '' || confirm_password == '') {
                  this.setState({
                      edit_password_error: true,
                      edit_password_error_text: this.state.language.missing_fields_error,
                  })
              } else if (old_password.length < 6 || new_password.length < 6 || confirm_password.length < 6) {
                  this.setState({
                      edit_password_error: true,
                      edit_password_error_text: this.state.language.password_must_be,
                  })
              } else if (new_password != confirm_password) {
                  this.setState({
                      edit_password_error: true,
                      edit_password_error_text: this.state.language.password_mismatch,
                  })
              }





             return false;
         }


         else {
             this.setState({
                 edit_password_error: false,
                 edit_password_error_text: '',
             })
             console.log(AuthStr, 'AuthStr')


             console.log(userInfo.login, 'aaaa')

             let hash_password_old = userInfo.login.toLowerCase() + old_password;
             let hash_password_old_result =  md5(hash_password_old);

             let hash_password_new = userInfo.login.toLowerCase() + new_password;
             let hash_password_new_result =  md5(hash_password_new);

             try {
                 fetch(`https://apiv1.zis.ru/account`, {
                     method: 'PATCH',
                     headers: {
                         'Authorization': AuthStr,
                         'Accept': 'application/json',
                         'Content-Type': 'application/json',
                     },
                     body: JSON.stringify({
                         password: hash_password_old_result,
                         password_new: hash_password_new_result,

                     })

                 }).then((response) => {
                     return response.json()
                 }).then((response) => {

                     console.log(response, 'edit_pssword')



                     if (response.hasOwnProperty('result')) {
                         if (response.result == 'success') {
                             this.setState({
                                 old_password: '',
                                 new_password: '',
                                 confirm_password: '',
                                 edit_password_error: false,
                                 edit_password_error_text: '',
                                 edit_password_popup: false
                             })
                         }
                     } else {
                         if (response.hasOwnProperty('description')) {
                             if (response.description.en == 'Password is invalid') {
                                 this.setState({
                                     edit_password_error: true,
                                     edit_password_error_text: this.state.language.invalid_password,
                                 })
                             }
                         }

                     }
                 })
             } catch (e) {
                 console.log(e)
             }
         }



    }


    getProfileInfo = async () => {
        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;

        // console.log(user)


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

                console.log(response, 'user_info')


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

    chooseLanguage = async (callback) => {

        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;

        await this.setState(state => ({
            selectedLanguage: callback(state.value),
            error_language: false,
            valid_language: true,
        }));


        let  {selectedLanguage} = this.state;
        console.log(selectedLanguage, 'selectedLanguage');



        await AsyncStorage.setItem('language', JSON.stringify({language: selectedLanguage}))

        try {
            fetch(`https://apiv1.zis.ru/account`, {
                method: 'PATCH',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    language:  selectedLanguage,

                })

            }).then((response) => {
                return response.json()
            }).then((response) => {

                this.setLanguageFromStorage();

                console.log(response, 'switchValue')

            })
        } catch (e) {
            console.log(e)
        }



    }


    chooseTimezone = async (callback) => {
        await this.setState(state => ({
            selectedTimeZone: callback(state.value),

        }));

        let  {selectedTimeZone} = this.state;



        console.log(selectedTimeZone, 'selectedTimeZone');
    }


    changeTimeZones = async () => {
        let selectedTimeZone = this.state.selectedTimeZone;

        let userToken = await AsyncStorage.getItem('userToken');
        let AuthStr = 'Bearer ' + userToken;

        try {
            fetch(`https://apiv1.zis.ru/account`, {
                method: 'PATCH',
                headers: {
                    'Authorization': AuthStr,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    timezone: selectedTimeZone,

                })

            }).then((response) => {
                return response.json()
            }).then((response) => {

                console.log(response, 'selectedTimeZone')

                if (response.hasOwnProperty('result')) {
                    if (response.result == 'success') {
                        this.setState({
                            timeZonesPopup: false
                        })

                        this.getProfileInfo();
                    }
                }

            })
        } catch (e) {
            console.log(e)
        }

    }

    setTimeZone = () => {
        let timezones = require('../timezones/timezones.json');
        console.log(timezones, "timezone");

        this.setState({
            timezones: timezones,
        })
    }


    componentDidMount() {
        const { navigation } = this.props;
        this.setLanguageFromStorage();
        this.setTimeZone();
        this.getProfileInfo();

        this.focusListener = navigation.addListener("focus", () => {
            this.setLanguageFromStorage();
            this.setTimeZone();
            this.getProfileInfo();
        });

    }

    componentWillUnmount() {
        // Remove the event listener
        if (this.focusListener) {
            this.focusListener();
            // console.log('Bum END')
        }

    }


    openEditPasswordPopup = () => {
        this.setState({
            edit_password_popup: true,
        })
    }

    openTimeZonesPopup = () => {
        this.setState({
            timeZonesPopup: true,
        })
    }

    logOut = () => {
        this.context.signOut(() => {
            this.props.navigation.navigate('Login')

        }).then(r => console.log("logOut"));
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
                <StatusBar style="dark" />
                <View style={[styles.container, { paddingTop: 25, paddingBottom: 29}]} >
                    <View style={styles.all_devices_general_page_header}>
                        <View style={styles.all_devices_general_page_header_child}>
                            <TouchableOpacity style={styles.title_back_btn_wrapper} onPress={() => {this.redirectToAllDevices()}}>
                                <View style={styles.back_btn}>
                                    <Svg width={12} height={20} viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <Path d="M9.633 0l1.406 1.406-8.297 8.227 8.297 8.226-1.406 1.407L0 9.633 9.633 0z" fill="#004B84"/>
                                    </Svg>
                                </View>
                                <Text style={styles.all_devices_general_page_header_title}>{this.state.language.settings}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.all_devices_general_page_header_menu_btn} onPress={() => {this.setState({headerMenuPopup: true})}}>
                                <Svg width={28} height={25} viewBox="0 0 28 25" fill="none" xmlns="http://www.w3.org/2000/svg"><Path fill="#004B84" d="M0 0H28V3H0z" /><Path fill="#004B84" d="M0 11H28V14H0z" /><Path fill="#004B84" d="M0 22H28V25H0z" /></Svg>
                            </TouchableOpacity>
                        </View>


                    </View>
                    <ScrollView  nestedScrollEnabled={true} style={styles.all_devices_general_page_main_wrapper}>



                        <View style={styles.setting_items_wrapper}>


                            <View style={[styles.settings_item, {marginBottom: 10}]}>
                                <Text style={styles.settings_item_title}>{this.state.language.push_notifications}</Text>
                                <Switch

                                    trackColor={{ false: '#767577', true: '#004B84' }}
                                    // thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                                    onValueChange={this.toggleSwitch}
                                    value={this.state.switchValue}
                                />
                            </View>
                            <View style={[styles.settings_item, {marginBottom: 5}]}>
                                <Text style={styles.settings_item_title}>{this.state.language.login_register}</Text>
                                <TextInput
                                    style={styles.settings_input_field}
                                    // onChangeText={(val) => this.setState({settingsLogin: val})}
                                    value={this.state.userInfo.login}
                                    placeholder={this.state.userInfo.login}
                                    // placeholderTextColor='#10BCCE'
                                    placeholderTextColor='#4A4A4A'
                                    editable={false}
                                />
                            </View>
                            <View style={[styles.settings_item, {marginBottom: 21}]}>
                                <Text style={styles.settings_item_title}>{this.state.language.password}</Text>

                                <TouchableOpacity  style={styles.settings_input_field} onPress={() => {this.openEditPasswordPopup()}}>
                                    <Text  style={styles.settings_input_field_text}>*********</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.settings_item, {marginBottom: 25}]}>
                                <Text style={styles.settings_item_title}>{this.state.language.time_zone}</Text>
                                <TouchableOpacity style={styles.settings_item_btn} onPress={() => {this.openTimeZonesPopup()}}>
                                    <Text style={styles.settings_item_btn_text}>{this.state.userInfo.timezone}</Text>
                                    <View style={styles.settings_item_btn_icon}>
                                        <Svg
                                            width={12}
                                            height={20}
                                            viewBox="0 0 12 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <Path
                                                d="M1.406 19.266L0 17.859l8.297-8.226L0 1.406 1.406 0l9.633 9.633-9.633 9.633z"
                                                fill="#004B84"
                                            />
                                        </Svg>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.settings_item, {marginBottom: 25}]}>
                                <Text style={styles.settings_item_title}>{this.state.language.legal_information}</Text>
                                <TouchableOpacity style={styles.settings_item_btn}>
                                    <Text style={styles.settings_item_btn_text}>Read</Text>
                                    <View style={styles.settings_item_btn_icon}>
                                        <Svg
                                            width={12}
                                            height={20}
                                            viewBox="0 0 12 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <Path
                                                d="M1.406 19.266L0 17.859l8.297-8.226L0 1.406 1.406 0l9.633 9.633-9.633 9.633z"
                                                fill="#004B84"
                                            />
                                        </Svg>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.languages_dropDown_wrapper, {zIndex: 9999999999999999999, borderRadius: 0,}]}>

                                {/*{this.state.selectedLanguage == 'en'  &&*/}

                                {/*<View style={{width: 26, height: 16, position: 'absolute', zIndex: 9999999, top: 15, left: 15}}><Image style={{width: '100%', height: '100%'}} source={require('../../assets/images/flag_uk.png')}/></View>*/}

                                {/*}*/}

                                {/*{this.state.selectedLanguage == 'ru'  &&*/}

                                {/*<View style={{width: 26, height: 16, position: 'absolute', zIndex: 9999999, top: 15, left: 15}}><Image style={{width: '100%', height: '100%'}} source={require('../../assets/images/flag_russia.png')}/></View>*/}

                                {/*}*/}

                                {/*<DropDownPicker*/}
                                {/*    items={*/}
                                {/*        [*/}
                                {/*            {label: 'English', value: 'en'},*/}
                                {/*            {label: 'Русский', value: 'ru'},*/}
                                {/*            // {label: 'Latviski', value: 'lv', icon: () => {} },*/}
                                {/*        ]*/}

                                {/*    }*/}
                                {/*    placeholder='Language'*/}
                                {/*    containerStyle={{  width: '100%', height: 45,  zIndex: 999999, borderRadius: 0, }}*/}
                                {/*    style={[styles.phone_code_dropdown,*/}
                                {/*        {backgroundColor: '#004B84', height: 45, borderRadius: 0}*/}
                                {/*    ]}*/}
                                {/*    itemStyle={{*/}
                                {/*        justifyContent: 'flex-start',*/}
                                {/*        width: 150,*/}
                                {/*        zIndex: 15*/}
                                {/*    }}*/}
                                {/*    selectedLabelStyle={{*/}
                                {/*        fontSize: 16,*/}
                                {/*        color: "#ffffff",*/}
                                {/*        fontWeight: '400',*/}
                                {/*        paddingLeft: 32*/}
                                {/*    }}*/}
                                {/*    labelStyle={{*/}
                                {/*        fontSize: 16,*/}
                                {/*        color: "#ffffff",*/}
                                {/*        fontWeight: '400',*/}

                                {/*    }}*/}
                                {/*    placeholderStyle={{*/}
                                {/*        fontSize: 14,*/}
                                {/*        color: "#ffffff",*/}
                                {/*        fontWeight: '400',*/}
                                {/*    }}*/}


                                {/*    dropDownStyle={{backgroundColor: '#004B84',  width: '100%', zIndex: 999999, borderRadius: 0,}}*/}
                                {/*    value={this.state.selectedLanguage}*/}
                                {/*    defaultValue={this.state.selectedLanguage}*/}


                                {/*    // selectedLabel='English'*/}
                                {/*    arrowColor={'white'}*/}
                                {/*    // onChangeItem={this.onChangeDropDownItem}*/}
                                {/*    onChangeItem={item => {*/}
                                {/*        this.chooseLanguage(item);*/}
                                {/*    }}*/}


                                {/*/>*/}

                                <DropDownPicker
                                    listMode="SCROLLVIEW"
                                    open={this.state.openLanguages}
                                    value={this.state.selectedLanguage}
                                    setOpen={() => {
                                        this.setState({
                                            openLanguages: !this.state.openLanguages
                                        })
                                    }}
                                    items={this.state.languages}
                                    setValue={this.chooseLanguage}
                                    // setItems={setRegionsDropdownItems}/}
                                    style={{
                                        width: '100%',
                                        height: 45,
                                        backgroundColor: '#004B84',
                                        borderRadius: 0,
                                        borderColor: 'white'
                                    }}
                                    containerStyle={{
                                        width: '100%',
                                        height: 70,
                                        borderRadius: 0,
                                    }}
                                    // listItemContainerStyle={{
                                    //
                                    //     borderRadius: 0
                                    // }}
                                    listItemLabelStyle={{
                                      color: '#ffffff',
                                      fontSize: 16,
                                      fontWeight: '400'
                                    }}
                                    labelStyle={{
                                        color: '#ffffff',
                                        fontSize: 16,
                                        fontWeight: '400'
                                    }}

                                    arrowIconStyle={{
                                        width: 20,
                                        height: 20,


                                    }}

                                    dropDownContainerStyle={{
                                        borderRadius: 0,
                                        backgroundColor: '#004B84',
                                        borderColor: 'white'
                                    }}


                                    // keyExtractor={(item, index) => index+1}/}

                                />


                            </View>


                            <View style={[styles.settings_item, {marginBottom: 25}]}>
                                <Text style={styles.settings_item_title}>{this.state.language.delete_account}</Text>
                                <TouchableOpacity style={styles.settings_item_btn} onPress={() => {this.deleteAccount()}}>
                                    <Text style={styles.settings_item_btn_text}>{this.state.language.delete}</Text>
                                    <View style={styles.settings_item_btn_icon}>
                                        <Svg
                                            width={12}
                                            height={20}
                                            viewBox="0 0 12 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <Path
                                                d="M1.406 19.266L0 17.859l8.297-8.226L0 1.406 1.406 0l9.633 9.633-9.633 9.633z"
                                                fill="#004B84"
                                            />
                                        </Svg>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>


                    </ScrollView>


                    {this.state.edit_password_popup &&
                    <View style={styles.edit_password_popup}>

                        <View style={styles.edit_password_popup_wrapper}>
                            <TouchableOpacity style={styles.edit_password_popup_close_btn} onPress={() => {this.setState({edit_password_popup:false})}}>
                                <Svg
                                    width={35}
                                    height={35}
                                    viewBox="0 0 35 35"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <Path
                                        d="M17.499 17.78L9.141 9.36m-.063 16.779l8.421-8.358-8.421 8.358zm8.421-8.358l8.421-8.359L17.5 17.78zm0 0l8.358 8.42-8.358-8.42z"
                                        stroke="#000"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                    />
                                </Svg>
                            </TouchableOpacity>

                            <View style={styles.login_header_logo}>
                                <Svg xmlns="http://www.w3.org/2000/svg" width={155} height={52} viewBox="0 0 155 52" fill="none">
                                    <Path fillRule="evenodd" clipRule="evenodd" d="M149.484 46.832l-3.076-1.938c-.81 1.777-2.268 2.907-4.211 2.584-1.944-.323-1.62-1.453-1.458-3.391l6.154-21.155h6.803l1.133-3.876h-6.802l4.049-14.373-13.605 4.522-2.915 9.85h-5.02l-1.134 3.877h5.021l-5.669 20.509c-1.133 3.714-.323 8.559 7.612 8.559 5.831 0 10.042-.969 13.118-5.168zM59.599 11.79c.486 2.584 4.211 4.037 7.936 3.068 3.725-1.13 5.993-4.037 5.345-6.46-.81-2.583-4.21-4.037-7.936-3.068-3.725.97-6.316 3.876-5.345 6.46zm43.728 36.82c-5.344 0-7.126-7.429-4.534-14.696 2.267-7.106 8.421-12.435 12.956-12.435 5.992-.323 6.155 8.72 3.887 14.696-1.943 5.652-5.669 12.435-12.309 12.435zm25.59-16.15c.485-9.043-5.67-14.372-17.168-13.888-8.26.323-16.357 4.038-20.892 9.69-3.077 4.037-4.859 9.366-3.725 14.211 1.458 5.652 6.802 9.367 17.005 9.367 11.499-.162 23.645-7.59 24.78-19.38zm-75.31-9.527h2.915L49.72 46.994h-6.154l-1.134 3.876h43.242l1.134-3.876h-6.154L93.124 4.36H75.31l-1.133 3.876h5.344L68.831 46.832h-6.64l7.774-27.938H55.227l-1.62 4.038z" fill="#004B84"/>
                                    <Path fillRule="evenodd" clipRule="evenodd" d="M44.7 17.602c-1.296 4.845-4.05 7.59-7.127 9.367-4.048 2.422-8.745 2.422-11.498 2.1l5.83-20.833c2.267-.323 6.964-.323 10.041 1.615 2.43 1.453 3.887 3.714 2.754 7.751zM18.948 8.398L8.098 46.832H1.134L0 50.708h26.884l1.134-3.876h-6.802l3.887-14.05c9.555.162 16.034-.968 20.892-3.068 4.697-2.1 7.45-4.844 9.07-7.913.971-1.776 1.62-3.875 1.943-6.136.162-1.777 0-3.392-.81-4.845-1.62-2.745-3.887-4.36-6.964-5.168-3.725-1.13-8.421-1.292-13.766-1.292H12.956l-1.133 4.038h7.126zM112.235 7.59c0-4.199-3.401-7.59-7.612-7.59s-7.612 3.391-7.612 7.59 3.401 7.59 7.612 7.59 7.612-3.391 7.612-7.59zm-1.296 0c0 3.553-2.915 6.298-6.316 6.298-3.563 0-6.316-2.907-6.316-6.298 0-3.553 2.753-6.298 6.316-6.298 3.563 0 6.316 2.745 6.316 6.298zm-8.259-2.907h2.105c.81 0 1.457.485 1.457 1.13 0 .808-.647 1.293-1.619 1.293h-1.943V4.683zm-1.296 7.106h1.296V8.236h.809c.972 0 1.458.323 2.43 2.1l.648 1.291h1.619l-.972-1.615c-.647-1.13-1.133-1.776-1.943-2.099 1.457 0 2.429-.807 2.429-2.1 0-.968-.648-2.099-2.753-2.099h-3.563v8.075z" fill="#004B84"/>
                                </Svg>
                            </View>
                            <ScrollView style={styles.edit_password_info_wrapper}>


                                {this.state.edit_password_error &&
                                <Text style={styles.error_text}>{this.state.edit_password_error_text}</Text>

                                }
                                <View style={styles.edit_password_input_field_wrapper}>
                                    <TextInput
                                        style={styles.edit_password_input_field}
                                        onChangeText={(val) => this.setState({old_password: val})}
                                        value={this.state.old_password}
                                        secureTextEntry={true}
                                        placeholder={this.state.language.old_password}
                                        placeholderTextColor='#4A4A4A'
                                    />

                                </View>
                                <View style={styles.edit_password_input_field_wrapper}>
                                    <TextInput
                                        style={styles.edit_password_input_field}
                                        onChangeText={(val) => this.setState({new_password: val})}
                                        value={this.state.new_password}
                                        secureTextEntry={true}
                                        placeholder={this.state.language.new_password}
                                        placeholderTextColor='#4A4A4A'


                                    />

                                </View>
                                <View style={styles.edit_password_input_field_wrapper}>
                                    <TextInput
                                        style={styles.edit_password_input_field}
                                        onChangeText={(val) => this.setState({confirm_password: val})}
                                        value={this.state.confirm_password}
                                        secureTextEntry={true}
                                        placeholder={this.state.language.confirm_password}
                                        placeholderTextColor='#4A4A4A'



                                    />

                                </View>

                                <View style={styles.edit_password_confirm_btn_box}>
                                    <TouchableOpacity style={styles.edit_password_confirm_btn} onPress={() => {this.editPassword()}}>
                                        <Text style={styles.edit_password_confirm_btn_text}>{this.state.language.confirm}</Text>
                                    </TouchableOpacity>
                                </View>

                            </ScrollView>
                        </View>

                    </View>
                    }

                    {this.state.timeZonesPopup &&
                    <View style={styles.timezone_popup}>
                        <View style={styles.timezone_popup_wrapper}>
                            <TouchableOpacity style={styles.timezone_popup_close_btn} onPress={() => {this.setState({timeZonesPopup:false})}}>
                                <Svg
                                    width={35}
                                    height={35}
                                    viewBox="0 0 35 35"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <Path
                                        d="M17.499 17.78L9.141 9.36m-.063 16.779l8.421-8.358-8.421 8.358zm8.421-8.358l8.421-8.359L17.5 17.78zm0 0l8.358 8.42-8.358-8.42z"
                                        stroke="#004B84"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                    />
                                </Svg>
                            </TouchableOpacity>
                            <View style={[styles.timezone_dropDown_wrapper, {zIndex: 999999999, borderRadius: 0,}]}>

                                {/*<DropDownPicker*/}
                                {/*    items={this.state.timezones}*/}
                                {/*    placeholder={this.state.language.time_zone}*/}
                                {/*    containerStyle={{ height: 45, width: '100%',  zIndex: 999999, borderRadius: 0, }}*/}
                                {/*    style={[styles.phone_code_dropdown,*/}
                                {/*        {backgroundColor: '#004B84', height: 45, borderRadius: 0}*/}
                                {/*    ]}*/}
                                {/*    itemStyle={{*/}
                                {/*        justifyContent: 'flex-start',*/}
                                {/*        width: 160,*/}
                                {/*        zIndex: 15*/}
                                {/*    }}*/}
                                {/*    selectedLabelStyle={{*/}
                                {/*        fontSize: 16,*/}
                                {/*        color: "#ffffff",*/}
                                {/*        fontWeight: '400',*/}
                                {/*        // width: 150,*/}
                                {/*    }}*/}
                                {/*    labelStyle={{*/}
                                {/*        fontSize: 16,*/}
                                {/*        color: "#ffffff",*/}
                                {/*        fontWeight: '400',*/}

                                {/*    }}*/}
                                {/*    placeholderStyle={{*/}
                                {/*        fontSize: 14,*/}
                                {/*        color: "#ffffff",*/}
                                {/*        fontWeight: '400',*/}
                                {/*    }}*/}


                                {/*    dropDownStyle={{backgroundColor: '#004B84',  width: '100%',  zIndex: 999999, borderRadius: 0,}}*/}
                                {/*    value={this.state.selectedTimeZone}*/}
                                {/*    // defaultValue={this.state.userInfo.language}*/}


                                {/*    // selectedLabel='English'*/}
                                {/*    arrowColor={'white'}*/}
                                {/*    // onChangeItem={this.onChangeDropDownItem}*/}
                                {/*    onChangeItem={item => {*/}
                                {/*        this.chooseTimezone(item);*/}
                                {/*    }}*/}


                                {/*/>*/}


                                <DropDownPicker
                                    listMode="SCROLLVIEW"
                                    open={this.state.openTimezones}
                                    value={this.state.selectedTimeZone}
                                    setOpen={() => {
                                        this.setState({
                                            openTimezones: !this.state.openTimezones
                                        })
                                    }}
                                    items={this.state.timezones}
                                    setValue={this.chooseTimezone}
                                    // setItems={setRegionsDropdownItems}/}
                                    style={{
                                        width: '100%',
                                        height: 45,
                                        backgroundColor: '#004B84',
                                        borderRadius: 0,
                                        borderColor: 'white'
                                    }}
                                    containerStyle={{
                                        width: '100%',
                                        height: 200,
                                        borderRadius: 0,
                                    }}
                                    listItemContainerStyle={{
                                        borderRadius: 0,
                                    }}
                                    listItemLabelStyle={{
                                        color: '#ffffff',
                                        fontSize: 14,
                                        fontWeight: '400'
                                    }}
                                    labelStyle={{
                                        color: '#ffffff',
                                        fontSize: 16,
                                        fontWeight: '400'
                                    }}

                                    arrowIconStyle={{
                                        width: 20,
                                        height: 20,


                                    }}
                                    dropDownContainerStyle={{
                                        borderRadius: 0,
                                        backgroundColor: '#004B84',
                                        borderColor: 'white',
                                        paddingBottom: 20,
                                    }}

                                    placeholder={this.state.language.time_zone}
                                    placeholderStyle={{
                                        color: '#ffffff',
                                        fontSize: 14,
                                        fontWeight: '400'
                                    }}



                                    // keyExtractor={(item, index) => index+1}/}

                                />
                            </View>



                            <TouchableOpacity style={styles.timezone_popup_confirm_btn} onPress={() => {this.changeTimeZones()}}>
                                <Text style={styles.timezone_popup_confirm_btn_text}>{this.state.language.confirm}</Text>
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
        width:  184,
        borderWidth: 1,
        borderColor: '#10BCCE',
        paddingVertical: 10,
        paddingLeft: 14,
        paddingRight: 10,
        fontSize: 12,
        // justifyContent: 'flex-end',
        // alignItems: 'flex-end',
        // alignSelf: 'flex-end',
        color: '#4A4A4A'
    },
    settings_input_field_text: {
        color: '#10BCCE',
        fontWeight: '600',
        fontSize: 12,
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
        // shadowColor: '#000000',
        // shadowOffset: { width: 0, height: 4 },
        // shadowOpacity: 0.25,
        // shadowRadius: 4,
        // elevation: 999,
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
        shadowOpacity: 0.50,
        shadowRadius: 4,
        elevation: 10,
        zIndex: 999999,
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
        // color: '#D3D3D3',
        color: '#4A4A4A',
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
        // height: 100
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
    timezone_dropDown_wrapper: {
        width: '100%',
         marginBottom: 20
        // height: 600,
    }

});
