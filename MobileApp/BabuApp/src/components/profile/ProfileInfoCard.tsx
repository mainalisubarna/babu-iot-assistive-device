import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Card, ActionSheet } from "../common";
import { Colors, Typography, Spacing } from "../../constants";
import { User } from "../../types";

// Import the profile placeholder image
const profilePlaceholder = require("../../../assets/images/profile.png");

interface ProfileInfoCardProps {
  user: User;
  language: "en" | "ne";
  onEditProfile?: () => void;
  onChangeProfilePicture?: () => void;
}

export const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({
  user,
  language,
  onEditProfile,
  onChangeProfilePicture,
}) => {
  const [showProfilePictureSheet, setShowProfilePictureSheet] = useState(false);
  const getEditText = () => {
    return language === "ne" ? "सम्पादन गर्नुहोस्" : "Edit";
  };

  const getProfileText = () => {
    return language === "ne" ? "प्रोफाइल" : "Profile";
  };

  const getMemberSinceText = () => {
    const date = user.createdAt.toLocaleDateString(
      language === "ne" ? "ne-NP" : "en-US",
      {
        year: "numeric",
        month: "long",
      }
    );
    return language === "ne" ? `${date} देखि सदस्य` : `Member since ${date}`;
  };

  const handleProfilePicturePress = () => {
    setShowProfilePictureSheet(true);
  };

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{getProfileText()}</Text>
        <TouchableOpacity onPress={onEditProfile}>
          <Text style={styles.editText}>{getEditText()}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileContent}>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={handleProfilePicturePress}
        >
          <View style={styles.avatar}>
            {user.profilePicture ? (
              <Image
                source={
                  typeof user.profilePicture === "string"
                    ? { uri: user.profilePicture }
                    : user.profilePicture
                }
                style={styles.avatarImage}
              />
            ) : (
              <Image source={profilePlaceholder} style={styles.avatarImage} />
            )}
          </View>
          <View style={styles.cameraIcon}>
            <Text style={styles.cameraEmoji}>📷</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.memberSince}>{getMemberSinceText()}</Text>
        </View>
      </View>

      <View style={styles.managementButtons}>
        <TouchableOpacity
          style={styles.managementButton}
          onPress={onEditProfile}
        >
          <Text style={styles.managementButtonText}>
            {language === "ne" ? "सम्पादन गर्नुहोस्" : "Edit Profile"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.managementButton}
          onPress={onChangeProfilePicture}
        >
          <Text style={styles.managementButtonText}>
            {language === "ne" ? "फोटो परिवर्तन गर्नुहोस्" : "Change Photo"}
          </Text>
        </TouchableOpacity>
      </View>

      <ActionSheet
        visible={showProfilePictureSheet}
        title={language === "ne" ? "प्रोफाइल फोटो" : "Profile Picture"}
        message={
          language === "ne"
            ? "प्रोफाइल फोटो परिवर्तन गर्न चाहनुहुन्छ?"
            : "Choose how to change your profile picture"
        }
        options={[
          {
            text: language === "ne" ? "फोटो लिनुहोस्" : "Take Photo",
            onPress: () => onChangeProfilePicture?.(),
          },
          {
            text:
              language === "ne"
                ? "ग्यालेरीबाट छान्नुहोस्"
                : "Choose from Gallery",
            onPress: () => onChangeProfilePicture?.(),
          },
        ]}
        cancelText={language === "ne" ? "रद्द गर्नुहोस्" : "Cancel"}
        onCancel={() => setShowProfilePictureSheet(false)}
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
  editText: {
    ...Typography.caption,
    color: Colors.success,
    fontWeight: "500",
  },
  profileContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginRight: Spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.success,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    ...Typography.title,
    color: Colors.surface,
    fontWeight: "bold",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.divider,
  },
  cameraEmoji: {
    fontSize: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...Typography.body,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  memberSince: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 11,
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
  managementButtonText: {
    ...Typography.caption,
    color: Colors.surface,
    fontWeight: "600",
  },
});
