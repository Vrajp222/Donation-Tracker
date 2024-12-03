import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const DonationHistoryScreen = () => {
    const [donationHistory, setDonationHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const db = getDatabase();
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            const donationHistoryRef = ref(db, `users/${user.uid}/donationHistory`);

            const unsubscribe = onValue(donationHistoryRef, (snapshot) => {
                setLoading(false);
                const data = snapshot.val();
                if (data) {
                    const donations = Object.keys(data).map(key => ({
                        ...data[key],
                        id: key,
                    }));
                    setDonationHistory(donations);
                } else {
                    setDonationHistory([]);
                }
            }, (error) => {
                setLoading(false);
                setError('Failed to fetch donation history.');
                console.error('Error fetching donation history:', error);
            });

            return () => unsubscribe();
        } else {
            setLoading(false);
            setError('User not authenticated.');
        }
    }, []);

    const renderItem = ({ item }) => {
        const amount = item.amount ? Number(item.amount).toFixed(2) : '0.00';
        const date = item.date ? new Date(item.date).toLocaleDateString() : 'No date';

        return (
            <View style={styles.historyItem}>
                <Text style={styles.charityName}>{item.charity}</Text>
                <Text style={styles.amount}>${amount}</Text>
                <Text style={styles.date}>{date}</Text>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={donationHistory}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
        padding: 16,
    },
    loadingText: {
        fontSize: 18,
        color: '#333333',
        textAlign: 'center',
        marginTop: 20,
    },
    errorText: {
        fontSize: 18,
        color: '#FF0000',
        textAlign: 'center',
        marginTop: 20,
    },
    listContainer: {
        paddingBottom: 20,
    },
    historyItem: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    charityName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
    },
    amount: {
        fontSize: 18,
        color: '#4CAF50',
        marginTop: 4,
    },
    date: {
        fontSize: 18,
        color: '#777777',
        marginTop: 4,
    },
});

export default DonationHistoryScreen;
