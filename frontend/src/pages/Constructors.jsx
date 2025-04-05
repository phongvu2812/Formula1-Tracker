import React from "react";
import {
   Box,
   Heading,
   Container,
   Flex,
   Divider,
   Text,
   VStack,
   HStack,
   Image,
} from "@chakra-ui/react";

export const Constructors = () => {
   return (
      <Box
         borderTop="2px double black"
         borderRight="2px double black"
         borderRadius="0 8px 0 0"
         padding="10px"
         maxWidth="400px"
         transition="all 0.2s"
         _hover={{ transform: "scale(1.02)", borderColor: "gray.700" }}
      >
         {/* Title */}
         <Text fontSize="15px" fontWeight="bold" textTransform="uppercase">
            Round 1
         </Text>

         <VStack spacing={2} align="start">
            {/* Date and Country */}
            <HStack justify="space-between" width="100%">
               <Text fontSize="18px" fontWeight="bold">
                  14-16
               </Text>
               <Image
                  src="https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Flags%2016x9/australia-flag.png"
                  alt="Australia"
                  height="20px"
                  borderRadius="5px"
                  border="1px solid gray"
               />
            </HStack>

            {/* Grand Prix Name */}
            <Text fontSize="14px" fontWeight="bold">
               FORMULA 1 LOUIS VUITTON AUSTRALIAN GRAND PRIX 2025
            </Text>

            {/* Drivers */}
            <HStack spacing={4} justify="center">
               <VStack>
                  <Image
                     src="https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/drivers/2025/lannor01.png.transform/2col/image.png"
                     alt="Lando Norris"
                     boxSize="60px"
                  />
                  <Text fontWeight="bold">NOR</Text>
               </VStack>
               <VStack>
                  <Image
                     src="https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/drivers/2025/maxver01.png.transform/2col/image.png"
                     alt="Max Verstappen"
                     boxSize="60px"
                  />
                  <Text fontWeight="bold">VER</Text>
               </VStack>
               <VStack>
                  <Image
                     src="https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/drivers/2025/georus01.png.transform/2col/image.png"
                     alt="George Russell"
                     boxSize="60px"
                  />
                  <Text fontWeight="bold">RUS</Text>
               </VStack>
            </HStack>
         </VStack>
      </Box>
   );
};
