import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, Typography, Spacing, BorderRadius } from "../constants";

const { width: screenWidth } = Dimensions.get("window");

interface OnboardingScreenProps {
  onComplete: (language: 'en' | 'ne') => void;
  onDirectToDashboard?: () => void;
}

interface OnboardingSlide {
  titleEn: string;
  titleNe: string;
  descriptionEn: string;
  descriptionNe: string;
  illustration: string; // For now, we'll use text placeholders
  image?: any; // Optional image for slides
}

const onboardingData: OnboardingSlide[] = [
  {
    titleEn: "Never Miss a Dose or Date",
    titleNe: "मिति र औषधि कहिल्यै नबिर्सनुहोस्",
    descriptionEn:
      "Babu reminds you of your medicines according to your schedule and also remembers important dates and tasks.",
    descriptionNe:
      "बाबुले समय तालिका अनुसार औषधि सम्झाउँछ र महत्वपूर्ण मिति र काम पनि सम्झाइदिन्छ।",
    illustration: "💊🏥⏰🔊",
    image: require("../../assets/images/firstimage.png"),
  },
  {
    titleEn: "Document Reading",
    titleNe: "कागजात पढ्ने",
    descriptionEn: "Babu reads English documents aloud in Nepali.",
    descriptionNe: "बाबुले अंग्रेजी कागजातहरू नेपालीमा ठूलो स्वरमा पढ्छ।",
    illustration: "📃🗣️",
    image: require("../../assets/images/secondimage.png"),
  },
  {
    titleEn: "Fall Detection",
    titleNe: "खसेको पत्ता लगाउने",
    descriptionEn: "Babu alerts family instantly in emergencies.",
    descriptionNe: "बाबुले आपतकालमा परिवारलाई तुरुन्त सचेत गराउँछ।",
    illustration: "🩼",
    image: require("../../assets/images/thirdimage.png"),
  },
  {
    titleEn: "Voice Companion",
    titleNe: "आवाज साथी",
    descriptionEn: "Babu gives news, राशिफल, calendar updates, and more.",
    descriptionNe:
      "बाबुले समाचार, राशिफल, क्यालेन्डर अपडेट, र थप जानकारी दिन्छ।",
    illustration: "🗣️📰🌟📅",
    image: require("../../assets/images/fourthimage.png"),
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onComplete,
  onDirectToDashboard,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [language, setLanguage] = useState<"en" | "ne">("en");
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(
      event.nativeEvent.contentOffset.x / screenWidth
    );
    setCurrentSlide(slideIndex);
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ne" : "en");
  };

  const handleSkip = () => {
    onComplete(language);
  };

  const handleGetStarted = () => {
    onComplete(language);
  };

  const goToSlide = (index: number) => {
    scrollViewRef.current?.scrollTo({ x: index * screenWidth, animated: true });
    setCurrentSlide(index);
  };

  return (
    <LinearGradient
      colors={[Colors.backgroundGradientTop, Colors.backgroundGradientBottom]}
      style={styles.container}
    >
      {/* Header with Language Toggle and Skip */}
      <View style={styles.header}>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={toggleLanguage}
            style={styles.languageToggle}
          >
            <Text style={styles.languageText}>
              {language === "en" ? "EN | ने" : "ने | EN"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>
              {language === "en" ? "Skip" : "छोड्नुहोस्"}
            </Text>
          </TouchableOpacity>
          {onDirectToDashboard && (
            <TouchableOpacity onPress={onDirectToDashboard} style={styles.testButton}>
              <Text style={styles.testButtonText}>A</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
      >
        {onboardingData.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <View style={styles.slideContent}>
              {/* Illustration Placeholder */}
              <View style={styles.illustrationContainer}>
                {slide.image ? (
                  <Image
                    source={slide.image}
                    style={styles.illustrationImage}
                  />
                ) : (
                  <Text style={styles.illustration}>{slide.illustration}</Text>
                )}
              </View>

              {/* Title */}
              <Text style={styles.title}>
                {language === "en" ? slide.titleEn : slide.titleNe}
              </Text>

              {/* Description */}
              <Text style={styles.description}>
                {language === "en" ? slide.descriptionEn : slide.descriptionNe}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Progress Dots */}
      <View style={styles.progressContainer}>
        {onboardingData.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => goToSlide(index)}
            style={[
              styles.progressDot,
              currentSlide === index && styles.progressDotActive,
            ]}
          />
        ))}
      </View>

      {/* Get Started Button (only on last slide) */}
      {currentSlide === onboardingData.length - 1 && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleGetStarted}
            style={styles.getStartedButton}
          >
            <Text style={styles.getStartedText}>
              {language === "en" ? "Get Started" : "सुरु गर्नुहोस्"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerRight: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: Spacing.lg,
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
  skipButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  skipText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  testButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.fab,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: Spacing.sm,
  },
  testButtonText: {
    color: Colors.fabIcon,
    fontWeight: "bold",
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: screenWidth,
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xxxl * 1.8, // Increased top padding to bring content further down
  },
  slideContent: {
    alignItems: "center",
    maxWidth: 320,
  },
  illustrationContainer: {
    width: 320,
    height: 240,
    borderRadius: BorderRadius.card,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xxxl * 1.5, // Increased spacing between image and text
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
    overflow: "hidden", // Ensures image respects border radius
  },
  illustration: {
    fontSize: 40,
    textAlign: "center",
  },
  illustrationImage: {
    width: "100%",
    height: "100%",
    borderRadius: BorderRadius.card,
    resizeMode: "cover", // Ensures proper fitting while maintaining aspect ratio
  },
  title: {
    ...Typography.title,
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: Spacing.xl, // Increased spacing between title and description
    marginTop: Spacing.lg, // Added top margin to push text further down
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 26, // Increased line height for better readability
    marginBottom: Spacing.xl, // Added bottom margin for more spacing
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.divider,
  },
  progressDotActive: {
    backgroundColor: Colors.textPrimary,
    width: 24,
    borderRadius: 12,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: 50,
  },
  getStartedButton: {
    backgroundColor: Colors.fab,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.button,
    alignItems: "center",
  },
  getStartedText: {
    ...Typography.body,
    color: Colors.fabIcon,
    fontWeight: "600",
  },
});
