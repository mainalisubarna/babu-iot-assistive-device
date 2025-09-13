import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { Colors, Typography } from '../constants';
import { translate } from '../utils/translations';

interface DocumentReaderScreenProps {
  language?: 'en' | 'ne';
  onBack?: () => void;
}

const DocumentReaderScreen: React.FC<DocumentReaderScreenProps> = ({ 
  language = 'en', 
  onBack 
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [scannedText, setScannedText] = useState<string | null>(null);
  const [scannedImage, setScannedImage] = useState<string | null>(null);

  const handleTakePhoto = async () => {
    try {
      setIsScanning(true);
      
      // Simulate camera capture and OCR processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock OCR result
      const mockText = "This is a sample document text that has been scanned and extracted using OCR technology. The Babu device can read this text aloud in Nepali language for better understanding.";
      
      setScannedText(mockText);
      setScannedImage('https://via.placeholder.com/300x200/E8E8E8/666666?text=Scanned+Document');
      setIsScanning(false);
      
      Alert.alert(
        translate('documentScanned', 'Document Scanned', language),
        translate('documentScanned', 'Document has been scanned successfully. Tap "Read Aloud" to hear it in Nepali.', language)
      );
    } catch (error) {
      setIsScanning(false);
      Alert.alert(
        translate('error', 'Error', language),
        translate('noDocumentFound', 'No document found or scanning failed', language)
      );
    }
  };

  const handleSelectFromGallery = () => {
    Alert.alert(
      translate('selectFromGallery', 'Select from Gallery', language),
      translate('selectFromGallery', 'This feature will allow you to select an image from your gallery', language),
      [
        { text: translate('cancel', 'Cancel', language), style: 'cancel' },
        { 
          text: 'OK', 
          onPress: () => {
            // Mock gallery selection
            const mockText = "यो एक नमूना कागजात हो जुन ग्यालेरीबाट छानिएको छ। बाबु यन्त्रले यसलाई नेपालीमा पढेर सुनाउन सक्छ।";
            setScannedText(mockText);
            setScannedImage('https://via.placeholder.com/300x200/E8E8E8/666666?text=Gallery+Document');
          }
        }
      ]
    );
  };

  const handleReadAloud = async () => {
    if (!scannedText) return;
    
    try {
      setIsReading(true);
      
      // Simulate text-to-speech processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setIsReading(false);
      
      Alert.alert(
        translate('success', 'Success', language),
        translate('readingDocument', 'Document has been read aloud successfully', language)
      );
    } catch (error) {
      setIsReading(false);
      Alert.alert(
        translate('error', 'Error', language),
        'Failed to read document aloud'
      );
    }
  };

  const handleClearDocument = () => {
    setScannedText(null);
    setScannedImage(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {translate('documentReader', 'Document Reader', language)}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Instructions */}
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsIcon}>📄</Text>
            <Text style={styles.instructionsTitle}>
              {language === 'ne' ? 'कसरी प्रयोग गर्ने' : 'How to Use'}
            </Text>
            <Text style={styles.instructionsText}>
              {language === 'ne' 
                ? '१. कागजातको फोटो खिच्नुहोस् वा ग्यालेरीबाट छान्नुहोस्\n२. बाबुले कागजात स्क्यान गर्नेछ\n३. "ठूलो स्वरमा पढ्नुहोस्" थिच्नुहोस्\n४. बाबुले नेपालीमा पढेर सुनाउनेछ'
                : '1. Take a photo of the document or select from gallery\n2. Babu will scan the document\n3. Tap "Read Aloud" button\n4. Babu will read it aloud in Nepali'
              }
            </Text>
          </View>

          {/* Camera Actions */}
          {!scannedText && (
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.primaryAction]}
                onPress={handleTakePhoto}
                disabled={isScanning}
              >
                <Text style={styles.actionIcon}>📷</Text>
                <Text style={styles.actionText}>
                  {isScanning 
                    ? translate('scanningDocument', 'Scanning...', language)
                    : translate('takePhoto', 'Take Photo', language)
                  }
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.secondaryAction]}
                onPress={handleSelectFromGallery}
                disabled={isScanning}
              >
                <Text style={styles.actionIcon}>🖼️</Text>
                <Text style={styles.actionText}>
                  {translate('selectFromGallery', 'Select from Gallery', language)}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Scanned Document */}
          {scannedText && (
            <View style={styles.scannedContainer}>
              <View style={styles.scannedHeader}>
                <Text style={styles.scannedTitle}>
                  {translate('documentScanned', 'Scanned Document', language)}
                </Text>
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={handleClearDocument}
                >
                  <Text style={styles.clearButtonText}>×</Text>
                </TouchableOpacity>
              </View>

              {scannedImage && (
                <View style={styles.imageContainer}>
                  <Image source={{ uri: scannedImage }} style={styles.scannedImage} />
                </View>
              )}

              <View style={styles.textContainer}>
                <Text style={styles.scannedTextLabel}>
                  {language === 'ne' ? 'स्क्यान गरिएको पाठ:' : 'Scanned Text:'}
                </Text>
                <ScrollView style={styles.textScrollView} nestedScrollEnabled>
                  <Text style={styles.scannedText}>{scannedText}</Text>
                </ScrollView>
              </View>

              <TouchableOpacity 
                style={[styles.readButton, isReading && styles.readButtonDisabled]}
                onPress={handleReadAloud}
                disabled={isReading}
              >
                <Text style={styles.readButtonIcon}>🔊</Text>
                <Text style={styles.readButtonText}>
                  {isReading 
                    ? translate('readingDocument', 'Reading...', language)
                    : (language === 'ne' ? 'ठूलो स्वरमा पढ्नुहोस्' : 'Read Aloud')
                  }
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Features Info */}
          <View style={styles.featuresCard}>
            <Text style={styles.featuresTitle}>
              {language === 'ne' ? 'सुविधाहरू' : 'Features'}
            </Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>
                  {language === 'ne' 
                    ? 'अंग्रेजी कागजातहरू नेपालीमा पढ्छ'
                    : 'Reads English documents in Nepali'
                  }
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>
                  {language === 'ne' 
                    ? 'स्पष्ट र बुझ्ने आवाज'
                    : 'Clear and understandable voice'
                  }
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>
                  {language === 'ne' 
                    ? 'कुनै पनि प्रकारको कागजात'
                    : 'Any type of document'
                  }
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>
                  {language === 'ne' 
                    ? 'तुरुन्त स्क्यान र पढाइ'
                    : 'Instant scan and reading'
                  }
                </Text>
              </View>
            </View>
          </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: Colors.textPrimary,
  },
  title: {
    fontSize: Typography.title.fontSize,
    fontWeight: Typography.title.fontWeight as any,
    color: Colors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  instructionsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  instructionsIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: Typography.title.fontSize,
    fontWeight: Typography.title.fontWeight as any,
    color: Colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  instructionsText: {
    fontSize: Typography.body.fontSize,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  actionsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryAction: {
    backgroundColor: Colors.success,
  },
  secondaryAction: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.success,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  actionText: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    color: Colors.surface,
  },
  scannedContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  scannedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scannedTitle: {
    fontSize: Typography.title.fontSize,
    fontWeight: Typography.title.fontWeight as any,
    color: Colors.textPrimary,
  },
  clearButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.danger + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 20,
    color: Colors.danger,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scannedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: Colors.backgroundGradientTop,
  },
  textContainer: {
    marginBottom: 20,
  },
  scannedTextLabel: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  textScrollView: {
    maxHeight: 150,
    backgroundColor: Colors.backgroundGradientTop,
    borderRadius: 8,
    padding: 12,
  },
  scannedText: {
    fontSize: Typography.body.fontSize,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  readButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.success,
    padding: 16,
    borderRadius: 12,
  },
  readButtonDisabled: {
    backgroundColor: Colors.textSecondary,
  },
  readButtonIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  readButtonText: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    color: Colors.surface,
  },
  featuresCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featuresTitle: {
    fontSize: Typography.title.fontSize,
    fontWeight: Typography.title.fontWeight as any,
    color: Colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 16,
    color: Colors.success,
    marginRight: 12,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: Typography.body.fontSize,
    color: Colors.textSecondary,
    flex: 1,
  },
});

export default DocumentReaderScreen;