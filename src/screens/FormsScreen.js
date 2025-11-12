import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Text, Card, Button, FAB } from 'react-native-paper';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

import EquifaxForm from '../forms/EquifaxForm';
import ExperianForm from '../forms/ExperianForm';
import TransUnionForm from '../forms/TransUnionForm';
import EdgeStandoutForm from '../forms/EdgeStandoutForm';

const FormsScreen = () => {
  const [selectedForm, setSelectedForm] = useState(null);

  const forms = [
    {
      id: 'equifax',
      title: 'Equifax Housing Dispute',
      description: 'Dispute rental & eviction errors with Equifax',
      icon: 'file-document',
      color: '#FF6B6B',
      component: EquifaxForm,
    },
    {
      id: 'experian',
      title: 'Experian Tenant Screening Dispute',
      description: 'Challenge screening report inaccuracies',
      icon: 'file-document',
      color: '#4ECDC4',
      component: ExperianForm,
    },
    {
      id: 'transunion',
      title: 'TransUnion Rental History Dispute',
      description: 'Correct rental history with TransUnion',
      icon: 'file-document',
      color: '#45B7D1',
      component: TransUnionForm,
    },
    {
      id: 'edge',
      title: 'Tenant Advantage Profile',
      description: 'Stand out in screening software',
      icon: 'star',
      color: '#0e6efb',
      component: EdgeStandoutForm,
    },
  ];

  const generatePDF = async (formData, formType) => {
    const html = generateFormHTML(formData, formType);
    
    try {
      const { uri } = await Print.printToFileAsync({ html });
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Success', 'PDF saved to device');
      }
      
      return uri;
    } catch (error) {
      Alert.alert('Error', 'Failed to generate PDF');
      console.error(error);
    }
  };

  const generateFormHTML = (data, type) => {
    // Form-specific HTML generation
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #0e6efb; }
            .section { margin-bottom: 20px; }
            .field { margin: 10px 0; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>${type} Dispute Form</h1>
          <div class="section">
            <h2>Personal Information</h2>
            <div class="field">
              <span class="label">Name:</span> ${data.name || ''}
            </div>
            <div class="field">
              <span class="label">Address:</span> ${data.address || ''}
            </div>
            <div class="field">
              <span class="label">SSN:</span> ${data.ssn || ''}
            </div>
          </div>
          ${generateFormSpecificContent(data, type)}
        </body>
      </html>
    `;
  };

  const generateFormSpecificContent = (data, type) => {
    switch(type) {
      case 'equifax':
        return `
          <div class="section">
            <h2>Dispute Details</h2>
            <div class="field">
              <span class="label">Account:</span> ${data.account || ''}
            </div>
            <div class="field">
              <span class="label">Reason:</span> ${data.reason || ''}
            </div>
            <div class="field">
              <span class="label">Evidence:</span> ${data.evidence || ''}
            </div>
          </div>
        `;
      default:
        return '';
    }
  };

  if (selectedForm) {
    const FormComponent = selectedForm.component;
    return (
      <FormComponent
        onBack={() => setSelectedForm(null)}
        onGenerate={generatePDF}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Document Generator</Text>
        <Text style={styles.subtitle}>
          Create and download your dispute forms
        </Text>
      </View>

      {forms.map((form) => (
        <Card
          key={form.id}
          style={[styles.card, { borderLeftColor: form.color }]}
          onPress={() => setSelectedForm(form)}
        >
          <Card.Content>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>{form.title}</Text>
                <Text style={styles.cardDescription}>
                  {form.description}
                </Text>
              </View>
              <Button
                mode="contained"
                style={[styles.button, { backgroundColor: form.color }]}
                onPress={() => setSelectedForm(form)}
              >
                Create
              </Button>
            </View>
          </Card.Content>
        </Card>
      ))}

      <View style={styles.info}>
        <Text style={styles.infoTitle}>How it works</Text>
        <Text style={styles.infoText}>
          1. Select the form you need{'\n'}
          2. Fill in your information{'\n'}
          3. Review and edit as needed{'\n'}
          4. Generate and download PDF{'\n'}
          5. Print or email to credit bureaus
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0e1726',
  },
  subtitle: {
    fontSize: 16,
    color: '#5b6473',
    marginTop: 5,
  },
  card: {
    margin: 15,
    borderLeftWidth: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0e1726',
  },
  cardDescription: {
    fontSize: 14,
    color: '#5b6473',
    marginTop: 5,
  },
  button: {
    marginLeft: 10,
  },
  info: {
    margin: 20,
    padding: 20,
    backgroundColor: '#eef4ff',
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1945a5',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#1945a5',
    lineHeight: 22,
  },
});

export default FormsScreen;
