import React, { Component } from 'react';
import Svg, {Path, Rect, Circle, Defs, Stop, ClipPath, G, Mask} from "react-native-svg";
import { StatusBar } from 'expo-status-bar';
import DropDownPicker from "react-native-custom-dropdown";
import PieChart from 'react-native-expo-pie-chart';
import { VictoryPie } from "victory-native";
import DatePicker from 'react-native-datepicker';
import {AuthContext} from "../AuthContext/context";
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
import AsyncStorage from "@react-native-async-storage/async-storage";



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

            sort_by_pre_configuration1: true,
            sort_by_pre_configuration2: false,
            sort_by_pre_configuration3: false,
            sort_by_pre_configuration4: false,
            sort_by_pre_configuration5: false,
            language: en,
            language_name: 'en',
        };

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



    componentDidMount() {
        const { navigation } = this.props;
        this.setLanguageFromStorage();
        this.focusListener = navigation.addListener("focus", () => {
            this.setLanguageFromStorage();
        });
    }
    componentWillUnmount() {
        if (this.focusListener) {
            this.focusListener();
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
    useScheduleToggleSwitch = (value) => {
        this.setState({ useScheduleSwitchValue: value });
    };
    settingNameToggleSwitch = (value) => {
        this.setState({ settingNameSwitchValue: value });
    };
    pushNotificationsToggleSwitch = (value) => {
        this.setState({ pushNotificationsSwitchValue: value });
    };

    redirectToDetailsGeneralPage = () => {
        this.props.navigation.navigate("DetailsGeneralPage");

    }
    redirectToTestMode = () => {
        this.props.navigation.navigate("TestMode");

    }

    redirectToPreferences = () => {
        this.props.navigation.navigate("Preferences");

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

    closeMenu = () => {
        this.setState({
            headerMenuPopup: false
        })
    }

    render() {

        // headerMenuPopup
        if (this.state.headerMenuPopup) {
            return (
                <TopMenu navigation={this.props.navigation} closeMenu={this.closeMenu} />
            )
        }




        return (
            <SafeAreaView style={styles.container} >
                <StatusBar style="dark" />
                <View style={styles.all_devices_general_page_header}>
                    <View style={styles.all_devices_general_page_header_child}>
                        <TouchableOpacity style={styles.title_back_btn_wrapper} onPress={() => {this.redirectToPreferences()}}>
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
                            <Text style={styles.all_devices_general_page_header_title}>Pre-configuration</Text>
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
                <ScrollView style={styles.all_devices_general_page_main_wrapper}>

                     <View style={styles.pre_configuration_items_wrapper}>
                             <Text style={styles.pre_configuration_item_info}>
                                 Recommended settings for optimal performance from the manufacturer
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
        paddingTop: 48,
        paddingBottom: 29,


    },

    all_devices_general_page_main_wrapper: {
        width: '100%',
        flex: 1,
        paddingHorizontal: 25,

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


});