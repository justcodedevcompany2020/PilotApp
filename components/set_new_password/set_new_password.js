import React, { Component } from 'react';
import Svg, {Path, Rect, Circle, Defs, Stop, ClipPath, G, Mask} from "react-native-svg";
import { StatusBar } from 'expo-status-bar';
import DropDownPicker from "react-native-custom-dropdown";
import {AuthContext} from "../AuthContext/context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from "i18n-js";
import {en, ru} from "../../i18n/supportedLanguages";
import md5 from 'md5';

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
    ScrollView, Dimensions
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
            email: '',
            confirm_password: '',
            new_password: '',
            confirm_password_error: false,
            confirm_password_error_text: '',

            verification_code: '',
            verification_code_error: false,
            verification_code_error_text: '',

            set_new_password_error: false,
            set_new_password_error_text: '',

            email_error: false,
            email_error_text: '',

            new_password_success: false,

            language: en,
            language_name: 'en',

        };

    }


    static contextType = AuthContext;



    chooseLanguage = (item) => {
        this.setState({
            selectedLanguage: item.value,
            error_language: false,
            valid_language: true,
        })
        console.log(item);
    }


    redirectToLogin = () => {
        this.props.navigation.navigate("Login");

    }
    redirectToRegistration = () => {
        this.props.navigation.navigate("Registration");

    }


    recoveryPassword = async () => {
        let {confirm_password, new_password, verification_code} = this.state;

        if (confirm_password == '' || new_password == '' || verification_code == '' || new_password.length < 6) {
            if (new_password.length < 6) {
                this.setState({
                    confirm_password_error: true,
                    confirm_password_error_text: this.state.language.password_must_be,
                })
            } else if (confirm_password != new_password) {
                this.setState({
                    confirm_password_error: true,
                    confirm_password_error_text:  this.state.language.password_mismatch,
                })
            }

            this.setState({
                set_new_password_error: true,
                set_new_password_error_text: this.state.language.missing_fields_error,
            })
        } else {
            this.setState({
                set_new_password_error: false,
                set_new_password_error_text: '',
                confirm_password_error: false,
                confirm_password_error_text: '',
            })


            let hash_password = this.props.email.toLowerCase() + new_password;

            let hash_password_result = md5(hash_password);

            try {
                fetch(`https://apiv1.zis.ru/account/recovery_set_password`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        login: this.props.email,
                        password: hash_password_result,
                        verification_code: verification_code,

                    })

                }).then((response) => {
                    return response.json()
                }).then((response) => {

                    console.log(response, 'login')

                    if (response.hasOwnProperty('result')) {
                        this.setState({
                            verification_code_error: false,
                            verification_code_error_text: '',
                        })
                        if (response.result == 'success') {
                            this.setState({
                                new_password_success: true,
                            })
                        }
                    } else {
                        if (response.hasOwnProperty('description')) {
                            if (response.description.en == 'account_not_found') {
                                this.setState({
                                    email_error: true,
                                    email_error_text: this.state.language.account_not_found,

                                })
                            }
                            if (response.description.en == 'Verification code mismatch') {
                                this.setState({
                                    verification_code_error: true,
                                    verification_code_error_text: this.state.language.verification_code_mismatch,
                                })
                            } else if (response.description.en == 'Too many attempts') {
                                this.setState({
                                    verification_code_error: true,
                                    verification_code_error_text: 'Too many attempts',
                                })
                            } else if (response.description.en == 'Verification code has expired') {
                                this.setState({
                                    verification_code_error: true,
                                    verification_code_error_text: 'Verification code has expired',
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


    redirectToPasswordRecovery = () => {
        this.props.navigation.navigate("PasswordRecovery");

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





    render() {



        return (
            <SafeAreaView style={styles.container} >
                <StatusBar style="dark" />
                <View style={styles.login_header}>
                    <TouchableOpacity style={styles.back_btn} onPress={() => {this.redirectToPasswordRecovery()}}>
                        <Svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={35}
                            height={35}
                            viewBox="0 0 35 35"
                            fill="none"

                        >
                            <Path
                                d="M20.169 27.708a1.458 1.458 0 01-1.138-.54l-7.043-8.75a1.458 1.458 0 010-1.851l7.291-8.75a1.46 1.46 0 112.246 1.866L15.006 17.5l6.3 7.817a1.458 1.458 0 01-1.137 2.391z"
                                fill="#000"
                            />
                        </Svg>

                    </TouchableOpacity>
                    <View style={styles.password_recovery_header_logo}>
                        <Svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={155}
                            height={52}
                            viewBox="0 0 155 52"
                            fill="none"
                        >
                            <Path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M149.484 46.832l-3.076-1.938c-.81 1.777-2.268 2.907-4.211 2.584-1.944-.323-1.62-1.453-1.458-3.391l6.154-21.155h6.803l1.133-3.876h-6.802l4.049-14.373-13.605 4.522-2.915 9.85h-5.02l-1.134 3.877h5.021l-5.669 20.509c-1.133 3.714-.323 8.559 7.612 8.559 5.831 0 10.042-.969 13.118-5.168zM59.599 11.79c.486 2.584 4.211 4.037 7.936 3.068 3.725-1.13 5.993-4.037 5.345-6.46-.81-2.583-4.21-4.037-7.936-3.068-3.725.97-6.316 3.876-5.345 6.46zm43.728 36.82c-5.344 0-7.126-7.429-4.534-14.696 2.267-7.106 8.421-12.435 12.956-12.435 5.992-.323 6.155 8.72 3.887 14.696-1.943 5.652-5.669 12.435-12.309 12.435zm25.59-16.15c.485-9.043-5.67-14.372-17.168-13.888-8.26.323-16.357 4.038-20.892 9.69-3.077 4.037-4.859 9.366-3.725 14.211 1.458 5.652 6.802 9.367 17.005 9.367 11.499-.162 23.645-7.59 24.78-19.38zm-75.31-9.527h2.915L49.72 46.994h-6.154l-1.134 3.876h43.242l1.134-3.876h-6.154L93.124 4.36H75.31l-1.133 3.876h5.344L68.831 46.832h-6.64l7.774-27.938H55.227l-1.62 4.038z"
                                fill="#004B84"
                            />
                            <Path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M44.7 17.602c-1.296 4.845-4.05 7.59-7.127 9.367-4.048 2.422-8.745 2.422-11.498 2.1l5.83-20.833c2.267-.323 6.964-.323 10.041 1.615 2.43 1.453 3.887 3.714 2.754 7.751zM18.948 8.398L8.098 46.832H1.134L0 50.708h26.884l1.134-3.876h-6.802l3.887-14.05c9.555.162 16.034-.968 20.892-3.068 4.697-2.1 7.45-4.844 9.07-7.913.971-1.776 1.62-3.875 1.943-6.136.162-1.777 0-3.392-.81-4.845-1.62-2.745-3.887-4.36-6.964-5.168-3.725-1.13-8.421-1.292-13.766-1.292H12.956l-1.133 4.038h7.126zM112.235 7.59c0-4.199-3.401-7.59-7.612-7.59s-7.612 3.391-7.612 7.59 3.401 7.59 7.612 7.59 7.612-3.391 7.612-7.59zm-1.296 0c0 3.553-2.915 6.298-6.316 6.298-3.563 0-6.316-2.907-6.316-6.298 0-3.553 2.753-6.298 6.316-6.298 3.563 0 6.316 2.745 6.316 6.298zm-8.259-2.907h2.105c.81 0 1.457.485 1.457 1.13 0 .808-.647 1.293-1.619 1.293h-1.943V4.683zm-1.296 7.106h1.296V8.236h.809c.972 0 1.458.323 2.43 2.1l.648 1.291h1.619l-.972-1.615c-.647-1.13-1.133-1.776-1.943-2.099 1.457 0 2.429-.807 2.429-2.1 0-.968-.648-2.099-2.753-2.099h-3.563v8.075z"
                                fill="#004B84"
                            />
                        </Svg>
                    </View>
                </View>
                <ScrollView style={styles.password_recovery_main_wrapper}>

                    {this.state.set_new_password_error &&
                      <Text style={styles.error_text}>{this.state.set_new_password_error_text}</Text>
                    }

                    {this.state.confirm_password_error &&
                    <Text style={styles.error_text}>{this.state.confirm_password_error_text}</Text>
                    }

                    {this.state.verification_code_error &&
                    <Text style={styles.error_text}>{this.state.verification_code_error_text}</Text>
                    }

                    {this.state.email_error &&
                    <Text style={styles.error_text}>{this.state.email_error_text}</Text>
                    }


                    {/*<Text style={styles.password_recovery_info}>*/}
                    {/*    A link to reset your password will be sent to your email. Follow the link in the email and set a new password. Then log in to the app.*/}
                    {/*</Text>*/}

                    <View style={[styles.password_recovery_input_field_wrapper]}>

                        <TextInput
                            style={[styles.password_recovery_input_field, {marginRight: 18, flex: 1}]}
                            onChangeText={(val) => this.setState({email: val})}
                            value={this.props.email}
                            placeholder={this.state.language.login}
                            editable={false}
                            placeholderTextColor='#D3D3D3'

                        />



                    </View>

                    <View style={[styles.password_recovery_input_field_wrapper ]}>

                        <TextInput
                            style={[styles.password_recovery_input_field]}
                            onChangeText={(val) => this.setState({new_password: val})}
                            value={this.state.new_password}
                            secureTextEntry={true}
                            placeholder={this.state.language.new_password}
                            placeholderTextColor='#D3D3D3'

                        />

                    </View>

                    <View style={[styles.password_recovery_input_field_wrapper ]}>

                        <TextInput
                            style={[styles.password_recovery_input_field]}
                            onChangeText={(val) => this.setState({confirm_password: val})}
                            value={this.state.confirm_password}
                            secureTextEntry={true}
                            placeholder={this.state.language.confirm_password}
                            placeholderTextColor='#D3D3D3'

                        />

                    </View>



                    <View style={[styles.password_recovery_input_field_wrapper ]}>

                        <TextInput
                            style={[styles.password_recovery_input_field]}
                            onChangeText={(val) => this.setState({verification_code: val})}
                            value={this.state.verification_code}
                            keyboardType='numeric'
                            placeholder={this.state.language.verification_code}
                        />

                    </View>


                    <TouchableOpacity style={styles.enter_btn} onPress={() => {this.recoveryPassword()}}>
                        <Text style={styles.enter_btn_text}>{this.state.language.enter}</Text>
                    </TouchableOpacity>

                </ScrollView>

                <View style={styles.password_recovery_footer_logo}>
                    <Svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={101}
                        height={13}
                        viewBox="0 0 101 13"
                        fill="none"
                    >
                        <G
                            clipPath="url(#clip0_4_110)"
                            fillRule="evenodd"
                            clipRule="evenodd"
                            fill="#004B84"
                        >
                            <Path d="M55.604 6.432c0-1.201.175-1.962.422-2.7.367-1.144 1.752-2.24 2.945-2.234 1.29 0 2.168.539 2.819 1.51.608.855.88 2.161.88 3.504 0 1.102-.374 2.607-1.055 3.566-.68.923-1.47 1.288-2.608 1.288-1.542 0-2.36-1.096-2.74-1.752-.627-1.145-.663-2.557-.663-3.182zm2.554.198c0 .662.169 2.34 1.036 2.34.813 0 .945-1.913.945-2.414 0-1.703-.283-2.631-1.011-2.631-.73-.006-.97 1.157-.97 2.705zM73.65 11.217l.005-9.52h2.482c.988 0 2.331.234 3.024 1.101.68.873.656 1.981.656 2.464 0 .477-.301 1.393-.801 1.975-.5.563-1.35.904-2.59.904-.066 0-.163-.038-.295-.038v3.114h-2.482zm2.487-5.256c.644 0 1.144-.377 1.144-1.058 0-.675-.512-1.164-1.144-1.22v2.278zM86.358 11.242l-2.638-.025-.139-1.25h-1.704l-.187 1.25h-2.566l2.187-9.515h3.041l2.006 9.54zm-4.132-3.256h1.073l-.35-2.526-.15-1.473-.181 1.473-.392 2.526zM98.826 11.236h-2.518l.006-4.049-2.301-5.49 2.626.018.536 1.857.332 1.585.319-1.579.554-1.863 2.62.006-2.162 5.491-.012 4.024zM87.038 11.223l.019-9.514h2.36l2.03 5.732-.258-2.817V1.71l2.385.006-.007 9.514-2.396.025-1.91-5.664.187 2.414-.006 3.22h-2.403zM72.758 11.217l-2.626-.006-.2-3.665-.03-2.365-.42 2.365-.633 3.665-2.03-.006-.548-3.653-.343-2.333-.048 2.333-.205 3.653h-2.656l1.066-9.515h3.09l.451 3.17.271 2.148.295-2.142.567-3.188h3.077l.922 9.54zM54.906 8.5V11c-.476.236-.88.34-1.422.34-.656 0-1.385-.185-1.74-.352-1.072-.508-1.301-1.046-1.62-1.696-.344-.693-.573-1.201-.579-2.755-.024-1.554.5-2.977 1.084-3.683.398-.477 1.585-1.337 2.777-1.337.404 0 1.06.074 1.5.272L54.9 4.606c-.211-.44-.723-.712-1.253-.712-1.096 0-1.584 1.312-1.56 2.488.012 1.164.283 2.6 1.59 2.6.428-.006.843-.247 1.229-.482zM40.432 7.998c.344.57 1.048 1.034 1.536 1.034.584 0 .813-.303.813-.662 0-.613-1.837-1.672-2.12-2.384-.114-.29-.295-.724-.295-1.318 0-1.047.657-2.501 1.59-2.867.771-.31 1.867-.538 3.084.199l-.012 2.841c-.458-.687-1.006-1.003-1.53-1.003-.307 0-.578.235-.578.477 0 .235.15.563.331.724.253.266 1.289.96 1.512 1.387.18.353.512.978.512 1.776 0 1.201-.488 1.864-.657 2.03-.476.552-1.06 1.103-2.397 1.103a5.062 5.062 0 01-1.789-.384V7.998zM36.692 1.665h2.47l-.006 9.515h-2.47l.006-9.515zM29.151 11.174l3.204-7.311-1.072.05h-1.632V1.646l6.162.018-3.108 7.392 1.054-.1 1.722.007v2.216l-6.33-.006zM18.852 2.37h1.59c-1.56-.711-3.53-1.212-5.674-1.441a.804.804 0 01.024.21c0 .13-.03.279-.102.409a18.87 18.87 0 014.162.823zM12.16 2.278c1.223 0 2.21-.514 2.21-1.139C14.378.508 13.39 0 12.167 0c-1.216 0-2.21.508-2.21 1.133 0 .631.994 1.145 2.205 1.145zM9.649 1.541a.899.899 0 01-.108-.408c0-.074.012-.149.03-.21-2.157.222-4.132.724-5.692 1.436h1.602c1.205-.39 2.668-.688 4.168-.818zM23.574 4.655c-.638-.835-1.548-1.46-2.487-1.968l-5.68-.007c-.765 0-.994.681-.645 1.22l2.861 4.55-3.638-.006.006-5.782h-3.625l-.006 5.782H6.74L9.6 3.9c.35-.539.121-1.22-.638-1.213L3.21 2.674c-.512.304-1.072.638-1.536 1.016C.614 4.569 0 5.584 0 6.667c0 3.238 5.45 5.893 12.154 5.9 6.698.006 12.167-2.644 12.173-5.875 0-.724-.271-1.412-.753-2.037zm-.482 3.38c-.674.842-1.945 1.548-3.62 2.05-1.963.6-4.45.984-7.318.984-3.987-.007-7.426-.756-9.486-1.907-.602-.34-1.096-.7-1.44-1.127C.88 7.602.724 7.02.694 6.555c0-1.138.692-2.129 2.102-2.995l3.385.006-2.723 4.333c-.433.687-.036 1.424 1.133 1.43l15.141.019c1.169.012 1.609-.75 1.175-1.437l-2.71-4.345 3.33.006c1.392.879 2.114 1.931 2.114 3.008 0 .527-.192 1.01-.548 1.455zM23.809 10.406c-.657 0-1.199.557-1.199 1.22 0 .675.542 1.232 1.199 1.232.644 0 1.186-.558 1.186-1.232 0-.663-.542-1.22-1.186-1.22zm0 2.31c-.596 0-1.06-.484-1.06-1.09 0-.6.47-1.077 1.06-1.077.584 0 1.048.482 1.048 1.077 0 .613-.47 1.09-1.048 1.09z" />
                            <Path d="M24.303 12.01c0-.143-.012-.285-.217-.341v-.025c.163-.024.265-.18.265-.353 0-.365-.325-.39-.482-.39h-.632v1.455h.205v-.613h.403c.241 0 .265.168.265.297 0 .192 0 .248.036.31h.217c-.06-.08-.048-.136-.06-.34zm-.434-.415h-.415v-.52h.391c.175 0 .301.068.301.26 0 .235-.186.266-.277.26z" />
                        </G>
                        <Defs>
                            <ClipPath id="clip0_4_110">
                                <Path fill="#fff" d="M0 0H101V13H0z" />
                            </ClipPath>
                        </Defs>
                    </Svg>
                </View>

                {this.state.new_password_success &&
                <View style={styles.register_success_popup}>
                    <View style={styles.register_success_popup_wrapper}>
                        <TouchableOpacity style={styles.register_success_popup_close_btn} onPress={() => {this.setState({register_success_popup:false})}}>
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
                        <View style={styles.register_success_popup_icon}>
                            <Svg
                                width={220}
                                height={220}
                                viewBox="0 0 220 220"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <Path
                                    d="M110 206.25c53.157 0 96.25-43.093 96.25-96.25S163.157 13.75 110 13.75 13.75 56.843 13.75 110s43.093 96.25 96.25 96.25z"
                                    fill="#0080DE"
                                />
                                <Path
                                    d="M158.583 66.917L96.25 129.25l-25.667-25.667-12.833 12.834 38.5 38.5 75.167-75.167-12.834-12.833z"
                                    fill="#fff"
                                />
                            </Svg>
                        </View>
                        <Text style={styles.register_success_popup_text}>{this.state.language.confirm_password_success_info}</Text>
                        <View style={{paddingHorizontal: 30}}>
                            <TouchableOpacity style={styles.register_success_popup_login_btn} onPress={() => {this.redirectToLogin()}}>
                                <Text style={styles.register_success_popup_login_btn_text}>{this.state.language.login_register}</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
                }
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
        paddingTop: 102,
        paddingBottom: 29,


    },
    password_recovery_header_logo: {
        marginBottom: 116,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    password_recovery_main_wrapper: {
        width: '100%',
        flex: 1,
        paddingHorizontal: 65,
    },

    password_recovery_input_field: {
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

    password_recovery_input_field_wrapper: {
        marginBottom: 13,
    },
    password_recovery_btn2: {
        backgroundColor: '#004B84',
        width: 45,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
    },
    password_recovery_buttons_wrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%'
    },
    registration_btn: {
        borderRightColor: '#BDBDBD',
        borderRightWidth: 1,
        paddingRight: 10,
        marginRight: 10,

    },
    registration_btn_text: {
        fontWeight: '500',
        fontSize: 12,
        color: '#004B84',
    },
    password_recovery_btn: {
        borderRightColor: '#BDBDBD',
        borderRightWidth: 1,
        paddingRight: 10,
        marginRight: 10,

    },
    password_recovery_btn_text: {
        fontWeight: '500',
        fontSize: 12,
        color: '#004B84',
    },
    rules_btn_text: {
        fontWeight: '500',
        fontSize: 12,
        color: '#004B84',
    },

    password_recovery_info: {
        fontWeight: '400',
        fontSize: 12,
        color: '#4A4A4A',
        marginBottom: 15,
        lineHeight: 15,
    },
    code_input_field: {
        width: 40,
        height: 55,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#10BCCE',
        fontSize:15,
        color:'#000000',
        borderRadius: 8,
        paddingHorizontal:14,
        fontWeight: "bold",
        marginRight: 10,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",

    },


    recovery_account_code_inputs_wrapper: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 20,
    },

    enter_btn: {
        backgroundColor: '#004B84',
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 30
    },
    enter_btn_text: {
        fontSize: 16,
        fontWeight: '400',
        color: '#ffffff',
    },

    error_text: {
        fontWeight: '500',
        fontSize: 15,
        color: 'red',
        marginBottom: 10,
    },

    back_btn: {
        position: 'absolute',
        left: 20,
        top: -50,
    },
    login_header: {
        position: 'relative',
        width: '100%'
    },
    register_success_popup: {
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
    register_success_popup_wrapper: {
        width: '100%',
        paddingTop: 120,
        paddingBottom: 62,
        position: 'relative',
        paddingHorizontal: 30,
    },

    register_success_popup_icon: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40
    },
    register_success_popup_text: {
        fontWeight: '500',
        fontSize: 25,
        color: '#0080DE',
        marginBottom: 129,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    register_success_popup_login_btn: {
        width: '100%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        height: 44,
        backgroundColor: '#0080DE',
        borderRadius: 20,

    },
    register_success_popup_login_btn_text: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 18,
    },

    register_success_popup_close_btn: {
        position: 'absolute',
        right: 20,
        top: 60,
    },

});