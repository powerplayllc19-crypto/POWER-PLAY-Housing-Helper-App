import React, { useState } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Checkbox,
  RadioButton,
  HelperText,
} from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';

const EquifaxForm = ({ onBack, onGenerate }) => {
  const [disputeType, setDisputeType] = useState('eviction');
  const [includeProof, setIncludeProof] = useState(false);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      // Personal Information
      firstName: '',
      middleName: '',
      lastName: '',
      ssn: '',
      dob: new Date(),
      currentAddress: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      email: '',
      
      // Previous Address (if applicable)
      previousAddress: '',
      previousCity: '',
      previousState: '',
      previousZip: '',
      
      // Dispute Information
      accountNumber: '',
      creditorName: '',
      disputeReason: '',
      disputeExplanation: '',
      
      // Eviction Specific
      courtCase: '',
      evictionDate: new Date(),
      landlordName: '',
      propertyAddress: '',
      judgmentAmount: '',
      satisfiedDate: new Date(),
      
      // Supporting Documentation
      proofOfPayment: false,
      courtDismissal: false,
      satisfactionLetter: false,
      identityDocuments: false,
    },
  });

  const onSubmit = (data) => {
    const formData = {
      ...data,
      disputeType,
      includeProof,
      formType: 'Equifax Housing Dispute',
      generatedDate: new Date().toISOString(),
    };
    
    // Generate the PDF with form data
    onGenerate(formData, 'equifax');
  };

  const disputeReasons = [
    'Information is not mine',
    'Account paid in full',
    'Account settled for less',
    'Judgment satisfied',
    'Case dismissed',
    'Eviction filed in error',
    'Identity theft',
    'Outdated information',
    'Duplicate entry',
    'Incorrect amount',
    'Incorrect dates',
    'Never late on payments',
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView>
        <Card style={styles.header}>
          <Card.Content>
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.title}>
                  Equifax Housing-Focused Dispute
                </Text>
                <Text style={styles.subtitle}>
                  Challenge rental & eviction errors
                </Text>
              </View>
              <Button onPress={onBack}>Back</Button>
            </View>
          </Card.Content>
        </Card>

        {/* Personal Information Section */}
        <Card style={styles.section}>
          <Card.Title title="Personal Information" />
          <Card.Content>
            <View style={styles.row}>
              <Controller
                control={control}
                rules={{ required: 'First name is required' }}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="First Name *"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    style={styles.halfInput}
                    error={errors.firstName}
                  />
                )}
              />
              
              <Controller
                control={control}
                name="middleName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Middle Name"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    style={styles.quarterInput}
                  />
                )}
              />
              
              <Controller
                control={control}
                rules={{ required: 'Last name is required' }}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Last Name *"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    style={styles.halfInput}
                    error={errors.lastName}
                  />
                )}
              />
            </View>

            <Controller
              control={control}
              rules={{ 
                required: 'SSN is required',
                pattern: {
                  value: /^\d{3}-\d{2}-\d{4}$/,
                  message: 'SSN format: XXX-XX-XXXX'
                }
              }}
              name="ssn"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Social Security Number *"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="XXX-XX-XXXX"
                  style={styles.input}
                  error={errors.ssn}
                  secureTextEntry
                />
              )}
            />
            {errors.ssn && (
              <HelperText type="error">{errors.ssn.message}</HelperText>
            )}

            <Controller
              control={control}
              rules={{ required: 'Current address is required' }}
              name="currentAddress"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Current Street Address *"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={styles.input}
                  error={errors.currentAddress}
                />
              )}
            />

            <View style={styles.row}>
              <Controller
                control={control}
                rules={{ required: 'City is required' }}
                name="city"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="City *"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    style={styles.halfInput}
                    error={errors.city}
                  />
                )}
              />

              <Controller
                control={control}
                rules={{ required: 'State is required' }}
                name="state"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="State *"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    style={styles.quarterInput}
                    maxLength={2}
                    autoCapitalize="characters"
                    error={errors.state}
                  />
                )}
              />

              <Controller
                control={control}
                rules={{ 
                  required: 'ZIP is required',
                  pattern: {
                    value: /^\d{5}(-\d{4})?$/,
                    message: 'Invalid ZIP'
                  }
                }}
                name="zip"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="ZIP *"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    style={styles.quarterInput}
                    keyboardType="numeric"
                    maxLength={10}
                    error={errors.zip}
                  />
                )}
              />
            </View>

            <View style={styles.row}>
              <Controller
                control={control}
                rules={{ 
                  required: 'Phone is required',
                  pattern: {
                    value: /^\(\d{3}\) \d{3}-\d{4}$/,
                    message: 'Format: (XXX) XXX-XXXX'
                  }
                }}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Phone Number *"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    style={styles.halfInput}
                    keyboardType="phone-pad"
                    placeholder="(XXX) XXX-XXXX"
                    error={errors.phone}
                  />
                )}
              />

              <Controller
                control={control}
                rules={{ 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email'
                  }
                }}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Email Address *"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    style={styles.halfInput}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={errors.email}
                  />
                )}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Dispute Type Selection */}
        <Card style={styles.section}>
          <Card.Title title="Dispute Type" />
          <Card.Content>
            <RadioButton.Group
              onValueChange={setDisputeType}
              value={disputeType}
            >
              <View style={styles.radioItem}>
                <RadioButton value="eviction" />
                <Text>Eviction Record</Text>
              </View>
              <View style={styles.radioItem}>
                <RadioButton value="rental_debt" />
                <Text>Rental Debt/Collections</Text>
              </View>
              <View style={styles.radioItem}>
                <RadioButton value="criminal" />
                <Text>Criminal Record on Screening</Text>
              </View>
              <View style={styles.radioItem}>
                <RadioButton value="identity" />
                <Text>Identity Error/Mixed File</Text>
              </View>
              <View style={styles.radioItem}>
                <RadioButton value="other" />
                <Text>Other Housing-Related Issue</Text>
              </View>
            </RadioButton.Group>
          </Card.Content>
        </Card>

        {/* Eviction-Specific Fields */}
        {disputeType === 'eviction' && (
          <Card style={styles.section}>
            <Card.Title title="Eviction Details" />
            <Card.Content>
              <Controller
                control={control}
                name="courtCase"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Court Case Number"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    style={styles.input}
                    placeholder="e.g., 2021-CV-12345"
                  />
                )}
              />

              <Controller
                control={control}
                name="landlordName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Landlord/Property Manager Name"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    style={styles.input}
                  />
                )}
              />

              <Controller
                control={control}
                name="propertyAddress"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Rental Property Address"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    style={styles.input}
                  />
                )}
              />

              <Controller
                control={control}
                name="judgmentAmount"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Judgment Amount (if any)"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    style={styles.input}
                    keyboardType="decimal-pad"
                    placeholder="$0.00"
                  />
                )}
              />

              <Text style={styles.label}>Select all that apply:</Text>
              <View style={styles.checkboxContainer}>
                <Checkbox.Item
                  label="Case was dismissed"
                  status={watch('courtDismissal') ? 'checked' : 'unchecked'}
                  onPress={() => {
                    const current = watch('courtDismissal');
                    control._formValues.courtDismissal = !current;
                  }}
                />
                <Checkbox.Item
                  label="Judgment was satisfied/paid"
                  status={watch('satisfactionLetter') ? 'checked' : 'unchecked'}
                  onPress={() => {
                    const current = watch('satisfactionLetter');
                    control._formValues.satisfactionLetter = !current;
                  }}
                />
                <Checkbox.Item
                  label="Filed in error/wrong person"
                  status={watch('identityDocuments') ? 'checked' : 'unchecked'}
                  onPress={() => {
                    const current = watch('identityDocuments');
                    control._formValues.identityDocuments = !current;
                  }}
                />
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Dispute Reason & Explanation */}
        <Card style={styles.section}>
          <Card.Title title="Dispute Reason" />
          <Card.Content>
            <Text style={styles.label}>
              Select the primary reason for your dispute:
            </Text>
            
            <Controller
              control={control}
              rules={{ required: 'Please select a dispute reason' }}
              name="disputeReason"
              render={({ field: { onChange, value } }) => (
                <RadioButton.Group onValueChange={onChange} value={value}>
                  {disputeReasons.map((reason) => (
                    <View key={reason} style={styles.radioItem}>
                      <RadioButton value={reason} />
                      <Text>{reason}</Text>
                    </View>
                  ))}
                </RadioButton.Group>
              )}
            />

            <Controller
              control={control}
              rules={{ 
                required: 'Please provide an explanation',
                minLength: {
                  value: 50,
                  message: 'Explanation must be at least 50 characters'
                }
              }}
              name="disputeExplanation"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Detailed Explanation *"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={styles.input}
                  multiline
                  numberOfLines={6}
                  placeholder="Provide specific details about why this information is incorrect..."
                  error={errors.disputeExplanation}
                />
              )}
            />
            {errors.disputeExplanation && (
              <HelperText type="error">
                {errors.disputeExplanation.message}
              </HelperText>
            )}
          </Card.Content>
        </Card>

        {/* Supporting Documentation */}
        <Card style={styles.section}>
          <Card.Title title="Supporting Documentation" />
          <Card.Content>
            <Text style={styles.label}>
              I will include the following (check all that apply):
            </Text>
            
            <Checkbox.Item
              label="Proof of payment/cancelled checks"
              status={watch('proofOfPayment') ? 'checked' : 'unchecked'}
              onPress={() => {
                const current = watch('proofOfPayment');
                control._formValues.proofOfPayment = !current;
              }}
            />
            
            <Checkbox.Item
              label="Court dismissal documentation"
              status={watch('courtDismissal') ? 'checked' : 'unchecked'}
              onPress={() => {
                const current = watch('courtDismissal');
                control._formValues.courtDismissal = !current;
              }}
            />
            
            <Checkbox.Item
              label="Satisfaction of judgment letter"
              status={watch('satisfactionLetter') ? 'checked' : 'unchecked'}
              onPress={() => {
                const current = watch('satisfactionLetter');
                control._formValues.satisfactionLetter = !current;
              }}
            />
            
            <Checkbox.Item
              label="Identity verification documents"
              status={watch('identityDocuments') ? 'checked' : 'unchecked'}
              onPress={() => {
                const current = watch('identityDocuments');
                control._formValues.identityDocuments = !current;
              }}
            />

            <Text style={styles.helperText}>
              Note: Including supporting documentation significantly increases
              the likelihood of a successful dispute.
            </Text>
          </Card.Content>
        </Card>

        {/* FCRA Statement */}
        <Card style={styles.section}>
          <Card.Title title="Legal Statement" />
          <Card.Content>
            <Text style={styles.legalText}>
              I certify that the information provided in this dispute is true
              and accurate to the best of my knowledge. I understand that
              knowingly submitting false information may constitute fraud.
            </Text>
            
            <Text style={styles.legalText}>
              Under the Fair Credit Reporting Act (FCRA), Equifax must
              investigate this dispute within 30 days of receipt and provide
              written results.
            </Text>
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={onBack}
            style={styles.button}
          >
            Cancel
          </Button>
          
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            style={[styles.button, styles.primaryButton]}
          >
            Generate PDF
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  header: {
    margin: 15,
    marginBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0e1726',
  },
  subtitle: {
    fontSize: 14,
    color: '#5b6473',
    marginTop: 5,
  },
  section: {
    margin: 15,
    marginBottom: 10,
  },
  input: {
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  halfInput: {
    width: '48%',
  },
  quarterInput: {
    width: '23%',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  checkboxContainer: {
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0e1726',
    marginBottom: 10,
    marginTop: 10,
  },
  helperText: {
    fontSize: 12,
    color: '#5b6473',
    marginTop: 10,
    fontStyle: 'italic',
  },
  legalText: {
    fontSize: 14,
    color: '#0e1726',
    marginBottom: 15,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
  },
  button: {
    width: '48%',
  },
  primaryButton: {
    backgroundColor: '#0e6efb',
  },
});

export default EquifaxForm;
