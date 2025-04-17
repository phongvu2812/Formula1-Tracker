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
   Text,
   HStack,
   Image,
} from "@chakra-ui/react";
import { constructorsStanding } from "../data/standing";
import { teams } from "../data/teams";

export const Constructors = () => {
   // Merge team logos with standings data
   const combinedData = constructorsStanding.map((constructor) => {
      const teamInfo = teams.find((t) => constructor.team.startsWith(t.name));
      return {
         ...constructor,
         carLogo: teamInfo?.carLogo,
      };
   });

   return (
      <Container maxW="container.xl" py={8}>
         <Heading mb={6}>2025 F1 Constructors Championship Standings</Heading>
         <Box overflowX="auto" shadow="md" rounded="lg" bg="white">
            <Table variant="simple">
               <Thead bg="gray.50">
                  <Tr>
                     <Th>Position</Th>
                     <Th>Constructor</Th>
                     <Th isNumeric>Points</Th>
                  </Tr>
               </Thead>
               <Tbody>
                  {combinedData.map((constructor) => (
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
