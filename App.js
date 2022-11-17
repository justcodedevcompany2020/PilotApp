import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import * as React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();



import {AuthContext} from "./components/AuthContext/context";
import {StackActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


import LoginComponent from './components/auth_login/login';
import PasswordRecoveryComponent from './components/password_recovery/password_recovery';
import RegistrationComponent from './components/registration/registration';
import AllDevicesComponent from './components/all_devices/all_devices';
import AddingNewComponent from './components/adding_new/adding_new';
import DeviceSetupComponent from './components/device_setup/device_setup';
import DetailsGeneralPageComponent from './components/details_general_page/details_general_page';
import SettingsComponent from './components/settings/settings';
import TestModeComponent from './components/test_mode/test_mode';
import NewTestComponent from './components/new_test/new_test';
import PreferencesComponent from './components/preferences/preferences';
import PreConfigurationComponent from './components/pre_configuration/pre_configuration';
import SharedAccessComponent from './components/shared_access/shared_access';
import TestReportComponent from './components/test_report/test_report';
import ImpulseSurgesComponent from './components/impulse_ surges/impulse_ surges';
import UndervoltageComponent from './components/undervoltage/undervoltage';
import PowerOutagesComponent from './components/power_outages/power_outages';
import VoltageComponent from './components/voltage/voltage';
import ConsumptionComponent from './components/consumption/consumption';
import OsciloscopeComponent from './components/osciloscope/osciloscope';
import SetNewPasswordComponent from './components/set_new_password/set_new_password';
import ManualComponent from './components/manual/manual';





function LoginScreen({ navigation }) {
  return (
      <LoginComponent navigation={navigation}  />
  );
}
function PasswordRecoveryScreen({ navigation }) {
  return (
      <PasswordRecoveryComponent navigation={navigation}  />
  );
}
function RegistrationScreen({ navigation }) {
  return (
      <RegistrationComponent navigation={navigation}  />
  );
}
function AllDevicesScreen({ navigation }) {
  return (
      <AllDevicesComponent navigation={navigation}  />
  );
}
function AddingNewScreen({ navigation }) {
  return (
      <AddingNewComponent navigation={navigation}  />
  );
}
function DeviceSetupScreen({ navigation }) {
  return (
      <DeviceSetupComponent navigation={navigation}  />
  );
}
function DetailsGeneralPageScreen({route, navigation }) {
    const {params} = route.params
  return (
      <DetailsGeneralPageComponent id={params} navigation={navigation}  />
  );
}

function SettingsScreen({ navigation }) {
    return (
        <SettingsComponent navigation={navigation}  />
    );
}

function TestModeScreen({ route, navigation  }) {
    const {params} = route.params
    return (
        <TestModeComponent id={params}  navigation={navigation}  />
    );
}
function NewTestScreen({route, navigation }) {
    const {params} = route.params
    return (
        <NewTestComponent id={params}  navigation={navigation}  />
    );
}
function PreferencesScreen({route, navigation }) {
    const {params} = route.params
    return (
        <PreferencesComponent id={params} navigation={navigation}  />
    );
}
function PreConfigurationScreen({ navigation }) {
    return (
        <PreConfigurationComponent navigation={navigation}  />
    );
}
function SharedAccessScreen({ navigation }) {
    return (
        <SharedAccessComponent navigation={navigation}  />
    );
}

function TestReportScreen({route, navigation }) {
    const {params} = route.params
    return (
        <TestReportComponent id={params} navigation={navigation}  />
    );
}

function ImpulseSurgesScreen({ navigation }) {
    return (
        <ImpulseSurgesComponent navigation={navigation}  />
    );
}
function UndervoltageScreen({ navigation }) {
    return (
        <UndervoltageComponent navigation={navigation}  />
    );
}
function PowerOutagesScreen({ navigation }) {
    return (
        <PowerOutagesComponent navigation={navigation}  />
    );
}
function VoltageScreen({ navigation }) {
    return (
        <VoltageComponent navigation={navigation}  />
    );
}

function ConsumptionScreen({ navigation }) {
    return (
        <ConsumptionComponent navigation={navigation}  />
    );
}

function OsciloscopeScreen({ navigation }) {
    return (
        <OsciloscopeComponent navigation={navigation}  />
    );
}
function ManualScreen({ navigation }) {
    return (
        <ManualComponent navigation={navigation}  />
    );
}

function SetNewPasswordScreen({route, navigation }) {
    const {params} = route.params
    return (
        <SetNewPasswordComponent  email={params} navigation={navigation}  />
    );
}






export default function App() {
    const popAction = StackActions.pop(1);

    const [isLoading, setIsLoading] = React.useState(true);
    const [userToken, setUserToken] = React.useState(null);

    const initialLoginState = {
        isLoading: true,
        userToken: null,
    };

    const loginReducer = (prevState, action) => {
        switch (action.type) {
            case 'RETRIEVE_TOKEN':
                return {
                    ...prevState,
                    userToken: action.token,
                    isLoading: false,
                };
            case 'LOGIN':
                return {
                    ...prevState,
                    userToken: action.token,
                    isLoading: false,
                };
            case 'LOGOUT':
                return {
                    ...prevState,
                    userName: null,
                    userToken: null,
                    isLoading: false,
                };
            case 'REGISTER':
                return {
                    ...prevState,
                    userName: action.id,
                    userToken: action.token,
                    isLoading: false,
                };
        }
    };

    const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

    const authContext = React.useMemo(() => ({
        signIn: async (foundUser, callback) => {
            // setIsLoading(true);
            const userToken = String(foundUser.token);
            // const userEmail = foundUser.email;
            // const userId = String(foundUser.user_id);
            // setUserToken(userToken);

            //  console.log('AuthUser', foundUser);
            try {
                await AsyncStorage.setItem('userToken', userToken);
                // await AsyncStorage.setItem('userId', userId);
            } catch (e) {
                console.log(e);
            }
            dispatch({type: 'LOGIN',  token: userToken});
            callback();
        },
        signOut: async (callback) => {
            try {
                await AsyncStorage.removeItem('userToken');
                setIsLoading(false);

            } catch (e) {
                console.log(e);
            }
            dispatch({type: 'LOGOUT'});
            callback();
        },
        signUp: () => {
            // setIsLoading(false);
        }
    }), []);


    // Проверка при входе в приложение.

    React.useEffect(() => {
        setTimeout(async () => {
            // await AsyncStorage.removeItem('userToken', userToken);

            let userToken;
            userToken = null;
            try {
                userToken = await AsyncStorage.getItem('userToken');
                setIsLoading(false);

            } catch (e) {
                console.log(e);
            }
            dispatch({type: 'RETRIEVE_TOKEN', token: userToken});
        }, 1000);
    }, []);
    return (


        <AuthContext.Provider value={authContext}>
            <NavigationContainer>
                {loginState.userToken !== null ?
                    (
                        <Stack.Navigator
                            initialRouteName='Catalog'
                            screenOptions={{
                                headerShown: false
                            }}

                        >


                            <Stack.Screen name="AllDevices" component={AllDevicesScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />


                            <Stack.Screen name="AddingNew" component={AddingNewScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />



                            <Stack.Screen name="DeviceSetup" component={DeviceSetupScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />


                            <Stack.Screen name="DetailsGeneralPage" component={DetailsGeneralPageScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />

                            <Stack.Screen name="Settings" component={SettingsScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />

                            <Stack.Screen name="TestMode" component={TestModeScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />


                            <Stack.Screen name="NewTest" component={NewTestScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />

                            <Stack.Screen name="Preferences" component={PreferencesScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />

                            <Stack.Screen name="PreConfiguration" component={PreConfigurationScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />

                            <Stack.Screen name="SharedAccess" component={SharedAccessScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />

                            <Stack.Screen name="TestReport" component={TestReportScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />

                            <Stack.Screen name="ImpulseSurges" component={ImpulseSurgesScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />

                            <Stack.Screen name="Undervoltage" component={UndervoltageScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />

                            <Stack.Screen name="PowerOutages" component={PowerOutagesScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />

                            <Stack.Screen name="Voltage" component={VoltageScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />

                            <Stack.Screen name="Consumption" component={ConsumptionScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />

                            <Stack.Screen name="Osciloscope" component={OsciloscopeScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />

                            <Stack.Screen name="Manual" component={ManualScreen}
                                          options={({route}) => ({
                                              tabBarButton: () => null,
                                              tabBarStyle: {display: 'none'},
                                          })}
                            />






                        </Stack.Navigator>
                    )
                    :


                    <Stack.Navigator
                        initialRouteName='Login'
                        screenOptions={{
                            headerShown: false
                        }}

                    >



                        <Stack.Screen name="Login" component={LoginScreen}
                                      options={({route}) => ({
                                          tabBarButton: () => null,
                                          tabBarStyle: {display: 'none'},
                                      })}
                        />


                        <Stack.Screen name="PasswordRecovery" component={PasswordRecoveryScreen}
                                      options={({route}) => ({
                                          tabBarButton: () => null,
                                          tabBarStyle: {display: 'none'},
                                      })}
                        />

                        <Stack.Screen name="Registration" component={RegistrationScreen}
                                      options={({route}) => ({
                                          tabBarButton: () => null,
                                          tabBarStyle: {display: 'none'},
                                      })}
                        />


                        <Stack.Screen name="SetNewPassword" component={SetNewPasswordScreen}
                                      options={({route}) => ({
                                          tabBarButton: () => null,
                                          tabBarStyle: {display: 'none'},
                                      })}
                        />


                    </Stack.Navigator>
                }
            </NavigationContainer>
        </AuthContext.Provider>



    );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },



});
