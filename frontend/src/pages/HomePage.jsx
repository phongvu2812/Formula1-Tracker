import React, { useEffect, useState } from "react";
import { Box, Container, Text, VStack, HStack, SimpleGrid, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import CalendarCard from "../components/CalendarCard";
import NextRaceCard from "../components/NextRaceCard";
import { f1_2025_schedule, f1_2025_session_time } from "../data/raceCalendar.js";
// import max from "../assets/max_verstappen.jpg";
import site from "../assets/IMG_20200626_171802.jpg";

export const HomePage = () => {
   const raceCalendar = f1_2025_schedule;
   const [countdown, setCountdown] = useState("");

   // Get today's date
   const today = new Date();

   // Find the upcoming race
   const upcomingRace = raceCalendar.find((race) => {
      const [startDay] = race.dates.split("-").map(Number);
      const raceMonth = new Date(`${race.month} 1, 2025`).getMonth();
      const raceStartDate = new Date(2025, raceMonth, startDay);
      console.log(raceStartDate);
      return raceStartDate >= today;
   });

   // Find the session times for the upcoming race
   const upcomingRaceSession = upcomingRace
      ? f1_2025_session_time.find((session) => session.round === upcomingRace.round)
      : null;
   useEffect(() => {
      if (upcomingRace) {
         const [startDay] = upcomingRace.dates.split("-").map(Number);
         const raceMonth = new Date(`${upcomingRace.month} 1, 2025`).getMonth();
         const raceDate = new Date(2025, raceMonth, startDay, 12, 0, 0); // Assuming race starts at 12:00
         const interval = setInterval(() => {
            const now = new Date();
            const timeLeft = raceDate - now;
            if (timeLeft <= 0) {
               clearInterval(interval);
               setCountdown("Race has started!");
            } else {
               const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
               const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
               const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
               const seconds = Math.floor((timeLeft / 1000) % 60);
               setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            }
         }, 1000);
         return () => clearInterval(interval);
      }
   }, [upcomingRace]);
   return (
      <Box bg={"#ffffff"}>
         {/* Hero Section */}
         <Container maxW="100%" maxH="70vh" bg="gray.800" py={2}>
            <Box
               as="fieldset"
               borderTop="2px solid gray"
               borderRight="2px solid gray"
               borderWidth="2px 2px 0px 0px"
               borderTopRightRadius="15px"
               padding="16px 35px 10px 0px"
            >
               <Box
                  as="legend"
                  fontSize="1.5rem"
                  fontWeight="bold"
                  color="white"
                  backgroundColor="gray.800"
                  paddingRight="10px"
               >
                  Upcoming Race
               </Box>
               <HStack color={"white"}>
                  <Box w={"30%"}>
                     {upcomingRace ? (
                        <NextRaceCard key={upcomingRace.round} raceInfo={upcomingRace} />
                     ) : (
                        <Text fontSize="lg">No upcoming races</Text>
                     )}
                  </Box>
                  <Box
                     w={"70%"}
                     bgImage={`url(${site})`}
                     // bgPosition="center"
                     bgRepeat="no-repeat"
                     bgSize="cover"
                     h={300}
                     borderRadius={"15px"}
                  >
                     <VStack mt={2}>
                        <Flex
                           bg={"gray.900"}
                           borderRadius={"15px"}
                           w={"md"}
                           justifyContent={"center"}
                           alignItems={"center"}
                        >
                           <VStack my={2}>
                              <Text fontSize="lg" fontWeight="bold">
                                 Grand Prix Weekend
                              </Text>
                              <Text fontSize="lg" fontWeight="bold">
                                 {countdown}
                              </Text>
                           </VStack>
                        </Flex>
                        <Flex
                           bg={"gray.900"}
                           borderRadius={"15px"}
                           w={"md"}
                           justifyContent={"center"}
                        >
                           {upcomingRaceSession && (
                              <VStack align="start" my={4}>
                                 <Text fontSize="lg">FP1: {upcomingRaceSession.fp1}</Text>
                                 <Text fontSize="lg">FP2: {upcomingRaceSession.fp2}</Text>
                                 <Text fontSize="lg">FP3: {upcomingRaceSession.fp3}</Text>
                                 <Text fontSize="lg">Qualifying: {upcomingRaceSession.quali}</Text>
                                 <Text fontSize="lg">Race: {upcomingRaceSession.race}</Text>
                              </VStack>
                           )}
                        </Flex>
                     </VStack>
                  </Box>
               </HStack>
            </Box>
         </Container>

         {/* Quick Links Section */}
         <Container maxW="container.xl" py={12}>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacingY={10} spacingX={4}>
               {raceCalendar.map((race) => (
                  <CalendarCard key={race.round} raceInfo={race} />
               ))}
            </SimpleGrid>
         </Container>
      </Box>
   );
};
