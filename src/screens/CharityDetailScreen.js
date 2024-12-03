import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { DonationContext } from '../components/DonationContext';
import defaultLogo from '../../assets/defaultLogo.png';

const CharityDetailScreen = ({ route, navigation }) => {
    const { charity } = route.params;
    const { walletBalance, makeDonation, addDonationHistory } = useContext(DonationContext);
    
    const [modalVisible, setModalVisible] = useState(false);
    const [donationAmount, setDonationAmount] = useState('');

    const confirmDonation = () => {
        const amount = parseFloat(donationAmount);

        if (!isNaN(amount) && amount > 0 && amount <= walletBalance) {
            const donationSuccessful = makeDonation(amount, charity.name);

            if (donationSuccessful) {
                addDonationHistory({ charity: charity.name, amount, date: new Date() });
                alert(`Thank you for donating $${amount.toFixed(2)} to ${charity.name}!`);
            } else {
                alert('Insufficient funds.');
            }
        } else {
            alert('Invalid or insufficient donation amount.');
        }

        setModalVisible(false);
        setDonationAmount('');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image
                source={charity.logoUrl ? { uri: charity.logoUrl } : defaultLogo}
                style={styles.logo}
            />
            <Text style={styles.name}>{charity.name}</Text>
            <Text style={styles.description}>{charity.description}</Text>
            <Text style={styles.location}>Location: {charity.location}</Text>
            <Text style={styles.website}>Website: <Text style={styles.link}>{charity.website}</Text></Text>
            <TouchableOpacity style={styles.donateButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.donateButtonText}>Donate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
            
            {/* Donation Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Donate to {charity.name}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter amount"
                            keyboardType="numeric"
                            value={donationAmount}
                            onChangeText={setDonationAmount}
                        />
                        <View style={styles.modalButtonsContainer}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={confirmDonation}
                            >
                                <Text style={styles.buttonText}>Donate</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F7F9FC',
        padding: 16,
    },
    logo: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    name: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 16,
    },
    location: {
        fontSize: 14,
        color: '#333333',
        marginBottom: 8,
    },
    website: {
        fontSize: 14,
        color: '#333333',
    },
    link: {
        color: '#007BFF',
    },
    button: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#007BFF',
        borderRadius: 25,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    donateButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#FF5722',
        borderRadius: 25,
    },
    donateButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#DDDDDD',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        marginBottom: 20,
        backgroundColor: '#F9F9F9',
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        borderRadius: 25,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4,

    },
    confirmButton: {
        backgroundColor: '#FF5722',
        borderRadius: 25,
    },
    cancelButton: {
        backgroundColor: '#007BFF',
        borderRadius: 25,
    },
});

export default CharityDetailScreen;
