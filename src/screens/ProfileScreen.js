import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { DonationContext } from '../components/DonationContext';

export default function ProfileScreen({ navigation }) {
    const { walletBalance, addFunds, goal, setGoal } = useContext(DonationContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [amountToAdd, setAmountToAdd] = useState('');
    const [goalInput, setGoalInput] = useState(goal || '');

    const auth = getAuth();

    const handleAddFunds = () => {
        setModalVisible(true);
    };

    const handleConfirmAddFunds = () => {
        const amount = parseFloat(amountToAdd);
        if (!isNaN(amount) && amount > 0) {
            addFunds(amount);
        }
        setModalVisible(false);
        setAmountToAdd('');
    };

    const handleSetGoal = () => {
        setGoal(goalInput);
        alert(`Goal set to $${goalInput}`);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigation.navigate('Login');
    
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Name:</Text>
                <Text style={styles.cardValue}>{auth.currentUser?.email || 'Not logged in'}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Donation Goal:</Text>
                <Text style={styles.cardValue}>{goal ? `$${goal}` : 'Not set'}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your donation goal"
                    keyboardType="numeric"
                    value={goalInput}
                    onChangeText={setGoalInput}
                />
                <TouchableOpacity style={styles.setGoalButton} onPress={handleSetGoal}>
                    <Text style={styles.buttonText}>Set Goal</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Wallet Balance:</Text>
                <Text style={styles.cardValue}>${walletBalance.toFixed(2)}</Text>
                <TouchableOpacity style={styles.addFundsButton} onPress={handleAddFunds}>
                    <Text style={styles.buttonText}>Add Funds</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Add Funds</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter amount"
                            keyboardType="numeric"
                            value={amountToAdd}
                            onChangeText={setAmountToAdd}
                        />
                        <View style={styles.modalButtonsContainer}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={handleConfirmAddFunds}
                            >
                                <Text style={styles.buttonText}>Add</Text>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F0F4F8',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 24,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#007BFF',
    },
    cardValue: {
        fontSize: 16,
        color: '#333333',
        marginTop: 8,
    },
    input: {
        height: 40,
        borderColor: '#CCCCCC',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginTop: 8,
        marginBottom: 16,
        fontSize: 16,
    },
    setGoalButton: {
        backgroundColor: '#28A745',
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 8,
    },
    addFundsButton: {
        marginTop: 16,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#007BFF',
        borderRadius: 25,
        alignItems: 'center',
    },
    logoutButton: {
        marginTop: 16,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#FF4D4D',
        borderRadius: 25,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 16,
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
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
        color: '#007BFF',
        textAlign: 'center',
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        padding: 12,
        borderRadius: 25,
        alignItems: 'center',
        width: '45%',
    },
    confirmButton: {
        backgroundColor: '#007BFF',
    },
    cancelButton: {
        backgroundColor: '#CCCCCC',
    },
});
