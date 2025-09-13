import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { ActivityLog } from '../types';
import { activityService } from '../services/activityService';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

type TimeFilter = 'today' | 'week' | 'month' | 'all';

interface ActivitiesScreenProps {
  language?: 'en' | 'ne';
}

const ActivitiesScreen: React.FC<ActivitiesScreenProps> = ({ language = 'en' }) => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityLog[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter>('today');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadActivities();
  }, []);

  useEffect(() => {
    filterActivities();
  }, [activities, selectedFilter]);

  const loadActivities = async () => {
    try {
      const data = await activityService.getAllActivities();
      setActivities(data);
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadActivities();
    setRefreshing(false);
  };

  const handleMarkAsChecked = async (activityId: string) => {
    try {
      await activityService.markAsChecked(activityId);
      await loadActivities(); // Refresh the list
    } catch (error) {
      console.error('Error marking activity as checked:', error);
    }
  };

  const filterActivities = () => {
    const now = new Date();
    let filtered = activities;

    switch (selectedFilter) {
      case 'today':
        filtered = activities.filter(activity => {
          const activityDate = new Date(activity.timestamp);
          return activityDate.toDateString() === now.toDateString();
        });
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = activities.filter(activity => 
          new Date(activity.timestamp) >= weekAgo
        );
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = activities.filter(activity => 
          new Date(activity.timestamp) >= monthAgo
        );
        break;
      case 'all':
      default:
        filtered = activities;
        break;
    }

    setFilteredActivities(filtered.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ));
  };

  const getActivityIcon = (type: string, details: any) => {
    switch (type) {
      case 'medicine':
        return details.verification === 'failure' ? '❌' : 
               details.pouchColor ? '🩺' : '💊';
      case 'fall':
        return '🚨';
      case 'call':
        return details.failureReason ? '⚠️' : '📞';
      case 'reminder':
        return details.daysFromNow ? '⏰' : '🏥';
      case 'companion':
        switch (details.activityType) {
          case 'voice_chat': return '🗣️';
          case 'news': return '📰';
          case 'rasifal': return '🌟';
          case 'patro': return '📅';
          case 'tithi': return '🌕';
          case 'fallback': return '🎵';
          case 'weather': return '🌤️';
          case 'music': return '🎵';
          default: return '💬';
        }
      default:
        return '📋';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return Colors.success;
      case 'missed':
        return Colors.danger;
      case 'pending':
        return Colors.warning;
      default:
        return Colors.textSecondary;
    }
  };

  const translate = (key: string, fallback: string) => {
    if (language === 'en') return fallback;
    
    const nepaliTranslations: { [key: string]: string } = {
      'activities': 'गतिविधिहरू',
      'today': 'आज',
      'thisWeek': 'यो हप्ता',
      'thisMonth': 'यो महिना',
      'all': 'सबै',
      'markAsChecked': 'जाँच गरिएको चिन्ह लगाउनुहोस्',
      'noActivities': 'अहिलेसम्म कुनै गतिविधि छैन',
      'activitiesDescription': 'तपाईंका दैनिक गतिविधिहरू यहाँ देखा पर्नेछ',
      'yesterday': 'हिजो'
    };
    return nepaliTranslations[key] || fallback;
  };

  const translateActivityDescription = (description: string) => {
    if (language === 'en') return description;
    
    // Translate common activity descriptions to Nepali
    const translations: { [key: string]: string } = {
      'Medicine from Green Pouch taken at 8:00 AM.': 'बिहान ८:०० बजे हरियो पाउचबाट औषधि लिइयो।',
      'Medicine from Blue Pouch missed at 2:00 PM.': 'दिउँसो २:०० बजे नीलो पाउचको औषधि छुट्यो।',
      "Detected distress call 'Babu, help!' – SMS sent to Emergency Contact: Sita (+977-98XXXXXX).": "संकटको कल 'बाबु, मद्दत!' पत्ता लाग्यो - आपतकालीन सम्पर्क सीतालाई SMS पठाइयो (+977-98XXXXXX)।",
      'Called Kriansh at 5:45 PM via voice command.': 'साँझ ५:४५ बजे आवाज आदेशद्वारा कृयांशलाई फोन गरियो।',
      'Missed call attempt to Ram due to network issue.': 'नेटवर्क समस्याका कारण रामलाई फोन गर्न सकिएन।',
      'Verified Red Pouch for evening medicine.': 'साँझको औषधिको लागि रातो पाउच प्रमाणित गरियो।',
      'Could not verify Yellow Pouch – image mismatch.': 'पहेंलो पाउच प्रमाणित गर्न सकिएन - तस्बिर मेल खाएन।',
      'User had a 10-minute casual talk with Babu.': 'प्रयोगकर्ताले बाबुसँग १० मिनेट कुराकानी गर्यो।',
      'Nepali news headlines played at 9:00 AM.': 'बिहान ९:०० बजे नेपाली समाचारका शीर्षकहरू बजाइयो।',
      'Sagittarius राशिफल shared at 7:30 AM.': 'बिहान ७:३० बजे धनु राशिफल साझा गरियो।',
      'Informed about Ekadasi on upcoming Friday.': 'आउँदो शुक्रबार एकादशीको जानकारी दिइयो।',
      "User asked for today's tithi – Received 'Purnima'.": "प्रयोगकर्ताले आजको तिथि सोध्यो - 'पूर्णिमा' प्राप्त भयो।",
      'Reminder set: Visit health camp in 10 days.': 'सम्झना सेट गरियो: १० दिनमा स्वास्थ्य शिविरमा जानुहोस्।',
      'Reminder: You have a doctor\'s appointment today at 4:00 PM.': 'सम्झना: तपाईंको आज दिउँसो ४:०० बजे डाक्टरसँग भेटघाट छ।',
      "Unknown request: User said 'Babu, play the old song.' (Not supported but logged)": "अज्ञात अनुरोध: प्रयोगकर्ताले भन्यो 'बाबु, पुरानो गीत बजाउ।' (समर्थित छैन तर लग गरियो)",
      'Morning vitamins from Orange Pouch taken at 7:00 AM.': 'बिहान ७:०० बजे सुन्तला पाउचबाट भिटामिन लिइयो।',
      'Called Maya (neighbor) for daily check-in.': 'दैनिक जाँचका लागि माया (छिमेकी)लाई फोन गरियो।',
      'Asked about today\'s weather forecast for Kathmandu.': 'काठमाडौंको आजको मौसम पूर्वानुमानको बारेमा सोधियो।',
      'Minor fall detected in kitchen - user confirmed safe.': 'भान्साकोठामा सानो खसेको पत्ता लाग्यो - प्रयोगकर्ताले सुरक्षित भएको पुष्टि गर्यो।',
      'Reminder: Water the plants in the garden.': 'सम्झना: बगैंचाका बिरुवाहरूलाई पानी दिनुहोस्।',

      'Blood pressure medicine from White Pouch taken at 8:00 PM.': 'राति ८:०० बजे सेतो पाउचबाट रक्तचापको औषधि लिइयो।',
      'Called Dr. Sharma for medication consultation.': 'औषधि परामर्शका लागि डा. शर्मालाई फोन गरियो।',

      'Reminder: Visit bank for pension collection.': 'सम्झना: निवृत्तिभरण संकलनका लागि बैंक जानुहोस्।',
      'Calcium supplement from Pink Pouch taken at 9:00 AM.': 'बिहान ९:०० बजे गुलाबी पाउचबाट क्यालसियम पूरक लिइयो।',
      'Played classic Nepali songs for 45 minutes.': '४५ मिनेटका लागि क्लासिक नेपाली गीतहरू बजाइयो।',
      'Long conversation with grandson about his studies.': 'नातिसँग उसको अध्ययनको बारेमा लामो कुराकानी।',
      'Fall detected in bathroom - family notified immediately.': 'बाथरूममा खसेको पत्ता लाग्यो - परिवारलाई तुरुन्त जानकारी दिइयो।',
      'Guided meditation session for stress relief - 15 minutes.': 'तनाव कम गर्नका लागि निर्देशित ध्यान सत्र - १५ मिनेट।'
    };
    
    return translations[description] || description;
  };

  const getStatusDot = (status: string) => {
    return (
      <View style={[styles.statusDot, { backgroundColor: getStatusColor(status) }]} />
    );
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (timestamp: Date) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    if (date.toDateString() === today.toDateString()) {
      return translate('today', 'Today');
    } else if (date.toDateString() === yesterday.toDateString()) {
      return translate('yesterday', 'Yesterday');
    } else {
      if (language === 'ne') {
        const nepaliMonths = ['जन', 'फेब', 'मार्च', 'अप्रिल', 'मे', 'जुन', 'जुलाई', 'अग', 'सेप्ट', 'अक्ट', 'नोभ', 'डिस'];
        const nepaliNumbers = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
        const month = nepaliMonths[date.getMonth()];
        const day = date.getDate().toString().split('').map(d => nepaliNumbers[parseInt(d)]).join('');
        return `${month} ${day}`;
      } else {
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      }
    }
  };

  const renderFilterButton = (filter: TimeFilter, label: string) => (
    <TouchableOpacity
      key={filter}
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonActive
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text style={[
        styles.filterButtonText,
        selectedFilter === filter && styles.filterButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderActivityCard = (activity: ActivityLog) => (
    <View key={activity.id} style={styles.activityCard}>
      <View style={styles.activityHeader}>
        <View style={styles.activityIconContainer}>
          <Text style={styles.activityIcon}>
            {getActivityIcon(activity.type, activity.details)}
          </Text>
        </View>
        <View style={styles.activityInfo}>
          <View style={styles.activityTitleRow}>
            <Text style={styles.activityTitle}>
              {translateActivityDescription(activity.details.description) || 
               `${activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} Activity`}
            </Text>
            {getStatusDot(activity.status)}
          </View>
          <View style={styles.activityMeta}>
            <Text style={styles.activityTime}>
              {formatDate(activity.timestamp)} • {formatTime(activity.timestamp)}
            </Text>
          </View>
        </View>
      </View>
      
      {activity.type === 'fall' && activity.status === 'pending' && (
        <TouchableOpacity 
          style={styles.markCheckedButton}
          onPress={() => handleMarkAsChecked(activity.id)}
        >
          <Text style={styles.markCheckedButtonText}>
            {translate('markAsChecked', 'Mark as Checked')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>
        {translate('noActivities', 'No activities yet')}
      </Text>
      <Text style={styles.emptyStateSubtitle}>
        {translate('activitiesDescription', 'Your daily activities will appear here')}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {translate('activities', 'Activities')}
        </Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.filterContainer}>
        {renderFilterButton('today', translate('today', 'Today'))}
        {renderFilterButton('week', translate('thisWeek', 'This Week'))}
        {renderFilterButton('month', translate('thisMonth', 'This Month'))}
        {renderFilterButton('all', translate('all', 'All'))}
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredActivities.length > 0 ? (
          <View style={styles.activitiesList}>
            {filteredActivities.map(renderActivityCard)}
          </View>
        ) : (
          renderEmptyState()
        )}
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
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: Typography.display.fontSize,
    fontWeight: Typography.display.fontWeight as any,
    color: Colors.textPrimary,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.divider,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.backgroundGradientTop,
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 18,
    backgroundColor: Colors.backgroundGradientBottom,
  },
  filterButtonActive: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  filterButtonText: {
    fontSize: Typography.caption.fontSize,
    fontWeight: Typography.caption.fontWeight as any,
    color: Colors.textSecondary,
  },
  filterButtonTextActive: {
    color: Colors.textPrimary,
    fontWeight: Typography.body.fontWeight as any,
  },
  scrollView: {
    flex: 1,
  },
  activitiesList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  activityCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundGradientBottom,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityIcon: {
    fontSize: 20,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  activityTitle: {
    fontSize: Typography.body.fontSize,
    fontWeight: Typography.body.fontWeight as any,
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityTime: {
    fontSize: Typography.caption.fontSize,
    fontWeight: Typography.caption.fontWeight as any,
    color: Colors.textSecondary,
  },
  markCheckedButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.danger,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  markCheckedButtonText: {
    fontSize: Typography.caption.fontSize,
    fontWeight: Typography.body.fontWeight as any,
    color: Colors.surface,
  },
  emptyState: {
    backgroundColor: Colors.backgroundGradientBottom,
    borderRadius: 20,
    padding: 16,
    margin: 16,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: Typography.body.fontSize,
    fontWeight: Typography.body.fontWeight as any,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  emptyStateSubtitle: {
    fontSize: Typography.caption.fontSize,
    fontWeight: Typography.caption.fontWeight as any,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default ActivitiesScreen;