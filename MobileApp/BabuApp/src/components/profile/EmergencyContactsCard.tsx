import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card, ActionSheet, ConfirmationDialog } from "../common";
import { Colors, Typography, Spacing } from "../../constants";
import { Contact } from "../../types";
import { translateContactName } from "../../utils/translations";

interface EmergencyContactsCardProps {
  contacts: Contact[];
  language: "en" | "ne";
  onAddContact?: () => void;
  onEditContact?: (contact: Contact) => void;
  onDeleteContact?: (contactId: string) => void;
  onManageAll?: () => void;
}

export const EmergencyContactsCard: React.FC<EmergencyContactsCardProps> = ({
  contacts,
  language,
  onAddContact,
  onEditContact,
  onDeleteContact,
  onManageAll,
}) => {
  const [showContactSheet, setShowContactSheet] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const getTitle = () => {
    return language === "ne" ? "आपातकालीन सम्पर्कहरू" : "Emergency Contacts";
  };

  const getAddText = () => {
    return language === "ne" ? "थप्नुहोस्" : "Add";
  };

  const getNoContactsText = () => {
    return language === "ne"
      ? "कुनै आपातकालीन सम्पर्क छैन"
      : "No emergency contacts";
  };

  const handleContactPress = (contact: Contact) => {
    setSelectedContact(contact);
    setShowContactSheet(true);
  };

  const handleDeletePress = () => {
    setShowContactSheet(false);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (selectedContact) {
      onDeleteContact?.(selectedContact.id);
    }
    setShowDeleteConfirm(false);
    setSelectedContact(null);
  };

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{getTitle()}</Text>
      </View>

      {contacts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>{getNoContactsText()}</Text>
        </View>
      ) : (
        <View style={styles.contactsList}>
          {contacts.map((contact, index) => (
            <TouchableOpacity
              key={contact.id}
              style={[
                styles.contactItem,
                index > 0 && { marginTop: Spacing.md },
              ]}
              onPress={() => handleContactPress(contact)}
            >
              <View style={styles.contactAvatar}>
                <Text style={styles.contactInitial}>
                  {contact.name.charAt(0).toUpperCase()}
                </Text>
              </View>

              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>
                  {translateContactName(contact.name, language)}
                </Text>
                <Text style={styles.contactPhone}>{contact.phoneNumber}</Text>
                {contact.voiceTag && (
                  <Text style={styles.voiceTag}>
                    {language === "ne" ? "आवाज ट्याग" : "Voice tag"}:{" "}
                    {contact.voiceTag}
                  </Text>
                )}
              </View>

              <View style={styles.contactActions}>
                <Text style={styles.editIcon}>✏️</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.managementButtons}>
        <TouchableOpacity
          style={styles.managementButton}
          onPress={onAddContact}
        >
          <Text style={styles.managementButtonText}>
            {language === "ne" ? "+ नयाँ सम्पर्क थप्नुहोस्" : "+ Add Contact"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.managementButton, styles.manageButton]}
          onPress={onManageAll}
        >
          <Text style={styles.managementButtonText}>
            {language === "ne" ? "व्यवस्थापन गर्नुहोस्" : "Manage All"}
          </Text>
        </TouchableOpacity>
      </View>

      <ActionSheet
        visible={showContactSheet}
        title={
          selectedContact
            ? translateContactName(selectedContact.name, language)
            : ""
        }
        message={selectedContact?.phoneNumber}
        options={[
          {
            text: language === "ne" ? "सम्पादन गर्नुहोस्" : "Edit",
            onPress: () => {
              if (selectedContact) {
                onEditContact?.(selectedContact);
              }
            },
          },
          {
            text: language === "ne" ? "मेटाउनुहोस्" : "Delete",
            style: "destructive",
            onPress: handleDeletePress,
          },
        ]}
        cancelText={language === "ne" ? "रद्द गर्नुहोस्" : "Cancel"}
        onCancel={() => {
          setShowContactSheet(false);
          setSelectedContact(null);
        }}
      />

      <ConfirmationDialog
        visible={showDeleteConfirm}
        title={language === "ne" ? "पुष्टि गर्नुहोस्" : "Confirm Delete"}
        message={
          language === "ne"
            ? "यो सम्पर्क मेटाउन चाहनुहुन्छ?"
            : "Are you sure you want to delete this contact?"
        }
        confirmText={language === "ne" ? "मेटाउनुहोस्" : "Delete"}
        cancelText={language === "ne" ? "रद्द गर्नुहोस्" : "Cancel"}
        confirmStyle="destructive"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setSelectedContact(null);
        }}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.body,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  addText: {
    ...Typography.caption,
    color: Colors.success,
    fontWeight: "500",
  },
  contactsList: {
    // marginTop handled by individual items
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.xs,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightBackground,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  contactInitial: {
    ...Typography.caption,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    ...Typography.caption,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  contactPhone: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 11,
    marginBottom: 2,
  },
  voiceTag: {
    ...Typography.caption,
    color: Colors.success,
    fontSize: 10,
  },
  contactActions: {
    padding: Spacing.xs,
  },
  editIcon: {
    fontSize: 14,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  managementButtons: {
    flexDirection: "row",
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  managementButton: {
    flex: 1,
    backgroundColor: Colors.textPrimary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 20,
    alignItems: "center",
  },
  manageButton: {
    backgroundColor: Colors.textPrimary,
  },
  managementButtonText: {
    ...Typography.caption,
    color: Colors.surface,
    fontWeight: "600",
  },
});
