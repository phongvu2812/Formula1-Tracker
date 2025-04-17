import React from "react";
import {
   Box,
   Heading,
   Container,
   Table,
   Thead,
   Tbody,
   Tr,
   Th,
   Td,
   HStack,
   Text,
   Image,
} from "@chakra-ui/react";
import { driversStanding } from "../data/standing";
import { drivers } from "../data/drivers";

export const Drivers = () => {
   // Merge driver images with standings data
   const combinedData = driversStanding.map((standing) => {
      const driverInfo = drivers.find((d) => d.name === standing.driver);
      return {
         ...standing,
         driverImage: driverInfo?.driverImage,
         nationalityImage: driverInfo?.nationalityImage,
         nationality: driverInfo?.nationality,
      };
   });

   return (
      <Container maxW="container.xl" py={8}>
         <Heading mb={6}>2025 F1 Drivers Championship Standings</Heading>
         <Box overflowX="auto" shadow="md" rounded="lg" bg="white">
            <Table variant="simple">
               <Thead bg="gray.50">
                  <Tr>
                     <Th>Position</Th>
                     <Th>Driver</Th>
                     <Th>Nationality</Th>
                     <Th>Team</Th>
                     <Th isNumeric>Points</Th>
                  </Tr>
               </Thead>
               <Tbody>
                  {combinedData.map((driver) => (
                     <Tr key={driver.position}>
                        <Td fontWeight="bold" color="f1.500">
                           {driver.position}
                        </Td>
                        <Td>
                           <HStack spacing={3}>
                              <Image
                                 src={driver.driverImage}
                                 alt={driver.driver}
                                 boxSize="45px"
                                 objectFit={"cover"}
                              />
                              <Text fontWeight="medium">{driver.driver}</Text>
                           </HStack>
                        </Td>
                        <Td>
                           <HStack spacing={2}>
                              <Image
                                 src={driver.nationalityImage}
                                 alt={driver.nationality}
                                 width="35px"
                                 height="25px"
                                 objectFit="cover"
                                 borderRadius="sm"
                                 border="1px solid"
                                 borderColor="gray.200"
                              />
                              <Text>{driver.nationality}</Text>
                           </HStack>
                        </Td>
                        <Td>{driver.team}</Td>
                        <Td isNumeric fontWeight="bold">
                           {driver.points}
                        </Td>
                     </Tr>
                  ))}
               </Tbody>
            </Table>
         </Box>
      </Container>
   );
};
