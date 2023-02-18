import {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import styles from './style';
import {useFormik} from 'formik';
import * as yup from 'yup';

const WelcomeScreen = ({navigation}) => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [error, setError] = useState('');

  //sanitizing input values with yup
  const validationSchema = yup.object({
    pin: yup
      .string('Enter your pin')
      .min(5, 'Pin should be 5 characters')
      .required('Valid pin is required'),
  });

  const Login = (pin) => {
    // function that does check if entered value = hardcoded value
    setIsSubmit(true);
    setError('');
    if (String('00000') === String(pin)) {
      setIsSubmit(false);
      //navigating to next screen if it passes the check
      navigation.navigate('Home');
    } else {
      setError('Invalid pin entered');
      setIsSubmit(false);
    }
  };

  //define formik validation hook
  const formik = useFormik({
    initialValues: {
      pin: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => Login(values.pin),
  });

  //destructure formik for ease of use
  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    touched,
    isValid,
  } = formik;
  return (
    <SafeAreaView style={styles.container} testID='signInScreen'>
      <View style={styles.wrapper}>
        <Text style={styles.welcomeText}>Welcome back! lets get you in</Text>
        <TextInput
          name='pin'
          style={{
            ...styles.textInput,
            borderColor: errors.pin && touched.pin && '#FF3131',
            borderWidth: errors.pin && touched.pin && 1,
          }}
          placeholder='Enter pin'
          placeholderTextColor={'#B8BCC6'}
          onChangeText={handleChange('pin')}
          onBlur={handleBlur('pin')}
          value={values.pin}
          secureTextEntry
          keyboardType='numeric'
          returnKeyType='go'
          onSubmitEditing={handleSubmit}
          blurOnSubmit={true}
          testID='pin-input'
        />

        {/*
         * it should display formik errors and submit validation error
         */}

        <Text style={styles.errorMessage} testID='signInErrorMessage'>
          {errors.pin && touched.pin ? errors.pin : error || ''}
        </Text>
        <TouchableOpacity
          style={{
            ...styles.signInButton,
            backgroundColor: isValid && values.pin ? '#0089AF' : '#b3eeff',
          }}
          //   disabled={!isValid || !values.pin}
          onPress={handleSubmit}
        >
          {/*
           *When button is pressed it should setsubmit to hide text with indicator for user experience
           */}

          {isSubmit ? (
            <ActivityIndicator
              animating={true}
              color='#fff'
              size='small'
              style={styles.activityIndicator}
            />
          ) : (
            <Text
              style={{
                ...styles.signInButtonTxt,
                color: isValid && values.pin ? 'white' : '#0089af',
              }}
              data-test-id='login-button'
            >
              Continue
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default WelcomeScreen;
