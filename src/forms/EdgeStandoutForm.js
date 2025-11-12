import React, { useState } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Chip,
  ProgressBar,
  Avatar,
  List,
} from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';

const EdgeStandoutForm = ({ onBack, onGenerate }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [completionScore, setCompletionScore] = useState(0);
  const [selectedStrengths, setSelectedStrengths] = useState([]);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      // Personal Branding
      personalStatement: '',
      housingGoals: '',
      
      // Financial Stability
      employmentStatus: '',
      employer: '',
      position: '',
      monthlyIncome: '',
      yearsEmployed: '',
      
      // Alternative Credit
      utilityPaymentHistory: '',
      phonePaymentHistory: '',
      insurancePayments: '',
      
      // Rental Readiness
      desiredRentRange: '',
      moveInDate: '',
      leaseTerm: '',
      
      // Character References
      reference1Name: '',
      reference1Relationship: '',
      reference1Phone: '',
      reference1Email: '',
      
      reference2Name: '',
      reference2Relationship: '',
      reference2Phone: '',
      reference2Email: '',
      
      // Proactive Disclosure
      backgroundExplanation: '',
      rehabilitationSteps: '',
      communityInvolvement: '',
      
      // Guarantor Information
      hasGuarantor: false,
      guarantorName: '',
      guarantorIncome: '',
      guarantorCredit: '',
      
      // Additional Assurances
      willingToPayExtra: false,
      extraDepositAmount: '',
      hasRentersInsurance: false,
      insuranceProvider: '',
      
      // Success Metrics
      onTimePayments: '',
      savingsAmount: '',
      debtReduction: '',
    },
  });

  const personalStrengths = [
    'Stable Employment',
    'Growing Savings',
    'No Recent Late Payments',
    'Community Volunteer',
    'Professional References',
    'Completed Education',
    'Military Service',
    'First Responder',
    'Healthcare Worker',
    'Teacher',
    'Long-term Resident',
    'Family-Oriented',
    'Pet-Free',
    'Non-Smoker',
    'Quiet Lifestyle',
  ];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      updateCompletionScore();
    }
  };

  const updateCompletionScore = () => {
    // Calculate completion percentage based on filled fields
    const fields = watch();
    const filledFields = Object.values(fields).filter(value => value).length;
    const totalFields = Object.keys(fields).length;
    const score = Math.round((filledFields / totalFields) * 100);
    setCompletionScore(score);
  };

  const toggleStrength = (strength) => {
    setSelectedStrengths(prev => {
      if (prev.includes(strength)) {
        return prev.filter(s => s !== strength);
      } else {
        return [...prev, strength];
      }
    });
  };

  const generateVisualProfile = (data) => {
    // Create a visually appealing profile document
    const profile = {
      ...data,
      profileImage,
      selectedStrengths,
      completionScore,
      generatedDate: new Date().toISOString(),
      profileType: 'EDGE Tenant Advantage Profile',
    };
    
    onGenerate(profile, 'edge-standout');
  };

  const onSubmit = (data) => {
    if (completionScore < 60) {
      Alert.alert(
        'Incomplete Profile',
        'Your profile is only ' + completionScore + '% complete. A more complete profile will make you stand out more. Continue anyway?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Generate Anyway', onPress: () => generateVisualProfile(data) }
        ]
      );
    } else {
      generateVisualProfile(data);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView>
        {/* Header with Profile Completion */}
        <Card style={styles.header}>
          <Card.Content>
            <View style={styles.headerContent}>
              <View style={styles.headerText}>
                <Text style={styles.title}>
                  Tenant Advantage Profile
                </Text>
                <Text style={styles.subtitle}>
                  Stand out in screening software
                </Text>
              </View>
              <Button onPress={onBack}>Back</Button>
            </View>
            
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>
                Profile Completion: {completionScore}%
              </Text>
              <ProgressBar
                progress={completionScore / 100}
                color="#0e6efb"
                style={styles.progressBar}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Profile Photo Section */}
        <Card style={styles.section}>
          <Card.Title
            title="Professional Photo"
            subtitle="Make a great first impression"
          />
          <Card.Content>
            <View style={styles.imageContainer}>
              {profileImage ? (
                <Avatar.Image
                  size={120}
                  source={{ uri: profileImage }}
                />
              ) : (
                <Avatar.Icon
                  size={120}
                  icon="camera"
                  style={styles.placeholderAvatar}
                />
              )}
              <Button
                mode="outlined"
                onPress={pickImage}
                style={styles.imageButton}
              >
                {profileImage ? 'Change Photo' : 'Add Photo'}
              </Button>
            </View>
            <Text style={styles.helperText}>
              A professional photo helps landlords connect with you as a person
            </Text>
          </Card.Content>
        </Card>

        {/* Personal Statement */}
        <Card style={styles.section}>
          <Card.Title
            title="Your Housing Story"
            subtitle="Help landlords understand your journey"
          />
          <Card.Content>
            <Controller
              control={control}
              rules={{
                required: 'Personal statement is required',
                minLength: {
                  value: 100,
                  message: 'Please write at least 100 characters'
                }
              }}
              name="personalStatement"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Personal Statement *"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    onChange(text);
                    updateCompletionScore();
                  }}
                  style={styles.input}
                  multiline
                  numberOfLines={6}
                  placeholder="Share your story. What brings you here? What are your goals? Why would you be a great tenant?"
                  error={errors.personalStatement}
                />
              )}
            />
            
            <Controller
              control={control}
              name="housingGoals"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Housing Goals"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    onChange(text);
                    updateCompletionScore();
                  }}
                  style={styles.input}
                  multiline
                  numberOfLines={3}
                  placeholder="What kind of home are you looking for? How long do you plan to stay?"
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* Personal Strengths */}
        <Card style={styles.section}>
          <Card.Title
            title="Your Strengths"
            subtitle="Select all that apply"
          />
          <Card.Content>
            <View style={styles.chipsContainer}>
              {personalStrengths.map((strength) => (
                <Chip
                  key={strength}
                  selected={selectedStrengths.includes(strength)}
                  onPress={() => toggleStrength(strength)}
                  style={styles.chip}
                >
                  {strength}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Financial Stability */}
        <Card style={styles.section}>
          <Card.Title
            title="Financial Stability"
            subtitle="Show your ability to pay rent"
          />
          <Card.Content>
            <Controller
              control={control}
              rules={{ required: 'Employment status is required' }}
              name="employmentStatus"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Employment Status *"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    onChange(text);
                    updateCompletionScore();
                  }}
                  style={styles.input}
                  placeholder="Full-time, Part-time, Self-employed, etc."
                  error={errors.employmentStatus}
                />
              )}
            />

            <View style={styles.row}>
              <Controller
                control={control}
                name="employer"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Current Employer"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text);
                      updateCompletionScore();
                    }}
                    style={styles.halfInput}
                  />
                )}
              />

              <Controller
                control={control}
                name="position"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Position"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text);
                      updateCompletionScore();
                    }}
                    style={styles.halfInput}
                  />
                )}
              />
            </View>

            <View style={styles.row}>
              <Controller
                control={control}
                rules={{ required: 'Monthly income is required' }}
                name="monthlyIncome"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Monthly Income *"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text);
                      updateCompletionScore();
                    }}
                    style={styles.halfInput}
                    keyboardType="numeric"
                    placeholder="$"
                    error={errors.monthlyIncome}
                  />
                )}
              />

              <Controller
                control={control}
                name="yearsEmployed"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Years at Job"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text);
                      updateCompletionScore();
                    }}
                    style={styles.halfInput}
                    keyboardType="numeric"
                  />
                )}
              />
            </View>

            {/* Visual Income vs Rent */}
            <View style={styles.incomeVisual}>
              <Text style={styles.visualTitle}>
                Rent Affordability Calculator
              </Text>
              <Text style={styles.visualText}>
                Based on your income, you can comfortably afford:
              </Text>
              <Text style={styles.affordAmount}>
                ${watch('monthlyIncome') ? 
                  Math.round(watch('monthlyIncome') * 0.3) : '0'}/month
              </Text>
              <Text style={styles.visualHelper}>
                (Using 30% income rule)
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Alternative Credit History */}
        <Card style={styles.section}>
          <Card.Title
            title="Payment History"
            subtitle="Show your track record with bills"
          />
          <Card.Content>
            <List.Item
              title="Utility Payments"
              description="Electric, Gas, Water"
              left={props => <List.Icon {...props} icon="flash" />}
              right={props => (
                <Controller
                  control={control}
                  name="utilityPaymentHistory"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={(text) => {
                        onChange(text);
                        updateCompletionScore();
                      }}
                      placeholder="Always on time"
                      style={styles.smallInput}
                    />
                  )}
                />
              )}
            />

            <List.Item
              title="Phone Bill"
              description="Mobile or landline"
              left={props => <List.Icon {...props} icon="phone" />}
              right={props => (
                <Controller
                  control={control}
                  name="phonePaymentHistory"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={(text) => {
                        onChange(text);
                        updateCompletionScore();
                      }}
                      placeholder="Never late"
                      style={styles.smallInput}
                    />
                  )}
                />
              )}
            />

            <List.Item
              title="Insurance"
              description="Auto, renters, health"
              left={props => <List.Icon {...props} icon="shield" />}
              right={props => (
                <Controller
                  control={control}
                  name="insurancePayments"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={(text) => {
                        onChange(text);
                        updateCompletionScore();
                      }}
                      placeholder="Current"
                      style={styles.smallInput}
                    />
                  )}
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* Character References */}
        <Card style={styles.section}>
          <Card.Title
            title="Professional References"
            subtitle="People who can vouch for you"
          />
          <Card.Content>
            <Text style={styles.sectionSubtitle}>Reference 1</Text>
            <View style={styles.row}>
              <Controller
                control={control}
                name="reference1Name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Name"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text);
                      updateCompletionScore();
                    }}
                    style={styles.halfInput}
                  />
                )}
              />

              <Controller
                control={control}
                name="reference1Relationship"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Relationship"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text);
                      updateCompletionScore();
                    }}
                    style={styles.halfInput}
                    placeholder="Supervisor, Mentor, etc."
                  />
                )}
              />
            </View>

            <View style={styles.row}>
              <Controller
                control={control}
                name="reference1Phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Phone"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text);
                      updateCompletionScore();
                    }}
                    style={styles.halfInput}
                    keyboardType="phone-pad"
                  />
                )}
              />

              <Controller
                control={control}
                name="reference1Email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Email"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text);
                      updateCompletionScore();
                    }}
                    style={styles.halfInput}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
              />
            </View>

            <Text style={[styles.sectionSubtitle, { marginTop: 20 }]}>
              Reference 2
            </Text>
            <View style={styles.row}>
              <Controller
                control={control}
                name="reference2Name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Name"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text);
                      updateCompletionScore();
                    }}
                    style={styles.halfInput}
                  />
                )}
              />

              <Controller
                control={control}
                name="reference2Relationship"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Relationship"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text);
                      updateCompletionScore();
                    }}
                    style={styles.halfInput}
                  />
                )}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Proactive Disclosure */}
        <Card style={styles.section}>
          <Card.Title
            title="Getting Ahead of Concerns"
            subtitle="Address potential issues upfront"
          />
          <Card.Content>
            <Controller
              control={control}
              name="backgroundExplanation"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Background Context (if needed)"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    onChange(text);
                    updateCompletionScore();
                  }}
                  style={styles.input}
                  multiline
                  numberOfLines={4}
                  placeholder="If you have any past issues, explain the context and what you've learned..."
                />
              )}
            />

            <Controller
              control={control}
              name="rehabilitationSteps"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Steps Taken to Improve"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    onChange(text);
                    updateCompletionScore();
                  }}
                  style={styles.input}
                  multiline
                  numberOfLines={3}
                  placeholder="Classes completed, counseling, job training, etc."
                />
              )}
            />

            <Controller
              control={control}
              name="communityInvolvement"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Community Involvement"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    onChange(text);
                    updateCompletionScore();
                  }}
                  style={styles.input}
                  multiline
                  numberOfLines={2}
                  placeholder="Volunteer work, church, community groups..."
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* Additional Assurances */}
        <Card style={styles.section}>
          <Card.Title
            title="Landlord Assurances"
            subtitle="Extra steps you're willing to take"
          />
          <Card.Content>
            <List.Item
              title="Additional Security Deposit"
              description="Willing to pay extra deposit?"
              left={props => <List.Icon {...props} icon="cash" />}
              right={props => (
                <Controller
                  control={control}
                  name="extraDepositAmount"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={(text) => {
                        onChange(text);
                        updateCompletionScore();
                      }}
                      placeholder="Amount"
                      style={styles.smallInput}
                      keyboardType="numeric"
                    />
                  )}
                />
              )}
            />

            <List.Item
              title="Renters Insurance"
              description="Do you have coverage?"
              left={props => <List.Icon {...props} icon="shield-check" />}
              right={props => (
                <Controller
                  control={control}
                  name="insuranceProvider"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={(text) => {
                        onChange(text);
                        updateCompletionScore();
                      }}
                      placeholder="Provider"
                      style={styles.smallInput}
                    />
                  )}
                />
              )}
            />

            <List.Item
              title="Co-Signer/Guarantor"
              description="Someone to guarantee lease?"
              left={props => <List.Icon {...props} icon="account-multiple" />}
              right={props => (
                <Controller
                  control={control}
                  name="guarantorName"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={(text) => {
                        onChange(text);
                        updateCompletionScore();
                      }}
                      placeholder="Name"
                      style={styles.smallInput}
                    />
                  )}
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* Success Metrics Visualization */}
        <Card style={styles.section}>
          <Card.Title
            title="Your Progress"
            subtitle="Positive trends to highlight"
          />
          <Card.Content>
            <View style={styles.metricsContainer}>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>On-Time Payments</Text>
                <Controller
                  control={control}
                  name="onTimePayments"
                  render={({ field: { onChange, value } }) => (
                    <>
                      <TextInput
                        value={value}
                        onChangeText={(text) => {
                          onChange(text);
                          updateCompletionScore();
                        }}
                        placeholder="24"
                        style={styles.metricInput}
                        keyboardType="numeric"
                      />
                      <Text style={styles.metricUnit}>months</Text>
                    </>
                  )}
                />
              </View>

              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Savings Growth</Text>
                <Controller
                  control={control}
                  name="savingsAmount"
                  render={({ field: { onChange, value } }) => (
                    <>
                      <TextInput
                        value={value}
                        onChangeText={(text) => {
                          onChange(text);
                          updateCompletionScore();
                        }}
                        placeholder="2500"
                        style={styles.metricInput}
                        keyboardType="numeric"
                      />
                      <Text style={styles.metricUnit}>saved</Text>
                    </>
                  )}
                />
              </View>

              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Debt Reduced</Text>
                <Controller
                  control={control}
                  name="debtReduction"
                  render={({ field: { onChange, value } }) => (
                    <>
                      <TextInput
                        value={value}
                        onChangeText={(text) => {
                          onChange(text);
                          updateCompletionScore();
                        }}
                        placeholder="40"
                        style={styles.metricInput}
                        keyboardType="numeric"
                      />
                      <Text style={styles.metricUnit}>%</Text>
                    </>
                  )}
                />
              </View>
            </View>
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
            disabled={completionScore < 30}
          >
            Generate Profile
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
  headerText: {
    flex: 1,
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
  progressContainer: {
    marginTop: 15,
  },
  progressText: {
    fontSize: 14,
    color: '#5b6473',
    marginBottom: 5,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  section: {
    margin: 15,
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0e1726',
    marginBottom: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  placeholderAvatar: {
    backgroundColor: '#e9eef6',
  },
  imageButton: {
    marginTop: 15,
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
  smallInput: {
    width: 120,
    height: 40,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  chip: {
    margin: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#5b6473',
    marginTop: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  incomeVisual: {
    backgroundColor: '#eef4ff',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  visualTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1945a5',
    marginBottom: 10,
  },
  visualText: {
    fontSize: 14,
    color: '#1945a5',
    marginBottom: 10,
  },
  affordAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0e6efb',
  },
  visualHelper: {
    fontSize: 12,
    color: '#5b6473',
    marginTop: 5,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  metric: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9eef6',
    minWidth: 100,
  },
  metricLabel: {
    fontSize: 12,
    color: '#5b6473',
    marginBottom: 5,
  },
  metricInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0e6efb',
    textAlign: 'center',
    width: 80,
    borderBottomWidth: 1,
    borderBottomColor: '#e9eef6',
  },
  metricUnit: {
    fontSize: 12,
    color: '#5b6473',
    marginTop: 5,
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

export default EdgeStandoutForm;
