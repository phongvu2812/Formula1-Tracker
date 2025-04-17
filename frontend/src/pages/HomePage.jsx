import React, { useEffect, useState } from "react";
import { Box, Container, Text, VStack, HStack, SimpleGrid, Flex } from "@chakra-ui/react";
import CalendarCard from "../components/CalendarCard";
import NextRaceCard from "../components/NextRaceCard";
import { f1_2025_schedule, f1_2025_session_time } from "../data/raceCalendar.js";

import site from "../assets/IMG_20200626_171802.jpg";

export const HomePage = () => {
   const raceCalendar = f1_2025_schedule;
   const [countdown, setCountdown] = useState("");
   const [countdownLabel, setCountdownLabel] = useState("");

   // Get today's date
   const today = new Date();

   // Find the upcoming race
   const upcomingRace = raceCalendar.find((race) => {
      const [, endDay] = race.dates.split("-").map(Number);
      const raceMonth = new Date(`${race.month} 1, 2025`).getMonth();
      const raceStartDate = new Date(2025, raceMonth, endDay);
      return raceStartDate >= today;
   });

   // Find the session times for the upcoming race
   const upcomingRaceSession = upcomingRace
      ? f1_2025_session_time.find((session) => session.round === upcomingRace.round)
      : null;

   useEffect(() => {
      const sessionList = [
         { label: "Practice 1", key: "fp1" },
         { label: "Practice 2", key: "fp2" },
         { label: "Practice 3", key: "fp3" },
         { label: "Qualifying", key: "quali" },
         { label: "Race", key: "race" },
      ];
      if (upcomingRace && upcomingRaceSession) {
         const [startDay] = upcomingRace.dates.split("-").map(Number);
         const raceMonth = new Date(`${upcomingRace.month} 1, 2025`).getMonth();
         const now = new Date();
         const sessionDates = sessionList
            .map(({ label, key }) => {
               let sessionDay = startDay;
               if (key === "fp3" || key === "quali") sessionDay = startDay + 1;
               if (key === "race") sessionDay = startDay + 2;
               const sessionTime = upcomingRaceSession[key];
               if (!sessionTime) return null;
               const date = new Date(
                  2025,
                  raceMonth,
                  sessionDay,
                  ...sessionTime.split(":").map(Number)
               );
               return { label, date };
            })
            .filter(Boolean)
            .filter(({ date }) => date > now);
         const nearestSession = sessionDates.sort((a, b) => a.date - b.date)[0];
         if (nearestSession && nearestSession.date - now <= 24 * 60 * 60 * 1000) {
            setCountdownLabel(nearestSession.label);
            const interval = setInterval(() => {
               const timeLeft = nearestSession.date - new Date();
               if (timeLeft <= 0) {
                  clearInterval(interval);
                  setCountdown("Session has started!");
               } else {
                  const totalHours = Math.floor(timeLeft / (1000 * 60 * 60));
                  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
                  const seconds = Math.floor((timeLeft / 1000) % 60);
                  const formatWithZero = (num) => (num < 10 ? `0${num}` : num);
                  setCountdown(
                     `${formatWithZero(totalHours)}h ${formatWithZero(minutes)}m ${formatWithZero(
                        seconds
                     )}s`
                  );
               }
            }, 1000);
            return () => clearInterval(interval);
         } else {
            setCountdown(null);
            setCountdownLabel("");
         }
      }
   }, [upcomingRace, upcomingRaceSession]);

   return (
      <Box bg={"#ffffff"}>
         {/* Hero Section */}
         <Container maxW={"100%"} bg="gray.800" py={2}>
            <Box
               as="fieldset"
               borderTop="2px solid gray"
               borderRight="2px solid gray"
               borderWidth="2px 2px 0px 0px"
               borderTopRightRadius="15px"
               padding="16px 35px 10px 0px"
               overflow={"hidden"}
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
                  <Flex
                     w={"70%"}
                     bgImage={`url(${site})`}
                     // bgPosition="center"
                     bgRepeat="no-repeat"
                     bgSize="cover"
                     h={300}
                     borderRadius={"15px"}
                     justifyContent={"end"}
                     align={"center"}
                     px={5}
                  >
                     <VStack mt={2}>
                        <Flex
                           bg={"gray.800"}
                           borderRadius={"15px"}
                           w={"320px"}
                           justifyContent={"center"}
                           alignItems={"center"}
                        >
                           <VStack my={2}>
                              <Text fontSize="lg" fontWeight="bold">
                                 {countdownLabel || "Grand Prix Weekend"}
                              </Text>
                              <Text fontSize="lg" fontWeight="bold">
                                 {countdown}
                              </Text>
                           </VStack>
                        </Flex>
                        <Flex
                           bg={"gray.800"}
                           borderRadius={"15px"}
                           w={"320px"}
                           justifyContent={"center"}
                        >
                           {upcomingRaceSession && (
                              <VStack align="start" my={4}>
                                 {[
                                    { label: "Practice 1", key: "fp1" },
                                    { label: "Practice 2", key: "fp2" },
                                    { label: "Practice 3", key: "fp3" },
                                    { label: "Qualifying", key: "quali" },
                                    { label: "Race", key: "race" },
                                 ].map(({ label, key }) => {
                                    const sessionTime = upcomingRaceSession[key];

                                    if (!sessionTime) return null;
                                    // Calculate the correct date for each session
                                    const [startDay] = upcomingRace.dates.split("-").map(Number);
                                    const raceMonth = new Date(
                                       `${upcomingRace.month} 1, 2025`
                                    ).getMonth();
                                    // fp1: first day, fp2: first day, fp3: second day, quali: second day, race: third day
                                    let sessionDay = startDay;
                                    if (key === "fp3" || key === "quali") sessionDay = startDay + 1;
                                    if (key === "race") sessionDay = startDay + 2;
                                    const sessionDate = new Date(
                                       2025,
                                       raceMonth,
                                       sessionDay,
                                       ...sessionTime.split(":").map(Number)
                                    );
                                    const dayShort = sessionDate.toLocaleDateString("en-US", {
                                       weekday: "short",
                                    });
                                    const timeShort = sessionDate.toLocaleTimeString("en-US", {
                                       hour: "2-digit",
                                       minute: "2-digit",
                                       hour12: false,
                                    });
                                    return (
                                       <HStack key={label} spacing={6} align="center" w="100%">
                                          <Text fontSize="lg" minW="110px">
                                             {label}
                                          </Text>
                                          <Text fontSize="lg" minW="50px">
                                             {dayShort}
                                          </Text>
                                          <Text fontSize="lg" minW="60px">
                                             {timeShort}
                                          </Text>
                                       </HStack>
                                    );
                                 })}
                              </VStack>
                           )}
                        </Flex>
                     </VStack>
                  </Flex>
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
