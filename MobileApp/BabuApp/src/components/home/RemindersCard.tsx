import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card } from "../common";
import { Colors, Typography, Spacing } from "../../constants";
import { Reminder } from "../../data/mockReminders";
import { translateReminderTitle } from "../../utils/translations";

interface RemindersCardProps {
  nextReminder: Reminder | null;
  upcomingReminders: Reminder[];
  language: "en" | "ne";
  onViewMore?: () => void;
}

export const RemindersCard: React.FC<RemindersCardProps> = ({
  nextReminder,
  upcomingReminders,
  language,
  onViewMore,
}) => {
  const getTitle = () => {
    return language === "ne" ? "आगामी सम्झनाहरू" : "Upcoming Reminders";
  };

  const getViewMoreText = () => {
    return language === "ne" ? "सबै हेर्नुहोस्" : "View More";
  };

  const getNoReminderText = () => {
    return language === "ne" ? "कुनै सम्झना छैन" : "No upcoming reminders";
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (date.getTime() - now.getTime()) / (1000 * 60)
    );

    if (language === "ne") {
      if (diffInMinutes < 60) return `${diffInMinutes} मिनेटमा`;
      const hours = Math.floor(diffInMinutes / 60);
      if (hours < 24) return `${hours} घण्टामा`;
      const days = Math.floor(hours / 24);
      return `${days} दिनमा`;
    } else {
      if (diffInMinutes < 60) return `in ${diffInMinutes}m`;
      const hours = Math.floor(diffInMinutes / 60);
      if (hours < 24) return `in ${hours}h`;
      const days = Math.floor(hours / 24);
      return `in ${days}d`;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return "🏥";
      case "personal":
        return "📝";
      case "medicine":
        return "💊";
      default:
        return "⏰";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "appointment":
        return Colors.danger;
      case "personal":
        return Colors.success;
      case "medicine":
        return Colors.warning;
      default:
        return Colors.textSecondary;
    }
  };

  const getTypeTextInNepali = (type: string) => {
    switch (type) {
      case "appointment":
        return "भेटघाट";
      case "personal":
        return "व्यक्तिगत";
      case "medicine":
        return "औषधि";
      default:
        return "सम्झना";
    }
  };

  if (upcomingReminders.length === 0) {
    return (
      <Card style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{getTitle()}</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>{getNoReminderText()}</Text>
        </View>
      </Card>
    );
  }

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{getTitle()}</Text>
        <TouchableOpacity onPress={onViewMore}>
          <Text style={styles.viewMoreText}>{getViewMoreText()}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.remindersList}>
        {upcomingReminders.slice(0, 2).map((reminder, index) => (
          <View
            key={reminder.id}
            style={[
              styles.reminderItem,
              index > 0 && { marginTop: Spacing.md },
            ]}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.typeIcon}>{getTypeIcon(reminder.type)}</Text>
            </View>
            <View style={styles.reminderInfo}>
              <View style={styles.reminderHeader}>
                <Text style={styles.reminderTitle}>
                  {translateReminderTitle(reminder.title, language)}
                </Text>
                <Text style={styles.timeText}>
                  {formatTime(reminder.scheduledTime)}
                </Text>
              </View>
              <View style={styles.typeContainer}>
                <View
                  style={[
                    styles.typeDot,
                    { backgroundColor: getTypeColor(reminder.type) },
                  ]}
                />
                <Text style={styles.typeText}>
                  {language === 'ne' ? getTypeTextInNepali(reminder.type) : reminder.type.charAt(0).toUpperCase() + reminder.type.slice(1)}
                </Text>
              </View>
            </View>
          </View>
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
  viewMoreText: {
    ...Typography.caption,
    color: Colors.success,
    fontWeight: "500",
  },
  remindersList: {
    // gap property might not be supported in older React Native versions
  },
  reminderItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  reminderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  timeText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightBackground,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  typeIcon: {
    fontSize: 20,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
    ...Typography.body,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  typeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: Spacing.xs,
  },
  typeText: {
    ...Typography.caption,
    color: Colors.textSecondary,
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
