import { Platform, NativeModules } from 'react-native';

export const DEVICE_LOCALE =
      (Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
        : NativeModules.I18nManager.localeIdentifier).replace('_', '-')

export const CHANNEL = Platform.select({
  ios: () => 'iOS',
  android: () => 'Android',
})();

export const DEFAULT_CONFIGURATION = {
  environment: 'test',
  clientKey: '{YOUR_CLIENT_KEY}',
  countryCode: 'NL',
  amount: {
    currency: 'EUR',
    value: 1000 // The amount value in minor units.
  },
  merchantAccount: '{YOUR_MERCHANT_ACCOUNT}',
  returnUrl: 'myapp://', // Only used for iOS
  dropin: {
    skipListWhenSinglePaymentMethod: true,
    // showPreselectedStoredPaymentMethod: false
  },
  card: {
    holderNameRequired: true,
    addressVisibility: `postalCode`
    // showStorePaymentField : false,
    // hideCvcStoredCard: true,
    // hideCvc: true,
  },
  applepay: {
    // merchantID: 'merchant.com.adyen.MY_MERCHANT_ID',
    // merchantName: 'MY_MERCHANT'
  },
  googlepay: {
  },
  style: {
    // TODO: add styling
  }
};

export const ENVIRONMENT = {
  apiKey:
    '{YOUR_DEMO_SERVER_API_KEY}',
  url: 'https://checkout-test.adyen.com/v67/',
};
