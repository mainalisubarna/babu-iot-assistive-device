import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Colors, Typography, Spacing } from '../constants';
import { User, Contact } from '../types';
import { userService } from '../services/userService';
import { ProfileInfoCard, EmergencyContactsCard, DeviceInfoCard } from '../components/profile';
import { ConfirmationDialog } from '../components/common';

interface ProfileScreenProps {
  language: 'en' | 'ne';
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ language }) => {
  const [user, setUser] = useState<User | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<Contact[]>([]);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEditProfileDialog, setShowEditProfileDialog] = useState(false);
  const [showAddContactDialog, setShowAddContactDialog] = useState(false);
  const [showManageDeviceDialog, setShowManageDeviceDialog] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const [userResult, contactsResult, deviceResult] = await Promise.all([
        userService.getProfile(),
        userService.getEmergencyContacts(),
        userService.getDeviceInfo(),
      ]);

      setUser(userResult);
      setEmergencyContacts(contactsResult);
      setDeviceInfo(deviceResult);
    } catch (error) {
      console.error('Failed to load profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setShowEditProfileDialog(true);
  };

  const handleConfirmEditProfile = () => {
    setShowEditProfileDialog(false);
    // Here you would navigate to edit profile screen
    console.log('Edit profile');
  };

  const handleChangeProfilePicture = () => {
    // Here you would implement image picker
    console.log('Change profile picture');
    Alert.alert(
      language === 'ne' ? 'सफल' : 'Success',
      language === 'ne' 
        ? 'प्रोफाइल फोटो परिवर्तन गर्ने सुविधा छिट्टै आउनेछ'
        : 'Profile picture change feature coming soon'
    );
  };

  const handleAddContact = () => {
    setShowAddContactDialog(true);
  };

  const handleConfirmAddContact = () => {
    setShowAddContactDialog(false);
    // Here you would navigate to contact management screen
    console.log('Navigate to contact management');
  };

  const handleEditContact = (contact: Contact) => {
    console.log('Edit contact:', contact.id);
    // Here you would navigate to edit contact screen
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      await userService.deleteEmergencyContact(contactId);
      setEmergencyContacts(prev => prev.filter(c => c.id !== contactId));
      Alert.alert(
        language === 'ne' ? 'सफल' : 'Success',
        language === 'ne' 
          ? 'सम्पर्क सफलतापूर्वक मेटाइयो'
          : 'Contact deleted successfully'
      );
    } catch (error) {
      Alert.alert(
        language === 'ne' ? 'त्रुटि' : 'Error',
        language === 'ne' 
          ? 'सम्पर्क मेटाउन सकिएन'
          : 'Failed to delete contact'
      );
    }
  };

  const handleManageDevice = () => {
    setShowManageDeviceDialog(true);
  };

  const handleConfirmManageDevice = () => {
    setShowManageDeviceDialog(false);
    // Here you would navigate to device management screen
    console.log('Manage device');
  };

  const getTitle = () => {
    return language === 'ne' ? 'प्रोफाइल' : 'Profile';
  };

  const getSubtitle = () => {
    return language === 'ne' 
      ? 'तपाईंको खाता र यन्त्रको जानकारी'
      : 'Your account and device information';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>{getTitle()}</Text>
        <Text style={styles.subtitle}>{getSubtitle()}</Text>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {language === 'ne' ? 'लोड हुँदैछ...' : 'Loading...'}
          </Text>
        </View>
      )}

      {!loading && (
        <>
          {user && (
            <ProfileInfoCard
              user={user}
              language={language}
              onEditProfile={handleEditProfile}
              onChangeProfilePicture={handleChangeProfilePicture}
            />
          )}

          <EmergencyContactsCard
            contacts={emergencyContacts}
            language={language}
            onAddContact={handleAddContact}
            onEditContact={handleEditContact}
            onDeleteContact={handleDeleteContact}
            onManageAll={() => console.log('Navigate to contact management')}
          />

          {deviceInfo && (
            <DeviceInfoCard
              deviceInfo={deviceInfo}
              language={language}
              onManageDevice={handleManageDevice}
            />
          )}
        </>
      )}

      <ConfirmationDialog
        visible={showEditProfileDialog}
        title={language === 'ne' ? 'प्रोफाइल सम्पादन गर्नुहोस्' : 'Edit Profile'}
        message={language === 'ne' 
          ? 'प्रोफाइल सम्पादन गर्न चाहनुहुन्छ?'
          : 'Do you want to edit your profile information?'}
        confirmText={language === 'ne' ? 'सम्पादन गर्नुहोस्' : 'Edit'}
        cancelText={language === 'ne' ? 'रद्द गर्नुहोस्' : 'Cancel'}
        onConfirm={handleConfirmEditProfile}
        onCancel={() => setShowEditProfileDialog(false)}
      />

      <ConfirmationDialog
        visible={showAddContactDialog}
        title={language === 'ne' ? 'नयाँ सम्पर्क थप्नुहोस्' : 'Add New Contact'}
        message={language === 'ne' 
          ? 'नयाँ आपातकालीन सम्पर्क थप्न चाहनुहुन्छ?'
          : 'Do you want to add a new emergency contact?'}
        confirmText={language === 'ne' ? 'थप्नुहोस्' : 'Add'}
        cancelText={language === 'ne' ? 'रद्द गर्नुहोस्' : 'Cancel'}
        confirmStyle="success"
        onConfirm={handleConfirmAddContact}
        onCancel={() => setShowAddContactDialog(false)}
      />

      <ConfirmationDialog
        visible={showManageDeviceDialog}
        title={language === 'ne' ? 'यन्त्र व्यवस्थापन' : 'Device Management'}
        message={language === 'ne' 
          ? 'यन्त्र व्यवस्थापन गर्न चाहनुहुन्छ?'
          : 'Do you want to manage your device settings?'}
        confirmText={language === 'ne' ? 'व्यवस्थापन गर्नुहोस्' : 'Manage'}
        cancelText={language === 'ne' ? 'रद्द गर्नुहोस्' : 'Cancel'}
        onConfirm={handleConfirmManageDevice}
        onCancel={() => setShowManageDeviceDialog(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.display,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    fontSize: 28,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  loadingContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});