import React, { createContext, useState, useEffect } from 'react';
import { getDatabase, ref, set, push, onValue, update } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DonationContext = createContext();

export const DonationProvider = ({ children }) => {
    const [walletBalance, setWalletBalance] = useState(0.00);
    const [donationHistory, setDonationHistory] = useState([]);
    const [totalDonation, setTotalDonation] = useState(0);
    const [goal, setGoal] = useState(null);

    const db = getDatabase();
    const auth = getAuth();

    useEffect(() => {
        const fetchLocalBalance = async () => {
            try {
                const value = await AsyncStorage.getItem('walletBalance');
                if (value !== null) {
                    setWalletBalance(parseFloat(value));
                }
            } catch (error) {
                console.error('Error fetching local balance:', error);
            }
        };

        fetchLocalBalance();

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const walletRef = ref(db, `users/${user.uid}/walletBalance`);
                onValue(walletRef, (snapshot) => {
                    const balance = snapshot.val();
                    setWalletBalance(balance || 0);
                    AsyncStorage.setItem('walletBalance', (balance || 0).toString()); 
                });

                const donationHistoryRef = ref(db, `users/${user.uid}/donationHistory`);
                onValue(donationHistoryRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        const donations = Object.values(data);
                        setDonationHistory(donations);

                        const total = donations.reduce((acc, donation) => acc + parseFloat(donation.amount || 0), 0);
                        setTotalDonation(total);
                    } else {
                        setDonationHistory([]);
                        setTotalDonation(0);
                    }
                });
            }
        });

        return () => unsubscribe(); 
    }, [auth, db]);

    const addFunds = async (amount) => {
        const newBalance = walletBalance + amount;
        setWalletBalance(newBalance);
        try {
            await AsyncStorage.setItem('walletBalance', newBalance.toString());
        } catch (error) {
            console.error('Error saving local balance:', error);
        }

        const user = auth.currentUser;
        if (user) {
            const walletRef = ref(db, `users/${user.uid}/walletBalance`);
            await set(walletRef, newBalance); 
        }
    };

    const makeDonation = async (amount, charityName) => {
        if (walletBalance >= amount) {
            const newBalance = walletBalance - amount;
            setWalletBalance(newBalance);

            const user = auth.currentUser;
            if (user) {
                const walletRef = ref(db, `users/${user.uid}/walletBalance`);
                await set(walletRef, newBalance);

                const donationHistoryRef = ref(db, `users/${user.uid}/donationHistory`);
                onValue(donationHistoryRef, async (snapshot) => {
                    const data = snapshot.val();
                    let updates = {};
                    let existingDonationKey = null;

                    if (data) {
                        const donations = Object.entries(data);
                        for (const [key, donation] of donations) {
                            if (
                                donation.amount === amount &&
                                donation.charity === charityName &&
                                donation.date
                            ) {
                                return;
                            }
                            if (
                                donation.amount === amount &&
                                donation.charity === charityName &&
                                !donation.date
                            ) {
                                existingDonationKey = key;
                                break;
                            }
                        }
                    }

                    if (existingDonationKey) {
                        updates[`/${existingDonationKey}/date`] = new Date().toISOString();
                    } else {
                        const newDonationRef = push(donationHistoryRef);
                        updates[`/${newDonationRef.key}`] = {
                            charity: charityName,
                            amount,
                            date: new Date().toISOString()
                        };
                    }

                    if (Object.keys(updates).length > 0) {
                        await update(donationHistoryRef, updates);
                    }
                });
            }
            return true;
        } else {
            return false;
        }
    };

    const addDonationHistory = async (donation) => {
        const user = auth.currentUser;
        if (user) {
            const donationHistoryRef = ref(db, `users/${user.uid}/donationHistory`);
            const newDonationRef = push(donationHistoryRef);
            await set(newDonationRef, donation);
        }
    };

    return (
        <DonationContext.Provider value={{ walletBalance, makeDonation, addFunds, donationHistory, totalDonation, goal, setGoal, addDonationHistory }}>
            {children}
        </DonationContext.Provider>
    );
};
