import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const TabButton = ({ label, active, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`py-2 mx-1 rounded-lg border ${
        active 
          ? 'bg-purple-600 border-purple-600' 
          : 'bg-white border-gray-300'
      }`}
    >
      <Text className={`text-sm font-medium ${
        active ? 'text-white' : 'text-gray-700'
      }`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default TabButton;
