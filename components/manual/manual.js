import React, { Component } from 'react';
import Svg, {Path, Rect, Circle, Defs, Stop, ClipPath, G, Mask} from "react-native-svg";
import { StatusBar } from 'expo-status-bar';
import DropDownPicker from "react-native-custom-dropdown";
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



export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            headerMenuPopup: false,
            enterNewDevice: '',
            wifiAccess: '',
            wifiPassword: '',
            switchValue: false,
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
        this.props.navigation.navigate("TestMode");

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
                            <TouchableOpacity style={styles.title_back_btn_wrapper}>
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
                                <Text style={styles.all_devices_general_page_header_title}>Manual</Text>
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
                    <ScrollView style={styles.manual_items_wrapper}>
                        <View style={[styles.manual_item_parent, {marginBottom: 58}]}>
                            <Text style={styles.manual_item_title}>Первое подключение устройства</Text>
                            <View style={styles.manual_item_child}>
                                <Text style={styles.manual_item_child_info}>
                                    <Text style={styles.manual_item_child_info_bold}>
                                        Шаг 1.
                                    </Text>
                                    <View style={{marginRight: 5}}></View>
                                    Подключите устройство к электросети
                                </Text>
                                <Text style={styles.manual_item_child_info}>
                                    <Text style={styles.manual_item_child_info_bold}>
                                        Шаг 2.
                                    </Text>
                                    <View style={{marginRight: 5}}></View>
                                    На смартфоне выполните поиск доступных WI-FI сетей. Должна появиться сеть PILOT_XXXX. (где XXXX - последние цифры заводского номера). Подключитесь к этой открытой сети
                                </Text>
                                <Text style={styles.manual_item_child_info}>
                                    <Text style={styles.manual_item_child_info_bold}>
                                        Шаг 3.
                                    </Text>
                                    <View style={{marginRight: 5}}></View>
                                    В боковом меню приложения нажмите “Первичная настройка” или в разделе поиска, наюмите кнопку “Ручная настройка устройства” или откройте в веб браузере страницу http://192.1168.0.
                                </Text>
                                <Text style={styles.manual_item_child_info}>
                                    <Text style={styles.manual_item_child_info_bold}>
                                        Шаг 4.
                                    </Text>
                                    <View style={{marginRight: 5}}></View>
                                    Введите название и пароль вашей Wi-Fi сети
                                </Text>
                                <Text style={styles.manual_item_child_info}>
                                    <Text style={styles.manual_item_child_info_bold}>
                                        Шаг 5.
                                    </Text>
                                    <View style={{marginRight: 5}}></View>
                                    Если сеть с именем PILOT_XXXX больше не доступна и не появилась снова в течении 60 секунд, Значит устройство настроено верно. Вы можете вернуться в вашу рабочую Wi-Fi сеть.
                                </Text>
                                <Text style={styles.manual_item_child_info}>
                                    <Text style={styles.manual_item_child_info_bold}>Если сеть PILOT_XXXX</Text>
                                    <View style={{marginRight: 5}}></View>
                                    снова доступна для подключения, то повторите действия, начиная шага 2, Удостоверьтесь в том что вы указываете правильные имя Wi-Fi сети и пароль.
                                </Text>
                            </View>
                        </View>
                        <View style={styles.manual_item_parent}>
                            <Text style={styles.manual_item_title}>Добавление устройства к аккаунту</Text>
                            <View style={styles.manual_item_child}>
                                <Text style={styles.manual_item_child_info}>
                                    <Text style={styles.manual_item_child_info_bold}>
                                        Шаг 1.
                                    </Text>
                                    <View style={{marginRight: 5}}></View>
                                    В боковом меню приложения выберите пункт “Добавить новое устройство”
                                </Text>
                                <Text style={styles.manual_item_child_info}>
                                    <Text style={styles.manual_item_child_info_bold}>
                                        Шаг 2.
                                    </Text>
                                    <View style={{marginRight: 5}}></View>
                                    Если вы находитесь в одной Wi-Fi сети с устройством. то оно должно отобразиться в списке доступных для подключения. Достаточно нажать кнопку “Добавить”
                                </Text>
                                <Text style={styles.manual_item_child_info}>
                                    <Text style={styles.manual_item_child_info_bold}>
                                        Шаг 3.
                                    </Text>
                                    <View style={{marginRight: 5}}></View>
                                    Если в списке нет нужно устройства. то введите заводской номер в формате AAAA:BBBB:CCCC который напечатан на коробке и на устройтсве.
                                </Text>
                                <Text style={styles.manual_item_child_info}>
                                    <Text style={styles.manual_item_child_info_bold}>
                                        Шаг 4.
                                    </Text>
                                    <View style={{marginRight: 5}}></View>
                                    Новое устройство готово к работе. Рекомендуется задать имя новому устройству.
                                </Text>
                                <Text style={styles.manual_item_child_info}>
                                    <Text style={styles.manual_item_child_info_bold}>Если устройства нет в списке,</Text>
                                    <View style={{marginRight: 5}}></View>
                                    выполните сброс устройства. Для этого удержите кнопку на корпусе естройства в течении 10 секунд, и повторите шаги по первичной настройке.                            </Text>
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
    all_devices_general_page_header: {
        width: '100%',
        marginBottom: 30,
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

    manual_items_wrapper: {
        width: '100%',
        flex: 1,
        paddingHorizontal: 35,
    },

    manual_item_title: {
        fontWeight: '400',
        fontSize: 16,
        color: '#004B84',
        marginBottom: 23,
    },
    manual_item_child_info: {
        color: '#4A4A4A',
        fontWeight: '400',
        fontSize: 12,
        marginBottom: 20,

    },
    manual_item_child_info_bold: {
        fontWeight: '700',

    },
    title_back_btn_wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    back_btn:{
        marginRight: 8,
    }

});
