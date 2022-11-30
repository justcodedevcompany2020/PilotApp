import {Text} from "react-native";
import React from "react";

const en = {
    login: 'Email as login',
    password: 'Password',
    registration: 'Registration',
    password_recovery: 'Password Recovery',
    rules: 'Rules',
    login_register: 'Login',
    register: 'Register',
    agree_text: 'I agree with the terms of use',
    password_recovery_page_text: 'A link to reset your password will be sent to your email. Follow the link in the email and set a new password. Then log in to the app.',
    new_password: 'New Password',
    old_password: 'Old Password',
    confirm_password: 'Confirm Password',
    verification_code: 'Verification Code',
    enter: 'Enter',
    confirm_password_success_info: 'You have successfully confirm your password!',
    registered_successfully: 'You have successfully registered!',
    error_email: 'Missing Required Email Field',
    invalid_password: 'Invalid Password',
    account_not_found: 'Account not found',
    password_must_be: 'The password must be at least 6 characters',
    missing_fields_error: 'Missing Required Fields',
    login_already_exists: 'Login already exists',
    verification_code_mismatch: 'Verification code mismatch',
    password_mismatch: 'Password mismatch',
    push_notifications: 'PUSH Notifications',
    time_zone: 'Time Zone',
    legal_information: 'Legal Information',
    delete_account: 'Delete account',
    delete: 'Delete',
    confirm: 'Confirm',
    settings: 'Settings',
    my_devices: 'My devices',
    add_a_new_device: 'Add a new device',
    manual: 'Manual',
    offline_setup: 'Offline Setup',
    save: 'Save',
    status: 'Status',
    online: 'Online',
    offline: 'Offline',
    consumption: 'Consumption',
    power: 'Power',
    power_protection: 'Power Protection',
    voltage: 'Voltage',
    amperage: 'Amperage',
    number_of_protection: 'Number of protection triggered',
    last_data: 'Last data',
    started_time: 'Started time',
    preferences: 'Preferences',
    pre_configuration: 'Pre-configuration',
    adding_new: 'Adding new',
    searching:'Searching',
    device_setup_page: 'Device setup page',
    device_setup: 'Device setup',
    add: 'Add',
    add_device_success_info: 'Your device has been successfully added!',
    first_device_connection: 'First Device Connection',
    step: 'Step',
    connect_the_device: 'Connect the device to the mains',
    wifi_connect: 'On your smartphone, search for available WI-FI networks. The PILOT_XXXX network should appear. (where XXXX are the last digits of the serial number). Connect to this open network',
    initial_setup: 'In the side menu of the application, click “Initial setup” or in the search section, click on the “Manual device setup” button or open the page http://192.1168.0 in a web browser.',
    no_wifi: 'If the network with the name PILOT_XXXX is no longer available and does not appear again within 60 seconds, then the device is configured correctly. You can return to your working Wi-Fi network.',
    wifi_available: 'If the PILOT_XXXX network is available for connection again, then repeat the steps from step 2. Make sure you enter the correct Wi-Fi network name and password.',
    add_device_to_an_account: 'Adding a device to an account',
    side_menu_info: 'In the side menu of the application, select "Add a new device"',
    same_wifi_info: 'If you are on the same Wi-Fi network as the device. then it should appear in the list of available connections. Just click the "Add" button',
    not_device: 'If the list does not include a device. then enter the serial number in the format AAAA:BBBB:CCCC which is printed on the box and on the device.',
    new_device_is_ready: 'The new device is ready to go. It is recommended to give a name to the new device.',
    not_listed_device: 'If the device is not listed, reset the device. To do this, hold the button on the body of the device for 10 seconds, and repeat the steps for the initial setup.',
    new_device_has_been_found: 'New device has been found!',
    make_device_settings: 'Make device settings',
    device_info: 'Device Information',
    setup_parameters: 'Setup parameters',
    wifi_access_name: 'WI-FI Access point name',
    wifi_password: 'WI-FI Password',
    upper_voltage_sec: 'Upper voltage delay (sec)',
    protection_upper_voltage_title: 'Protection upper voltage (V)',
    protection_lower_voltage_title: 'Protection lower voltage (V)',
    lower_voltage_delay_sec: 'Lower voltage delay (sec)',
    power_restore_delay_sec: 'Power restore delay (sec)',
    startup_delay_sec: 'Startup delay (sec)',
    current_protection_title: 'Current protection (A)',
    current_protection_delay: 'Current protection delay (sec)',
    use_schedule: 'Use schedule',
    week_days: 'Week days',
    turn_on_time: 'Turn-on time',
    turn_of_time: 'Turn-off time',
    shared_access: 'Shared access',
    unlink: 'Unlink',
    pre_configuration_popup_title: 'Recommended settings for optimal performance from the manufacturer',
    shared_access_popup_title: 'Share access with family members or colleagues so they can control this device',
    add_account: 'Add account',
    scheduler: 'Scheduler',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
    test_mode: 'Test mode',
    test_not_found: 'Test Not Found',
    scheduled:'Scheduled',
    in_progress: 'In progress',
    report: 'Report',
    oscilloscope: 'Oscilloscope',
    start_new_test: 'Start a new test',
    new_test_title: 'New test',
    start: 'Start',
    to: 'To',
    turn_off_the_load: 'Turn off the load?',
    schedule: 'Schedule',
    start_date: 'Start Date',
    to_date: 'To Date',
    attention: 'Attention!',
    turn_off_the_load_popup_info: 'Connected devices will be disconnected from the network during testing.',
    cancel: 'Cancel',
    ok: 'Ok',
    turn_on_the_load_popup_info: 'Connected devices may distort the test results. We recommend disconnecting the load during the power test',
    test_report: 'Test report',
    start_time: 'Start time',
    end_time: 'End time',
    undervoltage: 'Undervoltage',
    overvoltage: 'Overvoltage',
    power_outages: 'Power outages',
    impulse_surges: 'Impulse surges',
    stop_now: 'Stop now',
    total_duration: 'Total duration',
    peak_value: 'Peak value',
    limit: 'Limit',
    day: 'Day',
    week: 'Week',
    month: 'Month',
    minimum: 'Minimum',
    maximum: 'Maximum',
    incorrect_email: 'Incorrect email address',
    add_new: 'Add new',
    enter_device_number: 'Enter device number',




};

const ru = {
    login: 'Эл. адрес',
    password: 'Пароль',
    registration: 'Регистрация',
    password_recovery: 'Восстановление пароля',
    rules: 'Политика Конфиденциальности',
    login_register: 'Логин',
    register: 'Регистр',
    agree_text: 'Я согласен с условиями использования',
    password_recovery_page_text: 'Ссылка для сброса пароля будет отправлена ​​на вашу электронную почту. Перейдите по ссылке в письме и установите новый пароль. Затем войдите в приложение.',
    new_password: 'Новый пароль',
    old_password: 'Старый пароль',
    confirm_password: 'Подтвердить Пароль',
    verification_code: 'Код верификации',
    enter: 'Войти',
    confirm_password_success_info: 'Вы успешно подтвердили свой пароль!',
    registered_successfully: 'Вы успешно зарегистрировались!',
    error_email: 'Некорректный email, Логин не может быть пустым',
    invalid_password: 'Неверный пароль',
    account_not_found: 'Аккаунт не найден',
    password_must_be: 'Пароль должен быть не менее 6 символов',
    missing_fields_error: 'Отсутствуют обязательные поля',
    login_already_exists: 'Логин уже используется',
    verification_code_mismatch: 'Неправильный проверочный код',
    password_mismatch: 'Пароли не совпадают',
    push_notifications: 'PUSH Уведомление',
    time_zone: 'Часовой пояс',
    legal_information: 'Легальная информация',
    delete_account: 'Удалить аккаунт',
    delete: 'Удалить',
    confirm: 'Подтверждать',
    settings: 'Настройки',
    my_devices: 'Мои девайсы',
    add_a_new_device: 'Добавить новый девайс',
    manual: 'Руководство',
    offline_setup: 'Автономная настройка',
    save: 'Сохранять',
    status: 'Статус',
    online: 'Онлайн',
    offline: 'Оффлайн',
    consumption: 'Потребление',
    power: 'Мощность',
    voltage: 'Напряжение',
    amperage: 'Сила тока',
    number_of_protection: 'Количество сработавших защит',
    last_data: 'Последние данные',
    started_time: 'Время начала',
    preferences: 'Предпочтения',
    power_protection: 'Защита питания',
    pre_configuration: 'Предварительная конфигурация',
    adding_new: 'Добавление новых',
    searching:'Поиск',
    device_setup_page: 'Страница настройки устройства',
    add: 'Добавлять',
    add_device_success_info: 'Ваш девайс успешно добавлен!',
    first_device_connection: 'Первое подключение устройства',
    step: 'Шаг',
    connect_the_device: 'Подключите устройство к электросети',
    wifi_connect: 'На смартфоне выполните поиск доступных WI-FI сетей. Должна появиться сеть PILOT_XXXX. (где XXXX - последние цифры заводского номера). Подключитесь к этой открытой сети',
    initial_setup: 'В боковом меню приложения нажмите “Первичная настройка” или в разделе поиска, наюмите кнопку “Ручная настройка устройства” или откройте в веб браузере страницу http://192.1168.0.',
    no_wifi: 'Если сеть с именем PILOT_XXXX больше не доступна и не появилась снова в течении 60 секунд, Значит устройство настроено верно. Вы можете вернуться в вашу рабочую Wi-Fi сеть.',
    wifi_available: 'Если сеть PILOT_XXXX снова доступна для подключения, то повторите действия, начиная шага 2, Удостоверьтесь в том что вы указываете правильные имя Wi-Fi сети и пароль.',
    add_device_to_an_account: 'Добавление устройства к аккаунту',
    side_menu_info: 'В боковом меню приложения выберите пункт “Добавить новое устройство”',
    same_wifi_info: 'Если вы находитесь в одной Wi-Fi сети с устройством. то оно должно отобразиться в списке доступных для подключения. Достаточно нажать кнопку “Добавить”',
    not_device: 'Если в списке нет нужно устройства. то введите заводской номер в формате AAAA:BBBB:CCCC который напечатан на коробке и на устройтсве.',
    new_device_is_ready: 'Новое устройство готово к работе. Рекомендуется задать имя новому устройству.',
    not_listed_device: 'Если устройства нет в списке, выполните сброс устройства. Для этого удержите кнопку на корпусе естройства в течении 10 секунд, и повторите шаги по первичной настройке.',
    device_setup: 'Настройка устройства',
    new_device_has_been_found: 'Новое устройство найдено!',
    make_device_settings: 'Сделать настройки устройства',
    device_info: 'Информация об устройстве',
    setup_parameters: 'Параметры настройки',
    wifi_access_name: 'Имя точки доступа WI-FI',
    wifi_password: 'WI-FI Пароль',
    upper_voltage_sec: 'Задержка верхнего напряжения (сек)',
    protection_upper_voltage_title: 'Верхнее напряжение защиты (В)',
    protection_lower_voltage_title: 'Защита по нижнему напряжению (В)',
    lower_voltage_delay_sec: 'Задержка нижнего напряжения (сек)',
    power_restore_delay_sec: 'Задержка восстановления питания (сек)',
    startup_delay_sec: 'Задержка запуска (сек)',
    current_protection_title: 'Зашита по силе тока (А)',
    current_protection_delay: 'Задержка защиты по току (сек)',
    use_schedule: 'Использовать расписание',
    week_days: 'Будние дни',
    turn_on_time: 'Время включения',
    turn_of_time: 'Время выключения',
    shared_access: 'Общий доступ',
    unlink: 'Отключить',
    pre_configuration_popup_title: 'Рекомендуемые настройки для оптимальной работы от производителя',
    shared_access_popup_title: 'Предоставьте доступ членам семьи или коллегам, чтобы они могли управлять этим устройством.',
    add_account: 'Добавить аккаунт',
    scheduler: 'Планировщик',
    monday: 'Понедельник',
    tuesday: 'Вторник',
    wednesday: 'Среда',
    thursday: 'Четверг',
    friday: 'Пятница',
    saturday: 'Saturday',
    sunday: 'Воскресенье',
    test_mode: 'Режим тестирования',
    test_not_found: 'Тест не найден',
    scheduled: 'Запланированное',
    in_progress: 'In progress',
    report: 'Отчет',
    oscilloscope: 'Осциллограф',
    start_new_test: 'Начать новый тест',
    new_test_title: 'Новый тест',
    start: 'Начинать',
    to: 'К',
    turn_off_the_load: 'Выключать нагрузку?',
    schedule: 'Расписание',
    start_date: 'Дата начала',
    to_date: 'На сегодняшний день',
    attention: 'Внимание!',
    turn_off_the_load_popup_info: 'Подключенные устройства будут отключены от сети во время проведения тестирования.',
    cancel: 'Отмена',
    ok: 'Ok',
    turn_on_the_load_popup_info: 'Подключенные устройства могут исказить результаты теста. Рекомендуем отключить нагрузку во время проведения тестирования электросети',
    test_report: 'Отчет об испытаниях',
    start_time: 'Время начала',
    end_time: 'Время окончания',
    undervoltage: 'Пониженное напряжение',
    overvoltage: 'Перенапряжение',
    power_outages: 'Перебои в подаче электроэнергии',
    impulse_surges: 'Импульсные всплески',
    stop_now: 'Остановить сейчас',
    total_duration: 'Общая продолжительность',
    peak_value: 'Пиковое значение',
    limit: 'Ограничение',
    day: 'День',
    week: 'Неделя',
    month: 'Месяц',
    minimum: 'Минимум',
    maximum: 'Максимум',
    incorrect_email: 'Некорректный email',
    add_new: 'Добавить новое',
    enter_device_number: 'Введите номер устройства',

};




export { en, ru};

