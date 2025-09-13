import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '../common';
import { Colors, Typography, Spacing } from '../../constants';
import { MedicineReminder } from '../../types';

interface MedicineScheduleCardProps {
  nextMedicine: MedicineReminder | null;
  nextTime: string;
  todaysMedicines: MedicineReminder[];
  language: 'en' | 'ne';
  onViewMore?: () => void;
}

export const MedicineScheduleCard: React.FC<MedicineScheduleCardProps> = ({
  nextMedicine,
  nextTime,
  todaysMedicines,
  language,
  onViewMore,
}) => {
  const getColorIndicator = (color: string) => {
    const colorMap: { [key: string]: string } = {
      red: Colors.danger,
      blue: '#3B82F6',
      green: Colors.success,
      yellow: Colors.warning,
      purple: '#8B5CF6',
      orange: '#F97316',
    };
    return colorMap[color] || Colors.textSecondary;
  };

  const getTitle = () => {
    return language === 'ne' ? 'आजको औषधि' : "Today's Medicine";
  };

  const getNextMedicineLabel = () => {
    return language === 'ne' ? 'अर्को औषधि' : 'Next medicine';
  };

  const getTimeLabel = () => {
    return language === 'ne' ? 'समय' : 'Time';
  };

  const getDosageLabel = () => {
    return language === 'ne' ? 'मात्रा' : 'Dosage';
  };

  const getNoMedicineText = () => {
    return language === 'ne' 
      ? 'आज कुनै औषधि छैन' 
      : 'No medicine scheduled today';
  };

  const getTotalMedicinesText = () => {
    return language === 'ne' 
      ? `आज ${todaysMedicines.length} औषधि` 
      : `${todaysMedicines.length} medicines today`;
  };

  const getViewMoreText = () => {
    return language === 'ne' ? 'सबै हेर्नुहोस्' : 'View More';
  };

  const getColorNameInNepali = (color: string) => {
    const colorMap: { [key: string]: string } = {
      red: 'रातो',
      blue: 'निलो',
      green: 'हरियो',
      yellow: 'पहेंलो',
      purple: 'बैजनी',
      orange: 'सुन्तला',
    };
    return colorMap[color] || color;
  };

  if (!nextMedicine) {
    return (
      <Card style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{getTitle()}</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>{getNoMedicineText()}</Text>
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

      <View style={styles.medicinesList}>
        {todaysMedicines.slice(0, 2).map((medicine, index) => (
          <View key={medicine.id} style={[styles.medicineItem, index > 0 && { marginTop: Spacing.md }]}>
            <View style={styles.medicineHeader}>
              <View style={styles.medicineNameRow}>
                <View 
                  style={[
                    styles.colorIndicator, 
                    { backgroundColor: getColorIndicator(medicine.colorPouch) }
                  ]} 
                />
                <Text style={styles.medicineName}>{medicine.medicineName}</Text>
              </View>
              <Text style={styles.medicineTime}>
                {medicine.times[0]} {/* Show first time */}
              </Text>
            </View>
            <Text style={styles.medicineDosage}>
              {medicine.dosage} {language === 'ne' 
                ? 'गोली' 
                : (medicine.dosage === 1 ? 'tablet' : 'tablets')
              } • {language === 'ne' 
                ? `${getColorNameInNepali(medicine.colorPouch)} झोला` 
                : `${medicine.colorPouch} pouch`
              }
            </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  viewMoreText: {
    ...Typography.caption,
    color: Colors.success,
    fontWeight: '500',
  },
  medicinesList: {
    // gap property might not be supported in older React Native versions
  },
  medicineItem: {
    paddingVertical: Spacing.xs,
  },
  medicineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  medicineNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicineTime: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  medicineDosage: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  title: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: Spacing.xs,
  },
  statusText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});