import React, { Component } from 'react';
import Svg, {Path, Rect, Circle, Defs, Stop, ClipPath, G, Mask} from "react-native-svg";
import { StatusBar } from 'expo-status-bar';
import DropDownPicker from "react-native-custom-dropdown";
import PieChart from 'react-native-expo-pie-chart';
import { VictoryPie } from "victory-native";
import DatePicker from 'react-native-datepicker';

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



export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            headerMenuPopup: false,
            SharedAccessPopup: false,
            email: '',
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



    redirectToPreferences = () => {
        this.props.navigation.navigate("Preferences");

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


        // SharedAccessPopup
        if (this.state.SharedAccessPopup) {
            return (
                <View style={styles.turn_off_the_load_switch_value_popup}>
                    {/*<TouchableOpacity style={styles.turn_off_the_load_switch_value_popup_close_btn} onPress={() => {this.setState({turnOffTheLoadSwitchValuePopup: false})}}>*/}
                    {/*    <Svg*/}
                    {/*        width={30}*/}
                    {/*        height={30}*/}
                    {/*        viewBox="0 0 30 30"*/}
                    {/*        fill="none"*/}
                    {/*        xmlns="http://www.w3.org/2000/svg"*/}
                    {/*    >*/}
                    {/*        <Path*/}
                    {/*            d="M4.024 5.351a.938.938 0 111.327-1.327l9.65 9.65 9.648-9.65a.938.938 0 111.328 1.327L16.326 15l9.65 9.649a.94.94 0 01-1.327 1.327L15 16.326l-9.649 9.65a.939.939 0 11-1.327-1.327L13.674 15l-9.65-9.649z"*/}
                    {/*            fill="#004B84"*/}
                    {/*        />*/}
                    {/*    </Svg>*/}
                    {/*</TouchableOpacity>*/}
                    <View style={styles.turn_off_the_load_switch_value_popup_wrapper}>
                        <Text style={styles.turn_off_the_load_switch_value_popup_title}>Share</Text>

                        <TextInput
                            style={styles.login_input_field}
                            onChangeText={(val) => this.setState({email: val})}
                            value={this.state.email}
                            placeholder="Email address"
                        />

                        <TouchableOpacity style={styles.turn_off_the_load_switch_value_popup_confirm_btn} onPress={() => {this.setState({SharedAccessPopup: false})}}>
                            <Text style={styles.turn_off_the_load_switch_value_popup_confirm_btn_text}>Ok</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
                            <Text style={styles.all_devices_general_page_header_title}>Shared access</Text>
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

                      <View style={styles.shared_access_info_wrapper}>
                           <Text style={styles.shared_access_info1}>
                               Share access with family members or colleagues so they can control this device
                           </Text>
                          <View style={styles.shared_access_gmail_info_delete_btn_wrapper}>
                              <Text style={styles.shared_access_gmail_info}>thomasblack@gmai.com</Text>
                              <TouchableOpacity style={styles.shared_access_delete_btn}>
                                  <Text style={styles.shared_access_delete_btn_text}>Delete</Text>
                                  <View style={styles.shared_access_delete_btn_icon}>
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
                          <TouchableOpacity style={styles.add_account_btn} onPress={() => {this.setState({SharedAccessPopup: true})}}>
                              <Text style={styles.add_account_btn_text}>Add account</Text>
                          </TouchableOpacity>
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
        paddingHorizontal: 32,
        paddingTop: 25,
        paddingBottom: 25,
    },
    turn_off_the_load_switch_value_popup_title: {
        marginBottom: 27,
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
    shared_access_info1: {
        marginBottom: 47,
        color: '#4A4A4A',
        fontWeight: '400',
        fontSize: 16,
        paddingRight: 35,
    },
    shared_access_gmail_info_delete_btn_wrapper: {
        marginBottom: 47,
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
    }

});