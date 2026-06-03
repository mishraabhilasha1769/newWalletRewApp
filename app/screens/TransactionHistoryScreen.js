import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { TransactionHandler } from '../business/handlers';

export default function TransactionHistoryScreen({ navigation }) {
  const [transactionList, setTransactionList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.user);

  const transactionHandler = useMemo(() => {
    return user?.uid ? new TransactionHandler(user) : null;
  }, [user]);

  const loadTransactions = useCallback(async () => {
    if (!transactionHandler) {
      setError('User not found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await transactionHandler.getUserTransactions();

      if (result.success) {
        setTransactionList(result.transactions);
        setError(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load transactions');
      console.error('Load transactions error:', err);
    } finally {
      setLoading(false);
    }
  }, [transactionHandler]);

  useEffect(() => {
    if (!user?.uid) {
      setError('User not found');
      setLoading(false);
      return;
    }

    loadTransactions();

    const unsubscribe = transactionHandler?.subscribeToTransactions((result) => {
      if (result.success) {
        setTransactionList(result.data);
        setError(null);
      } else {
        setError(result.error);
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      transactionHandler?.unsubscribeFromTransactions();
    };
  }, [loadTransactions, transactionHandler, user?.uid]);

  
  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 pt-12 pb-6 shadow-sm">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="text-blue-600 text-lg mr-4">‹</Text>
          </TouchableOpacity>
          <Text className="text-gray-900 text-xl font-bold">Transaction History</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {loading ? (
          <View className="items-center justify-center mt-20">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="text-gray-500 text-sm mt-4">Loading transactions...</Text>
          </View>
        ) : error ? (
          <View className="items-center justify-center mt-20">
            <Text className="text-red-500 text-lg">Error</Text>
            <Text className="text-gray-500 text-sm mt-2">{error}</Text>
            <TouchableOpacity 
              className="bg-blue-600 px-6 py-2 rounded-lg mt-4"
              onPress={() => {
                setLoading(true);
                setError(null);
                loadTransactions();
              }}
            >
              <Text className="text-white text-sm">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : transactionList.length === 0 ? (
          <View className="items-center justify-center mt-20">
            <Text className="text-gray-400 text-lg">No transactions yet</Text>
            <Text className="text-gray-400 text-sm mt-2">Your transaction history will appear here</Text>
          </View>
        ) : (
          <View className="mt-6 mb-8">
            {transactionList.map((transaction, index) => (
              <View key={`${transaction.id}_${index}`} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-gray-900 font-semibold text-base mb-1">
                      {transaction.type}
                    </Text>
                    {transaction.data && (
                      <Text className="text-gray-600 text-sm mb-1">
                        {transaction.data}
                      </Text>
                    )}
                    <View className="flex-row items-center">
                      <Text className="text-gray-500 text-xs mr-2">
                        {transaction.source}
                      </Text>
                      {transaction.maskedCardNumber && (
                        <Text className="text-gray-500 text-xs">
                          {transaction.maskedCardNumber}
                        </Text>
                      )}
                    </View>
                    <Text className="text-gray-500 text-xs mt-1">
                      {transaction.formattedDate}
                    </Text>
                  </View>
                  
                  <View className="items-end">
                    <Text className={`font-bold text-lg ${transaction.amountColor}`}>
                      {transaction.formattedAmount}
                    </Text>
                    <View className={`px-2 py-1 rounded-full mt-1 ${
                      transaction.status === 'Success' 
                        ? 'bg-green-100' 
                        : 'bg-yellow-100'
                    }`}>
                      <Text className={`text-xs font-medium ${
                        transaction.status === 'Success' 
                          ? 'text-green-700' 
                          : 'text-yellow-700'
                      }`}>
                        {transaction.status}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
