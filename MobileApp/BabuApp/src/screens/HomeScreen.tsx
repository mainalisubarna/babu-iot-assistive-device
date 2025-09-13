import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Colors, Typography, Spacing } from "../constants";
import { DeviceStatus, MedicineReminder, ActivityLog } from "../types";
import { deviceService } from "../services/deviceService";
import { medicineService } from "../services/medicineService";
import { reminderService } from "../services/reminderService";
import { activityService } from "../services/activityService";
import {
  DeviceStatusCard,
  MedicineScheduleCard,
  RemindersCard,
  ActivitiesCard,
} from "../components/home";
import { ConfirmationDialog } from "../components/common";
import { Reminder } from "../data/mockReminders";

interface HomeScreenProps {
  language: "en" | "ne";
  onNavigateToActivities?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ language, onNavigateToActivities }) => {
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus | null>(null);
  const [nextMedicine, setNextMedicine] = useState<MedicineReminder | null>(
    null
  );
  const [nextMedicineTime, setNextMedicineTime] = useState<string>("");
  const [todaysMedicines, setTodaysMedicines] = useState<MedicineReminder[]>(
    []
  );
  const [nextReminder, setNextReminder] = useState<Reminder | null>(null);
  const [upcomingReminders, setUpcomingReminders] = useState<Reminder[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [
        deviceStatusResult,
        medicineResult,
        reminderResult,
        upcomingRemindersResult,
        activitiesResult,
      ] = await Promise.all([
        deviceService.getStatus(),
        medicineService.getNextMedicine(),
        reminderService.getNext(),
        reminderService.getUpcoming(5),
        activityService.getRecent(5),
      ]);

      setDeviceStatus(deviceStatusResult);
      setNextMedicine(medicineResult.medicine);
      setNextMedicineTime(medicineResult.time);
      setTodaysMedicines(medicineResult.todaysMedicines);
      setNextReminder(reminderResult);
      setUpcomingReminders(upcomingRemindersResult);
      setRecentActivities(activitiesResult);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivityPress = (activity: ActivityLog) => {
    // Navigate to Activities tab when any activity is pressed
    onNavigateToActivities?.();
  };

  const handleViewAllActivities = () => {
    // Navigate to Activities tab when "View All" is pressed
    onNavigateToActivities?.();
  };

  const handleViewMoreMedicines = () => {
    // Here you would navigate to medicines screen
    console.log("View more medicines");
  };

  const handleViewMoreReminders = () => {
    // Here you would navigate to reminders screen
    console.log("View more reminders");
  };

  const getWelcomeText = () => {
    return language === "ne" ? "स्वागतम्" : "Welcome";
  };

  const getOverviewText = () => {
    return language === "ne"
      ? "तपाईंको बाबु यन्त्रको स्थिति"
      : "Your Babu device overview";
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>{getWelcomeText()}</Text>
        <Text style={styles.overviewText}>{getOverviewText()}</Text>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {language === "ne" ? "लोड हुँदैछ..." : "Loading..."}
          </Text>
        </View>
      )}

      {!loading && (
        <>
          {deviceStatus && (
            <DeviceStatusCard deviceStatus={deviceStatus} language={language} />
          )}

          <MedicineScheduleCard
            nextMedicine={nextMedicine}
            nextTime={nextMedicineTime}
            todaysMedicines={todaysMedicines}
            language={language}
            onViewMore={handleViewMoreMedicines}
          />

          <RemindersCard 
            nextReminder={nextReminder} 
            upcomingReminders={upcomingReminders}
            language={language}
            onViewMore={handleViewMoreReminders}
          />

          <ActivitiesCard
            recentActivities={recentActivities}
            language={language}
            onActivityPress={handleActivityPress}
            onViewAll={handleViewAllActivities}
          />
        </>
      )}


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    padding: Spacing.xl,
    alignItems: "center",
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  welcomeText: {
    ...Typography.display,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    fontSize: 28,
  },
  overviewText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
