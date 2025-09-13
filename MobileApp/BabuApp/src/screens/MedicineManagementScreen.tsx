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
import { Colors, Typography, Spacing } from '../constants';
import { MedicineReminder } from '../types';
import { medicineService } from '../services/medicineService';
import { translate } from '../utils/translations';

interface MedicineManagementScreenProps {
  language?: 'en' | 'ne';
  onBack?: () => void;
}

const MedicineManagementScreen: React.FC<MedicineManagementScreenProps> = ({ 
  language = 'en', 
  onBack 
}) => {
  const [medicines, setMedicines] = useState<MedicineReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<MedicineReminder | null>(null);
  const [formData, setFormData] = useState({
    medicineName: '',
    colorPouch: 'red',
    dosage: '1',
    times: ['08:00'],
    voiceInstructions: '',
  });

  const colorOptions = [
    { value: 'red', label: language === 'ne' ? 'रातो' : 'Red', color: '#FF6B6B' },
    { value: 'blue', label: language === 'ne' ? 'निलो' : 'Blue', color: '#4ECDC4' },
    { value: 'green', label: language === 'ne' ? 'हरियो' : 'Green', color: '#45B7D1' },
    { value: 'yellow', label: language === 'ne' ? 'पहेंलो' : 'Yellow', color: '#FFA07A' },
    { value: 'purple', label: language === 'ne' ? 'बैजनी' : 'Purple', color: '#98D8C8' },
    { value: 'orange', label: language === 'ne' ? 'सुन्तला' : 'Orange', color: '#F7DC6F' },
  ];

  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    try {
      setLoading(true);
      const schedule = await medicineService.getSchedule();
      setMedicines(schedule);
    } catch (error) {
      Alert.alert(
        translate('error', 'Error', language),
        translate('failedToLoadMedicines', 'Failed to load medicines', language)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedicine = () => {
    setEditingMedicine(null);
    setFormData({
      medicineName: '',
      colorPouch: 'red',
      dosage: '1',
      times: ['08:00'],
      voiceInstructions: '',
    });
    setShowAddModal(true);
  };

  const handleEditMedicine = (medicine: MedicineReminder) => {
    setEditingMedicine(medicine);
    setFormData({
      medicineName: medicine.medicineName,
      colorPouch: medicine.colorPouch,
      dosage: medicine.dosage.toString(),
      times: medicine.times,
      voiceInstructions: medicine.voiceInstructions,
    });
    setShowAddModal(true);
  };

  const handleSaveMedicine = () => {
    if (!formData.medicineName.trim()) {
      Alert.alert(
        translate('error', 'Error', language),
        translate('medicineNameRequired', 'Medicine name is required', language)
      );
      return;
    }

    const newMedicine: MedicineReminder = {
      id: editingMedicine?.id || Date.now().toString(),
      medicineName: formData.medicineName,
      colorPouch: formData.colorPouch,
      dosage: parseInt(formData.dosage) || 1,
      times: formData.times,
      voiceInstructions: formData.voiceInstructions,
    };

    if (editingMedicine) {
      setMedicines(prev => prev.map(m => m.id === editingMedicine.id ? newMedicine : m));
    } else {
      setMedicines(prev => [...prev, newMedicine]);
    }

    setShowAddModal(false);
    Alert.alert(
      translate('success', 'Success', language),
      editingMedicine 
        ? translate('medicineUpdated', 'Medicine updated successfully', language)
        : translate('medicineAdded', 'Medicine added successfully', language)
    );
  };

  const handleDeleteMedicine = (medicine: MedicineReminder) => {
    Alert.alert(
      translate('confirmDelete', 'Confirm Delete', language),
      translate('deleteMedicineConfirm', `Are you sure you want to delete ${medicine.medicineName}?`, language),
      [
        { text: translate('cancel', 'Cancel', language), style: 'cancel' },
        {
          text: translate('delete', 'Delete', language),
          style: 'destructive',
          onPress: () => {
            setMedicines(prev => prev.filter(m => m.id !== medicine.id));
            Alert.alert(
              translate('success', 'Success', language),
              translate('medicineDeleted', 'Medicine deleted successfully', language)
            );
          },
        },
      ]
    );
  };

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      times: [...prev.times, '12:00']
    }));
  };

  const updateTimeSlot = (index: number, time: string) => {
    setFormData(prev => ({
      ...prev,
      times: prev.times.map((t, i) => i === index ? time : t)
    }));
  };

  const removeTimeSlot = (index: number) => {
    if (formData.times.length > 1) {
      setFormData(prev => ({
        ...prev,
        times: prev.times.filter((_, i) => i !== index)
      }));
    }
  };

  const renderMedicineCard = (medicine: MedicineReminder) => {
    const colorOption = colorOptions.find(c => c.value === medicine.colorPouch);
    
    return (
      <View key={medicine.id} style={styles.medicineCard}>
        <View style={styles.medicineHeader}>
          <View style={styles.medicineInfo}>
            <View style={[styles.colorIndicator, { backgroundColor: colorOption?.color || '#FF6B6B' }]} />
            <View style={styles.medicineDetails}>
              <Text style={styles.medicineName}>{medicine.medicineName}</Text>
              <Text style={styles.medicinePouch}>
                {colorOption?.label} {translate('pouch', 'Pouch', language)} • {medicine.dosage} {translate('pills', 'pills', language)}
              </Text>
            </View>
          </View>
          <View style={styles.medicineActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEditMedicine(medicine)}
            >
              <Text style={styles.actionButtonText}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDeleteMedicine(medicine)}
            >
              <Text style={styles.actionButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.timesContainer}>
          <Text style={styles.timesLabel}>
            {translate('times', 'Times', language)}:
          </Text>
          <View style={styles.timesList}>
            {medicine.times.map((time, index) => (
              <View key={index} style={styles.timeChip}>
                <Text style={styles.timeText}>{time}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {medicine.voiceInstructions && (
          <View style={styles.voiceInstructions}>
            <Text style={styles.voiceLabel}>
              🎤 {translate('voiceInstructions', 'Voice Instructions', language)}:
            </Text>
            <Text style={styles.voiceText}>{medicine.voiceInstructions}</Text>
          </View>
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
          {translate('medicineReminders', 'Medicine Reminders', language)}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.saveButton} onPress={() => Alert.alert('Success', 'Changes saved successfully')}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={handleAddMedicine}>
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
        ) : medicines.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💊</Text>
            <Text style={styles.emptyTitle}>
              {translate('noMedicines', 'No Medicines Added', language)}
            </Text>
            <Text style={styles.emptySubtitle}>
              {translate('addFirstMedicine', 'Add your first medicine reminder', language)}
            </Text>
          </View>
        ) : (
          <View style={styles.medicinesList}>
            {medicines.map(renderMedicineCard)}
          </View>
        )}
      </ScrollView>

      {/* Add/Edit Medicine Modal */}
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
              {editingMedicine 
                ? translate('editMedicine', 'Edit Medicine', language)
                : translate('addMedicine', 'Add Medicine', language)
              }
            </Text>
            <TouchableOpacity onPress={handleSaveMedicine}>
              <Text style={styles.modalSaveText}>
                {translate('save', 'Save', language)}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Medicine Name */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                {translate('medicineName', 'Medicine Name', language)}
              </Text>
              <TextInput
                style={styles.textInput}
                value={formData.medicineName}
                onChangeText={(text) => setFormData(prev => ({ ...prev, medicineName: text }))}
                placeholder={translate('enterMedicineName', 'Enter medicine name', language)}
              />
            </View>

            {/* Color Pouch */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                {translate('colorPouch', 'Color Pouch', language)}
              </Text>
              <View style={styles.colorOptions}>
                {colorOptions.map((color) => (
                  <TouchableOpacity
                    key={color.value}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color.color },
                      formData.colorPouch === color.value && styles.selectedColorOption
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, colorPouch: color.value }))}
                  >
                    <Text style={styles.colorOptionText}>{color.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Dosage */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                {translate('dosage', 'Dosage (pills)', language)}
              </Text>
              <TextInput
                style={styles.textInput}
                value={formData.dosage}
                onChangeText={(text) => setFormData(prev => ({ ...prev, dosage: text }))}
                placeholder="1"
                keyboardType="numeric"
              />
            </View>

            {/* Times */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                {translate('times', 'Times', language)}
              </Text>
              {formData.times.map((time, index) => (
                <View key={index} style={styles.timeInputRow}>
                  <TextInput
                    style={[styles.textInput, styles.timeInput]}
                    value={time}
                    onChangeText={(text) => updateTimeSlot(index, text)}
                    placeholder="08:00"
                  />
                  {formData.times.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeTimeButton}
                      onPress={() => removeTimeSlot(index)}
                    >
                      <Text style={styles.removeTimeText}>×</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              <TouchableOpacity style={styles.addTimeButton} onPress={addTimeSlot}>
                <Text style={styles.addTimeText}>
                  + {translate('addTime', 'Add Time', language)}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Voice Instructions */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                {translate('voiceInstructions', 'Voice Instructions (Nepali)', language)}
              </Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={formData.voiceInstructions}
                onChangeText={(text) => setFormData(prev => ({ ...prev, voiceInstructions: text }))}
                placeholder={translate('enterVoiceInstructions', 'Enter voice instructions in Nepali', language)}
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
  medicinesList: {
    padding: 16,
  },
  medicineCard: {
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
  medicineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  medicineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  medicineDetails: {
    flex: 1,
  },
  medicineName: {
    fontSize: Typography.body.fontSize,
    fontWeight: Typography.body.fontWeight as any,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  medicinePouch: {
    fontSize: Typography.caption.fontSize,
    color: Colors.textSecondary,
  },
  medicineActions: {
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
  timesContainer: {
    marginBottom: 12,
  },
  timesLabel: {
    fontSize: Typography.caption.fontSize,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  timesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    backgroundColor: Colors.success + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  timeText: {
    fontSize: Typography.caption.fontSize,
    color: Colors.success,
    fontWeight: '600',
  },
  voiceInstructions: {
    backgroundColor: Colors.backgroundGradientTop,
    padding: 12,
    borderRadius: 8,
  },
  voiceLabel: {
    fontSize: Typography.caption.fontSize,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  voiceText: {
    fontSize: Typography.caption.fontSize,
    color: Colors.textPrimary,
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
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: Colors.textPrimary,
  },
  colorOptionText: {
    fontSize: Typography.caption.fontSize,
    color: Colors.surface,
    fontWeight: '600',
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeInput: {
    flex: 1,
    marginRight: 8,
  },
  removeTimeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.danger + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeTimeText: {
    fontSize: 20,
    color: Colors.danger,
    fontWeight: 'bold',
  },
  addTimeButton: {
    backgroundColor: Colors.success + '20',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  addTimeText: {
    fontSize: Typography.body.fontSize,
    color: Colors.success,
    fontWeight: '600',
  },
});

export default MedicineManagementScreen;