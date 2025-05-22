import { Box, Flex, HStack, Image, Text, VStack } from "@chakra-ui/react";

import React from "react";

const CalendarCard = ({ raceInfo }) => {
   const { round, month, dates, grandPrix, location, image, flag } = raceInfo;

   return (
      <Box
         overflow="hidden"
         transition="transform 0.2s"
         _hover={{ transform: "translateY(-5px)" }}
         maxH={"330px"}
         py={2}
         fontFamily={("Formula1-Display-Regular", "arial")}
      >
         <Box
            borderTop="2px solid black"
            borderRight="2px solid black"
            borderTopRightRadius="15px"
            _hover={{
               borderTopColor: "f1.500",
               borderRightColor: "f1.500",
            }}
            as="fieldset"
         >
            <Box as="legend" fontSize="1rem" fontWeight="bold" color="#e10600" pr="10px">
               Round {round}
            </Box>
            <Box fontWeight={"bold"}>
               <HStack>
                  <VStack>
                     <Box fontSize={23} w={"150px"}>
                        <Text>{dates}</Text>
                        <Text bg={"black"} color={"white"} borderRadius={5} px={1} w="fit-content">
                           {month.includes("-")
                              ? month
                                   .split("-")
                                   .map((m) => m.trim().substring(0, 3))
                                   .join(" - ")
                              : month.substring(0, 3)}
                        </Text>
                     </Box>
                  </VStack>
                  <Box
                     border="2px solid black"
                     borderRadius={"5px"}
                     overflow={"hidden"}
                     ml={"80px"}
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
            <Box
               style={{
                  backgroundImage: `linear-gradient(to bottom, transparent 45%, #e0e0e0 45%, #e0e0e0 55%, transparent 55%),
                                    linear-gradient(to right, transparent 45%, #e0e0e0 45%, #e0e0e0 55%, transparent 55%)`,
                  backgroundSize: "5px 5px",
               }}
               display="flex"
               justifyContent={"center"}
               alignItems={"center"}
            >
               <Image
                  src={image}
                  alt={`${grandPrix} track`}
                  objectFit="contain"
                  w={"100%"}
                  h={"130px"}
               />
            </Box>
         </Box>
      </Box>
   );
};

export default CalendarCard;
