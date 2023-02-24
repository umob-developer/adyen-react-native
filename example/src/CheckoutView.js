import React, { useEffect } from 'react';
import { AdyenCheckout, ERROR_CODE_CANCELED } from '@adyen/react-native';
import { fetchPayments, fetchPaymentDetails, isSuccess } from './APIClient';
import { SafeAreaView, StyleSheet, Text, View, Alert } from 'react-native';
import { usePaymentMethods } from './PaymentMethodsProvider';
import PaymentMethods from './PaymentMethodsView';

const styles = StyleSheet.create({
  topContentView: {
    alignItems: 'center',
    borderRadius: 5,
    justifyContent: 'center',
    padding: 16,
  },
});

function getFlagEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const CheckoutView = ({ navigation }) => {
  const { config, paymentMethods, refreshPaymentMethods } = usePaymentMethods();

  useEffect(() => {
    refreshPaymentMethods();
  }, []);

  const didSubmit = (data, nativeComponent, configuration) => {
    console.log(`didSubmit: ${data.paymentMethod.type}`);
    fetchPayments(data, configuration)
      .then((result) => {
        if (result.action) {
          console.log('Action!');
          nativeComponent.handle(result.action);
        } else {
          proccessResult(result, nativeComponent);
        }
      })
      .catch((error) => proccessError(error, nativeComponent));
  };

  const didProvide = (data, nativeComponent) => {
    console.log('didProvide');
    fetchPaymentDetails(data)
      .then((result) => proccessResult(result, nativeComponent))
      .catch((error) => proccessError(error, nativeComponent));
  };

  const didComplete = (nativeComponent) => {
    console.log('didComplete');
    nativeComponent.hide(true, { message: 'Completed' });
  };

  const didFail = (error, nativeComponent) => {
    console.log(`didFailed: ${error.message}`);
    proccessError(error, nativeComponent);
  };

  const proccessResult = (result, nativeComponent) => {
    let success = isSuccess(result);
    console.log(
      `Payment: ${success ? 'success' : 'failure'} : ${result.resultCode}`
    );
    nativeComponent.hide(success, { message: result.resultCode });
    navigation.popToTop();
    navigation.push('Result', { result: result.resultCode });
  };

  const proccessError = (error, nativeComponent) => {
    nativeComponent.hide(false, { message: error.message || 'Unknown error' });
    if (error.errorCode == ERROR_CODE_CANCELED) {
      Alert.alert('Canceled');
    } else {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={[{ flex: 1 }]}>
      <PaymentMethodsView config={config} paymentMethods={paymentMethods} />
      <AdyenCheckout
        config={config}
        paymentMethods={paymentMethods}
        onSubmit={(payload, nativeComponent) => {
          didSubmit(payload, nativeComponent, config);
        }}
        onProvide={didProvide}
        onFail={didFail}
        onComplete={didComplete}
      >
        <PaymentMethods />
      </AdyenCheckout>
    </SafeAreaView>
  );
};

const PaymentMethodsView = ({ paymentMethods, config }) => {
  return (
    <View style={[styles.topContentView]}>
      {paymentMethods ? (
        <Text style={{ textAlign: 'center' }}>
          {`${config.amount.value} ${config.amount.currency}`}
          {'\n'}
          Country: {getFlagEmoji(config.countryCode)}
        </Text>
      ) : (
        <Text>No PaymentMethods</Text>
      )}
    </View>
  );
};

export default CheckoutView;
