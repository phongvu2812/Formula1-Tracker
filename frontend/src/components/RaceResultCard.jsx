import React from "react";

const RaceResultCard = ({ position, driver, team, time, getTeamColor }) => (
   <HStack
      bg="#fff"
      p={4}
      spacing={8}
      _hover={{ bg: "gray.200" }}
      transition="all 0.2s"
      borderRadius="md"
      my={1}
   >
      <HStack spacing={8} flex={1}>
         <Text
            color={getTeamColor(team)}
            fontSize="34px"
            fontWeight="light"
            w="40px"
            ml="6px"
            pr="10px"
            lineHeight="none"
            fontFamily="Formula1-Display-Regular, Arial"
         >
            {position}
         </Text>
         <Text color="black" fontSize="xl">
            {driver}
         </Text>
         <Text color="gray.600" fontSize="lg">
            {team}
         </Text>
      </HStack>
      <Text color="black" fontSize="lg" fontFamily="mono">
         {time}
      </Text>
   </HStack>
);

export default RaceResultCard;
