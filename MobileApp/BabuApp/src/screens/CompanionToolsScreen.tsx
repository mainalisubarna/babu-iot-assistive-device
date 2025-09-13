import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Colors, Typography } from '../constants';
import { translate } from '../utils/translations';

interface CompanionToolsScreenProps {
  language?: 'en' | 'ne';
  onBack?: () => void;
}

interface CompanionTool {
  id: string;
  type: 'calendar' | 'horoscope' | 'news' | 'weather' | 'reminder';
  title: string;
  description: string;
  isEnabled: boolean;
  lastUsed?: string;
}

const CompanionToolsScreen: React.FC<CompanionToolsScreenProps> = ({ 
  language = 'en', 
  onBack 
}) => {
  const [tools, setTools] = useState<CompanionTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState<CompanionTool | null>(null);

  // Mock companion tools data
  const mockTools: CompanionTool[] = [
    {
      id: '1',
      type: 'calendar',
      title: language === 'ne' ? 'नेपाली पात्रो' : 'Nepali Calendar',
      description: language === 'ne' ? 'आजको मिति र चाडपर्वहरू' : 'Today\'s date and festivals',
      isEnabled: true,
      lastUsed: '2 hours ago',
    },
    {
      id: '2',
      type: 'horoscope',
      title: language === 'ne' ? 'राशिफल' : 'Horoscope',
      description: language === 'ne' ? 'दैनिक राशिफल र भविष्यवाणी' : 'Daily horoscope and predictions',
      isEnabled: true,
      lastUsed: '1 day ago',
    },
    {
      id: '3',
      type: 'news',
      title: language === 'ne' ? 'समाचार' : 'News',
      description: language === 'ne' ? 'दैनिक समाचार र अपडेटहरू' : 'Daily news and updates',
      isEnabled: false,
      lastUsed: '3 days ago',
    },
    {
      id: '4',
      type: 'weather',
      title: language === 'ne' ? 'मौसम' : 'Weather',
      description: language === 'ne' ? 'आजको मौसम र पूर्वानुमान' : 'Today\'s weather and forecast',
      isEnabled: true,
      lastUsed: '30 minutes ago',
    },
    {
      id: '5',
      type: 'reminder',
      title: language === 'ne' ? 'व्यक्तिगत सम्झना' : 'Personal Reminders',
      description: language === 'ne' ? 'दैनिक कार्यहरूको सम्झना' : 'Daily task reminders',
      isEnabled: true,
      lastUsed: '4 hours ago',
    },
  ];

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setTools(mockTools);
    } catch (error) {
      Alert.alert(
        translate('error', 'Error', language),
        'Failed to load companion tools'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToolPress = (tool: CompanionTool) => {
    setSelectedTool(tool);
    
    switch (tool.type) {
      case 'calendar':
        Alert.alert(
          tool.title,
          language === 'ne' 
            ? 'आज: २०८१ कार्तिक १५ गते, शुक्रबार\nचाडपर्व: तिहार नजिकै आउँदैछ'
            : 'Today: Kartik 15, 2081, Friday\nFestival: Tihar is approaching',
          [{ text: 'OK', onPress: () => setSelectedTool(null) }]
        );
        break;
      case 'horoscope':
        Alert.alert(
          tool.title,
          language === 'ne' 
            ? 'आजको राशिफल: आज तपाईंको दिन राम्रो हुनेछ। स्वास्थ्यमा ध्यान दिनुहोस्।'
            : 'Today\'s Horoscope: Your day will be good. Pay attention to your health.',
          [{ text: 'OK', onPress: () => setSelectedTool(null) }]
        );
        break;
      case 'weather':
        Alert.alert(
          tool.title,
          language === 'ne' 
            ? 'आजको मौसम: २३°C, आंशिक बादल\nभोलि: २५°C, घाम'
            : 'Today\'s Weather: 23°C, Partly Cloudy\nTomorrow: 25°C, Sunny',
          [{ text: 'OK', onPress: () => setSelectedTool(null) }]
        );
        break;
      case 'news':
        Alert.alert(
          tool.title,
          language === 'ne' 
            ? 'समाचार सुविधा अहिले उपलब्ध छैन।'
            : 'News feature is currently not available.',
          [{ text: 'OK', onPress: () => setSelectedTool(null) }]
        );
        break;
      case 'reminder':
        setShowAddModal(true);
        break;
    }
  };

  const toggleTool = (toolId: string) => {
    setTools(prev => prev.map(tool => 
      tool.id === toolId 
        ? { ...tool, isEnabled: !tool.isEnabled }
        : tool
    ));
  };

  const getToolIcon = (type: string) => {
    switch (type) {
      case 'calendar': return '📅';
      case 'horoscope': return '🔮';
      case 'news': return '📰';
      case 'weather': return '🌤️';
      case 'reminder': return '⏰';
      default: return '🗣️';
    }
  };

  const renderToolCard = (tool: CompanionTool) => {
    return (
      <View key={tool.id} style={styles.toolCard}>
        <View style={styles.toolHeader}>
          <View style={styles.toolInfo}>
            <View style={[styles.toolIconContainer, { opacity: tool.isEnabled ? 1 : 0.5 }]}>
              <Text style={styles.toolIcon}>{getToolIcon(tool.type)}</Text>
            </View>
            <View style={styles.toolDetails}>
              <Text style={[styles.toolTitle, { opacity: tool.isEnabled ? 1 : 0.5 }]}>
                {tool.title}
              </Text>
              <Text style={styles.toolDescription}>{tool.description}</Text>
              {tool.lastUsed && tool.isEnabled && (
                <Text style={styles.lastUsed}>
                  {translate('lastUsed', 'Last used', language)}: {tool.lastUsed}
                </Text>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={[styles.toggleButton, tool.isEnabled && styles.toggleButtonActive]}
            onPress={() => toggleTool(tool.id)}
          >
            <Text style={[styles.toggleText, tool.isEnabled && styles.toggleTextActive]}>
              {tool.isEnabled ? '✓' : '○'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {tool.isEnabled && (
          <TouchableOpacity
            style={styles.useToolButton}
            onPress={() => handleToolPress(tool)}
          >
            <Text style={styles.useToolText}>
              {translate('useNow', 'Use Now', language)}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {translate('voiceCompanion', 'Voice Companion', language)}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>
              {translate('loading', 'Loading...', language)}
            </Text>
          </View>
        ) : (
          <View style={styles.toolsList}>
            <Text style={styles.sectionTitle}>
              {translate('availableTools', 'Available Tools', language)}
            </Text>
            {tools.map(renderToolCard)}
          </View>
        )}

        {/* Voice Commands Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            🎤 {translate('voiceCommands', 'Voice Commands', language)}
          </Text>
          <View style={styles.commandsList}>
            <Text style={styles.commandText}>
              • "{language === 'ne' ? 'आजको मिति के हो?' : 'What is today\'s date?'}"
            </Text>
            <Text style={styles.commandText}>
              • "{language === 'ne' ? 'मेरो राशिफल सुनाउनुहोस्' : 'Tell me my horoscope'}"
            </Text>
            <Text style={styles.commandText}>
              • "{language === 'ne' ? 'आजको मौसम कस्तो छ?' : 'How is today\'s weather?'}"
            </Text>
            <Text style={styles.commandText}>
              • "{language === 'ne' ? 'के चाडपर्व आउँदैछ?' : 'What festivals are coming?'}"
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Add Reminder Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalCancelText}>
                {translate('cancel', 'Cancel', language)}
              </Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {translate('addReminder', 'Add Reminder', language)}
            </Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalSaveText}>
                {translate('save', 'Save', language)}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.comingSoonText}>
              {translate('comingSoon', 'Coming Soon', language)}
            </Text>
            <Text style={styles.comingSoonSubtext}>
              {language === 'ne' 
                ? 'व्यक्तिगत सम्झना सुविधा छिट्टै उपलब्ध हुनेछ।'
                : 'Personal reminder feature will be available soon.'
              }
            </Text>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGradientTop,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.backgroundGradientTop,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 18,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  title: {
    fontSize: Typography.title.fontSize,
    fontWeight: Typography.title.fontWeight as any,
    color: Colors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: Typography.body.fontSize,
    color: Colors.textSecondary,
  },
  toolsList: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  toolCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  toolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  toolInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toolIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.backgroundGradientTop,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  toolIcon: {
    fontSize: 24,
  },
  toolDetails: {
    flex: 1,
  },
  toolTitle: {
    fontSize: Typography.body.fontSize,
    fontWeight: Typography.body.fontWeight as any,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  toolDescription: {
    fontSize: Typography.caption.fontSize,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  lastUsed: {
    fontSize: Typography.caption.fontSize,
    color: Colors.success,
    fontStyle: 'italic',
  },
  toggleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: Colors.success,
  },
  toggleText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  toggleTextActive: {
    color: Colors.surface,
    fontWeight: 'bold',
  },
  useToolButton: {
    backgroundColor: Colors.success + '20',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  useToolText: {
    fontSize: Typography.body.fontSize,
    color: Colors.success,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    margin: 16,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoTitle: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  commandsList: {
    gap: 8,
  },
  commandText: {
    fontSize: Typography.caption.fontSize,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundGradientTop,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalCancelText: {
    fontSize: Typography.body.fontSize,
    color: Colors.textSecondary,
  },
  modalTitle: {
    fontSize: Typography.title.fontSize,
    fontWeight: Typography.title.fontWeight as any,
    color: Colors.textPrimary,
  },
  modalSaveText: {
    fontSize: Typography.body.fontSize,
    color: Colors.success,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  comingSoonText: {
    fontSize: Typography.title.fontSize,
    fontWeight: Typography.title.fontWeight as any,
    color: Colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  comingSoonSubtext: {
    fontSize: Typography.body.fontSize,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default CompanionToolsScreen;