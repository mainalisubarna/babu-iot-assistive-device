import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, Typography, Spacing, BorderRadius } from "../constants";

interface DevicePairingScreenProps {
  onComplete: () => void;
  initialLanguage?: "en" | "ne";
}

export const DevicePairingScreen: React.FC<DevicePairingScreenProps> = ({
  onComplete,
  initialLanguage = "en",
}) => {
  const [language, setLanguage] = useState<"en" | "ne">(initialLanguage);
  const [deviceId, setDeviceId] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ne" : "en");
  };

  const handleDevicePairing = () => {
    if (deviceId.trim().length < 6) {
      return; // Basic validation
    }

    setIsConnecting(true);

    // Mock device pairing process
    setTimeout(() => {
      setIsConnecting(false);
      setShowSetupModal(true);

      // Show success after setup process
      setTimeout(() => {
        setSetupComplete(true);
      }, 2000);
    }, 1500);
  };

  const handleGoToHome = () => {
    setShowSetupModal(false);
    onComplete();
  };

  const isValidDeviceId = deviceId.trim().length >= 6;

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
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>
              {language === "en"
                ? "Connect Your Babu Device"
                : "आफ्नो बाबु यन्त्र जडान गर्नुहोस्"}
            </Text>
            <Text style={styles.subtitle}>
              {language === "en"
                ? "Enter your device ID to pair with your Babu companion"
                : "आफ्नो बाबु साथीसँग जोड्न यन्त्र ID प्रविष्ट गर्नुहोस्"}
            </Text>
          </View>

          {/* Device ID Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>
              {language === "en" ? "Device ID" : "यन्त्र ID"}
            </Text>
            <TextInput
              style={styles.deviceInput}
              value={deviceId}
              onChangeText={setDeviceId}
              placeholder={
                language === "en"
                  ? "Enter device ID (e.g., BABU123456)"
                  : "यन्त्र ID प्रविष्ट गर्नुहोस् (जस्तै, BABU123456)"
              }
              placeholderTextColor={Colors.textSecondary}
              autoCapitalize="characters"
              maxLength={12}
            />
            <Text style={styles.inputHint}>
              {language === "en"
                ? "Find your device ID on the back of your Babu device"
                : "आफ्नो बाबु यन्त्रको पछाडि यन्त्र ID फेला पार्नुहोस्"}
            </Text>
          </View>

          {/* Connect Button */}
          <TouchableOpacity
            style={[
              styles.connectButton,
              !isValidDeviceId && styles.buttonDisabled,
              isConnecting && styles.buttonConnecting,
            ]}
            onPress={handleDevicePairing}
            disabled={!isValidDeviceId || isConnecting}
          >
            <Text style={styles.connectButtonText}>
              {isConnecting
                ? language === "en"
                  ? "Connecting..."
                  : "जडान गर्दै..."
                : language === "en"
                ? "Connect Device"
                : "यन्त्र जडान गर्नुहोस्"}
            </Text>
          </TouchableOpacity>

          {/* Help Section */}
          <View style={styles.helpSection}>
            <Text style={styles.helpTitle}>
              {language === "en" ? "Need Help?" : "सहायता चाहिन्छ?"}
            </Text>
            <Text style={styles.helpText}>
              {language === "en"
                ? "• Make sure your Babu device is powered on\n• Check that you're connected to WiFi\n• Device ID is usually 10-12 characters"
                : "• आफ्नो बाबु यन्त्र खुला छ भनी सुनिश्चित गर्नुहोस्\n• तपाईं WiFi मा जडान भएको जाँच गर्नुहोस्\n• यन्त्र ID सामान्यतया 10-12 अक्षरको हुन्छ"}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Setup Progress Modal */}
      <Modal visible={showSetupModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.setupCard}>
            {!setupComplete ? (
              // Setup in progress
              <>
                <View style={styles.setupIcon}>
                  <Text style={styles.setupIconText}>⚙️</Text>
                </View>
                <Text style={styles.setupTitle}>
                  {language === "en"
                    ? "Setting up your device..."
                    : "तपाईंको यन्त्र सेटअप गर्दै..."}
                </Text>
                <Text style={styles.setupMessage}>
                  {language === "en"
                    ? "Please wait while we configure your Babu device"
                    : "कृपया पर्खनुहोस् जब हामी तपाईंको बाबु यन्त्र कन्फिगर गर्छौं"}
                </Text>
                <View style={styles.loadingDots}>
                  <View style={[styles.dot, styles.dot1]} />
                  <View style={[styles.dot, styles.dot2]} />
                  <View style={[styles.dot, styles.dot3]} />
                </View>
              </>
            ) : (
              // Setup complete
              <>
                <View style={styles.successIcon}>
                  <Text style={styles.successIconText}>✓</Text>
                </View>
                <Text style={styles.successTitle}>
                  {language === "en"
                    ? "Device Paired Successfully!"
                    : "यन्त्र सफलतापूर्वक जोडियो!"}
                </Text>
                <Text style={styles.successMessage}>
                  {language === "en"
                    ? "Your Babu device is now connected and ready to use"
                    : "तपाईंको बाबु यन्त्र अब जडान भयो र प्रयोगको लागि तयार छ"}
                </Text>
                <TouchableOpacity
                  style={styles.goHomeButton}
                  onPress={handleGoToHome}
                >
                  <Text style={styles.goHomeButtonText}>
                    {language === "en" ? "Go to Home" : "घर जानुहोस्"}
                  </Text>
                </TouchableOpacity>
              </>
            )}
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
  titleSection: {
    alignItems: "center",
    marginBottom: Spacing.xxxl * 2,
  },
  title: {
    ...Typography.display,
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: Spacing.lg,
    fontSize: 28,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: Spacing.md,
  },
  inputSection: {
    marginBottom: Spacing.xxxl,
  },
  inputLabel: {
    ...Typography.body,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  deviceInput: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.input,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.divider,
    ...Typography.body,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  inputHint: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  connectButton: {
    backgroundColor: Colors.fab,
    borderRadius: BorderRadius.button,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xxxl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: Colors.divider,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonConnecting: {
    backgroundColor: Colors.textSecondary,
  },
  connectButtonText: {
    ...Typography.body,
    color: Colors.fabIcon,
    fontWeight: "600",
    textAlign: "center",
  },
  helpSection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  helpTitle: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  helpText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xxl,
  },
  setupCard: {
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
  setupIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.fab,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  setupIconText: {
    fontSize: 28,
  },
  setupTitle: {
    ...Typography.title,
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: Spacing.lg,
    fontSize: 20,
  },
  setupMessage: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  loadingDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.fab,
    marginHorizontal: 4,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
  // Success State Styles
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
    fontSize: 20,
  },
  successMessage: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: Spacing.xxxl,
  },
  goHomeButton: {
    backgroundColor: Colors.fab,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxxl,
    borderRadius: BorderRadius.button,
    minWidth: 140,
  },
  goHomeButtonText: {
    ...Typography.body,
    color: Colors.fabIcon,
    fontWeight: "600",
    textAlign: "center",
  },
});
