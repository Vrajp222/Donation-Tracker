import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, TextInput, Modal } from 'react-native';
import axios from 'axios';
import { DonationContext } from '../components/DonationContext';
import defaultLogo from '../../assets/defaultLogo.png';

const CharityDiscoveryScreen = ({ navigation }) => {
    const { walletBalance, makeDonation, addDonationHistory } = useContext(DonationContext);
    const [charities, setCharities] = useState([]);
    const [filteredCharities, setFilteredCharities] = useState([]);
    const [category, setCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [donationAmount, setDonationAmount] = useState('');
    const [selectedCharity, setSelectedCharity] = useState(null);

    useEffect(() => {
        const fetchCharities = async () => {
            try {
                const response = await axios.get(`https://partners.every.org/v0.2/search/${category}?apiKey=pk_live_961703a41072a67a412ee90c17d9dc36`);
                setCharities(response.data.nonprofits);
                setFilteredCharities(response.data.nonprofits);
            } catch (error) {
                console.error('Error fetching charities:', error);
            }
        };

        fetchCharities();
    }, [category]);

    useEffect(() => {
        if (searchQuery.length === 0) {
            setFilteredCharities(charities);
        } else {
            const filtered = charities.filter(charity =>
                charity.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredCharities(filtered);
        }
    }, [searchQuery, charities]);

    const handleViewMore = (charity) => {
        navigation.navigate('CharityDetailScreen', { charity });
    };

    const handleDonate = (charity) => {
        setSelectedCharity(charity);
        setModalVisible(true);
    };

    const confirmDonation = () => {
      const amount = parseFloat(donationAmount);
      
      if (!isNaN(amount) && amount > 0 && amount <= walletBalance) {
          const donationSuccessful = makeDonation(amount, selectedCharity.name);
          
          if (donationSuccessful) {
              addDonationHistory({ charity: selectedCharity.name, amount, date: new Date() });
              alert(`Thank you for donating $${amount.toFixed(2)} to ${selectedCharity.name}!`);
          } else {
              alert('Insufficient funds.');
          }
      } else {
          alert('Invalid or insufficient donation amount.');
      }
      
      setModalVisible(false);
      setDonationAmount('');
  };
  

    const renderItem = ({ item }) => (
        <View style={styles.charityCard}>
            <Image
                source={item.logoUrl ? { uri: item.logoUrl } : defaultLogo}
                style={styles.logo}
            />
            <View style={styles.infoContainer}>
                <Text style={styles.charityName}>{item.name}</Text>
                <Text style={styles.charityLocation}>{item.location}</Text>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => handleViewMore(item)}>
                        <Text style={styles.buttonText}>View More</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.donateButton} onPress={() => handleDonate(item)}>
                        <Text style={styles.donateButtonText}>Donate</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.filterBar}>
                {['All', 'Education', 'Health', 'Environment'].map((filter) => (
                    <TouchableOpacity
                        key={filter}
                        style={[styles.filterButton, category === filter.toLowerCase() && styles.activeFilter]}
                        onPress={() => setCategory(filter.toLowerCase())}
                    >
                        <Text style={[styles.filterButtonText, category === filter.toLowerCase() && styles.activeFilterText]}>
                            {filter}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search charities..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            <FlatList
                data={filteredCharities}
                keyExtractor={(item) => item.ein || item.slug}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Donate to {selectedCharity?.name}</Text>
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    filterBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#DDDDDD',
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: '#E5E5E5',
    },
    activeFilter: {
        backgroundColor: '#007BFF',
    },
    filterButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333333',
    },
    activeFilterText: {
        color: '#FFFFFF',
    },
    searchContainer: {
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#DDDDDD',
    },
    searchInput: {
        height: 40,
        borderColor: '#DDDDDD',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 12,
        fontSize: 16,
        backgroundColor: '#F9F9F9',
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    charityCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    logo: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 16,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    infoContainer: {
        flex: 1,
    },
    charityName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 4,
    },
    charityLocation: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 12,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 25,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    donateButton: {
        backgroundColor: '#FF5722',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    donateButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
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
        backgroundColor: '#007BFF',
        borderRadius: 25,
    },
    cancelButton: {
        backgroundColor: '#DDDDDD',
        borderRadius: 25,
    },
});

export default CharityDiscoveryScreen;
