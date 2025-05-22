import React, { useState, useEffect } from "react";
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
   Spinner,
   Center,
} from "@chakra-ui/react";
import { drivers } from "../data/drivers";

// Helper function to normalize driver names for matching
const normalizeDriverName = (name) => {
   const nameMap = {
      "Andrea Kimi Antonelli": "Kimi Antonelli",
      "Nicholas Hülkenberg": "Nico Hulkenberg",
      "Nicholas Huelkenberg": "Nico Hulkenberg",
      "Nico Hülkenberg": "Nico Hulkenberg",
   };
   return nameMap[name] || name;
};

// Helper function to find driver info from drivers.js
const findDriverInfo = (apiDriver) => {
   const fullName = `${apiDriver.givenName} ${apiDriver.familyName}`;
   const normalizedName = normalizeDriverName(fullName);
   return drivers.find((d) => d.name === normalizedName);
};

export const Drivers = () => {
   const [driverStandings, setDriverStandings] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchDriverStandings = async () => {
         try {
            const response = await fetch("https://api.jolpi.ca/ergast/f1/2025/driverstandings/");
            const data = await response.json();
            const standings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

            // Transform and combine API data with driver images
            const transformedStandings = standings.map((standing) => {
               const driverInfo = findDriverInfo(standing.Driver);
               const fullName = `${standing.Driver.givenName} ${standing.Driver.familyName}`;
               const normalizedName = normalizeDriverName(fullName);

               return {
                  position: standing.position,
                  driver: normalizedName,
                  team: standing.Constructors[0].name,
                  points: standing.points,
                  nationality: driverInfo?.nationality || standing.Driver.nationality,
                  driverImage: driverInfo?.driverImage,
                  nationalityImage: driverInfo?.nationalityImage,
               };
            });

            setDriverStandings(transformedStandings);
         } catch (error) {
            console.error("Error fetching driver standings:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchDriverStandings();
   }, []);

   if (loading) {
      return (
         <Container maxW="container.xl" py={8}>
            <Center h="50vh">
               <Spinner size="xl" color="f1.500" />
            </Center>
         </Container>
      );
   }

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
                  {driverStandings.map((driver) => (
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
