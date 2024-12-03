import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DonationContext } from '../components/DonationContext';

export default function DashboardScreen() {
    const { goal, totalDonation, donationHistory } = useContext(DonationContext);

    const goalProgress = goal ? (totalDonation / goal) * 100 : 0;

    const recentDonations = donationHistory.slice(-3);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dashboard</Text>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Total Donations:</Text>
                <Text style={styles.cardValue}>${totalDonation.toFixed(2)}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Goal Progress:</Text>
                <Text style={styles.cardValue}>{goal ? `${goalProgress.toFixed(2)}%` : 'Set your goal'}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Recent Donations</Text>
                {recentDonations.length === 0 ? (
                    <Text style={styles.cardValue}>No donations yet</Text>
                ) : (
                    recentDonations.map((donation, index) => (
                        <Text key={index} style={styles.cardValue}>{donation.charity}: ${parseFloat(donation.amount).toFixed(2)}</Text>
                    ))
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#212121',
        marginBottom: 16,
    },
    card: {
        backgroundColor: '#F5F5F5',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    cardValue: {
        fontSize: 16,
        color: '#212121',
        marginTop: 8,
    },
});
