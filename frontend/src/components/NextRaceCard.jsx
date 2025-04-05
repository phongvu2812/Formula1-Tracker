import { Box, Flex, HStack, Image, Text, VStack } from "@chakra-ui/react";

import React from "react";

const NextRaceCard = ({ raceInfo }) => {
   const { round, month, dates, grandPrix, location, image, flag } = raceInfo;

   return (
      <Box maxH={"300px"} py={1} fontFamily={("Formula1-Display-Regular", "arial")}>
         <Box as="fieldset">
            <Box as="legend" fontSize="1rem" fontWeight="bold" color="#e10600" pr="10px">
               Round {round}
            </Box>
            <Box fontWeight={"bold"}>
               <HStack>
                  <VStack>
                     <Box fontSize={23} w={"150px"}>
                        <Text>{dates}</Text>
                        <Text bg={"white"} color={"black"} borderRadius={5} px={1} w="fit-content">
                           {month}
                        </Text>
                     </Box>
                  </VStack>
                  <Box
                     border="2px solid black"
                     borderRadius={"5px"}
                     overflow={"hidden"}
                     ml={"130px"}
                  >
                     <Image src={flag} w={"45px"}></Image>
                  </Box>
               </HStack>
               <Box borderTop={"1px solid gray"} borderBottom={"1px solid gray"} py={1} my={1}>
                  <Text fontSize={20}>{location}</Text>
                  <Text fontWeight={"normal"} fontSize={17}>
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
               justifyContent={"center"}
               alignItems={"center"}
            >
               <Image
                  src={image}
                  alt={`${grandPrix} track`}
                  objectFit="contain"
                  w={"100%"}
                  h={"160px"}
               />
            </Flex>
         </Box>
      </Box>
   );
};

export default NextRaceCard;
