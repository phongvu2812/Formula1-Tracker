import React, { useState, useEffect } from "react";
import {
   Box,
   Heading,
   Container,
   Text,
   Select,
   Flex,
   VStack,
   HStack,
   Divider,
   Table,
   Thead,
   Tbody,
   Tr,
   Th,
   Td,
   useColorModeValue,
   Tabs,
   TabList,
   TabPanels,
   Tab,
   TabPanel,
   FormLabel,
} from "@chakra-ui/react";
import {
   LineChart,
   Line,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   Legend,
   ResponsiveContainer,
} from "recharts";
import { drivers } from "../data/drivers";
import { f1_2025_schedule, f1_2025_session_time } from "../data/raceCalendar";

// Sample pace data - in a real app, this would come from an API
const generatePaceData = () => {
   const races = f1_2025_schedule.map((race) => race.name);
   return drivers.map((driver) => {
      const raceData = races.map((race) => {
         const generateSessionData = () => {
            // Generate random sector times between 25-35 seconds each
            const sector1 = (25 + Math.random() * 10).toFixed(3);
            const sector2 = (25 + Math.random() * 10).toFixed(3);
            const sector3 = (25 + Math.random() * 10).toFixed(3);
            // Total lap time is sum of sectors
            const bestLapTime = (Number(sector1) + Number(sector2) + Number(sector3)).toFixed(3);
            // Average lap time slightly slower than best
            const avgLapTime = (Number(bestLapTime) + 0.5 + Math.random() * 2).toFixed(3);

            return {
               avgLapTime: Number(avgLapTime),
               bestLapTime: Number(bestLapTime),
               sector1: Number(sector1),
               sector2: Number(sector2),
               sector3: Number(sector3),
               tire: ["Soft", "Medium", "Hard"][Math.floor(Math.random() * 3)],
               position: Math.floor(Math.random() * 20) + 1,
            };
         };

         return {
            race,
            fp1: generateSessionData(),
            fp2: generateSessionData(),
            fp3: generateSessionData(),
            q1: generateSessionData(),
            q2: generateSessionData(),
            q3: generateSessionData(),
            raceSession: generateSessionData(),
         };
      });

      return {
         driver: driver.name,
         driverImage: driver.driverImage,
         team: driver.team,
         races: raceData,
      };
   });
};

// Helper function to format sector time to ss.sss
const formatSectorTime = (seconds) => {
   if (!seconds) return "N/A";
   return seconds.toFixed(3);
};

// Helper function to format lap time from seconds to mm:ss.sss
const formatLapTime = (seconds) => {
   if (!seconds) return "N/A";

   const minutes = Math.floor(seconds / 60);
   const remainingSeconds = (seconds % 60).toFixed(3);

   // Pad seconds with leading zero if needed
   const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

   return `${minutes}:${formattedSeconds}`;
};

const paceHistoryData = generatePaceData();

// Helper function to find best times across all drivers
const findBestTimes = (allData, session) => {
   let bestSector1 = Infinity;
   let bestSector2 = Infinity;
   let bestSector3 = Infinity;
   let bestLapTime = Infinity;

   allData.forEach((driver) => {
      driver.races.forEach((race) => {
         const sessionData = race[session];
         bestSector1 = Math.min(bestSector1, sessionData.sector1);
         bestSector2 = Math.min(bestSector2, sessionData.sector2);
         bestSector3 = Math.min(bestSector3, sessionData.sector3);
         bestLapTime = Math.min(bestLapTime, sessionData.bestLapTime);
      });
   });

   return { bestSector1, bestSector2, bestSector3, bestLapTime };
};

// Helper function to find driver's best times
const findDriverBestTimes = (driverData, session) => {
   let bestSector1 = Infinity;
   let bestSector2 = Infinity;
   let bestSector3 = Infinity;
   let bestLapTime = Infinity;

   driverData.races.forEach((race) => {
      const sessionData = race[session];
      bestSector1 = Math.min(bestSector1, sessionData.sector1);
      bestSector2 = Math.min(bestSector2, sessionData.sector2);
      bestSector3 = Math.min(bestSector3, sessionData.sector3);
      bestLapTime = Math.min(bestLapTime, sessionData.bestLapTime);
   });

   return { bestSector1, bestSector2, bestSector3, bestLapTime };
};

export default function PaceHistory() {
   const [selectedDriver, setSelectedDriver] = useState(paceHistoryData[0]?.driver || "");
   const [selectedSession, setSelectedSession] = useState("fp1");
   const [selectedRound, setSelectedRound] = useState(1);
   const [selectedRace, setSelectedRace] = useState(null);
   const [comparedDrivers, setComparedDrivers] = useState([]);

   const bgColor = useColorModeValue("white", "gray.800");
   const borderColor = useColorModeValue("gray.200", "gray.700");

   useEffect(() => {
      // Find the race data for the selected round
      const race = f1_2025_session_time.find((race) => race.round === selectedRound);
      setSelectedRace(race);
   }, [selectedRound]);

   // Get data for the selected driver
   const driverData = paceHistoryData.find((d) => d.driver === selectedDriver);

   // Format chart data
   const chartData =
      driverData?.races.map((race) => ({
         race: race.race,
         bestLapTime: race[selectedSession].bestLapTime,
         // Add compared drivers' data if in compare mode
         ...comparedDrivers.reduce((acc, driverName) => {
            const driver = paceHistoryData.find((d) => d.driver === driverName);
            const raceData = driver?.races.find((r) => r.race === race.race);
            if (raceData) {
               acc[`${driverName}_bestLapTime`] = raceData[selectedSession].bestLapTime;
            }
            return acc;
         }, {}),
      })) || [];

   // Generate random colors for drivers
   const getDriverColor = (index) => {
      const colors = ["#FF1E1E", "#1EA5FF", "#FFD700", "#00FF85", "#FF00E6", "#5454FF"];
      return colors[index % colors.length];
   };

   // Get best times for the current session
   const overallBestTimes = findBestTimes(paceHistoryData, selectedSession);
   const driverBestTimes = driverData ? findDriverBestTimes(driverData, selectedSession) : null;

   // Helper function to determine time color
   const getTimeColor = (time, driverBest, overallBest) => {
      if (Math.abs(time - overallBest) < 0.001) return { bg: "purple.500", color: "white" };
      if (Math.abs(time - driverBest) < 0.001) return { bg: "green.500", color: "white" };
      return { bg: "transparent", color: "inherit" };
   };

   return (
      <Container maxW="container.xl" py={8}>
         <Heading mb={6}>F1 Pace History Analysis</Heading>

         <Tabs isFitted variant="enclosed" mb={6}>
            <TabList>
               <Tab>Single Driver</Tab>
               <Tab>Driver Comparison</Tab>
            </TabList>

            <TabPanels>
               <TabPanel>
                  <VStack spacing={6} align="stretch">
                     <Flex direction={{ base: "column", md: "row" }} gap={4}>
                        <Box flex="1">
                           <Text mb={2} fontWeight="medium">
                              Select Driver:
                           </Text>
                           <Select
                              value={selectedDriver}
                              onChange={(e) => setSelectedDriver(e.target.value)}
                           >
                              {paceHistoryData.map((driver) => (
                                 <option key={driver.driver} value={driver.driver}>
                                    {driver.driver} ({driver.team})
                                 </option>
                              ))}
                           </Select>
                        </Box>

                        <Box flex="1">
                           <FormLabel>Round</FormLabel>
                           <Select
                              value={selectedRound}
                              onChange={(e) => setSelectedRound(Number(e.target.value))}
                              mb={4}
                           >
                              {f1_2025_schedule.map((race) => (
                                 <option key={race.round} value={race.round}>
                                    Round {race.round} - {race.location}
                                 </option>
                              ))}
                           </Select>
                        </Box>

                        <Box flex="1">
                           <FormLabel>Session</FormLabel>
                           <Select
                              value={selectedSession}
                              onChange={(e) => setSelectedSession(e.target.value)}
                           >
                              {selectedRace?.has_sprint ? (
                                 <>
                                    <option value="fp1">Practice 1</option>
                                    <option value="sprint_shootout">Sprint Qualifying</option>
                                    <option value="sprint">Sprint Race</option>
                                    <option value="q1">Qualifying 1</option>
                                    <option value="q2">Qualifying 2</option>
                                    <option value="q3">Qualifying 3</option>
                                    <option value="raceSession">Race</option>
                                 </>
                              ) : (
                                 <>
                                    <option value="fp1">Practice 1</option>
                                    <option value="fp2">Practice 2</option>
                                    <option value="fp3">Practice 3</option>
                                    <option value="q1">Qualifying 1</option>
                                    <option value="q2">Qualifying 2</option>
                                    <option value="q3">Qualifying 3</option>
                                    <option value="raceSession">Race</option>
                                 </>
                              )}
                           </Select>
                        </Box>
                     </Flex>

                     <Box
                        p={4}
                        bg={bgColor}
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor={borderColor}
                        shadow="md"
                        h="400px"
                     >
                        <ResponsiveContainer width="100%" height="100%">
                           <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="race" />
                              <YAxis
                                 domain={["dataMin - 0.5", "dataMax + 0.5"]}
                                 tickFormatter={formatLapTime}
                              />
                              <Tooltip
                                 formatter={(value) => [
                                    formatLapTime(value),
                                    selectedSession === "raceSession"
                                       ? "Race Lap Time"
                                       : "Session Lap Time",
                                 ]}
                              />
                              <Legend />
                              <Line
                                 type="monotone"
                                 dataKey="bestLapTime"
                                 stroke="#FF1E1E"
                                 activeDot={{ r: 8 }}
                                 name={driverData?.driver || "Driver"}
                              />
                           </LineChart>
                        </ResponsiveContainer>
                     </Box>

                     <Box
                        p={4}
                        bg={bgColor}
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor={borderColor}
                        shadow="md"
                     >
                        <Heading size="md" mb={4}>
                           Race Details
                        </Heading>
                        <Table size="sm" textAlign="center" variant="simple">
                           <Thead>
                              <Tr>
                                 {/* <Th>Race</Th> */}
                                 <Th textAlign="center" px={6}>
                                    Sector 1
                                 </Th>
                                 <Th textAlign="center" px={6}>
                                    Sector 2
                                 </Th>
                                 <Th textAlign="center" px={6}>
                                    Sector 3
                                 </Th>
                                 <Th textAlign="center" px={6}>
                                    Lap Time
                                 </Th>
                                 <Th textAlign="center" px={6}>
                                    Tire
                                 </Th>
                                 <Th textAlign="center" px={6}>
                                    Position
                                 </Th>
                              </Tr>
                           </Thead>
                           <Tbody>
                              {driverData?.races.map((race) => (
                                 <Tr key={race.race}>
                                    {/* <Td fontWeight="medium">{race.race}</Td> */}
                                    <Td
                                       textAlign="center"
                                       px={6}
                                       {...getTimeColor(
                                          race[selectedSession].sector1,
                                          driverBestTimes?.bestSector1,
                                          overallBestTimes.bestSector1
                                       )}
                                    >
                                       {formatSectorTime(race[selectedSession].sector1)}
                                    </Td>
                                    <Td
                                       textAlign="center"
                                       px={6}
                                       {...getTimeColor(
                                          race[selectedSession].sector2,
                                          driverBestTimes?.bestSector2,
                                          overallBestTimes.bestSector2
                                       )}
                                    >
                                       {formatSectorTime(race[selectedSession].sector2)}
                                    </Td>
                                    <Td
                                       textAlign="center"
                                       px={6}
                                       {...getTimeColor(
                                          race[selectedSession].sector3,
                                          driverBestTimes?.bestSector3,
                                          overallBestTimes.bestSector3
                                       )}
                                    >
                                       {formatSectorTime(race[selectedSession].sector3)}
                                    </Td>
                                    <Td
                                       textAlign="center"
                                       px={6}
                                       {...getTimeColor(
                                          race[selectedSession].bestLapTime,
                                          driverBestTimes?.bestLapTime,
                                          overallBestTimes.bestLapTime
                                       )}
                                    >
                                       {formatLapTime(race[selectedSession].bestLapTime)}
                                    </Td>
                                    <Td textAlign="center" px={6}>
                                       {race[selectedSession].tire}
                                    </Td>
                                    <Td textAlign="center" px={6}>
                                       P{race[selectedSession].position}
                                    </Td>
                                 </Tr>
                              ))}
                           </Tbody>
                        </Table>
                     </Box>
                  </VStack>
               </TabPanel>

               <TabPanel>
                  <VStack spacing={6} align="stretch">
                     <Flex direction={{ base: "column", md: "row" }} gap={4}>
                        <Box flex="1">
                           <Text mb={2} fontWeight="medium">
                              Primary Driver:
                           </Text>
                           <Select
                              value={selectedDriver}
                              onChange={(e) => setSelectedDriver(e.target.value)}
                           >
                              {paceHistoryData.map((driver) => (
                                 <option key={driver.driver} value={driver.driver}>
                                    {driver.driver} ({driver.team})
                                 </option>
                              ))}
                           </Select>
                        </Box>

                        <Box flex="1">
                           <Text mb={2} fontWeight="medium">
                              Compare Drivers:
                           </Text>
                           <Select
                              onChange={(e) => {
                                 const value = e.target.value;
                                 if (
                                    value &&
                                    !comparedDrivers.includes(value) &&
                                    value !== selectedDriver
                                 ) {
                                    setComparedDrivers([...comparedDrivers, value]);
                                 }
                              }}
                              value=""
                           >
                              <option value="" disabled>
                                 Select driver to compare
                              </option>
                              {paceHistoryData
                                 .filter(
                                    (d) =>
                                       d.driver !== selectedDriver &&
                                       !comparedDrivers.includes(d.driver)
                                 )
                                 .map((driver) => (
                                    <option key={driver.driver} value={driver.driver}>
                                       {driver.driver} ({driver.team})
                                    </option>
                                 ))}
                           </Select>
                        </Box>

                        <Box flex="1">
                           <FormLabel>Round</FormLabel>
                           <Select
                              value={selectedRound}
                              onChange={(e) => setSelectedRound(Number(e.target.value))}
                              mb={4}
                           >
                              {f1_2025_schedule.map((race) => (
                                 <option key={race.round} value={race.round}>
                                    Round {race.round} - {race.location}
                                 </option>
                              ))}
                           </Select>
                        </Box>

                        <Box flex="1">
                           <FormLabel>Session</FormLabel>
                           <Select
                              value={selectedSession}
                              onChange={(e) => setSelectedSession(e.target.value)}
                           >
                              {selectedRace?.has_sprint ? (
                                 <>
                                    <option value="fp1">Practice 1</option>
                                    <option value="sprint_shootout">Sprint Qualifying</option>
                                    <option value="sprint">Sprint Race</option>
                                    <option value="q1">Qualifying 1</option>
                                    <option value="q2">Qualifying 2</option>
                                    <option value="q3">Qualifying 3</option>
                                    <option value="raceSession">Race</option>
                                 </>
                              ) : (
                                 <>
                                    <option value="fp1">Practice 1</option>
                                    <option value="fp2">Practice 2</option>
                                    <option value="fp3">Practice 3</option>
                                    <option value="q1">Qualifying 1</option>
                                    <option value="q2">Qualifying 2</option>
                                    <option value="q3">Qualifying 3</option>
                                    <option value="raceSession">Race</option>
                                 </>
                              )}
                           </Select>
                        </Box>
                     </Flex>

                     {comparedDrivers.length > 0 && (
                        <Box>
                           <Text fontWeight="medium" mb={2}>
                              Selected Drivers:
                           </Text>
                           <Flex wrap="wrap" gap={2}>
                              {comparedDrivers.map((driver) => (
                                 <Box
                                    key={driver}
                                    py={1}
                                    px={3}
                                    bg="gray.100"
                                    borderRadius="full"
                                    fontSize="sm"
                                    display="flex"
                                    alignItems="center"
                                 >
                                    {driver}
                                    <Text
                                       ml={2}
                                       cursor="pointer"
                                       color="red.500"
                                       onClick={() => {
                                          setComparedDrivers(
                                             comparedDrivers.filter((d) => d !== driver)
                                          );
                                       }}
                                    >
                                       ×
                                    </Text>
                                 </Box>
                              ))}
                           </Flex>
                        </Box>
                     )}

                     <Box
                        p={4}
                        bg={bgColor}
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor={borderColor}
                        shadow="md"
                        h="400px"
                     >
                        <ResponsiveContainer width="100%" height="100%">
                           <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="race" />
                              <YAxis
                                 domain={["dataMin - 0.5", "dataMax + 0.5"]}
                                 tickFormatter={formatLapTime}
                              />
                              <Tooltip
                                 formatter={(value) => [
                                    formatLapTime(value),
                                    selectedSession === "raceSession"
                                       ? "Race Lap Time"
                                       : "Session Lap Time",
                                 ]}
                              />
                              <Legend />
                              <Line
                                 type="monotone"
                                 dataKey="bestLapTime"
                                 stroke="#FF1E1E"
                                 activeDot={{ r: 8 }}
                                 name={driverData?.driver || "Driver"}
                              />
                              {comparedDrivers.map((driver, index) => (
                                 <Line
                                    key={driver}
                                    type="monotone"
                                    dataKey={`${driver}_bestLapTime`}
                                    stroke={getDriverColor(index + 1)}
                                    name={driver}
                                 />
                              ))}
                           </LineChart>
                        </ResponsiveContainer>
                     </Box>

                     {comparedDrivers.length > 0 && (
                        <Box
                           p={4}
                           bg={bgColor}
                           borderRadius="lg"
                           borderWidth="1px"
                           borderColor={borderColor}
                           shadow="md"
                        >
                           <Heading size="md" mb={4}>
                              Performance Comparison
                           </Heading>
                           <Table size="sm" textAlign="center" variant="simple">
                              <Thead>
                                 <Tr>
                                    {/* <Th>Race</Th> */}
                                    <Th textAlign="center" px={6}>
                                       Sector 1
                                    </Th>
                                    <Th textAlign="center" px={6}>
                                       Sector 2
                                    </Th>
                                    <Th textAlign="center" px={6}>
                                       Sector 3
                                    </Th>
                                    <Th textAlign="center" px={6}>
                                       Lap Time
                                    </Th>
                                    <Th textAlign="center" px={6}>
                                       Tire
                                    </Th>
                                    <Th textAlign="center" px={6}>
                                       Position
                                    </Th>
                                 </Tr>
                              </Thead>
                              <Tbody>
                                 {driverData?.races.map((race) => (
                                    <Tr key={race.race}>
                                       <Td
                                          textAlign="center"
                                          px={6}
                                          {...getTimeColor(
                                             race[selectedSession].sector1,
                                             driverBestTimes?.bestSector1,
                                             overallBestTimes.bestSector1
                                          )}
                                       >
                                          {formatSectorTime(race[selectedSession].sector1)}
                                       </Td>
                                       <Td
                                          textAlign="center"
                                          px={6}
                                          {...getTimeColor(
                                             race[selectedSession].sector2,
                                             driverBestTimes?.bestSector2,
                                             overallBestTimes.bestSector2
                                          )}
                                       >
                                          {formatSectorTime(race[selectedSession].sector2)}
                                       </Td>
                                       <Td
                                          textAlign="center"
                                          px={6}
                                          {...getTimeColor(
                                             race[selectedSession].sector3,
                                             driverBestTimes?.bestSector3,
                                             overallBestTimes.bestSector3
                                          )}
                                       >
                                          {formatSectorTime(race[selectedSession].sector3)}
                                       </Td>
                                       <Td
                                          textAlign="center"
                                          px={6}
                                          {...getTimeColor(
                                             race[selectedSession].bestLapTime,
                                             driverBestTimes?.bestLapTime,
                                             overallBestTimes.bestLapTime
                                          )}
                                       >
                                          {formatLapTime(race[selectedSession].bestLapTime)}
                                       </Td>
                                       <Td textAlign="center" px={6}>
                                          {race[selectedSession].tire}
                                       </Td>
                                       <Td textAlign="center" px={6}>
                                          P{race[selectedSession].position}
                                       </Td>
                                    </Tr>
                                 ))}
                              </Tbody>
                           </Table>
                        </Box>
                     )}
                  </VStack>
               </TabPanel>
            </TabPanels>
         </Tabs>
      </Container>
   );
}
