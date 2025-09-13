import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Colors, Typography, Spacing } from '../constants';
import { Contact } from '../types';
import { userService } from '../services/userService';
import { translateContactName } from '../utils/translations';

interface ContactManagementScreenProps {
  language: 'en' | 'ne';
  onBack?: () => void;
}

export const ContactManagementScreen: React.FC<ContactManagementScreenProps> = ({
  language,
  onBack,
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    voiceTag: '',
  });

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const contactsData = await userService.getEmergencyContacts();
      setContacts(contactsData);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async () => {
    if (!formData.name || !formData.phoneNumber) {
      Alert.alert(
        language === 'ne' ? 'त्रुटि' : 'Error',
        language === 'ne' ? 'कृपया सबै फिल्डहरू भर्नुहोस्' : 'Please fill all fields'
      );
      return;
    }

    try {
      const newContact = await userService.addEmergencyContact({
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        voiceTag: formData.voiceTag,
        isEmergencyContact: true,
      });
      
      setContacts([...contacts, newContact]);
      setFormData({ name: '', phoneNumber: '', voiceTag: '' });
      setShowAddForm(false);
      
      Alert.alert(
        language === 'ne' ? 'सफल' : 'Success',
        language === 'ne' ? 'सम्पर्क सफलतापूर्वक थपियो' : 'Contact added successfully'
      );
    } catch (error) {
      Alert.alert(
        language === 'ne' ? 'त्रुटि' : 'Error',
        language === 'ne' ? 'सम्पर्क थप्न सकिएन' : 'Failed to add contact'
      );
    }
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      phoneNumber: contact.phoneNumber,
      voiceTag: contact.voiceTag,
    });
    setShowAddForm(true);
  };

  const handleUpdateContact = async () => {
    if (!editingContact || !formData.name || !formData.phoneNumber) {
      Alert.alert(
        language === 'ne' ? 'त्रुटि' : 'Error',
        language === 'ne' ? 'कृपया सबै फिल्डहरू भर्नुहोस्' : 'Please fill all fields'
      );
      return;
    }

    try {
      const updatedContact = await userService.updateEmergencyContact(editingContact.id, {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        voiceTag: formData.voiceTag,
      });
      
      setContacts(contacts.map(c => c.id === editingContact.id ? updatedContact : c));
      setFormData({ name: '', phoneNumber: '', voiceTag: '' });
      setShowAddForm(false);
      setEditingContact(null);
      
      Alert.alert(
        language === 'ne' ? 'सफल' : 'Success',
        language === 'ne' ? 'सम्पर्क सफलतापूर्वक अपडेट भयो' : 'Contact updated successfully'
      );
    } catch (error) {
      Alert.alert(
        language === 'ne' ? 'त्रुटि' : 'Error',
        language === 'ne' ? 'सम्पर्क अपडेट गर्न सकिएन' : 'Failed to update contact'
      );
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    Alert.alert(
      language === 'ne' ? 'पुष्टि गर्नुहोस्' : 'Confirm Delete',
      language === 'ne' ? 'यो सम्पर्क मेटाउन चाहनुहुन्छ?' : 'Are you sure you want to delete this contact?',
      [
        { text: language === 'ne' ? 'रद्द गर्नुहोस्' : 'Cancel', style: 'cancel' },
        {
          text: language === 'ne' ? 'मेटाउनुहोस्' : 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await userService.deleteEmergencyContact(contactId);
              setContacts(contacts.filter(c => c.id !== contactId));
              Alert.alert(
                language === 'ne' ? 'सफल' : 'Success',
                language === 'ne' ? 'सम्पर्क सफलतापूर्वक मेटाइयो' : 'Contact deleted successfully'
              );
            } catch (error) {
              Alert.alert(
                language === 'ne' ? 'त्रुटि' : 'Error',
                language === 'ne' ? 'सम्पर्क मेटाउन सकिएन' : 'Failed to delete contact'
              );
            }
          },
        },
      ]
    );
  };

  const cancelForm = () => {
    setFormData({ name: '', phoneNumber: '', voiceTag: '' });
    setShowAddForm(false);
    setEditingContact(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← {language === 'ne' ? 'फिर्ता' : 'Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {language === 'ne' ? 'आपातकालीन सम्पर्कहरू' : 'Emergency Contacts'}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {showAddForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>
              {editingContact 
                ? (language === 'ne' ? 'सम्पर्क सम्पादन गर्नुहोस्' : 'Edit Contact')
                : (language === 'ne' ? 'नयाँ सम्पर्क थप्नुहोस्' : 'Add New Contact')
              }
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder={language === 'ne' ? 'नाम' : 'Name'}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
            
            <TextInput
              style={styles.input}
              placeholder={language === 'ne' ? 'फोन नम्बर' : 'Phone Number'}
              value={formData.phoneNumber}
              onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
              keyboardType="phone-pad"
            />
            
            <TextInput
              style={styles.input}
              placeholder={language === 'ne' ? 'आवाज ट्याग' : 'Voice Tag'}
              value={formData.voiceTag}
              onChangeText={(text) => setFormData({ ...formData, voiceTag: text })}
            />
            
            <View style={styles.formButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={cancelForm}>
                <Text style={styles.cancelButtonText}>
                  {language === 'ne' ? 'रद्द गर्नुहोस्' : 'Cancel'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={editingContact ? handleUpdateContact : handleAddContact}
              >
                <Text style={styles.saveButtonText}>
                  {editingContact 
                    ? (language === 'ne' ? 'अपडेट गर्नुहोस्' : 'Update')
                    : (language === 'ne' ? 'सेभ गर्नुहोस्' : 'Save')
                  }
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!showAddForm && (
          <TouchableOpacity style={styles.addButton} onPress={() => setShowAddForm(true)}>
            <Text style={styles.addButtonText}>
              + {language === 'ne' ? 'नयाँ सम्पर्क थप्नुहोस्' : 'Add New Contact'}
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.contactsList}>
          {contacts.map((contact) => (
            <View key={contact.id} style={styles.contactCard}>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>
                  {translateContactName(contact.name, language)}
                </Text>
                <Text style={styles.contactPhone}>{contact.phoneNumber}</Text>
                {contact.voiceTag && (
                  <Text style={styles.voiceTag}>
                    {language === 'ne' ? 'आवाज ट्याग' : 'Voice tag'}: {contact.voiceTag}
                  </Text>
                )}
              </View>
              
              <View style={styles.contactActions}>
                <TouchableOpacity 
                  style={styles.editButton} 
                  onPress={() => handleEditContact(contact)}
                >
                  <Text style={styles.editButtonText}>
                    {language === 'ne' ? 'सम्पादन' : 'Edit'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.deleteButton} 
                  onPress={() => handleDeleteContact(contact.id)}
                >
                  <Text style={styles.deleteButtonText}>
                    {language === 'ne' ? 'मेटाउनुहोस्' : 'Delete'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  backButton: {
    marginRight: Spacing.md,
  },
  backText: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  title: {
    ...Typography.title,
    color: Colors.textPrimary,
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: Spacing.lg,
    marginVertical: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  formTitle: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 16,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
    ...Typography.body,
    color: Colors.textPrimary,
  },
  formButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.divider,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.textPrimary,
    paddingVertical: Spacing.md,
    borderRadius: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    ...Typography.caption,
    color: Colors.surface,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: Colors.textPrimary,
    paddingVertical: Spacing.lg,
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  addButtonText: {
    ...Typography.body,
    color: Colors.surface,
    fontWeight: '600',
  },
  contactsList: {
    marginBottom: Spacing.xl,
  },
  contactCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  contactInfo: {
    marginBottom: Spacing.md,
  },
  contactName: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  contactPhone: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  voiceTag: {
    ...Typography.caption,
    color: Colors.success,
    fontSize: 11,
  },
  contactActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  editButton: {
    flex: 1,
    backgroundColor: Colors.textPrimary,
    paddingVertical: Spacing.sm,
    borderRadius: 16,
    alignItems: 'center',
  },
  editButtonText: {
    ...Typography.caption,
    color: Colors.surface,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: Colors.danger,
    paddingVertical: Spacing.sm,
    borderRadius: 16,
    alignItems: 'center',
  },
  deleteButtonText: {
    ...Typography.caption,
    color: Colors.surface,
    fontWeight: '600',
  },
});