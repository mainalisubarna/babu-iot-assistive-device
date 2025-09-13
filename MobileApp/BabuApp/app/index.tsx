import React, { useState } from "react";
import { Text, View } from "react-native";
import { SplashScreen } from "../src/screens/SplashScreen";
import { OnboardingScreen } from "../src/screens/OnboardingScreen";
import { AccountSetupScreen } from "../src/screens/AccountSetupScreen";
import { DevicePairingScreen } from "../src/screens/DevicePairingScreen";
import { MainDashboard } from "../src/screens/MainDashboard";

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showAccountSetup, setShowAccountSetup] = useState(true);
  const [showDevicePairing, setShowDevicePairing] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "ne">("en");

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleOnboardingComplete = (language: "en" | "ne") => {
    setSelectedLanguage(language);
    setShowOnboarding(false);
  };

  const handleAccountSetupComplete = () => {
    setShowAccountSetup(false);
  };

  const handleDevicePairingComplete = () => {
    setShowDevicePairing(false);
  };

  const handleSignIn = () => {
    // For now, just go to main app (in real app, this would show sign-in screen)
    setShowAccountSetup(false);
  };

  const handleDirectToDashboard = () => {
    // Skip all screens and go directly to dashboard (for testing)
    setShowSplash(false);
    setShowOnboarding(false);
    setShowAccountSetup(false);
    setShowDevicePairing(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (showOnboarding) {
    return (
      <OnboardingScreen 
        onComplete={handleOnboardingComplete}
        onDirectToDashboard={handleDirectToDashboard}
      />
    );
  }

  if (showAccountSetup) {
    return (
      <AccountSetupScreen
        onComplete={handleAccountSetupComplete}
        onSignIn={handleSignIn}
        initialLanguage={selectedLanguage}
      />
    );
  }

  if (showDevicePairing) {
    return (
      <DevicePairingScreen
        onComplete={handleDevicePairingComplete}
        initialLanguage={selectedLanguage}
      />
    );
  }

  return <MainDashboard initialLanguage={selectedLanguage} />;
}
