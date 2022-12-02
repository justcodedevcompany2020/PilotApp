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
            voltage_item_info: 'AVG 221.7 V',
            minimum_info: '214.4 V',
            maximum_info: '244.9 V',
            todayDate: '2022-07-5 12:44:43',


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



    redirectToTestReport = () => {
        this.props.navigation.navigate("TestReport");

    }

    redirectToNewTest = () => {
        this.props.navigation.navigate("NewTest");

    }




    componentDidMount() {

        var date = new Date().getDate();
        date = date < 10 ? `0${date}` : date;
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();

        //Alert.alert(date + '-' + month + '-' + year);
        // You can turn it in to your desired format


        let todayDate =  date + '-' + month + '-' + year;//format: dd-mm-yyyy;
        this.setState({
            todayDate: todayDate,
        })

    }
    componentWillUnmount() {


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
                        <TouchableOpacity style={styles.title_back_btn_wrapper} onPress={() => {this.redirectToTestReport()}}>
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
                            <Text style={styles.all_devices_general_page_header_title}>Osciloscope</Text>
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
                    <View style={styles.impulse_surges_items_main_wrapper}>

                        <Text style={styles.osciloscope_date_info}>{this.state.todayDate}</Text>
                            <View style={[styles.impulse_surges_item_img]}>
                                <Image style={styles.impulse_surges_item_img_child} source={require('../../assets/images/chart_img7.png')}/>
                            </View>

                            <TouchableOpacity style={styles.osciloscope_refresh_button}>
                                <Text style={styles.osciloscope_refresh_button_text}>Refresh</Text>
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
        marginBottom: 28,
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

    impulse_surges_item_img: {
        width: 265,
        height: 320,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        marginBottom: 25,
    },
    impulse_surges_item_img_child: {
        width: '100%',
        height: '100%',
    },

    impulse_surges_items_main_wrapper: {
        width: '100%',
    },
    osciloscope_refresh_button: {
        width: '100%',
        height: 40,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#004B84',

    },
    osciloscope_refresh_button_text: {
        color: '#ffffff',
        fontWeight: '400',
        fontSize: 16,
    },
    osciloscope_date_info: {
        marginBottom: 23,
        color: '#4A4A4A',
        fontWeight: '400',
        fontSize: 16,
    }
});
