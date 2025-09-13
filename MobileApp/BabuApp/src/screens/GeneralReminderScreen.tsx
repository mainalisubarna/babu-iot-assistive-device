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
  Switch,
} from 'react-native';
import { Colors, Typography } from '../constants';
import { translate } from '../utils/translations';

interface GeneralReminderScreenProps {
  language?: 'en' | 'ne';
  onBack?: () => void;
}

interface GeneralReminder {
  id: string;
  title: string;
  time: string;
  type: 'reminder' | 'memory';
  isEnabled: boolean;
  description?: string;
}

const GeneralReminderScreen: React.FC<GeneralReminderScreenProps> = ({ 
  language = 'en', 
  onBack 
}) => {
  const [reminders, setReminders] = useState<GeneralReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState<GeneralReminder | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    time: '08:00',
    type: 'reminder' as 'reminder' | 'memory',
    description: '',
  });

  // Mock general reminders data
  const mockReminders: GeneralReminder[] = [
    {
      id: '1',
      title: 'Morning Walk',
      time: '06:00',
      type: 'reminder',
      isEnabled: true,
      description: 'Daily morning exercise routine',
    },
    {
      id: '2',
      title: 'Call Doctor',
      time: '14:00',
      type: 'reminder',
      isEnabled: false,
      description: 'Monthly checkup appointment',
    },
    {
      id: '3',
      title: 'Grandson Birthday',
      time: '10:00',
      type: 'memory',
      isEnabled: true,
      description: 'Remember to call and wish',
    },
    {
      id: '4',
      title: 'Wedding Anniversary',
      time: '18:00',
      type: 'memory',
      isEnabled: true,
      description: '45th wedding anniversary celebration',
    },
    {
      id: '5',
      title: 'Take Evening Medicine',
      time: '20:00',
      type: 'reminder',
      isEnabled: true,
      description: 'Blood pressure medication',
    },
    {
      id: '6',
      title: 'Festival Preparation',
      time: '09:00',
      type: 'memory',
      isEnabled: false,
      description: 'Dashain festival shopping list',
    },
  ];

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setReminders(mockReminders);
    } catch (error) {
      Alert.alert(
        translate('error', 'Error', language),
        'Failed to load reminders'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleReminder = (id: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id 
          ? { ...reminder, isEnabled: !reminder.isEnabled }
          : reminder
      )
    );
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    Alert.alert(
      translate('success', 'Success', language),
      translate('changesSaved', 'Changes saved successfully', language)
    );
    setHasChanges(false);
  };

  const handleAddReminder = () => {
    setEditingReminder(null);
    setFormData({
      title: '',
      time: '08:00',
      type: 'reminder',
      description: '',
    });
    setShowAddModal(true);
  };

  const handleEditReminder = (reminder: GeneralReminder) => {
    setEditingReminder(reminder);
    setFormData({
      title: reminder.title,
      time: reminder.time,
      type: reminder.type,
      description: reminder.description || '',
    });
    setShowAddModal(true);
  };

  const handleSaveReminder = () => {
    if (!formData.title.trim()) {
      Alert.alert(
        translate('error', 'Error', language),
        'Title is required'
      );
      return;
    }

    const newReminder: GeneralReminder = {
      id: editingReminder?.id || Date.now().toString(),
      title: formData.title,
      time: formData.time,
      type: formData.type,
      isEnabled: true,
      description: formData.description,
    };

    if (editingReminder) {
      setReminders(prev => prev.map(r => r.id === editingReminder.id ? newReminder : r));
    } else {
      setReminders(prev => [...prev, newReminder]);
    }

    setShowAddModal(false);
    setHasChanges(true);
  };

  const handleDeleteReminder = (reminder: GeneralReminder) => {
    Alert.alert(
      translate('confirmDelete', 'Confirm Delete', language),
      `Are you sure you want to delete "${reminder.title}"?`,
      [
        { text: translate('cancel', 'Cancel', language), style: 'cancel' },
        {
          text: translate('delete', 'Delete', language),
          style: 'destructive',
          onPress: () => {
            setReminders(prev => prev.filter(r => r.id !== reminder.id));
            setHasChanges(true);
          },
        },
      ]
    );
  };

  const renderReminderCard = (reminder: GeneralReminder) => {
    const typeColor = reminder.type === 'memory' ? Colors.danger : Colors.success;
    
    return (
      <View key={reminder.id} style={styles.reminderCard}>
        <View style={styles.reminderHeader}>
          <View style={styles.reminderInfo}>
            <View style={styles.reminderTitleRow}>
              <Text style={styles.reminderTitle}>{reminder.title}</Text>
              <View style={[styles.typeBadge, { backgroundColor: typeColor }]}>
                <Text style={styles.typeText}>
                  {reminder.type === 'memory' 
                    ? (language === 'ne' ? 'स्मृति' : 'Memory')
                    : (language === 'ne' ? 'सम्झना' : 'Reminder')
                  }
                </Text>
              </View>
            </View>
            <Text style={styles.reminderTime}>{reminder.time}</Text>
            {reminder.description && (
              <Text style={styles.reminderDescription}>{reminder.description}</Text>
            )}
          </View>
          <Switch
            value={reminder.isEnabled}
            onValueChange={() => handleToggleReminder(reminder.id)}
            trackColor={{ false: Colors.border, true: typeColor + '40' }}
            thumbColor={reminder.isEnabled ? typeColor : Colors.textSecondary}
          />
        </View>
        
        <View style={styles.reminderActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditReminder(reminder)}
          >
            <Text style={styles.actionButtonText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteReminder(reminder)}
          >
            <Text style={styles.actionButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
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
          {translate('generalReminders', 'General Reminders', language)}
        </Text>
        <View style={styles.headerActions}>
          {hasChanges && (
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.addButton} onPress={handleAddReminder}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>
              {translate('loading', 'Loading...', language)}
            </Text>
          </View>
        ) : reminders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyTitle}>
              {translate('noReminders', 'No Reminders Added', language)}
            </Text>
            <Text style={styles.emptySubtitle}>
              {translate('addFirstReminder', 'Add your first reminder or memory', language)}
            </Text>
          </View>
        ) : (
          <View style={styles.remindersList}>
            {reminders.map(renderReminderCard)}
          </View>
        )}
      </ScrollView>

      {/* Add/Edit Reminder Modal */}
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
              {editingReminder 
                ? translate('editReminder', 'Edit Reminder', language)
                : translate('addReminder', 'Add Reminder', language)
              }
            </Text>
            <TouchableOpacity onPress={handleSaveReminder}>
              <Text style={styles.modalSaveText}>
                {translate('save', 'Save', language)}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Title */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                {translate('title', 'Title', language)}
              </Text>
              <TextInput
                style={styles.textInput}
                value={formData.title}
                onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
                placeholder="Enter title"
              />
            </View>

            {/* Time */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                {translate('time', 'Time', language)}
              </Text>
              <TextInput
                style={styles.textInput}
                value={formData.time}
                onChangeText={(text) => setFormData(prev => ({ ...prev, time: text }))}
                placeholder="08:00"
              />
            </View>

            {/* Type */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                {translate('type', 'Type', language)}
              </Text>
              <View style={styles.typeSelector}>
                <TouchableOpacity
                  style={[styles.typeOption, formData.type === 'reminder' && styles.typeOptionActive]}
                  onPress={() => setFormData(prev => ({ ...prev, type: 'reminder' }))}
                >
                  <Text style={[styles.typeOptionText, formData.type === 'reminder' && styles.typeOptionTextActive]}>
                    {language === 'ne' ? 'सम्झना' : 'Reminder'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.typeOption, formData.type === 'memory' && styles.typeOptionActive]}
                  onPress={() => setFormData(prev => ({ ...prev, type: 'memory' }))}
                >
                  <Text style={[styles.typeOptionText, formData.type === 'memory' && styles.typeOptionTextActive]}>
                    {language === 'ne' ? 'स्मृति' : 'Memory'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Description */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                {translate('description', 'Description', language)}
              </Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                placeholder="Enter description (optional)"
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>
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
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveButton: {
    backgroundColor: Colors.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  saveButtonText: {
    color: Colors.surface,
    fontSize: Typography.caption.fontSize,
    fontWeight: '600',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 24,
    color: Colors.surface,
    fontWeight: 'bold',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: Typography.title.fontSize,
    fontWeight: Typography.title.fontWeight as any,
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: Typography.body.fontSize,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  remindersList: {
    padding: 16,
  },
  reminderCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reminderInfo: {
    flex: 1,
    marginRight: 12,
  },
  reminderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  reminderTitle: {
    fontSize: Typography.body.fontSize,
    fontWeight: Typography.body.fontWeight as any,
    color: Colors.textPrimary,
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typeText: {
    fontSize: Typography.small.fontSize,
    fontWeight: '700',
    color: Colors.surface,
  },
  reminderTime: {
    fontSize: Typography.caption.fontSize,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  reminderDescription: {
    fontSize: Typography.caption.fontSize,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  reminderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.backgroundGradientTop,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FFE5E5',
  },
  actionButtonText: {
    fontSize: 16,
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
    padding: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: Typography.body.fontSize,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  typeOptionActive: {
    backgroundColor: Colors.success + '20',
    borderColor: Colors.success,
  },
  typeOptionText: {
    fontSize: Typography.body.fontSize,
    color: Colors.textSecondary,
  },
  typeOptionTextActive: {
    color: Colors.success,
    fontWeight: '600',
  },
});

export default GeneralReminderScreen;