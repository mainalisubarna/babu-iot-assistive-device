import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, Typography, Spacing, BorderRadius } from "../constants";
import { HomeScreen } from "./HomeScreen";
import { ProfileScreen } from "./ProfileScreen";
import ActivitiesScreen from "./ActivitiesScreen";
import FeaturesScreen from "./FeaturesScreen";

interface MainDashboardProps {
  initialLanguage?: "en" | "ne";
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  initialLanguage = "en",
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [language, setLanguage] = useState<"en" | "ne">(initialLanguage);

  const HomeComponent = () => <HomeScreen language={language} onNavigateToActivities={() => setActiveTab(1)} />;
  const ProfileScreenComponent = () => <ProfileScreen language={language} />;
  const ActivitiesComponent = () => <ActivitiesScreen language={language} />;
  const FeaturesComponent = () => <FeaturesScreen language={language} />;

  const tabs = [
    {
      id: 0,
      nameEn: "Home",
      nameNe: "घर",
      icon: "🏠",
      component: HomeComponent,
    },
    {
      id: 1,
      nameEn: "Activities",
      nameNe: "गतिविधिहरू",
      icon: "📊",
      component: ActivitiesComponent,
    },
    {
      id: 2,
      nameEn: "Features",
      nameNe: "सुविधाहरू",
      icon: "⚙️",
      component: FeaturesComponent,
    },
    {
      id: 3,
      nameEn: "Profile",
      nameNe: "प्रोफाइल",
      icon: "👤",
      component: ProfileScreenComponent,
    },
  ];

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ne" : "en");
  };

  const ActiveComponent = tabs[activeTab].component;

  return (
    <LinearGradient
      colors={[Colors.backgroundGradientTop, Colors.backgroundGradientBottom]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Language Toggle Only */}
        <View style={styles.header}>
          <View style={styles.spacer} />
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
        <View
          style={[styles.content, activeTab === 1 && styles.contentFullWidth]}
        >
          <ActiveComponent />
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomNavContainer}>
          <View style={styles.bottomNav}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabButton,
                  activeTab === tab.id && styles.tabButtonActive,
                ]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text
                  style={[
                    styles.tabIcon,
                    activeTab === tab.id && styles.tabIconActive,
                  ]}
                >
                  {tab.icon}
                </Text>
                <Text
                  style={[
                    styles.tabLabel,
                    activeTab === tab.id && styles.tabLabelActive,
                  ]}
                >
                  {language === "en" ? tab.nameEn : tab.nameNe}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Spacing.xxxl + Spacing.lg, // Much more space to avoid status bar overlap (32 + 16 = 48px)
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  spacer: {
    flex: 1,
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
    paddingHorizontal: Spacing.lg,
  },
  contentFullWidth: {
    paddingHorizontal: 0,
  },
  tabContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabTitle: {
    ...Typography.display,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    fontSize: 28,
  },
  tabSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  bottomNavContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.xs,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.button,
  },
  tabButtonActive: {
    backgroundColor: Colors.fab,
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 2,
    opacity: 0.6,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    ...Typography.caption,
    color: Colors.tabInactive,
    fontWeight: "500",
    fontSize: 11,
  },
  tabLabelActive: {
    color: Colors.fabIcon,
    fontWeight: "600",
  },
});
