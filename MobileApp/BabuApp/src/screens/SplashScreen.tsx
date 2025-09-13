import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, Typography, Spacing } from "../constants";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Auto-transition after 2 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, onComplete]);

  return (
    <LinearGradient
      colors={[Colors.backgroundGradientTop, Colors.backgroundGradientBottom]}
      style={styles.container}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Babu Logo */}
        <View style={styles.logo}>
          <Image
            source={require("../../assets/images/logobgless.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Bilingual tagline */}
        <View style={styles.taglineContainer}>
          <Text style={styles.taglineEn}>Your Voice, Your Care</Text>
          <Text style={styles.taglineNe}>तपाईँको आवाज, बाबुको हेरचाह</Text>
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  logo: {
    marginBottom: Spacing.xxxl,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  taglineContainer: {
    alignItems: "center",
    gap: Spacing.sm,
  },
  taglineEn: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  taglineNe: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
    fontSize: 14,
  },
});
