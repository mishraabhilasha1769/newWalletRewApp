import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

const RewardPopup = ({ visible, rewardData, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: 'white', borderRadius: 8, padding: 20, width: 280 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>
            Congratulations!
          </Text>
          
          <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 10 }}>
            🏆 Reward Earned
          </Text>
          
          <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 }}>
            +{rewardData?.pointsEarned || 0} Points
          </Text>
          
          <TouchableOpacity
            onPress={onClose}
            style={{ backgroundColor: '#007AFF', borderRadius: 6, paddingVertical: 10, alignItems: 'center' }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default RewardPopup;
