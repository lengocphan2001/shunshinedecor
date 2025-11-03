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
import { typography, spacing, useTheme } from '../../theme';
import { LanguageSwitcher, useLanguage } from '../../i18n';
import { loginApi } from '../../api/auth';
import { useAuth } from '../../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

interface LoginScreenProps {
  onLoginSuccess?: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const { colors } = useTheme();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorVisible, setErrorVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const styles = createStyles(colors);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const userData = await loginApi(username, password);
      
      // Update AuthContext with new user data
      // Backend returns { id: user._id, email, ... }
      if (userData) {
        // Map to ensure id field is correct
        const mappedUser = {
          id: userData._id?.toString() || userData.id?.toString() || '',
          email: userData.email || '',
          fullName: userData.fullName || '',
          role: userData.role || 'STAFF',
          isActive: userData.isActive !== false,
        };
        login(mappedUser);
        console.log('Login successful, user updated:', mappedUser.email, 'ID:', mappedUser.id);
      }
      
      onLoginSuccess?.();
    } catch (e: any) {
      const msg = e?.message || 'Login failed';
      console.log('Login error:', msg);
      setErrorMessage(msg);
      setErrorVisible(true);
    } finally { setLoading(false); }
  };

  return (
    <>
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
            <TouchableOpacity style={[styles.loginButton, loading && { opacity: 0.6 }]} onPress={handleLogin} disabled={loading}>
              <Text style={styles.loginButtonText}>{loading ? (t('common.loading') || 'Loading...') : t('auth.login')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Project Manager App by</Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
    
    {/* Error Modal */}
    {errorVisible && (
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{t('auth.login')}</Text>
          <Text style={styles.modalMessage}>{errorMessage}</Text>
          <TouchableOpacity style={styles.modalButton} onPress={() => setErrorVisible(false)}>
            <Text style={styles.modalButtonText}>{t('common.close') || 'Close'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )}
    </>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
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
    paddingVertical: spacing.xs,
    borderRadius: spacing.borderRadius.xs,
    transform: [{ rotate: '90deg' }],
  },
  brandText: {
    ...typography.styles.login.brand,
    color: colors.text.white,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    backgroundColor: colors.background || '#111',
    borderRadius: spacing.borderRadius.medium,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.login.inputBorder,
  },
  modalTitle: {
    ...typography.styles.displayMedium,
    color: colors.text.primary,
    marginBottom: spacing.md,
    fontSize: 20,
  },
  modalMessage: {
    ...typography.styles.textMedium,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
    fontSize: 16,
  },
  modalButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.login.buttonBackground,
    borderRadius: spacing.borderRadius.small,
    borderWidth: 1,
    borderColor: colors.login.inputBorder,
  },
  modalButtonText: {
    ...typography.styles.login.button,
    color: colors.text.primary,
    fontSize: 16,
  },
});
