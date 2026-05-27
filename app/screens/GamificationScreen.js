import { useRef, useState } from 'react';

import {
    Alert,
    Animated,
    Easing,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import Svg, {
    G,
    Line,
    Path,
    Text as SvgText,
} from 'react-native-svg';

import { useDispatch, useSelector } from 'react-redux';

import { updateUser } from '../store/authSlice';

export default function GamificationScreen({
  navigation,
}) {
  const dispatch = useDispatch();

  const user = useSelector(
    (state) => state.auth.user
  );

  const [winnerValue, setWinnerValue] =
    useState('');

  const [spinning, setSpinning] =
    useState(false);

  const spinAnim = useRef(
    new Animated.Value(0)
  ).current;

  const rewards = [
    '5',
    '20',
    'Better Luck',
    '10',
    '15',
    'Spin Again',
    'Better Luck',
    'Spin Again',
  ];

  const colors = [
    '#EC4899',
    '#3B82F6',
    '#8B5CF6',
    '#F97316',
    '#10B981',
    '#EAB308',
    '#6366F1',
    '#EF4444',
  ];

  const wheelSize = 320;

  const radius = wheelSize / 2;

  const angle = 360 / rewards.length;

  const rotation = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '1440deg'],
  });

  const polarToCartesian = (
    cx,
    cy,
    r,
    angleDeg
  ) => {
    const angleRad =
      ((angleDeg - 90) * Math.PI) / 180;

    return {
      x:
        cx + r * Math.cos(angleRad),
      y:
        cy + r * Math.sin(angleRad),
    };
  };

  const createSegment = (
    startAngle,
    endAngle,
    color
  ) => {
    const start = polarToCartesian(
      radius,
      radius,
      radius,
      endAngle
    );

    const end = polarToCartesian(
      radius,
      radius,
      radius,
      startAngle
    );

    const largeArcFlag =
      endAngle - startAngle <= 180
        ? '0'
        : '1';

    return `
      M ${radius} ${radius}
      L ${start.x} ${start.y}
      A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}
      Z
    `;
  };

  const handleResult = (reward) => {
    setWinnerValue(reward);

    if (
      reward.includes('5') ||
      reward.includes('10') ||
      reward.includes('15') ||
      reward.includes('20')
    ) {
      const points =
        parseInt(reward);

      const currentPoints =
        user?.userData?.rewards
          ?.points || 0;

      const updatedUser = {
        ...user,

        userData: {
          ...user.userData,

          rewards: {
            ...user.userData?.rewards,

            points:
              currentPoints +
              points,
          },
        },
      };

      dispatch(
        updateUser(updatedUser)
      );

      Alert.alert(
        'Congratulations 🎉',
        `You won ${points} reward points`
      );
    } else if (
      reward === 'Spin Again'
    ) {
      Alert.alert(
        'Spin Again 🔄',
        'You earned another spin'
      );
    } else {
      Alert.alert(
        'Better Luck Next Time 😔'
      );
    }
  };

  const handleSpin = () => {
    if (spinning) {
      return;
    }

    setSpinning(true);

    Animated.timing(spinAnim, {
      toValue: 1,
      duration: 4000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      spinAnim.setValue(0);

      const randomIndex = Math.floor(
        Math.random() * rewards.length
      );

      const reward =
        rewards[randomIndex];

      handleResult(reward);

      setSpinning(false);
    });
  };

  return (
    <View className="flex-1 bg-[#0F172A]">
      {/* Header */}
      <View className="px-5 pt-14 pb-6">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }
          >
            <Text className="text-white text-3xl mr-4">
              ‹
            </Text>
          </TouchableOpacity>

          <View>
            <Text className="text-white text-3xl font-bold">
              Spin & Win
            </Text>

            <Text className="text-gray-300 mt-1">
              Try your luck and win rewards
            </Text>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View className="flex-1 items-center justify-center">
        {/* Pointer */}
        <Text className="text-yellow-400 text-6xl mb-[-30px] z-50">
          ▼
        </Text>

        {/* Wheel */}
        <Animated.View
          style={{
            transform: [
              { rotate: rotation },
            ],
          }}
        >
          <Svg
            width={wheelSize}
            height={wheelSize}
          >
            <G>
              {rewards.map(
                (reward, index) => {
                  const startAngle =
                    index * angle;

                  const endAngle =
                    startAngle + angle;

                  const middleAngle =
                    startAngle +
                    angle / 2;

                  const textPosition =
                    polarToCartesian(
                      radius,
                      radius,
                      radius * 0.65,
                      middleAngle
                    );

                  return (
                    <G key={index}>
                      {/* Segment */}
                      <Path
                        d={createSegment(
                          startAngle,
                          endAngle,
                          colors[index]
                        )}
                        fill={colors[index]}
                        stroke="#FFFFFF"
                        strokeWidth={4}
                      />

                      {/* Divider */}
                      <Line
                        x1={radius}
                        y1={radius}
                        x2={
                          polarToCartesian(
                            radius,
                            radius,
                            radius,
                            startAngle
                          ).x
                        }
                        y2={
                          polarToCartesian(
                            radius,
                            radius,
                            radius,
                            startAngle
                          ).y
                        }
                        stroke="#FFFFFF"
                        strokeWidth={3}
                      />

                      {/* Reward Text */}
                      <SvgText
                        x={textPosition.x}
                        y={textPosition.y}
                        fill="#FFFFFF"
                        fontSize="13"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {reward}
                      </SvgText>
                    </G>
                  );
                }
              )}
            </G>
          </Svg>
        </Animated.View>

        {/* Center Circle */}
        <View className="absolute w-20 h-20 rounded-full bg-yellow-400 items-center justify-center">
          <Text className="text-black font-bold text-lg">
            SPIN
          </Text>
        </View>

        {/* Result */}
        {winnerValue ? (
          <View className="bg-white rounded-2xl px-8 py-4 mt-10 shadow-lg">
            <Text className="text-gray-500 text-center">
              Last Result
            </Text>

            <Text className="text-indigo-600 text-2xl font-bold mt-1 text-center">
              {winnerValue}
            </Text>
          </View>
        ) : null}

        {/* Spin Button */}
        <TouchableOpacity
          disabled={spinning}
          onPress={handleSpin}
          className={`px-16 py-5 rounded-3xl mt-10 ${
            spinning
              ? 'bg-gray-400'
              : 'bg-yellow-400'
          }`}
        >
          <Text className="text-black text-xl font-bold">
            {spinning
              ? 'SPINNING...'
              : 'SPIN'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}