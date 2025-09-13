import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card, StatusDot } from "../common";
import { Colors, Typography, Spacing } from "../../constants";
import { ActivityLog } from "../../types";

interface ActivitiesCardProps {
  recentActivities: ActivityLog[];
  language: "en" | "ne";
  onActivityPress?: (activity: ActivityLog) => void;
  onViewAll?: () => void;
}

export const ActivitiesCard: React.FC<ActivitiesCardProps> = ({
  recentActivities,
  language,
  onActivityPress,
  onViewAll,
}) => {
  const getTitle = () => {
    return language === "ne" ? "हालका गतिविधिहरू" : "Recent Activities";
  };

  const getViewAllText = () => {
    return language === "ne" ? "सबै हेर्नुहोस्" : "View All";
  };

  const getNoActivitiesText = () => {
    return language === "ne" ? "कुनै गतिविधि छैन" : "No recent activities";
  };

  const getActivityTypeText = (type: string) => {
    if (language === "ne") {
      switch (type) {
        case "fall":
          return "खसेको";
        case "medicine":
          return "औषधि";
        case "call":
          return "फोन";
        case "reminder":
          return "सम्झना";
        case "companion":
          return "साथी";
        default:
          return type;
      }
    }
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getActivityDescription = (activity: ActivityLog) => {
    if (activity.details.description) {
      // Translate activity descriptions to Nepali if needed
      if (language === "ne") {
        const translations: { [key: string]: string } = {
          "Medicine from Green Pouch taken at 8:00 AM.":
            "बिहान ८:०० बजे हरियो पाउचबाट औषधि लिइयो।",
          "Medicine from Blue Pouch missed at 2:00 PM.":
            "दिउँसो २:०० बजे नीलो पाउचको औषधि छुट्यो।",
          "Detected distress call 'Babu, help!' – SMS sent to Emergency Contact: Sita (+977-98XXXXXX).":
            "संकटको कल 'बाबु, मद्दत!' पत्ता लाग्यो।",
          "Called Kriansh at 5:45 PM via voice command.":
            "कृयांशलाई आवाज आदेशद्वारा फोन गरियो।",
          "Missed call attempt to Ram due to network issue.":
            "रामलाई फोन गर्न सकिएन।",
          "Verified Red Pouch for evening medicine.":
            "साँझको औषधिको लागि रातो पाउच प्रमाणित गरियो।",
          "Could not verify Yellow Pouch – image mismatch.":
            "पहेंलो पाउच प्रमाणित गर्न सकिएन।",
          "User had a 10-minute casual talk with Babu.":
            "बाबुसँग १० मिनेट कुराकानी गर्यो।",
          "Nepali news headlines played at 9:00 AM.":
            "बिहान ९:०० बजे नेपाली समाचार बजाइयो।",
          "Sagittarius राशिफल shared at 7:30 AM.":
            "बिहान ७:३० बजे धनु राशिफल साझा गरियो।",
        };
        return (
          translations[activity.details.description] ||
          activity.details.description
        );
      }
      return activity.details.description;
    }

    // Fallback to generic description
    return `${getActivityTypeText(activity.type)} activity`;
  };

  const getActivityIcon = (type: string, details: any) => {
    switch (type) {
      case "medicine":
        return details.verification === "failure"
          ? "❌"
          : details.pouchColor
          ? "🩺"
          : "💊";
      case "fall":
        return "🚨";
      case "call":
        return details.failureReason ? "⚠️" : "📞";
      case "reminder":
        return details.daysFromNow ? "⏰" : "🏥";
      case "companion":
        switch (details.activityType) {
          case "voice_chat":
            return "🗣️";
          case "news":
            return "📰";
          case "rasifal":
            return "🌟";
          case "patro":
            return "📅";
          case "tithi":
            return "🌕";
          case "weather":
            return "🌤️";
          case "music":
            return "🎵";
          default:
            return "💬";
        }
      default:
        return "📋";
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (language === "ne") {
      if (diffInMinutes < 60) return `${diffInMinutes} मिनेट अगाडि`;
      const hours = Math.floor(diffInMinutes / 60);
      if (hours < 24) return `${hours} घण्टा अगाडि`;
      const days = Math.floor(hours / 24);
      return `${days} दिन अगाडि`;
    } else {
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      const hours = Math.floor(diffInMinutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    }
  };

  const getStatusForActivity = (activity: ActivityLog) => {
    switch (activity.status) {
      case "completed":
        return "success";
      case "missed":
        return "danger";
      case "pending":
        return "warning";
      default:
        return "pending";
    }
  };

  if (recentActivities.length === 0) {
    return (
      <Card style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{getTitle()}</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>{getNoActivitiesText()}</Text>
        </View>
      </Card>
    );
  }

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{getTitle()}</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAllText}>{getViewAllText()}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.activitiesList}>
        {recentActivities.slice(0, 3).map((activity, index) => (
          <TouchableOpacity
            key={activity.id}
            style={[
              styles.activityItem,
              index > 0 && { marginTop: Spacing.md },
            ]}
            onPress={() => onActivityPress?.(activity)}
          >
            <View style={styles.activityIcon}>
              <Text style={styles.iconText}>
                {getActivityIcon(activity.type, activity.details)}
              </Text>
            </View>

            <View style={styles.activityInfo}>
              <View style={styles.activityHeader}>
                <Text style={styles.activityType}>
                  {getActivityTypeText(activity.type)}
                </Text>
                <StatusDot status={getStatusForActivity(activity)} size={6} />
              </View>
              <Text style={styles.activityDescription} numberOfLines={1}>
                {getActivityDescription(activity)}
              </Text>
              <Text style={styles.activityTime}>
                {formatTime(activity.timestamp)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
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
  viewAllText: {
    ...Typography.caption,
    color: Colors.success,
    fontWeight: "500",
  },
  activitiesList: {
    // gap property might not be supported in older React Native versions
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.xs,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.lightBackground,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  iconText: {
    fontSize: 16,
  },
  activityInfo: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  activityType: {
    ...Typography.caption,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginRight: Spacing.xs,
  },
  activityDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 2,
    lineHeight: 16,
  },
  activityTime: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 11,
  },

  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing.lg,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
