import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Colors, Typography } from '../constants';
import MedicineManagementScreen from './MedicineManagementScreen';
import CallContactsScreen from './CallContactsScreen';
import CompanionToolsScreen from './CompanionToolsScreen';
import GeneralReminderScreen from './GeneralReminderScreen';

interface FeaturesScreenProps {
  language?: 'en' | 'ne';
}

const FeaturesScreen: React.FC<FeaturesScreenProps> = ({ language = 'en' }) => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const translate = (key: string, fallback: string) => {
    if (language === 'en') return fallback;
    
    const nepaliTranslations: { [key: string]: string } = {
      'features': 'सुविधाहरू',
      'manageFeatures': 'तपाईंको बाबु यन्त्रका सुविधाहरू व्यवस्थापन गर्नुहोस्',
      'recentActivity': 'हालको गतिविधि',
      'manage': 'व्यवस्थापन गर्नुहोस्',
      'viewAll': 'सबै हेर्नुहोस्',
      'quickStats': 'छिटो तथ्याङ्क',
      'medicines': 'औषधिहरू',
      'contacts': 'सम्पर्कहरू',
      'documents': 'कागजातहरू',
    };
    return nepaliTranslations[key] || fallback;
  };

  const handleFeaturePress = (featureId: string) => {
    setSelectedFeature(featureId);
  };

  const handleBackToFeatures = () => {
    setSelectedFeature(null);
  };

  // Render individual feature screens
  if (selectedFeature === 'medicine') {
    return <MedicineManagementScreen language={language} onBack={handleBackToFeatures} />;
  }
  
  if (selectedFeature === 'general') {
    return <GeneralReminderScreen language={language} onBack={handleBackToFeatures} />;
  }
  
  if (selectedFeature === 'call') {
    return <CallContactsScreen language={language} onBack={handleBackToFeatures} />;
  }
  
  if (selectedFeature === 'companion') {
    return <CompanionToolsScreen language={language} onBack={handleBackToFeatures} />;
  }

  const features = [
    {
      id: 'medicine',
      icon: '💊',
      titleEn: 'Medicine Reminders',
      titleNe: 'औषधि सम्झना',
      subtitleEn: 'Manage daily medications & schedules',
      subtitleNe: 'दैनिक औषधिहरू र समयतालिका व्यवस्थापन',
      color: Colors.success,
      count: 4,
      recentActivity: 'Aspirin taken 2 hours ago',
    },
    {
      id: 'general',
      icon: '🔔',
      titleEn: 'General Reminder & Memory',
      titleNe: 'सामान्य सम्झना र स्मृति',
      subtitleEn: 'Daily tasks and important dates',
      subtitleNe: 'दैनिक कार्यहरू र महत्वपूर्ण मितिहरू',
      color: Colors.warning,
      count: 6,
      recentActivity: 'Morning walk reminder set',
    },
    {
      id: 'call',
      icon: '📞',
      titleEn: 'Quick Call',
      titleNe: 'छिटो फोन',
      subtitleEn: 'Manage contacts & voice calling',
      subtitleNe: 'सम्पर्कहरू र आवाज कल व्यवस्थापन',
      color: Colors.textPrimary,
      count: 8,
      recentActivity: 'Called daughter 3 hours ago',
    },
    {
      id: 'companion',
      icon: '🗣️',
      titleEn: 'Voice Companion',
      titleNe: 'आवाज साथी',
      subtitleEn: 'Daily info, calendar & राशिफल',
      subtitleNe: 'दैनिक जानकारी, पात्रो र राशिफल',
      color: Colors.textSecondary,
      count: 0,
      recentActivity: 'Asked about weather 30 min ago',
    },
  ];

  const renderFeatureCard = (feature: any) => {
    return (
      <TouchableOpacity
        key={feature.id}
        style={styles.featureCard}
        onPress={() => handleFeaturePress(feature.id)}
      >
        <View style={styles.featureHeader}>
          <View style={[styles.featureIconContainer, { backgroundColor: feature.color + '20' }]}>
            <Text style={styles.featureIcon}>{feature.icon}</Text>
          </View>
          
          <View style={styles.featureContent}>
            <View style={styles.featureTitleRow}>
              <Text style={styles.featureTitle}>
                {language === 'en' ? feature.titleEn : feature.titleNe}
              </Text>
              {feature.count > 0 && (
                <View style={[styles.countBadge, { backgroundColor: feature.color }]}>
                  <Text style={styles.countText}>{feature.count}</Text>
                </View>
              )}
            </View>
            <Text style={styles.featureSubtitle}>
              {language === 'en' ? feature.subtitleEn : feature.subtitleNe}
            </Text>
          </View>
          
          <View style={styles.featureArrow}>
            <Text style={styles.arrowText}>›</Text>
          </View>
        </View>
        
        {feature.recentActivity && (
          <View style={styles.recentActivity}>
            <Text style={styles.recentActivityLabel}>
              {translate('recentActivity', 'Recent Activity')}:
            </Text>
            <Text style={styles.recentActivityText}>{feature.recentActivity}</Text>
          </View>
        )}
        
        <View style={styles.featureActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.manageButton, { backgroundColor: feature.color }]}
            onPress={() => handleFeaturePress(feature.id)}
          >
            <Text style={[styles.actionButtonText, styles.manageButtonText]}>
              {translate('manage', 'Manage')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.viewButton]}
            onPress={() => handleFeaturePress(feature.id)}
          >
            <Text style={styles.viewButtonText}>
              {translate('viewAll', 'View All')}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {translate('features', 'Features')}
        </Text>
        <Text style={styles.subtitle}>
          {translate('manageFeatures', 'Manage your Babu device features')}
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.featuresGrid}>
          {features.map(renderFeatureCard)}
        </View>
        
        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>
            {translate('quickStats', 'Quick Stats')}
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>4</Text>
              <Text style={styles.statLabel}>
                {translate('medicines', 'Medicines')}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>
                {translate('contacts', 'Contacts')}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>6</Text>
              <Text style={styles.statLabel}>
                {language === 'ne' ? 'सम्झना र स्मृति' : 'Reminders'}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>
            {language === 'ne' ? 'सुविधाहरूको बारेमा' : 'About Features'}
          </Text>
          <Text style={styles.infoText}>
            {language === 'ne' 
              ? 'यी सुविधाहरू तपाईंको बाबु यन्त्रमा उपलब्ध छन्। प्रत्येक सुविधा तपाईंको दैनिक जीवनलाई सजिलो बनाउन डिजाइन गरिएको छ।'
              : 'These features are available on your Babu device. Each feature is designed to make your daily life easier and safer.'
            }
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGradientTop,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: Typography.display.fontSize,
    fontWeight: Typography.display.fontWeight as any,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: Typography.body.fontSize,
    color: Colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  featuresGrid: {
    paddingHorizontal: 16,
  },
  featureCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureIcon: {
    fontSize: 26,
  },
  featureContent: {
    flex: 1,
  },
  featureTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  featureTitle: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  countText: {
    fontSize: Typography.caption.fontSize,
    fontWeight: '600',
    color: Colors.surface,
  },
  featureSubtitle: {
    fontSize: Typography.caption.fontSize,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  featureArrow: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 20,
    color: Colors.textSecondary,
    fontWeight: '300',
  },
  recentActivity: {
    backgroundColor: Colors.backgroundGradientTop,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  recentActivityLabel: {
    fontSize: Typography.caption.fontSize,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  recentActivityText: {
    fontSize: Typography.caption.fontSize,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  featureActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: Typography.caption.fontSize,
    fontWeight: '600',
  },
  manageButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  manageButtonText: {
    color: Colors.surface,
  },
  viewButton: {
    backgroundColor: Colors.border,
  },
  viewButtonText: {
    fontSize: Typography.caption.fontSize,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  statsSection: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.success,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: Typography.caption.fontSize,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    margin: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  infoTitle: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: Typography.caption.fontSize,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});

export default FeaturesScreen;