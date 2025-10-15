import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, typography, spacing } from '../../theme';
import { LanguageSwitcher, useLanguage } from '../../i18n';

const { width, height } = Dimensions.get('window');

interface LoginScreenProps {
  onLoginSuccess?: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Handle login logic here
    console.log('Login attempt:', { username, password });
    // For demo purposes, navigate to home after login
    onLoginSuccess?.();
  };

  return (
    <ImageBackground 
      source={require('../../../assets/background.jpg')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        {/* Language selector in top right */}
        <View style={styles.languageContainer}>
          <LanguageSwitcher variant="button" />
        </View>

        {/* Main content container */}
        <View style={styles.contentContainer}>
          {/* App Logo */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../../assets/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            {/* Username Input */}
            <TextInput
              style={styles.inputField}
              placeholder={t('auth.email')}
              placeholderTextColor={colors.text.secondary}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Password Input */}
            <TextInput
              style={styles.inputField}
              placeholder={t('auth.password')}
              placeholderTextColor={colors.text.secondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>{t('auth.login')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Project Manager App by</Text>
          <View style={styles.brandLogo}>
            <Text style={styles.brandText}>SUN SHINE</Text>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  languageContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  languageText: {
    ...typography.styles.login.language,
    color: colors.login.languageText,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl * 1.5,
  },
  logoContainer: {
    marginBottom: spacing.xxl * 2,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  inputField: {
    width: '100%',
    height: 50,
    backgroundColor: colors.login.inputBackground,
    borderRadius: spacing.borderRadius.medium,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...typography.styles.login.input,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.login.inputBorder,
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: colors.login.buttonBackground,
    borderRadius: spacing.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.login.inputBorder,
  },
  loginButtonText: {
    ...typography.styles.login.button,
    color: colors.text.primary,
  },
  footerContainer: {
    position: 'absolute',
    bottom: spacing.xl * 1.5,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: spacing.md,
  },
  footerText: {
    ...typography.styles.login.footer,
    color: colors.login.footerText,
    marginBottom: spacing.sm,
    transform: [{ rotate: '90deg' }],
    writingDirection: 'rtl',
  },
  brandLogo: {
    backgroundColor: colors.login.brandBackground,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.borderRadius.xs,
  },
  brandText: {
    ...typography.styles.login.brand,
    color: colors.text.white,
  },
});
