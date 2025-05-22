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
   Text,
   HStack,
   Image,
   Spinner,
} from "@chakra-ui/react";
import { teams } from "../data/teams";

export const Constructors = () => {
   const [constructorsData, setConstructorsData] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      const fetchConstructors = async () => {
         try {
            const response = await fetch(
               "https://api.jolpi.ca/ergast/f1/2025/constructorstandings/"
            );
            const data = await response.json();
            const standings = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;

            const transformedData = standings.map((constructor) => {
               // Map API constructor names to our team names for logo matching
               const constructorName = constructor.Constructor.name;
               const teamInfo = teams.find((t) => {
                  // Handle special cases and normalize names
                  const normalizedConstructorName = constructorName.toLowerCase();
                  const normalizedTeamName = t.name.toLowerCase();

                  // Special cases mapping
                  if (
                     normalizedConstructorName === "rb f1 team" ||
                     normalizedConstructorName === "rb"
                  ) {
                     return normalizedTeamName === "racing bulls";
                  }

                  return (
                     normalizedTeamName.includes(normalizedConstructorName) ||
                     normalizedConstructorName.includes(normalizedTeamName)
                  );
               });

               return {
                  position: constructor.position,
                  team: constructor.Constructor.name,
                  points: constructor.points,
                  carLogo: teamInfo?.carLogo,
                  nationality: constructor.Constructor.nationality,
               };
            });

            setConstructorsData(transformedData);
            setIsLoading(false);
         } catch (err) {
            console.error("Error fetching constructor standings:", err);
            setError("Failed to fetch constructor standings");
            setIsLoading(false);
         }
      };

      fetchConstructors();
   }, []);

   if (isLoading) {
      return (
         <Container maxW="container.xl" py={8} textAlign="center">
            <Spinner size="xl" color="f1.500" />
         </Container>
      );
   }

   if (error) {
      return (
         <Container maxW="container.xl" py={8}>
            <Text color="red.500" fontSize="lg">
               {error}
            </Text>
         </Container>
      );
   }

   return (
      <Container maxW="container.xl" py={8}>
         <Heading mb={6}>2025 F1 Constructors Championship Standings</Heading>
         <Box overflowX="auto" shadow="md" rounded="lg" bg="white">
            <Table variant="simple">
               <Thead bg="gray.50">
                  <Tr>
                     <Th>Position</Th>
                     <Th>Constructor</Th>
                     <Th>Nationality</Th>
                     <Th isNumeric>Points</Th>
                  </Tr>
               </Thead>
               <Tbody>
                  {constructorsData.map((constructor) => (
                     <Tr key={constructor.position}>
                        <Td fontWeight="bold" color="f1.500">
                           {constructor.position}
                        </Td>
                        <Td>
                           <HStack spacing={3}>
                              <Image
                                 src={constructor.carLogo}
                                 alt={constructor.team}
                                 height="30px"
                                 objectFit="contain"
                              />
                              <Text fontWeight="medium">{constructor.team}</Text>
                           </HStack>
                        </Td>
                        <Td>
                           <Text>{constructor.nationality}</Text>
                        </Td>
                        <Td isNumeric fontWeight="bold">
                           {constructor.points}
                        </Td>
                     </Tr>
                  ))}
               </Tbody>
            </Table>
         </Box>
      </Container>
   );
};
