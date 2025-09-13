import React, { useState, useEffect } from "react";
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
  Linking,
} from "react-native";
import { Colors, Typography } from "../constants";
import { Contact } from "../types";
import { translate } from "../utils/translations";

interface CallContactsScreenProps {
  language?: "en" | "ne";
  onBack?: () => void;
}

const CallContactsScreen: React.FC<CallContactsScreenProps> = ({
  language = "en",
  onBack,
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    voiceTag: "",
    isEmergencyContact: false,
  });

  // Mock contacts data
  const mockContacts: Contact[] = [
    {
      id: "1",
      name: "Sita Sharma (Daughter)",
      phoneNumber: "+977-9841234567",
      voiceTag: "छोरी",
      isEmergencyContact: true,
    },
    {
      id: "2",
      name: "Raj Sharma (Son)",
      phoneNumber: "+977-9851234567",
      voiceTag: "छोरा",
      isEmergencyContact: true,
    },
    {
      id: "3",
      name: "Dr. Krishna Thapa",
      phoneNumber: "+977-9861234567",
      voiceTag: "डाक्टर",
      isEmergencyContact: false,
    },
    {
      id: "4",
      name: "Maya Gurung (Neighbor)",
      phoneNumber: "+977-9871234567",
      voiceTag: "छिमेकी",
      isEmergencyContact: false,
    },
  ];

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setContacts(mockContacts);
    } catch (error) {
      Alert.alert(
        translate("error", "Error", language),
        "Failed to load contacts"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = () => {
    setEditingContact(null);
    setFormData({
      name: "",
      phoneNumber: "",
      voiceTag: "",
      isEmergencyContact: false,
    });
    setShowAddModal(true);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      phoneNumber: contact.phoneNumber,
      voiceTag: contact.voiceTag,
      isEmergencyContact: contact.isEmergencyContact,
    });
    setShowAddModal(true);
  };

  const handleSaveContact = () => {
    if (!formData.name.trim() || !formData.phoneNumber.trim()) {
      Alert.alert(
        translate("error", "Error", language),
        "Name and phone number are required"
      );
      return;
    }

    const newContact: Contact = {
      id: editingContact?.id || Date.now().toString(),
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      voiceTag: formData.voiceTag,
      isEmergencyContact: formData.isEmergencyContact,
    };

    if (editingContact) {
      setContacts((prev) =>
        prev.map((c) => (c.id === editingContact.id ? newContact : c))
      );
    } else {
      setContacts((prev) => [...prev, newContact]);
    }

    setShowAddModal(false);
    Alert.alert(
      translate("success", "Success", language),
      editingContact
        ? translate("contactUpdated", "Contact updated successfully", language)
        : translate("contactAdded", "Contact added successfully", language)
    );
  };

  const handleDeleteContact = (contact: Contact) => {
    Alert.alert(
      translate("confirmDelete", "Confirm Delete", language),
      translate(
        "deleteContactConfirm",
        `Are you sure you want to delete ${contact.name}?`,
        language
      ),
      [
        { text: translate("cancel", "Cancel", language), style: "cancel" },
        {
          text: translate("delete", "Delete", language),
          style: "destructive",
          onPress: () => {
            setContacts((prev) => prev.filter((c) => c.id !== contact.id));
            Alert.alert(
              translate("success", "Success", language),
              translate(
                "contactDeleted",
                "Contact deleted successfully",
                language
              )
            );
          },
        },
      ]
    );
  };

  const handleCallContact = (contact: Contact) => {
    Alert.alert(
      translate("callNow", "Call Now", language),
      `${translate("callNow", "Call", language)} ${contact.name}?`,
      [
        { text: translate("cancel", "Cancel", language), style: "cancel" },
        {
          text: translate("callNow", "Call", language),
          onPress: () => {
            const phoneUrl = `tel:${contact.phoneNumber}`;
            Linking.canOpenURL(phoneUrl).then((supported) => {
              if (supported) {
                Linking.openURL(phoneUrl);
              } else {
                Alert.alert(
                  "Error",
                  "Phone calls are not supported on this device"
                );
              }
            });
          },
        },
      ]
    );
  };

  const renderContactCard = (contact: Contact) => {
    return (
      <View key={contact.id} style={styles.contactCard}>
        <View style={styles.contactHeader}>
          <View style={styles.contactInfo}>
            <View style={styles.contactAvatar}>
              <Text style={styles.contactAvatarText}>
                {contact.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.contactDetails}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactPhone}>{contact.phoneNumber}</Text>
              {contact.voiceTag && (
                <Text style={styles.contactVoiceTag}>
                  🎤 {contact.voiceTag}
                </Text>
              )}
            </View>
          </View>
          {contact.isEmergencyContact && (
            <View style={styles.emergencyBadge}>
              <Text style={styles.emergencyBadgeText}>🚨</Text>
            </View>
          )}
        </View>

        <View style={styles.contactActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.callButton]}
            onPress={() => handleCallContact(contact)}
          >
            <Text style={styles.callButtonText}>📞</Text>
            <Text style={styles.callButtonLabel}>
              {translate("callNow", "Call", language)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEditContact(contact)}
          >
            <Text style={styles.actionButtonText}>✏️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteContact(contact)}
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
          {translate("callContacts", "Call Contacts", language)}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.saveButton} onPress={() => Alert.alert('Success', 'Contacts saved successfully')}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={handleAddContact}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>
              {translate("loading", "Loading...", language)}
            </Text>
          </View>
        ) : contacts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📞</Text>
            <Text style={styles.emptyTitle}>
              {translate("noContacts", "No Contacts Added", language)}
            </Text>
            <Text style={styles.emptySubtitle}>
              {translate("addFirstContact", "Add your first contact", language)}
            </Text>
          </View>
        ) : (
          <View style={styles.contactsList}>
            {/* Emergency Contacts */}
            {contacts.some((c) => c.isEmergencyContact) && (
              <>
                <Text style={styles.sectionTitle}>
                  🚨{" "}
                  {translate(
                    "emergencyContact",
                    "Emergency Contacts",
                    language
                  )}
                </Text>
                {contacts
                  .filter((c) => c.isEmergencyContact)
                  .map(renderContactCard)}
              </>
            )}

            {/* Regular Contacts */}
            {contacts.some((c) => !c.isEmergencyContact) && (
              <>
                <Text style={styles.sectionTitle}>
                  📞 {language === "ne" ? "अन्य सम्पर्कहरू" : "Other Contacts"}
                </Text>
                {contacts
                  .filter((c) => !c.isEmergencyContact)
                  .map(renderContactCard)}
              </>
            )}
          </View>
        )}

        {/* Voice Commands Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            🎤 {language === "ne" ? "आवाज आदेशहरू" : "Voice Commands"}
          </Text>
          <Text style={styles.infoText}>
            {language === "ne"
              ? 'बाबुलाई भन्नुहोस्: "छोरीलाई फोन गर्नुहोस्" वा "डाक्टरलाई कल गर्नुहोस्"'
              : 'Say to Babu: "Call daughter" or "Phone doctor"'}
          </Text>
        </View>
      </ScrollView>

      {/* Add/Edit Contact Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalCancelText}>
                {translate("cancel", "Cancel", language)}
              </Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingContact
                ? translate("editContact", "Edit Contact", language)
                : translate("addContact", "Add Contact", language)}
            </Text>
            <TouchableOpacity onPress={handleSaveContact}>
              <Text style={styles.modalSaveText}>
                {translate("save", "Save", language)}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Contact Name */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                {translate("contactName", "Contact Name", language)}
              </Text>
              <TextInput
                style={styles.textInput}
                value={formData.name}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, name: text }))
                }
                placeholder="Enter contact name"
              />
            </View>

            {/* Phone Number */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                {translate("phoneNumber", "Phone Number", language)}
              </Text>
              <TextInput
                style={styles.textInput}
                value={formData.phoneNumber}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, phoneNumber: text }))
                }
                placeholder="+977-9841234567"
                keyboardType="phone-pad"
              />
            </View>

            {/* Voice Tag */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                {translate("voiceTag", "Voice Tag (Nepali)", language)}
              </Text>
              <TextInput
                style={styles.textInput}
                value={formData.voiceTag}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, voiceTag: text }))
                }
                placeholder="छोरी, छोरा, डाक्टर..."
              />
              <Text style={styles.formHint}>
                {language === "ne"
                  ? "बाबुले यो नाम सुनेर फोन गर्नेछ"
                  : "Babu will recognize this name for voice calls"}
              </Text>
            </View>

            {/* Emergency Contact Toggle */}
            <View style={styles.formGroup}>
              <View style={styles.switchRow}>
                <View style={styles.switchLabel}>
                  <Text style={styles.formLabel}>
                    {translate(
                      "emergencyContact",
                      "Emergency Contact",
                      language
                    )}
                  </Text>
                  <Text style={styles.formHint}>
                    {language === "ne"
                      ? "आपातकालीन अवस्थामा सम्पर्क गरिने"
                      : "Will be contacted in emergencies"}
                  </Text>
                </View>
                <Switch
                  value={formData.isEmergencyContact}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      isEmergencyContact: value,
                    }))
                  }
                  trackColor={{
                    false: Colors.border,
                    true: Colors.success + "40",
                  }}
                  thumbColor={
                    formData.isEmergencyContact
                      ? Colors.success
                      : Colors.textSecondary
                  }
                />
              </View>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    shadowColor: "#000",
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
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 18,
    color: Colors.textPrimary,
    fontWeight: "600",
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
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 24,
    color: Colors.surface,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: Typography.body.fontSize,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: Typography.body.fontSize,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  contactsList: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: Typography.body.fontSize,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 12,
    marginTop: 8,
  },
  contactCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  contactHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  contactInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.success,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contactAvatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.surface,
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: Typography.body.fontSize,
    fontWeight: Typography.body.fontWeight as any,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: Typography.caption.fontSize,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  contactVoiceTag: {
    fontSize: Typography.caption.fontSize,
    color: Colors.success,
    fontStyle: "italic",
  },
  emergencyBadge: {
    backgroundColor: Colors.danger + "20",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emergencyBadgeText: {
    fontSize: 16,
  },
  contactActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  callButton: {
    backgroundColor: Colors.success,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  callButtonText: {
    fontSize: 18,
  },
  callButtonLabel: {
    fontSize: Typography.body.fontSize,
    fontWeight: "600",
    color: Colors.surface,
  },
  editButton: {
    backgroundColor: Colors.backgroundGradientTop,
    flex: 0,
    width: 44,
  },
  deleteButton: {
    backgroundColor: Colors.danger + "20",
    flex: 0,
    width: 44,
  },
  actionButtonText: {
    fontSize: 16,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    margin: 16,
    marginTop: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoTitle: {
    fontSize: Typography.body.fontSize,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  infoText: {
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    fontWeight: "600",
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
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  formHint: {
    fontSize: Typography.caption.fontSize,
    color: Colors.textSecondary,
    marginTop: 4,
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
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchLabel: {
    flex: 1,
    marginRight: 16,
  },
});

export default CallContactsScreen;
