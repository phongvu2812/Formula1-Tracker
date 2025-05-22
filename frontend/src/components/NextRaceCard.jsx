import { Box, Flex, HStack, Image, Text, VStack } from "@chakra-ui/react";

import React from "react";

const NextRaceCard = ({ raceInfo }) => {
   const { round, month, dates, grandPrix, location, image, flag } = raceInfo;

   return (
      <Box maxH="300px" py={1} fontFamily={("Formula1-Display-Regular", "arial")} overflow="hidden">
         <Box as="fieldset">
            <Box as="legend" fontSize="1rem" fontWeight="bold" color="#e10600" pr="10px">
               Round {round}
            </Box>
            <Box fontWeight="bold">
               <Flex justify="space-between" align="center" wrap="nowrap">
                  <Box fontSize={{ base: 18, md: 23 }}>
                     <Text>{dates}</Text>
                     <Text bg="white" color="black" borderRadius={5} px={1} w="fit-content">
                        {month}
                     </Text>
                  </Box>
                  <Box border="2px solid black" borderRadius="5px" overflow="hidden">
                     <Image src={flag} w="45px" alt={`${location} flag`} />
                  </Box>
               </Flex>

               <Box borderTop="1px solid gray" borderBottom="1px solid gray" py={1} my={1}>
                  <Text fontSize={{ base: 16, md: 20 }} noOfLines={1}>
                     {location}
                  </Text>
                  <Text
                     fontWeight="normal"
                     fontSize={{ base: 14, md: 17 }}
                     noOfLines={1}
                     title={grandPrix}
                  >
                     {grandPrix}
                  </Text>
               </Box>
            </Box>
            <Flex
               style={{
                  backgroundImage: `linear-gradient(to bottom, transparent 45%, #e0e0e0 45%, #e0e0e0 55%, transparent 55%),
                                    linear-gradient(to right, transparent 45%, #e0e0e0 45%, #e0e0e0 55%, transparent 55%)`,
                  backgroundSize: "15px 15px",
               }}
               justifyContent="center"
            >
               <Image
                  src={image}
                  alt={`${grandPrix} track`}
                  objectFit="contain"
                  maxW="100%"
                  maxH="150px"
               />
            </Flex>
         </Box>
      </Box>
   );
};

export default NextRaceCard;
