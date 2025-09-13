import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, Typography, Spacing, BorderRadius } from "../constants";

interface AccountSetupScreenProps {
  onComplete: () => void;
  onSignIn: () => void;
  initialLanguage?: "en" | "ne";
}

export const AccountSetupScreen: React.FC<AccountSetupScreenProps> = ({
  onComplete,
  onSignIn,
  initialLanguage = "en",
}) => {
  const [language, setLanguage] = useState<"en" | "ne">(initialLanguage);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ne" : "en");
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);

    // Mock Google OAuth process
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccessPopup(true);
    }, 2000);
  };

  const handleSignIn = () => {
    onSignIn();
  };

  return (
    <LinearGradient
      colors={[Colors.backgroundGradientTop, Colors.backgroundGradientBottom]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header with Language Toggle */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={toggleLanguage}
            style={styles.languageToggle}
          >
            <Text style={styles.languageText}>
              {language === "en" ? "EN | ने" : "ने | EN"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Logo/Brand Section */}
          <View style={styles.brandSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>Babu</Text>
            </View>
            <Text style={styles.tagline}>
              {language === "en"
                ? "Your Voice, Your Care"
                : "तपाईंको आवाज, तपाईंको माया"}
            </Text>
          </View>

          {/* Welcome Text */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>
              {language === "en" ? "Welcome to Babu" : "बाबुमा स्वागत छ"}
            </Text>
            <Text style={styles.welcomeSubtitle}>
              {language === "en"
                ? "Create your account to get started with your personal care companion"
                : "आफ्नो व्यक्तिगत हेरचाह साथीसँग सुरु गर्न आफ्नो खाता सिर्जना गर्नुहोस्"}
            </Text>
          </View>

          {/* Google Sign Up Button */}
          <TouchableOpacity
            style={[styles.googleButton, isLoading && styles.buttonDisabled]}
            onPress={handleGoogleSignUp}
            disabled={isLoading}
          >
            <View style={styles.googleButtonContent}>
              {/* Google Logo */}
              <View style={styles.googleLogo}>
                <Image
                  source={require("../../assets/images/google.png")}
                  style={styles.googleLogoImage}
                />
              </View>
              <Text style={styles.googleButtonText}>
                {isLoading
                  ? language === "en"
                    ? "Creating Account..."
                    : "खाता सिर्जना गर्दै..."
                  : language === "en"
                  ? "Continue with Google"
                  : "Google सँग जारी राख्नुहोस्"}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Terms and Privacy */}
          <Text style={styles.termsText}>
            {language === "en"
              ? "By continuing, you agree to our Terms of Service and Privacy Policy"
              : "जारी राखेर, तपाईं हाम्रो सेवाका सर्तहरू र गोपनीयता नीतिमा सहमत हुनुहुन्छ"}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {language === "en"
              ? "Already have an account?"
              : "पहिले नै खाता छ?"}
          </Text>
          <TouchableOpacity onPress={handleSignIn} style={styles.signInButton}>
            <Text style={styles.signInButtonText}>
              {language === "en" ? "Sign In" : "साइन इन गर्नुहोस्"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Success Popup Modal */}
      <Modal
        visible={showSuccessPopup}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessPopup(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIcon}>
              <Text style={styles.successIconText}>✓</Text>
            </View>
            <Text style={styles.successTitle}>
              {language === "en" ? "Success!" : "सफल!"}
            </Text>
            <Text style={styles.successMessage}>
              {language === "en"
                ? "Account created successfully! Welcome to Babu."
                : "खाता सफलतापूर्वक सिर्जना गरियो! बाबुमा स्वागत छ।"}
            </Text>
            <TouchableOpacity
              style={styles.successButton}
              onPress={() => {
                setShowSuccessPopup(false);
                onComplete();
              }}
            >
              <Text style={styles.successButtonText}>
                {language === "en" ? "Continue" : "जारी राख्नुहोस्"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingTop: Spacing.xxxl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    alignItems: "flex-end",
  },
  languageToggle: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.chip,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  languageText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xxl,
    justifyContent: "center",
  },
  brandSection: {
    alignItems: "center",
    marginBottom: Spacing.xxxl * 2,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.fab,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoText: {
    ...Typography.title,
    color: Colors.fabIcon,
    fontWeight: "bold",
    fontSize: 24,
  },
  tagline: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  welcomeSection: {
    alignItems: "center",
    marginBottom: Spacing.xxxl * 2,
  },
  welcomeTitle: {
    ...Typography.display,
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: Spacing.lg,
    fontSize: 28,
  },
  welcomeSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: Spacing.md,
  },
  googleButton: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.button,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  googleButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  googleLogo: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  googleLogoImage: {
    width: 20,
    height: 20,
    borderRadius: 4,
    resizeMode: "contain",
  },
  googleButtonText: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: "600",
  },
  termsText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: Spacing.lg,
  },
  footer: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xl,
    alignItems: "center",
  },
  footerText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  signInButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  signInButtonText: {
    ...Typography.body,
    color: Colors.fab,
    fontWeight: "600",
  },
  // Success Popup Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xxl,
  },
  successCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.xxl,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    maxWidth: 320,
    width: "100%",
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#16A34A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  successIconText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
  },
  successTitle: {
    ...Typography.title,
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: Spacing.lg,
    fontSize: 24,
  },
  successMessage: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: Spacing.xxxl,
  },
  successButton: {
    backgroundColor: Colors.fab,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxxl,
    borderRadius: BorderRadius.button,
    minWidth: 140,
  },
  successButtonText: {
    ...Typography.body,
    color: Colors.fabIcon,
    fontWeight: "600",
    textAlign: "center",
  },
});
